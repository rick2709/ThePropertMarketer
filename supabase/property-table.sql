-- Run this in your Supabase project: SQL Editor → New query → paste → Run
-- Creates the `property` table for The Property Marketer listings (stands, Airbnb, developments, etc.).

-- Create table (matches lib/properties and app/api/properties)
create table if not exists public.property (
  id text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  image text default '/images/property-placeholder.jpg',
  date text not null,
  read_time text not null default '—',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: trigger to keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists property_updated_at on public.property;
create trigger property_updated_at
  before update on public.property
  for each row
  execute function public.set_updated_at();

-- Enable RLS (your API uses service_role key for full access)
alter table public.property enable row level security;

-- Policy: service_role full access (Next.js API)
create policy "Service role full access"
  on public.property
  for all
  to service_role
  using (true)
  with check (true);

-- Policy: public read-only for published listings (optional, for client-side reads)
create policy "Public read published"
  on public.property
  for select
  to anon, authenticated
  using (published = true);

-- Seed one example listing so the app shows content immediately
insert into public.property (
  id, title, excerpt, content, category, image, date, read_time, featured, published
) values (
  'luxury-stand-borrowdale-sample',
  'Luxury Stand in Borrowdale',
  'Prime residential stand in one of Harare''s most sought-after suburbs. Ready for development with all services available.',
  '<p>This outstanding stand offers a rare opportunity to build your dream home in Borrowdale. The area is known for its security, excellent schools, and proximity to shopping and offices.</p><p>All municipal services are available at the boundary. Title deeds in order. Viewing by appointment.</p>',
  'Stand',
  '/images/property-placeholder.jpg',
  to_char(now(), 'Mon DD, YYYY'),
  '2 min read',
  true,
  true
)
on conflict (id) do nothing;
