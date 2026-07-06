// Browser agents: deterministic offline templates only (no model, no filesystem).
export function loadAgent(){ return ""; }
export async function runAgent({ offline, context }){ return offline(context); }
