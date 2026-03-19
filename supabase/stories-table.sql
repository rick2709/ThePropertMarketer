-- Run this in your Supabase project: SQL Editor → New query → paste → Run
-- Creates the `stories` table and seeds one example story so /api/stories returns data.

-- Create table (matches app/api/stories and lib/stories)
create table if not exists public.stories (
  id text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  image text default '/images/story-placeholder.jpg',
  date text not null,
  read_time text not null default '5 min read',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: enable RLS but allow service_role full access (your API uses service key)
alter table public.stories enable row level security;

-- Policy: allow service_role to do everything (used by your Next.js API)
create policy "Service role full access"
  on public.stories
  for all
  to service_role
  using (true)
  with check (true);

-- Optional: allow anon/authenticated read-only for published stories (if you add client-side reads later)
create policy "Public read published"
  on public.stories
  for select
  to anon, authenticated
  using (published = true);

-- Seed one story so the app shows content immediately
insert into public.stories (
  id, title, excerpt, content, category, image, date, read_time, featured, published
) values (
  'black-rhino-recovery-namibia',
  'Against All Odds: The Black Rhino''s Remarkable Recovery in Namibia',
  'How community conservancies and innovative anti-poaching strategies have brought one of Africa''s most endangered species back from the brink.',
  'In the rugged terrain of Namibia''s Kunene Region, a conservation success story is unfolding. The black rhino, once hunted to near extinction with fewer than 2,500 individuals remaining globally in the 1990s, is making a remarkable comeback thanks to an innovative model that puts local communities at the heart of protection efforts.',
  'Biodiversity & Wildlife',
  '/images/stories/biodiversity-rhino.jpg',
  'Mar 5, 2026',
  '7 min read',
  true,
  true
)
on conflict (id) do nothing;
