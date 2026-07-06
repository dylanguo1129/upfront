// ── Upfront backend config ─────────────────────────────────────────────
// Leave both blank to run fully on-device (accounts + saved trips live in this
// browser's localStorage). Fill both in to switch on cross-device accounts
// backed by your free Supabase project, so users can sign in from any device.
//
// Where to find them:  Supabase dashboard  ->  Project Settings  ->  API
//   SUPABASE_URL       = "Project URL"      (e.g. https://abcdefgh.supabase.co)
//   SUPABASE_ANON_KEY  = "anon public" key  (safe to publish; access is enforced
//                        by row-level security, which the setup SQL turns on)
// After filling these in, commit + push. Full steps in SUPABASE_SETUP.md.
export const SUPABASE_URL = "";
export const SUPABASE_ANON_KEY = "";
