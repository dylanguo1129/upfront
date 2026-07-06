// ── Upfront backend config ─────────────────────────────────────────────
// Cross-device accounts are ON: these point at the Upfront Supabase project.
// The publishable key is safe to publish; all data access is enforced by the
// row-level-security policy created in supabase.sql. To go back to on-device
// only, blank both values. Full notes in SUPABASE_SETUP.md.
export const SUPABASE_URL = "https://dnhygawsxnnhagyscxmc.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_2THA7eq6UUY-tjpzGUGK7A_qC1wh3rg";
