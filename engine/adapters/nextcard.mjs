// Next Best Card — faithful port of @ccp/engine recommend() (the consumer survey path).
// Pure and deterministic; the catalogue is passed in. Given (input, catalog, options) it returns
// the top-N cards ranked by net value, with the same marginal-over-your-wallet math, welcome-bonus
// feasibility, situational cents-per-point, and currency diversity as the real Credit Card product.
// 1:1 with products/credit-card/packages/engine/src/index.ts (types stripped, catalog as a param).

const round = (n) => Math.round(n);
const byId = (arr, id) => arr.find((x) => x.id === id);
const currencyName = (catalog, id) => byId(catalog.currencies, id)?.name ?? id;
const CREDIT_SCORE_ORDER = { fair: 0, good: 1, excellent: 2 };

function monthsBetween(fromIso, now) {
  const f = new Date(fromIso);
  return (now.getFullYear() - f.getFullYear()) * 12 + (now.getMonth() - f.getMonth());
}
function withinWindow(start, end, now) {
  if (!now) return false;
  if (start && now < new Date(start)) return false;
  if (end && now > new Date(end)) return false;
  return true;
}

const TRAVEL_TO_REDEMPTION = { general: "any", domestic: "domestic", north_america: "north_america", europe: "europe", asia: "asia", latam: "latam" };
function regionsFromTravelPlans(plans) {
  const s = new Set();
  for (const p of plans) { const r = TRAVEL_TO_REDEMPTION[p.region]; if (r) s.add(r); }
  return s;
}

export function reachableCurrencies(startId, catalog) {
  const best = new Map();
  best.set(startId, { ratio: 1, path: currencyName(catalog, startId) });
  const queue = [{ id: startId, ratio: 1, path: currencyName(catalog, startId) }];
  let guard = 0;
  while (queue.length && guard++ < 10000) {
    const cur = queue.shift();
    for (const t of catalog.transfers) {
      if (t.isActive === false) continue;
      if (t.fromCurrencyId !== cur.id) continue;
      const ratio = cur.ratio * t.ratio;
      const existing = best.get(t.toCurrencyId);
      if (!existing || ratio > existing.ratio) {
        const path = `${cur.path} -> ${currencyName(catalog, t.toCurrencyId)} x${t.ratio}`;
        best.set(t.toCurrencyId, { ratio, path });
        queue.push({ id: t.toCurrencyId, ratio, path });
      }
    }
  }
  return [...best.entries()].map(([id, v]) => ({ id, ratio: v.ratio, path: v.path }));
}

export function resolveCpp(currencyId, preferredRegions, profile, catalog) {
  const currency = byId(catalog.currencies, currencyId);
  if (!currency) return { currencyId, currencyName: currencyId, cpp: 1, path: "unknown", regionDriver: "baseline" };
  if (currency.type === "cashback") return { currencyId, currencyName: currency.name, cpp: currency.baselineCpp, path: "cash", regionDriver: "baseline" };
  let best = currency.baselineCpp, bestPath = `${currency.name} floor`, bestRegion = "baseline";
  for (const node of reachableCurrencies(currencyId, catalog)) {
    const rows = catalog.valuations.filter((v) => v.currencyId === node.id);
    if (rows.length === 0) continue;
    let cpp, region;
    const specific = rows.filter((r) => r.region !== "any" && preferredRegions.has(r.region));
    if (specific.length) { let m = specific[0]; for (const r of specific) if (r.cpp > m.cpp) m = r; cpp = m.cpp; region = m.region; }
    else if (preferredRegions.has("any")) { const anyRow = rows.find((r) => r.region === "any"); if (anyRow) { cpp = anyRow.cpp; region = "any"; } }
    if (cpp === undefined || region === undefined) continue;
    const eff = cpp * node.ratio;
    if (eff > best) { best = eff; bestPath = node.id === currencyId ? `${currency.name} (${region})` : `${node.path} (${region})`; bestRegion = region; }
  }
  if (profile.pointsSavvy === false) best = 0.5 * best + 0.5 * currency.baselineCpp;
  return { currencyId, currencyName: currency.name, cpp: best, path: bestPath, regionDriver: bestRegion };
}

const everythingElseMultiplier = (card) => card.earnRules.find((r) => r.category === "everything_else")?.multiplier ?? 1;
const earnRuleFor = (card, category) => card.earnRules.find((r) => r.category === category) ?? card.earnRules.find((r) => r.category === "everything_else");

function annualCategoryPoints(card, category, annualSpendCents) {
  const rule = earnRuleFor(card, category);
  const baseMult = everythingElseMultiplier(card);
  if (!rule) return (annualSpendCents / 100) * baseMult;
  if (rule.monthlyCapSpendCents != null && rule.capPeriod) {
    const capAnnual = rule.capPeriod === "monthly" ? rule.monthlyCapSpendCents * 12 : rule.monthlyCapSpendCents;
    const capped = Math.min(annualSpendCents, capAnnual);
    const overflow = Math.max(0, annualSpendCents - capped);
    const overMult = rule.capOverflowMultiplier ?? baseMult;
    return (capped / 100) * rule.multiplier + (overflow / 100) * overMult;
  }
  return (annualSpendCents / 100) * rule.multiplier;
}
const categoryValueCents = (card, category, annualSpendCents, cpp) => annualCategoryPoints(card, category, annualSpendCents) * cpp;

function meetsObtainability(card, profile, heldIds, excludeCategories) {
  if (card.isActive === false) return false;
  if (heldIds.has(card.id)) return false;
  if (excludeCategories?.includes(card.category)) return false;
  if (card.minIncomePersonalCents != null && profile.annualIncomeCents != null) {
    const personalOk = profile.annualIncomeCents >= card.minIncomePersonalCents;
    const householdOk = card.minIncomeHouseholdCents != null && profile.householdIncomeCents != null && profile.householdIncomeCents >= card.minIncomeHouseholdCents;
    if (!personalOk && !householdOk) return false;
  }
  if (profile.creditScoreBand && CREDIT_SCORE_ORDER[profile.creditScoreBand] < CREDIT_SCORE_ORDER[card.recommendedCreditScore]) return false;
  if (profile.willingToPayFees === false && card.annualFeeCents > 0 && !card.feeWaivedFirstYear) return false;
  return true;
}

function bonusEligibility(card, bonusHistory, now) {
  const wb = card.welcomeBonus;
  if (!wb) return { eligible: true };
  const hist = bonusHistory.get(card.id);
  if (wb.eligibilityRule === "once_per_lifetime" && hist) return { eligible: false, note: "Once-per-lifetime bonus, you have already received it on this card." };
  if (wb.eligibilityRule === "no_bonus_if_held_in_months" && hist) {
    const lockout = wb.heldWithinMonths ?? 24;
    if (now && hist.receivedOn) { const m = monthsBetween(hist.receivedOn, now); if (m < lockout) return { eligible: false, note: `No bonus if received within ${lockout} months (last received ${m} months ago).` }; }
    else return { eligible: false, note: "Recently held, bonus likely unavailable." };
  }
  return { eligible: true };
}

function projectedSpend(windowMonths, restriction, excludes, spendByCat, purchases) {
  const allowed = (c) => (!restriction || restriction.includes(c)) && !excludes?.includes(c);
  let steady = 0;
  for (const [cat, monthly] of spendByCat) if (allowed(cat)) steady += monthly * windowMonths;
  let lumpy = 0;
  for (const p of purchases) { if (p.monthsFromNow < windowMonths && allowed(p.category)) lumpy += p.amountCents * (p.confidence ?? 1); }
  return steady + lumpy;
}

export function rateOffer(currentPoints, typicalPoints, bestPoints) {
  if (typicalPoints == null && bestPoints == null) return null;
  const best = bestPoints ?? Math.max(currentPoints, typicalPoints ?? currentPoints);
  const typical = typicalPoints ?? best;
  const percentOfBest = best > 0 ? Math.round((currentPoints / best) * 100) : 100;
  const vsTypicalPct = typical > 0 ? Math.round(((currentPoints - typical) / typical) * 100) : 0;
  let level, label;
  if (currentPoints >= best * 0.98) { level = "best"; label = "At its best ever"; }
  else if (currentPoints >= typical * 1.1) { level = "strong"; label = "Above its usual"; }
  else if (currentPoints >= typical * 0.92) { level = "typical"; label = "Around its usual"; }
  else { level = "below"; label = "Below its usual"; }
  return { currentPoints, typicalPoints: typical, bestPoints: best, percentOfBest, vsTypicalPct, level, label };
}

function evaluateBonus(card, ctx) {
  const wb = card.welcomeBonus;
  if (!wb) return null;
  const bonusCurrencyId = wb.currencyId ?? card.currencyId;
  const cpp = ctx.cppOf(bonusCurrencyId).cpp;
  const elig = bonusEligibility(card, ctx.bonusHistory, ctx.now);
  const eligible = elig.eligible, eligibilityNote = elig.note;
  const tiers = [...wb.tiers].sort((a, b) => a.minSpendCents - b.minSpendCents);
  let points = 0, anyFeasible = false, maxWindow = 0, hardestRequired = 0, hardestProjected = 0;
  const tierLines = [];
  for (const tier of tiers) {
    const proj = projectedSpend(tier.windowMonths, wb.categoryRestriction, wb.excludesCategories, ctx.spendByCat, ctx.purchases);
    maxWindow = Math.max(maxWindow, tier.windowMonths);
    const feasible = proj >= tier.minSpendCents;
    if (feasible) { points += tier.amount; anyFeasible = true; }
    tierLines.push(`${tier.amount.toLocaleString()} pts for $${Math.round(tier.minSpendCents / 100).toLocaleString()} in ${tier.windowMonths}mo: ${feasible ? "feasible" : "NOT feasible"} (projected ~$${Math.round(proj / 100).toLocaleString()})`);
    if (tier.minSpendCents >= hardestRequired) { hardestRequired = tier.minSpendCents; hardestProjected = proj; }
  }
  const awardedPoints = eligible ? points : 0;
  const valueCents = awardedPoints * cpp;
  return { amountPoints: awardedPoints, currencyId: bonusCurrencyId, cppUsed: cpp, valueCents: round(valueCents), feasible: anyFeasible, eligible, projectedSpendCents: round(hardestProjected), requiredSpendCents: hardestRequired, windowMonths: maxWindow, detail: eligible ? tierLines.join("; ") : (eligibilityNote ?? "Not eligible"), eligibilityNote, offerRating: rateOffer(wb.tiers.reduce((s, t) => s + t.amount, 0), wb.typicalPoints, wb.bestPoints) };
}

function scoreCard(card, ctx) {
  const cardCpp = ctx.cppOf(card.currencyId);
  const marginals = [];
  let marginalOngoing = 0;
  for (const [category, monthly] of ctx.spendByCat) {
    const annual = monthly * 12;
    if (annual <= 0) continue;
    const candVal = categoryValueCents(card, category, annual, cardCpp.cpp);
    let baseVal = 0, baseName = null;
    for (const hc of ctx.heldCards) {
      const hcCpp = ctx.cppOf(hc.currencyId).cpp;
      const v = categoryValueCents(hc, category, annual, hcCpp);
      if (v > baseVal) { baseVal = v; baseName = hc.name; }
    }
    const marginal = Math.max(0, candVal - baseVal);
    marginalOngoing += marginal;
    if (marginal > 0.5) marginals.push({ category, annualSpendCents: annual, currentBestCardName: baseName, currentBestValueCents: round(baseVal), candidateMultiplier: earnRuleFor(card, category)?.multiplier ?? everythingElseMultiplier(card), candidateValueCents: round(candVal), marginalValueCents: round(marginal) });
  }
  marginals.sort((a, b) => b.marginalValueCents - a.marginalValueCents);
  const bonus = evaluateBonus(card, ctx);
  const bonusValue = bonus?.valueCents ?? 0;
  const feeYear1 = card.feeWaivedFirstYear ? 0 : card.annualFeeCents;
  const feeOngoing = card.annualFeeCents;
  const firstYearNet = marginalOngoing + bonusValue - feeYear1;
  const ongoingNet = marginalOngoing - feeOngoing;
  const cppResMap = new Map();
  cppResMap.set(cardCpp.currencyId, cardCpp);
  if (bonus) cppResMap.set(bonus.currencyId, ctx.cppOf(bonus.currencyId));
  const notes = [];
  if (ongoingNet < 0 && firstYearNet > 0) notes.push("Strong first-year value from the welcome bonus, but negative ongoing, plan to downgrade or cancel before year 2.");
  if (bonus && !bonus.eligible && bonus.eligibilityNote) notes.push(bonus.eligibilityNote);
  if (bonus?.eligible && !bonus.feasible) notes.push("Welcome bonus not counted: your projected spend does not reach the minimum within the window.");
  const promo = ctx.activeTransferPromos.get(card.currencyId);
  if (promo) notes.push(promo);
  const breakdown = { welcomeBonus: bonus, marginalEarnByCategory: marginals, ongoingMarginalCents: round(marginalOngoing), annualFeeCents: card.annualFeeCents, feeWaivedYear1: card.feeWaivedFirstYear, cppResolutions: [...cppResMap.values()], notes };
  const rec = { cardId: card.id, cardName: card.name, issuer: card.issuer, currencyId: card.currencyId, rank: 0, firstYearNetCents: round(firstYearNet), ongoingAnnualNetCents: round(ongoingNet), bonusFeasible: !!bonus && bonus.eligible && bonus.feasible, breakdown };
  return { card, rec };
}

/** Rank the user's HELD cards by reward value for one spend category+amount ("which card should I use?"). */
export function rankHeldCardsForCategory(input, category, spendCents, catalog) {
  const preferredRegions = regionsFromTravelPlans(input.travelPlans || []);
  const profile = input.profile;
  const cppCache = new Map();
  const cppOf = (currencyId) => { let c = cppCache.get(currencyId); if (!c) { c = resolveCpp(currencyId, preferredRegions, profile, catalog); cppCache.set(currencyId, c); } return c; };
  const held = (input.holdings || []).map((h) => byId(catalog.cards, h.cardId)).filter(Boolean);
  const out = held.map((card) => {
    const res = cppOf(card.currencyId);
    const points = annualCategoryPoints(card, category, spendCents);
    const rule = earnRuleFor(card, category);
    return { cardId: card.id, cardName: card.name, issuer: card.issuer, currencyId: card.currencyId, currencyName: res.currencyName, cpp: res.cpp, multiplier: rule?.multiplier ?? everythingElseMultiplier(card), points: Math.round(points), valueCents: Math.round(points * res.cpp) };
  });
  out.sort((a, b) => b.valueCents - a.valueCents);
  return out;
}

// ---- big-purchase planner: multiple-choice knapsack over welcome-bonus tier-stops ----
function chooseGroups(groups, capacity, maxCount) {
  const memo = new Map();
  const go = (i, capLeft, kLeft) => {
    if (i >= groups.length || kLeft <= 0) return { value: 0, picks: [] };
    const key = `${i}|${capLeft}|${kLeft}`;
    const cached = memo.get(key);
    if (cached) return cached;
    let best = go(i + 1, capLeft, kLeft);
    const opts = groups[i];
    for (let o = 0; o < opts.length; o++) {
      if (opts[o].weight > capLeft) continue;
      const sub = go(i + 1, capLeft - opts[o].weight, kLeft - 1);
      const value = sub.value + opts[o].value;
      if (value > best.value) best = { value, picks: [{ group: i, option: o }, ...sub.picks] };
    }
    memo.set(key, best);
    return best;
  };
  return go(0, capacity, maxCount).picks;
}

function classifyEligibility(wb) {
  if (wb.eligibilityRule === "once_per_lifetime" || wb.eligibilityRule === "new_clients_only")
    return { kind: "lifetime", oneShot: true, note: "Once-per-lifetime bonus, your one shot, so the plan grabs the full bonus or skips it." };
  if (wb.eligibilityRule === "no_bonus_if_held_in_months") {
    const months = wb.heldWithinMonths ?? 24;
    return { kind: "cooldown", oneShot: false, note: `Cooldown, you can earn this bonus again about ${months} months after your last one.` };
  }
  return { kind: "repeatable", oneShot: false, note: "Repeatable, you can earn this bonus again later." };
}

const POINTS_PER_HARD_PULL = 5;
const RISKY_INQUIRIES_PER_YEAR = 6;
const PRIME_APPROVAL_FLOOR = 660;
const UNKNOWN_BAND_COMFORT = 2;
const COMFORTABLE_CARDS_PER_YEAR = { excellent: 5, good: 3, fair: 2 };
const BAND_MIDPOINT = { excellent: 830, good: 692, fair: 610 };

function computeCreditImpact(band, hardPulls) {
  const comfortableCount = band ? COMFORTABLE_CARDS_PER_YEAR[band] : UNKNOWN_BAND_COMFORT;
  const estPointsDrop = hardPulls * POINTS_PER_HARD_PULL;
  const startingScoreEstimate = band ? BAND_MIDPOINT[band] : null;
  const projectedScoreEstimate = startingScoreEstimate != null ? startingScoreEstimate - estPointsDrop : null;
  const crossesFloor = startingScoreEstimate != null && startingScoreEstimate >= PRIME_APPROVAL_FLOOR && projectedScoreEstimate < PRIME_APPROVAL_FLOOR;
  let riskLevel;
  if (hardPulls > RISKY_INQUIRIES_PER_YEAR || crossesFloor) riskLevel = "high";
  else if (hardPulls > comfortableCount) riskLevel = "caution";
  else riskLevel = "ok";
  const pulls = `${hardPulls} hard ${hardPulls === 1 ? "inquiry" : "inquiries"}`;
  const recover = `~${estPointsDrop} pts, recovering within ~12 months`;
  const forTier = band ? ` for ${band} credit` : "";
  let note;
  if (hardPulls === 0) note = "No new applications, no credit hit.";
  else if (hardPulls > RISKY_INQUIRIES_PER_YEAR) note = `${pulls} in a year looks risky to lenders and can trigger declines. Open fewer, or stage them across more than a year.`;
  else if (crossesFloor) note = `${pulls} (${recover}) could pull your estimated score below ~${PRIME_APPROVAL_FLOOR}, the usual approval floor. Risky if you'll need a loan or mortgage soon.`;
  else if (riskLevel === "caution") note = `${pulls} (${recover}) is above the comfortable pace${forTier} (~${comfortableCount}/year). Approval odds dip, space applications ~3 months apart.`;
  else note = `${pulls} (${recover}) is a comfortable pace${forTier}. Space them ~3 months apart.`;
  return { hardPulls, pointsPerPull: POINTS_PER_HARD_PULL, estPointsDrop, startingScoreEstimate, projectedScoreEstimate, comfortableCount, riskLevel, note };
}

/** Profit-optimal set of NEW cards for one big purchase, splitting spend to stack welcome bonuses. */
export function planBigPurchase(input, purchaseCents, category, catalog, options = {}) {
  const profile = input.profile;
  const preferredRegions = regionsFromTravelPlans(input.travelPlans || []);
  const now = options.now ? new Date(options.now) : undefined;
  const cppCache = new Map();
  const cppOf = (currencyId) => { let c = cppCache.get(currencyId); if (!c) { c = resolveCpp(currencyId, preferredRegions, profile, catalog); cppCache.set(currencyId, c); } return c; };
  const heldIds = new Set((input.holdings || []).map((h) => h.cardId));
  const heldCards = (input.holdings || []).map((h) => byId(catalog.cards, h.cardId)).filter(Boolean);
  const bonusHistory = new Map((input.bonusHistory || []).map((b) => [b.cardId, b]));
  const earnOf = (card, cents) => (cents > 0 ? categoryValueCents(card, category, cents, cppOf(card.currencyId).cpp) : 0);
  const UNIT = 10000;
  const band = profile.creditScoreBand;

  let singleCardName = null, singleCardValue = 0;
  const groups = [];
  for (const card of catalog.cards) {
    if (!meetsObtainability(card, profile, heldIds, options.excludeCandidateCategories)) continue;
    const wb = card.welcomeBonus;
    if (!wb || wb.tiers.length === 0) continue;
    if (!bonusEligibility(card, bonusHistory, now).eligible) continue;
    if (wb.categoryRestriction && !wb.categoryRestriction.includes(category)) continue;
    if (wb.excludesCategories?.includes(category)) continue;
    const tiers = [...wb.tiers].sort((a, b) => a.minSpendCents - b.minSpendCents);
    const cum = [];
    let running = 0;
    for (let i = 0; i < tiers.length; i++) { running += tiers[i].amount; cum[i] = running; }
    const bonusCurrencyId = wb.currencyId ?? card.currencyId;
    const cppRes = cppOf(bonusCurrencyId);
    const cpp = cppRes.cpp;
    const feeYear1 = card.feeWaivedFirstYear ? 0 : card.annualFeeCents;
    const elig = classifyEligibility(wb);
    const reachable = [];
    for (let i = 0; i < tiers.length; i++) if (tiers[i].minSpendCents > 0 && tiers[i].minSpendCents <= purchaseCents) reachable.push(i);
    if (reachable.length === 0) continue;
    const topIdx = reachable[reachable.length - 1];
    const maxReachableTierHit = topIdx + 1;
    const singleVal = cum[topIdx] * cpp - feeYear1 + earnOf(card, purchaseCents);
    if (singleVal > singleCardValue) { singleCardValue = singleVal; singleCardName = card.name; }
    const stopIdxs = elig.oneShot ? [topIdx] : reachable;
    const opts = [];
    for (const i of stopIdxs) {
      const minSpendCents = tiers[i].minSpendCents;
      const points = cum[i];
      const bonusValueCents = points * cpp;
      const earnCents = earnOf(card, minSpendCents);
      const value = bonusValueCents + earnCents - feeYear1;
      if (value <= 0) continue;
      const next = i + 1 < tiers.length ? tiers[i + 1] : null;
      opts.push({ weight: Math.ceil(minSpendCents / UNIT), value, card, tierHit: i + 1, tiersAvailable: tiers.length, maxReachableTierHit, minSpendCents, points, bonusCurrencyId, bonusCurrencyName: cppRes.currencyName, cpp, bonusValueCents, feeYear1, earnCents, eligibility: elig.kind, eligibilityNote: elig.note, nextTierAmount: next ? next.amount : null, nextTierExtraSpendCents: next ? next.minSpendCents - minSpendCents : null });
    }
    if (opts.length > 0) groups.push(opts);
  }
  for (const card of heldCards) { const v = earnOf(card, purchaseCents); if (v > singleCardValue) { singleCardValue = v; singleCardName = card.name; } }
  const singleCardValueCents = round(singleCardValue);
  groups.sort((a, b) => {
    const av = Math.max(...a.map((o) => o.value)), bv = Math.max(...b.map((o) => o.value));
    const aw = Math.min(...a.map((o) => o.weight)), bw = Math.min(...b.map((o) => o.weight));
    return bv - av || aw - bw || (a[0].card.id < b[0].card.id ? -1 : 1);
  });
  for (const g of groups) g.sort((a, b) => a.weight - b.weight || a.value - b.value);
  const maxNeeded = groups.reduce((s, g) => s + Math.max(...g.map((o) => o.weight)), 0);
  const dpCapacity = Math.min(Math.floor(purchaseCents / UNIT), maxNeeded);
  const weights = groups.map((g) => g.map((o) => ({ weight: o.weight, value: o.value })));
  const feasiblePicks = chooseGroups(weights, dpCapacity, groups.length);
  const maxFeasibleCardCount = feasiblePicks.length;
  const comfortable = band ? COMFORTABLE_CARDS_PER_YEAR[band] : UNKNOWN_BAND_COMFORT;
  const recommendedCardCount = Math.min(maxFeasibleCardCount, comfortable);
  const requested = options.maxCards != null ? Math.floor(options.maxCards) : recommendedCardCount;
  const cap = Math.max(0, Math.min(requested, maxFeasibleCardCount));
  const picks = cap >= maxFeasibleCardCount ? feasiblePicks : chooseGroups(weights, dpCapacity, cap);
  const chosen = picks.map((p) => groups[p.group][p.option]);
  const allocatedCents = chosen.reduce((s, o) => s + o.minSpendCents, 0);
  const leftoverCents = Math.max(0, purchaseCents - allocatedCents);
  let leftoverCardName = null, leftoverEarnCents = 0;
  for (const card of [...chosen.map((o) => o.card), ...heldCards]) {
    const v = earnOf(card, leftoverCents);
    if (v > leftoverEarnCents) { leftoverEarnCents = v; leftoverCardName = card.name; }
  }
  const cards = chosen.map((o) => {
    let skippedTierNote;
    if (o.tierHit < o.maxReachableTierHit && o.nextTierAmount != null && o.nextTierExtraSpendCents != null) {
      const at = Math.round(o.minSpendCents / 100).toLocaleString("en-CA");
      const more = Math.round(o.nextTierExtraSpendCents / 100).toLocaleString("en-CA");
      skippedTierNote = `Stops at the $${at} tier. The next tier's +${o.nextTierAmount.toLocaleString("en-CA")} ${o.bonusCurrencyName} would need $${more} more spend, worth more unlocking another card.`;
    }
    return { cardId: o.card.id, cardName: o.card.name, issuer: o.card.issuer, allocateCents: o.minSpendCents, bonusPoints: o.points, bonusCurrencyId: o.bonusCurrencyId, bonusCurrencyName: o.bonusCurrencyName, cppUsed: o.cpp, bonusValueCents: round(o.bonusValueCents), annualFeeCents: o.card.annualFeeCents, feeWaivedYear1: o.card.feeWaivedFirstYear ?? false, earnOnAllocationCents: round(o.earnCents), netValueCents: round(o.value), tierHit: o.tierHit, tiersAvailable: o.tiersAvailable, skippedTierNote, eligibility: o.eligibility, eligibilityNote: o.eligibilityNote };
  });
  const totalValueCents = round(cards.reduce((s, c) => s + c.netValueCents, 0) + leftoverEarnCents);
  return { purchaseCents, category, maxCards: options.maxCards != null ? cap : null, recommendedCardCount, maxFeasibleCardCount, creditImpact: computeCreditImpact(band, chosen.length), cards, allocatedCents, leftoverCents, leftoverCardName, leftoverEarnCents: round(leftoverEarnCents), totalValueCents, singleCardName, singleCardValueCents, upliftVsSingleCents: round(totalValueCents - singleCardValueCents) };
}

// ---- welcome-bonus tracker + perk reminders ----
const DAY_MS = 86400000;
function addMonths(d, months) { const r = new Date(d.getTime()); r.setMonth(r.getMonth() + months); return r; }
function daysUntil(now, target) { return Math.floor((target.getTime() - now.getTime()) / DAY_MS); }

/** Progress toward a held card's welcome-bonus minimum spend, with a profile-tailored pace. */
export function trackWelcomeBonus(card, openedOnIso, spentCents, nowIso, monthlyOrganicCents, cpp) {
  const wb = card.welcomeBonus;
  if (!wb || wb.tiers.length === 0) return null;
  const tiers = [...wb.tiers].sort((a, b) => a.minSpendCents - b.minSpendCents);
  const cum = [];
  let running = 0;
  for (let i = 0; i < tiers.length; i++) { running += tiers[i].amount; cum[i] = running; }
  const nextIdx = tiers.findIndex((t) => t.minSpendCents > spentCents);
  const idx = nextIdx === -1 ? tiers.length - 1 : nextIdx;
  const targetCents = tiers[idx].minSpendCents;
  const windowMonths = tiers[idx].windowMonths;
  const fullBonusPoints = cum[idx];
  const opened = new Date(openedOnIso);
  const now = new Date(nowIso);
  const deadline = addMonths(opened, windowMonths);
  const daysLeft = daysUntil(now, deadline);
  const remainingCents = Math.max(0, targetCents - spentCents);
  const pct = targetCents > 0 ? Math.min(1, Math.max(0, spentCents / targetCents)) : 1;
  const weeksLeft = Math.max(daysLeft, 0) / 7;
  const organicCoversCents = Math.max(0, Math.round((monthlyOrganicCents * Math.max(0, daysLeft)) / 30));
  let status;
  if (remainingCents === 0) status = "done";
  else if (daysLeft < 0) status = "expired";
  else if (spentCents + organicCoversCents >= targetCents) status = "on_track";
  else status = "behind";
  const active = status === "on_track" || status === "behind";
  const perWeek = (cents) => (active && weeksLeft > 0 ? Math.round(cents / Math.max(weeksLeft, 1 / 7)) : 0);
  return { cardId: card.id, cardName: card.name, currencyId: wb.currencyId ?? card.currencyId, targetCents, spentCents, remainingCents, pct, windowMonths, deadlineIso: deadline.toISOString(), daysLeft, status, recommendedPerWeekCents: perWeek(remainingCents), organicCoversCents, extraPerWeekCents: perWeek(Math.max(0, remainingCents - organicCoversCents)), fullBonusPoints, bonusValueCents: Math.round(fullBonusPoints * cpp) };
}

function endOfPeriod(now, cadence) {
  const y = now.getFullYear(), m = now.getMonth();
  if (cadence === "monthly") return new Date(y, m + 1, 0);
  if (cadence === "quarterly") return new Date(y, Math.floor(m / 3) * 3 + 3, 0);
  if (cadence === "semiannual") return new Date(y, m < 6 ? 6 : 12, 0);
  return new Date(y, 12, 0);
}
function nextAnniversary(opened, now) {
  const thisYear = new Date(now.getFullYear(), opened.getMonth(), opened.getDate());
  return thisYear.getTime() >= now.getTime() ? thisYear : new Date(now.getFullYear() + 1, opened.getMonth(), opened.getDate());
}
/** Use-it-or-lose-it perk reminders for a held card. */
export function cardPerkReminders(card, openedOnIso, nowIso) {
  const now = new Date(nowIso);
  const opened = new Date(openedOnIso);
  const out = (card.perks || []).map((p) => {
    const useBy = p.kind === "keep_active" ? nextAnniversary(opened, now) : endOfPeriod(now, p.cadence);
    return { id: p.id, kind: p.kind, label: p.label, amountCents: p.amountCents ?? null, cadence: p.cadence, useByIso: useBy.toISOString(), daysLeft: daysUntil(now, useBy), notes: p.notes ?? null };
  });
  out.sort((a, b) => a.daysLeft - b.daysLeft);
  return out;
}

/** Top-N "next best card" recommendations for a survey input. Ranked by first-year (default) or ongoing net value. */
export function recommend(input, catalog, options = {}) {
  const profile = input.profile;
  const preferredRegions = regionsFromTravelPlans(input.travelPlans || []);
  const now = options.now ? new Date(options.now) : undefined;
  const cppCache = new Map();
  const cppOf = (currencyId) => { let c = cppCache.get(currencyId); if (!c) { c = resolveCpp(currencyId, preferredRegions, profile, catalog); cppCache.set(currencyId, c); } return c; };
  const spendByCat = new Map();
  for (const s of input.spend || []) spendByCat.set(s.category, (spendByCat.get(s.category) ?? 0) + s.monthlyCents);
  const heldIds = new Set((input.holdings || []).map((h) => h.cardId));
  const heldCards = (input.holdings || []).map((h) => byId(catalog.cards, h.cardId)).filter(Boolean);
  const bonusHistory = new Map((input.bonusHistory || []).map((b) => [b.cardId, b]));
  const activeTransferPromos = new Map();
  for (const t of catalog.transfers) {
    if (t.bonusRatioMultiplier && t.bonusRatioMultiplier > 1 && withinWindow(t.bonusStarts, t.bonusEnds, now)) {
      const pct = Math.round((t.bonusRatioMultiplier - 1) * 100);
      activeTransferPromos.set(t.fromCurrencyId, `Limited-time +${pct}% transfer bonus ${currencyName(catalog, t.fromCurrencyId)} -> ${currencyName(catalog, t.toCurrencyId)}${t.bonusEnds ? ` (ends ${t.bonusEnds})` : ""}, extra upside not included in the headline value.`);
    }
  }
  const ctx = { cppOf, spendByCat, heldCards, bonusHistory, purchases: input.upcomingPurchases || [], now, activeTransferPromos };
  const candidates = catalog.cards.filter((card) => meetsObtainability(card, profile, heldIds, options.excludeCandidateCategories));
  const rankBy = options.rankBy ?? "firstYear";
  const metric = (r) => (rankBy === "ongoing" ? r.ongoingAnnualNetCents : r.firstYearNetCents);
  const scored = candidates.map((c) => scoreCard(c, ctx)).filter((x) => metric(x.rec) > 0);
  scored.sort((a, b) => {
    const d = metric(b.rec) - metric(a.rec);
    if (d !== 0) return d;
    if (a.rec.breakdown.annualFeeCents !== b.rec.breakdown.annualFeeCents) return a.rec.breakdown.annualFeeCents - b.rec.breakdown.annualFeeCents;
    return a.rec.cardId < b.rec.cardId ? -1 : a.rec.cardId > b.rec.cardId ? 1 : 0;
  });
  const topN = options.topN ?? 3;
  const diversity = options.diversity !== false;
  const picked = [];
  const usedCurrency = new Set();
  for (const x of scored) { if (picked.length >= topN) break; if (diversity && picked.length > 0 && usedCurrency.has(x.card.currencyId)) continue; picked.push(x); usedCurrency.add(x.card.currencyId); }
  if (picked.length < topN) { for (const x of scored) { if (picked.length >= topN) break; if (!picked.includes(x)) picked.push(x); } }
  return picked.map((x, i) => ({ ...x.rec, rank: i + 1 }));
}
