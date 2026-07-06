// EARN adapter -> wraps the Credit Card Project's deterministic recommendation engine.
//
// THE MOAT (now wired): this used to be a 3-card hardcoded mock. It now reimplements the
// minimal earn-plan path of the REAL engine (products/credit-card/packages/engine) over the
// REAL Canadian catalog (products/credit-card/packages/data) — 70 cards, their actual sign-up
// bonuses, minimum spends, bonus windows, annual fees, earn rates, the currency/valuation table
// and the transfer graph — copied verbatim into creditcard.data.json beside this file.
//
// Pure ESM, zero deps, deterministic. Given the same (profile, target) it always returns the
// same plan; every number traces to the catalog and the formulas below (ports of the engine's
// resolveCpp / projectedSpend / bonusEligibility / scoreCard). The Earn Strategist agent only
// narrates this output — it never invents the points math.
//
// Why a reimplementation and not a direct import: the engine ships as TypeScript with a zod
// runtime dependency and a workspace build step; the orchestration package is constrained to
// pure-node, no-deps, no-TS-build. So the deterministic earn-plan slice is ported faithfully in
// plain JS and the validated catalog is brought over as JSON. Logic and data are the product's.

import catalog from "./creditcard.data.js";

// --- shared enums (mirror packages/shared/src/enums.ts) -----------------------------------
const SPEND_CATEGORIES = [
  "groceries", "dining", "gas", "travel", "transit",
  "drugstore", "recurring", "entertainment", "foreign", "everything_else",
];
const CREDIT_SCORE_ORDER = { fair: 0, good: 1, excellent: 2 };

const byId = (arr, id) => arr.find((x) => x.id === id);
const round = (n) => Math.round(n);

// --- CPP resolution (port of engine resolveCpp + reachableCurrencies) ---------------------
// No travel plan is passed from the orchestration layer (the profile carries only a home
// airport), so preferredRegions is empty: every currency resolves to its conservative floor
// exactly as the engine does for a flexible/no-region user. The transfer graph + valuations
// are still loaded so the math is the engine's, not a constant.

function currencyName(id) {
  return byId(catalog.currencies, id)?.name ?? id;
}

/** Best reachable ratio to every currency from startId via the active transfer graph. */
function reachableCurrencies(startId) {
  const best = new Map();
  best.set(startId, { ratio: 1, path: currencyName(startId) });
  const queue = [{ id: startId, ratio: 1 }];
  let guard = 0;
  while (queue.length && guard++ < 10000) {
    const cur = queue.shift();
    for (const t of catalog.transfers) {
      if (t.isActive === false) continue;
      if (t.fromCurrencyId !== cur.id) continue;
      const ratio = cur.ratio * t.ratio;
      const existing = best.get(t.toCurrencyId);
      if (!existing || ratio > existing.ratio) {
        best.set(t.toCurrencyId, { ratio, path: currencyName(t.toCurrencyId) });
        queue.push({ id: t.toCurrencyId, ratio });
      }
    }
  }
  return [...best.entries()].map(([id, v]) => ({ id, ratio: v.ratio }));
}

/** Cents-per-point for a currency given the user's (here flexible) travel intent + savviness. */
function resolveCpp(currencyId, preferredRegions, profile) {
  const currency = byId(catalog.currencies, currencyId);
  if (!currency) return { currencyId, cpp: 1 };
  if (currency.type === "cashback") return { currencyId, cpp: currency.baselineCpp };

  let best = currency.baselineCpp;
  for (const node of reachableCurrencies(currencyId)) {
    const rows = catalog.valuations.filter((v) => v.currencyId === node.id);
    if (rows.length === 0) continue;
    let cpp;
    const specific = rows.filter((r) => r.region !== "any" && preferredRegions.has(r.region));
    if (specific.length) {
      cpp = specific.reduce((m, r) => (r.cpp > m ? r.cpp : m), 0);
    } else if (preferredRegions.has("any")) {
      const anyRow = rows.find((r) => r.region === "any");
      if (anyRow) cpp = anyRow.cpp;
    }
    if (cpp === undefined) continue;
    const eff = cpp * node.ratio;
    if (eff > best) best = eff;
  }
  if (profile.pointsSavvy === false) best = 0.5 * best + 0.5 * currency.baselineCpp;
  return { currencyId, cpp: best };
}

// --- earn simulation (port of engine annualCategoryPoints) --------------------------------

function everythingElseMultiplier(card) {
  return card.earnRules.find((r) => r.category === "everything_else")?.multiplier ?? 1;
}
function earnRuleFor(card, category) {
  return (
    card.earnRules.find((r) => r.category === category) ??
    card.earnRules.find((r) => r.category === "everything_else")
  );
}
/** Points earned on `spendCents` in a category, honoring the rule's spend cap + overflow rate. */
function categoryPoints(card, category, spendCents) {
  const rule = earnRuleFor(card, category);
  const baseMult = everythingElseMultiplier(card);
  if (!rule) return (spendCents / 100) * baseMult;
  if (rule.monthlyCapSpendCents != null && rule.capPeriod) {
    const capAnnual =
      rule.capPeriod === "monthly" ? rule.monthlyCapSpendCents * 12 : rule.monthlyCapSpendCents;
    const capped = Math.min(spendCents, capAnnual);
    const overflow = Math.max(0, spendCents - capped);
    const overMult = rule.capOverflowMultiplier ?? baseMult;
    return (capped / 100) * rule.multiplier + (overflow / 100) * overMult;
  }
  return (spendCents / 100) * rule.multiplier;
}

// --- eligibility (port of engine meetsObtainability + bonusEligibility) --------------------

function meetsObtainability(card, profile, heldIds) {
  if (card.isActive === false) return false;
  if (heldIds.has(card.id)) return false;
  if (card.minIncomePersonalCents != null && profile.annualIncomeCents != null) {
    if (profile.annualIncomeCents < card.minIncomePersonalCents) return false;
  }
  if (
    profile.creditScoreBand &&
    CREDIT_SCORE_ORDER[profile.creditScoreBand] < CREDIT_SCORE_ORDER[card.recommendedCreditScore ?? "good"]
  ) {
    return false;
  }
  if (profile.willingToPayFees === false && card.annualFeeCents > 0 && !card.feeWaivedFirstYear) {
    return false;
  }
  return true;
}

// --- bonus feasibility within the deadline (port of engine projectedSpend + evaluateBonus) -
// spendByCat: Map<category, monthlyCents>. A tier counts only if its minimum spend is reachable
// within min(tier.windowMonths, deadlineMonths) of projected spend (steady-state; no lumpy
// upcoming purchases are passed from the orchestration layer).

function projectedSpend(windowMonths, restriction, excludes, spendByCat) {
  const allowed = (c) => (!restriction || restriction.includes(c)) && !excludes?.includes(c);
  let steady = 0;
  for (const [cat, monthly] of spendByCat) if (allowed(cat)) steady += monthly * windowMonths;
  return steady;
}

/** Feasible welcome-bonus points within the deadline, plus the hardest required spend/window hit. */
function feasibleBonus(card, spendByCat, deadlineMonths) {
  const wb = card.welcomeBonus;
  if (!wb) return null;
  const tiers = [...wb.tiers].sort((a, b) => a.minSpendCents - b.minSpendCents);
  let points = 0;
  let any = false;
  let minSpendCents = 0;
  let windowMonths = 0;        // the tier's nominal bonus window
  let effectiveWindow = 0;     // capped at the engagement deadline (when the client actually finishes)
  for (const tier of tiers) {
    // The bonus window is the tier's window, but the client must finish within the engagement deadline.
    const tierEffective = Math.min(tier.windowMonths, deadlineMonths);
    const proj = projectedSpend(tierEffective, wb.categoryRestriction, wb.excludesCategories, spendByCat);
    if (proj >= tier.minSpendCents) {
      points += tier.amount; // cumulative: hitting a higher tier also awards the lower ones
      any = true;
      if (tier.minSpendCents >= minSpendCents) {
        minSpendCents = tier.minSpendCents;
        windowMonths = tier.windowMonths;
        effectiveWindow = tierEffective;
      }
    }
  }
  return any ? { points, minSpendCents, windowMonths, effectiveWindow } : null;
}

// --- name -> card-id resolution -----------------------------------------------------------
// profile.cardsHeld arrives as human names ("Amex Cobalt"); map to catalog ids loosely.

function norm(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function resolveHeldIds(cardsHeld) {
  const held = new Set();
  for (const raw of cardsHeld ?? []) {
    const n = norm(raw);
    let match = catalog.cards.find((c) => norm(c.name) === n || c.id === raw);
    if (!match) {
      // token-subset match: every word of the query appears in the card name (e.g. "Amex Cobalt").
      const words = n.split(" ").filter(Boolean);
      match = catalog.cards.find((c) => {
        const cn = norm(c.name) + " " + norm(c.issuer);
        return words.every((w) => cn.includes(w));
      });
    }
    if (match) held.add(match.id);
  }
  return held;
}

// --- income band -> annual income cents ---------------------------------------------------

function incomeBandToCents(band) {
  if (!band) return undefined;
  const nums = String(band).match(/\d+/g);
  if (!nums) return undefined;
  // Use the band's LOWER bound (conservative for income gates), interpreted in thousands if "k".
  const k = /k/i.test(band);
  const low = parseInt(nums[0], 10) * (k ? 1000 : 1);
  return Math.round(low * 100);
}

// --- spend vector from a single monthly total ---------------------------------------------
// The engine takes a per-category monthly spend vector; the orchestration profile only carries
// a single monthlySpend total. We distribute it across the real categories with a fixed,
// documented household-typical weighting so cap-limited and category-restricted bonuses behave
// like the engine. (SIMPLIFICATION: the weighting is a stand-in for a real category survey.)
const SPEND_WEIGHTS = {
  groceries: 0.22, dining: 0.14, gas: 0.08, travel: 0.06, transit: 0.03,
  drugstore: 0.03, recurring: 0.16, entertainment: 0.05, foreign: 0.03, everything_else: 0.20,
};

function spendVector(monthlySpendDollars) {
  const totalCents = Math.round((monthlySpendDollars || 0) * 100);
  const m = new Map();
  for (const cat of SPEND_CATEGORIES) {
    const cents = Math.round(totalCents * (SPEND_WEIGHTS[cat] ?? 0));
    if (cents > 0) m.set(cat, cents);
  }
  return m;
}

// --- program/currency coordination (the burn engine tells us which program to fund) -------
function currencyIdByName(name) {
  if (!name) return undefined;
  const n = norm(name);
  const c = catalog.currencies.find((c) => { const cn = norm(c.name); return cn === n || cn.includes(n) || n.includes(cn); });
  return c?.id;
}
function bestRatioToTarget(fromId, targetId) {
  if (!targetId || fromId === targetId) return 1;
  for (const node of reachableCurrencies(fromId)) if (node.id === targetId) return node.ratio;
  return 0; // this card's points cannot reach the chosen award's program
}
/** Normalized names of every program a Canadian card in the catalog can fund, directly or via transfer. */
export function fundableProgramNames() {
  const names = new Set();
  for (const card of catalog.cards) {
    if (card.isActive === false) continue;
    const start = card.welcomeBonus?.currencyId ?? card.currencyId;
    if (!start) continue;
    for (const node of reachableCurrencies(start)) {
      const c = byId(catalog.currencies, node.id);
      if (c) names.add(norm(c.name));
    }
  }
  return names;
}

// --- the earn plan ------------------------------------------------------------------------

export function recommendEarnPlan(profile, target) {
  const months = target.deadlineMonths || 5;
  const targetPoints = target.points;
  // When the burn side has chosen an award, target ITS program so the earned points are usable.
  const targetCurrencyId = currencyIdByName(target.currencyName);

  const userProfile = {
    annualIncomeCents: incomeBandToCents(profile.incomeBand),
    creditScoreBand: undefined, // not provided by the orchestration profile -> no credit gate
    pointsSavvy: true,
    willingToPayFees: true,
  };
  const heldIds = resolveHeldIds(profile.cardsHeld);
  const spendByCat = spendVector(profile.monthlySpend);
  const preferredRegions = new Set(); // no travel plan from orchestration -> conservative cpp

  const cppCache = new Map();
  const cppOf = (currencyId) => {
    let c = cppCache.get(currencyId);
    if (!c) { c = resolveCpp(currencyId, preferredRegions, userProfile); cppCache.set(currencyId, c); }
    return c.cpp;
  };

  // Build candidate earn-plan cards: obtainable, with a sign-up bonus that is feasible within the
  // deadline. Score by the engine's first-year net value (bonus value + marginal earn on the bonus
  // spend, minus year-1 fee) so the ranking matches the product, then we accumulate toward target.
  const candidates = [];
  for (const card of catalog.cards) {
    if (!meetsObtainability(card, userProfile, heldIds)) continue;
    const fb = feasibleBonus(card, spendByCat, months);
    if (!fb || fb.points <= 0) continue;

    const bonusCurrencyId = card.welcomeBonus.currencyId ?? card.currencyId;
    // With a target program set, keep only cards whose bonus can REACH it; value the bonus in the
    // target currency, converted by the best transfer ratio. This is the burn<->earn coordination.
    const ratio = bestRatioToTarget(bonusCurrencyId, targetCurrencyId);
    if (targetCurrencyId && ratio <= 0) continue;
    const effBonusPoints = targetCurrencyId ? Math.round(fb.points * ratio) : fb.points;
    const cpp = cppOf(bonusCurrencyId);
    const feeYear1 = card.feeWaivedFirstYear ? 0 : card.annualFeeCents;
    const earnPts = categoryPoints(card, "everything_else", fb.minSpendCents);
    const earnValue = earnPts * cppOf(card.currencyId);
    const bonusValue = fb.points * cpp;
    const firstYearNetCents = round(bonusValue + earnValue - feeYear1);

    candidates.push({
      card, fb, cpp, bonusCurrencyId, effBonusPoints,
      firstYearNetCents,
      bonusValueCents: round(bonusValue),
      annualFeeCents: card.annualFeeCents,
    });
  }

  // Deterministic order (mirrors engine scoreCard tie-breaks): best net first-year value, then the
  // cheaper annual fee, then card id. This makes the plan reproducible and audit-stable.
  candidates.sort((a, b) =>
    b.firstYearNetCents - a.firstYearNetCents ||
    a.annualFeeCents - b.annualFeeCents ||
    (a.card.id < b.card.id ? -1 : a.card.id > b.card.id ? 1 : 0),
  );

  // Greedily open cards until the feasible sign-up bonuses reach the points target. Bonuses are in
  // mixed currencies; the target is a points figure, so we accumulate raw bonus points (the product's
  // unit) and stop once we clear the target. Every card's bonus is feasible within the deadline.
  const chosen = [];
  let bonusPoints = 0;
  for (const cand of candidates) {
    if (bonusPoints >= targetPoints) break;
    chosen.push(cand);
    bonusPoints += cand.effBonusPoints; // already in the TARGET program's currency
  }

  // Projected points = feasible sign-up bonuses from the chosen NEW cards, plus the points the
  // client's steady spend earns across the engagement on the strongest card they will hold.
  const heldCards = [...heldIds].map((id) => byId(catalog.cards, id)).filter(Boolean);
  const walletForSpend = [...chosen.map((c) => c.card), ...heldCards];
  let spendPoints = 0;
  for (const [cat, monthlyCents] of spendByCat) {
    const annualWindowCents = monthlyCents * months;
    let bestPts = 0;
    for (const card of walletForSpend) {
      const r = targetCurrencyId ? bestRatioToTarget(card.welcomeBonus?.currencyId ?? card.currencyId, targetCurrencyId) : 1;
      if (targetCurrencyId && r <= 0) continue;
      const pts = categoryPoints(card, cat, annualWindowCents) * r;
      if (pts > bestPts) bestPts = pts;
    }
    spendPoints += bestPts;
  }
  const projectedPoints = round(bonusPoints + spendPoints);

  const tgtName = targetCurrencyId ? currencyName(targetCurrencyId) : null;
  const cards = chosen.map((c) => {
    const tier = [...c.card.welcomeBonus.tiers].sort((x, y) => y.minSpendCents - x.minSpendCents)[0];
    const annualFeeDollars = Math.round(c.annualFeeCents / 100);
    const subSpendDollars = Math.round(c.fb.minSpendCents / 100);
    const feeNote = c.card.feeWaivedFirstYear ? " First-year fee is rebated." : "";
    const nativeName = currencyName(c.bonusCurrencyId);
    const transferNote =
      tgtName && norm(nativeName) !== norm(tgtName)
        ? ` (${c.fb.points.toLocaleString()} ${nativeName} transferred to ~${c.effBonusPoints.toLocaleString()} ${tgtName}.)`
        : "";
    return {
      card: c.card.name,
      sub: c.effBonusPoints,
      minSpend: subSpendDollars,
      spendMonths: c.fb.effectiveWindow || c.fb.windowMonths || tier.windowMonths,
      annualFee: annualFeeDollars,
      note:
        `${c.effBonusPoints.toLocaleString()} ${tgtName || nativeName} for $${subSpendDollars.toLocaleString()} ` +
        `spent within ${c.fb.effectiveWindow} mo (window ${c.fb.windowMonths} mo, capped at ${months} mo).${transferNote}${feeNote}`,
    };
  });

  const cashOutlayFees = cards.reduce((s, c) => s + c.annualFee, 0);

  return {
    target: targetPoints,
    projectedPoints,
    surplus: projectedPoints - targetPoints,
    cards,
    timelineMonths: months,
    cashOutlayFees,
    deterministic: true,
    source:
      "credit-card engine (real): ported recommend-path over the live Canadian catalog " +
      `(${catalog.cards.length} cards) in creditcard.data.json`,
  };
}
