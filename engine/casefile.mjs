// Browser CaseFile: same object model as the Node runtime; persistence handled by the UI layer.
export function newCaseFile(intake){ return { id:intake.id, status:"open", client:intake.client, request:intake.request, brief:null, earnPlan:null, awardOptions:null, chosen:null, value:null, realityCheck:null, reviews:[], deliverable:null, log:[] }; }
export function logEvent(cf, stage, event, data){ cf.log.push({ at:new Date().toISOString(), stage, event, ...(data?{data}:{}) }); }
export function save(){ /* no-op in browser; the UI persists engagements per user */ }
export function load(){ return null; }
