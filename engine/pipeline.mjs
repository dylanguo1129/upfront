// The delivery runtime. Routes one engagement through staged agents, persists shared
// memory after every stage, gates on an adversarial reality check + a human approval
// before anything money-moving, and recovers from stage errors by escalating to a human
// (never silently passing). Money is computed deterministically; agents only narrate.
import { recommendEarnPlan, fundableProgramNames } from "./adapters/creditcard.mjs";
import { searchAward } from "./adapters/seatsaero.mjs";
import { runAgent } from "./agents.mjs";
import { logEvent, save } from "./casefile.mjs";

const cad = (n) => "CA$" + Math.round(n).toLocaleString("en-CA");

// ---- deterministic value calc: the number we sell, never model-invented ----
function computeValue(chosen) {
  const pax = chosen.pax;
  const cashTotal = chosen.cashEachCad * pax;
  const milesTotal = chosen.milesEach * pax;
  const feesTotal = chosen.taxesEachCad * pax;
  const valueDelivered = cashTotal - feesTotal; // airfare value not paid in cash
  const centsPerPoint = +(((cashTotal - feesTotal) / milesTotal) * 100).toFixed(2);
  return { pax, cashTotal, milesTotal, feesTotal, valueDelivered, centsPerPoint };
}

// ---- the stages. Each returns a patch merged into the case file ----
const STAGES = [
  {
    id: "intake",
    async run(cf) {
      const brief = await runAgent({
        agent: "intake-concierge",
        task: "Normalize this engagement into one plain paragraph: who the client is, the exact trip, the deadline, and the single guaranteed-value number we commit to.",
        context: { client: cf.client, request: cf.request },
        offline: (c) =>
          `${c.client.name} (home ${c.client.homeAirport}) wants ${c.request.pax}x ${c.request.cabin} ${c.request.from}->${c.request.to} in ${c.request.month}, within ${c.request.deadlineMonths} months. Upfront commits to a value floor of ${cad(c.request.guaranteedValueFloor)} or the fee is refunded.`,
      });
      return { brief };
    },
  },
  {
    id: "award-hunt",
    async run(cf) {
      const res = searchAward({ from: cf.request.from, to: cf.request.to, cabin: cf.request.cabin, pax: cf.request.pax, month: cf.request.month });
      // Only book what the client can BOOK and what their Canadian cards can FUND.
      const fundable = fundableProgramNames();
      const nm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const isFundable = (o) => [...fundable].some((f) => nm(o.program) === f || f.includes(nm(o.program)) || nm(o.program).includes(f));
      const bookable = res.options.filter((o) => o.bookable);
      const fundableBookable = bookable.filter(isFundable);
      const pool = fundableBookable.length ? fundableBookable : bookable.length ? bookable : res.options;
      const ranked = [...pool].sort((a, b) => b.dealScore - a.dealScore);
      const pick = ranked[0];
      const backup = ranked[1] || res.options.find((o) => o !== pick);
      const rationale = await runAgent({
        agent: "award-hunter",
        task: "From these bookable, fundable award options, pick the one to book and justify it in 2-3 sentences (value, surcharges, product, risk). Name a backup. Never pick an award the client cannot fund from Canadian cards. Do not change any number.",
        context: { fundablePrograms: [...fundable], options: ranked, pick, backup },
        offline: (x) =>
          `Book ${x.pick.carrier} ${x.pick.routing} (${x.pick.program}, deal score ${x.pick.dealScore}/100): ${x.pick.milesEach.toLocaleString()} ${x.pick.program} pts + ${cad(x.pick.taxesEachCad)} taxes each, vs ${cad(x.pick.cashEachCad)} cash. ${x.pick.note}${x.backup ? " Backup: " + x.backup.carrier + " (" + x.backup.program + ")." : ""}`,
      });
      return { awardOptions: res.options, chosen: { ...pick, fundable: isFundable(pick), rationale } };
    },
  },
  {
    id: "earn-plan",
    async run(cf) {
      // The chosen award decides BOTH the program and the number of points needed.
      const pointsTarget = cf.chosen.milesEach * cf.chosen.pax;
      const plan = recommendEarnPlan(cf.client, { points: pointsTarget, deadlineMonths: cf.request.deadlineMonths, currencyName: cf.chosen.program });
      const explanation = await runAgent({
        agent: "earn-strategist",
        task: "Explain this earn plan plainly: which cards, in what order, what to spend and by when, that bonuses transfer to the award's program, and that the surplus is the safety margin. Do not change any number.",
        context: { plan, program: cf.chosen.program, client: cf.client },
        offline: (x) =>
          x.plan.cards.length
            ? `Open ${x.plan.cards.map((c) => c.card).join(", then ")}. Sign-up bonuses (transferred to ${cf.chosen.program} where needed) plus your usual ${cad(cf.client.monthlySpend)}/mo net ~${x.plan.projectedPoints.toLocaleString()} ${cf.chosen.program} points in ${x.plan.timelineMonths} months, a ${x.plan.surplus.toLocaleString()}-point cushion over the ${x.plan.target.toLocaleString()} needed. Card fees this cycle: ${cad(x.plan.cashOutlayFees)}.`
            : `No Canadian card plan reaches ${x.plan.target.toLocaleString()} ${cf.chosen.program} points within ${x.plan.timelineMonths} months at this spend.`,
      });
      return { earnPlan: { ...plan, explanation, program: cf.chosen.program } };
    },
  },
  {
    id: "value", // pure deterministic stage, no agent
    async run(cf) {
      return { value: computeValue(cf.chosen) };
    },
  },
  {
    id: "reality-check",
    async run(cf) {
      const floor = cf.request.guaranteedValueFloor;
      const meetsFloor = cf.value.valueDelivered >= floor;
      const enoughPoints = cf.earnPlan.projectedPoints >= cf.earnPlan.target;
      const fundable = cf.chosen.fundable !== false;
      const verdict = meetsFloor && enoughPoints && cf.chosen.bookable && fundable ? "GO" : "NO-GO";
      const review = await runAgent({
        agent: "trip-reality-checker",
        task: "Adversarially gate this engagement. Verify (a) projected points >= target in the award's program, (b) value delivered >= guaranteed floor, (c) award is currently bookable, (d) the program is fundable from Canadian cards. List the top risks. End with GO or NO-GO. Do not soften a NO-GO.",
        context: { value: cf.value, points: { target: cf.earnPlan.target, projected: cf.earnPlan.projectedPoints, program: cf.chosen.program }, bookable: cf.chosen.bookable, fundable, floor },
        offline: () =>
          `${verdict}. Points ${enoughPoints ? "OK" : "SHORT"} (${cf.earnPlan.projectedPoints.toLocaleString()}/${cf.earnPlan.target.toLocaleString()} ${cf.chosen.program}). Value ${meetsFloor ? "OK" : "BELOW FLOOR"} (${cad(cf.value.valueDelivered)} vs floor ${cad(floor)}). Bookable ${cf.chosen.bookable ? "yes" : "NO"}. Fundable from Canadian cards ${fundable ? "yes" : "NO"}. Top risks: award space can vanish before spend completes (watch alerts, hold flexible space); card approval not guaranteed; surcharges can move at ticketing.`,
      });
      return { realityCheck: { verdict, meetsFloor, enoughPoints, fundable, review } };
    },
  },
];

export async function runPipeline(cf, { autoApprove = false, onHumanGate } = {}) {
  for (const stage of STAGES) {
    let attempt = 0;
    while (true) {
      try {
        logEvent(cf, stage.id, "start");
        Object.assign(cf, await stage.run(cf));
        logEvent(cf, stage.id, "ok");
        save(cf); // durable shared memory after every stage
        break;
      } catch (err) {
        attempt++;
        logEvent(cf, stage.id, "error", { attempt, message: String((err && err.message) || err) });
        save(cf);
        if (attempt >= 2) {
          cf.status = "needs-human";
          cf.reviews.push({ stage: stage.id, kind: "error-escalation", message: String(err) });
          save(cf);
          throw new Error(`Stage ${stage.id} failed twice; escalated to human.`);
        }
      }
    }

    // Human-in-the-loop gate AFTER the reality check, BEFORE anything client-facing.
    if (stage.id === "reality-check") {
      const gate = { stage: "human-review", verdict: cf.realityCheck.verdict, summary: cf.realityCheck.review };
      if (cf.realityCheck.verdict === "NO-GO") {
        cf.status = "blocked-no-go";
        cf.reviews.push({ ...gate, decision: "auto-blocked" });
        save(cf);
        return cf; // never ships a NO-GO
      }
      const approved = autoApprove || (onHumanGate ? await onHumanGate(cf) : false);
      cf.reviews.push({ ...gate, decision: approved ? "approved" : "pending" });
      save(cf);
      if (!approved) {
        cf.status = "awaiting-human-approval";
        return cf; // pause; resume later from runs/<id>.json
      }
    }
  }

  // Final client deliverable (only after GO + human approval)
  cf.deliverable = await runAgent({
    agent: "client-writer",
    task: "Write the final client-facing trip plan in calm, plain, brokerage-grade language (Upfront brand). Sections: The result (one number), Your trip, Your earn plan, What we booked, The math, What happens next, The guarantee. Use only numbers present in the case context.",
    context: { client: cf.client, request: cf.request, earnPlan: cf.earnPlan, chosen: cf.chosen, value: cf.value },
    offline: (ctx) => offlineDeliverable(ctx),
  });
  cf.status = "delivered";
  save(cf);
  return cf;
}

function offlineDeliverable(ctx) {
  const { client, request, earnPlan, chosen, value } = ctx;
  const cards = earnPlan.cards
    .map((c) =>
      c.sub
        ? `- **${c.card}**: ${c.sub.toLocaleString()} pt bonus after ${cad(c.minSpend)} spend in ${c.spendMonths} mo (annual fee ${cad(c.annualFee)}). ${c.note}`
        : `- **${c.card}**: already held (annual fee ${cad(c.annualFee)}). ${c.note}`
    )
    .join("\n");
  return `# Upfront trip plan for ${client.name}

## The result
**${cad(value.valueDelivered)} of ${request.cabin.toLowerCase()}-class airfare for ${cad(value.feesTotal)} in taxes** (plus our flat fee).
That is **${value.centsPerPoint} cents of value per point**.

## Your trip
${request.pax}x **${request.cabin}**, ${request.from} to ${request.to}, ${request.month}

## Your earn plan (${earnPlan.timelineMonths} months)
You need ${earnPlan.target.toLocaleString()} points. This plan projects **${earnPlan.projectedPoints.toLocaleString()}**, a ${earnPlan.surplus.toLocaleString()}-point cushion:
${cards}

> ${earnPlan.explanation}

## What we booked
**${chosen.carrier}: ${chosen.routing}**, ${chosen.program}, deal score ${chosen.dealScore}/100
${chosen.milesEach.toLocaleString()} pts + ${cad(chosen.taxesEachCad)} taxes per person.

> ${chosen.rationale}

## The math
| | Cash price | You pay in points | You pay in cash |
|---|---:|---:|---:|
| ${request.pax}x ${request.cabin} | ${cad(value.cashTotal)} | ${value.milesTotal.toLocaleString()} pts | ${cad(value.feesTotal)} |

**Value delivered: ${cad(value.valueDelivered)}.**

## What happens next
1. Apply for the cards in the order above. We send the exact links and dates.
2. Put your normal spend on them; we track each bonus to the dollar.
3. The moment your points post, we book the seats we have been watching.
4. You get the booking reference, seat assignments, and check-in reminders.

## The guarantee
If we do not deliver at least **${cad(request.guaranteedValueFloor)}** of value, your Upfront fee is refunded in full. The points and the cards are yours regardless.
`;
}
