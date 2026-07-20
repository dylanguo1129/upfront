import { searchAward } from "./adapters/seatsaero.mjs";
import { recommendEarnPlan, fundableProgramNames } from "./adapters/creditcard.mjs";
import { recommend, rankHeldCardsForCategory, planBigPurchase, trackWelcomeBonus, cardPerkReminders, resolveCpp } from "./adapters/nextcard.mjs";
import { newCaseFile } from "./casefile.mjs";
import { runPipeline } from "./pipeline.mjs";
import SEATS from "./adapters/seatsaero.data.js";
import CC from "./adapters/creditcard.data.js";
export { searchAward, recommendEarnPlan, fundableProgramNames, newCaseFile, runPipeline };
export function recommendCards(input, options){ return recommend(input, CC, options); }
export function rankWallet(input, category, spendCents){ return rankHeldCardsForCategory(input, category, spendCents, CC); }
export function planPurchase(input, purchaseCents, category, options){ return planBigPurchase(input, purchaseCents, category, CC, options); }
export function trackBonus(cardId, openedOnIso, spentCents, nowIso, monthlyOrganicCents){ const card = CC.cards.find(c=>c.id===cardId); if(!card||!card.welcomeBonus) return null; const cpp = resolveCpp(card.welcomeBonus.currencyId ?? card.currencyId, new Set(), {pointsSavvy:true}, CC).cpp; return trackWelcomeBonus(card, openedOnIso, spentCents, nowIso, monthlyOrganicCents, cpp); }
export function perkReminders(cardId, openedOnIso, nowIso){ const card = CC.cards.find(c=>c.id===cardId); return card ? cardPerkReminders(card, openedOnIso, nowIso) : []; }
export function getCard(id){ return CC.cards.find(c=>c.id===id) || null; }
export function getCatalog(){ return { cards:CC.cards, currencies:CC.currencies, transfers:CC.transfers, valuations:CC.valuations, issuers:[...new Set(CC.cards.map(c=>c.issuer))] }; }
export function getAirports(){ return SEATS.airports.map(a=>a.code).sort(); }
export function getPrograms(){ const fundable=[...fundableProgramNames()]; const programs=CC.currencies.filter(c=>c.type!=="cashback").map(c=>({id:c.id,name:c.name,type:c.type,baselineCpp:c.baselineCpp})); return {programs, fundable}; }
export function getStatus(){ return { live:false, liveAward:false, cards:CC.cards.length, airports:SEATS.airports.length, routes:SEATS.routes.length }; }
