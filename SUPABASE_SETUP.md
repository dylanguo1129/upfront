# Turn on cross-device accounts (Supabase)

The app works out of the box on-device (localStorage). To let people sign in from
any device and keep their saved trips, connect a free Supabase project. About 5
minutes, no credit card.

## 1. Create the project
1. Go to https://supabase.com and sign up (free).
2. Create a new project. Wait ~2 minutes for it to provision.

## 2. Create the table + security
1. In your project: **SQL Editor -> New query**.
2. Paste the contents of [`supabase.sql`](supabase.sql) and click **Run**.
   This creates the `engagements` table and turns on row-level security so each
   user can only ever see their own data.

## 3. Turn off email confirmation (for instant sign-up)
1. **Authentication -> Sign In / Providers -> Email**.
2. Turn **off** "Confirm email" so new users are signed in immediately.
   (Leave it on if you would rather users confirm via an email link first.)

## 4. Plug in your keys
1. **Project Settings -> API**. Copy the **Project URL** and the **anon public** key.
2. Put them in [`config.js`](config.js):
   ```js
   export const SUPABASE_URL = "https://YOURPROJECT.supabase.co";
   export const SUPABASE_ANON_KEY = "eyJhbGc...your anon key...";
   ```
3. Commit + push. GitHub Pages redeploys in ~1 minute.

Done. The sign-in screen switches to email + password, accounts live in Supabase
(server-side password hashing), and every saved trip syncs per user across
devices. The anon key is safe to publish; all access is enforced by the
row-level security policy from step 2.
