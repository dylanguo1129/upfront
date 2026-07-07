import { searchAward } from "./adapters/seatsaero.mjs";
import { recommendEarnPlan, fundableProgramNames } from "./adapters/creditcard.mjs";
import { recommend } from "./adapters/nextcard.mjs";
import { newCaseFile } from "./casefile.mjs";
import { runPipeline } from "./pipeline.mjs";
import SEATS from "./adapters/seatsaero.data.js";
import CC from "./adapters/creditcard.data.js";
export { searchAward, recommendEarnPlan, fundableProgramNames, newCaseFile, runPipeline };
export function recommendCards(input, options){ return recommend(input, CC, options); }
export function getCatalog(){ return { cards:CC.cards, currencies:CC.currencies, transfers:CC.transfers, valuations:CC.valuations, issuers:[...new Set(CC.cards.map(c=>c.issuer))] }; }
export function getAirports(){ return SEATS.airports.map(a=>a.code).sort(); }
export function getPrograms(){ const fundable=[...fundableProgramNames()]; const programs=CC.currencies.filter(c=>c.type!=="cashback").map(c=>({id:c.id,name:c.name,type:c.type,baselineCpp:c.baselineCpp})); return {programs, fundable}; }
export function getStatus(){ return { live:false, liveAward:false, cards:CC.cards.length, airports:SEATS.airports.length, routes:SEATS.routes.length }; }
