// Browser agents: deterministic offline templates only.
export function loadAgent(){ return ""; }
export async function runAgent({ offline, context }){ return offline(context); }
