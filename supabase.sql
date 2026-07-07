-- Upfront: cross-device accounts + saved engagements.
-- Run once in your Supabase project:  Dashboard -> SQL Editor -> New query -> paste -> Run.

create table if not exists public.engagements (
  row_id     uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  eng_id     text not null,
  data       jsonb not null,
  value      numeric,
  created_at timestamptz not null default now(),
  unique (user_id, eng_id)
);

alter table public.engagements enable row level security;

-- Each signed-in user can only read/write their OWN rows.
create policy "own engagements"
  on public.engagements
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Per-user saved survey answers (the Next Best Card profile follows you across devices).
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  answers    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "own profile"
  on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- For "forgot password" to redirect back to the app, also set (Authentication -> URL Configuration):
--   Site URL:       https://dylanguo1129.github.io/upfront/
--   Redirect URLs:  https://dylanguo1129.github.io/upfront/**
