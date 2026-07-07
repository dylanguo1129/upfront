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
