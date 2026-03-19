-- Run this in Supabase → SQL Editor → New query → Run
-- Creates the `products` table and seeds the default shop items.

create table if not exists public.products (
  id           text primary key,
  name         text not null,
  description  text not null default '',
  price        numeric(10,2) not null default 0,
  price_zwg    text not null default '',
  image        text not null default '/images/product-placeholder.jpg',
  category     text not null default 'Other',
  in_stock     boolean not null default true,
  featured     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- RLS
alter table public.products enable row level security;

create policy "Service role full access"
  on public.products for all
  to service_role
  using (true) with check (true);

create policy "Public read in-stock"
  on public.products for select
  to anon, authenticated
  using (in_stock = true);

-- Auto-update updated_at on every change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ── Seed default products ─────────────────────────────────────
insert into public.products (id, name, description, price, price_zwg, image, category, in_stock, featured) values
(
  'wildlife-tshirt',
  'Wear the Story',
  'Apparel featuring original artwork from conservationists and community artists we''ve profiled. Wear a piece of the story.',
  25, 'ZWG 7,500', '/images/product-tshirt.jpg', 'Apparel', true, false
),
(
  'leather-journal',
  'Field Notes Journal',
  'Unique notebooks, prints, and stationery featuring photography and sketches from our contributors in the field.',
  35, 'ZWG 10,500', '/images/product-journal.jpg', 'Field Notes', true, false
),
(
  'tote-bag',
  'Artisan of the Wild Tote',
  'Beautiful, ethically sourced crafts and goods made by communities whose stories we tell. Your purchase supports local livelihoods.',
  18, 'ZWG 5,400', '/images/product-tote.jpg', 'Artisan', true, false
),
(
  'bush-bottle',
  'Conservation Compass Bottle',
  'Stainless steel, branded with The Conservation Compass logo. Perfect for field expeditions.',
  22, 'ZWG 6,600', '/images/product-bottle.jpg', 'Field Notes', true, false
),
(
  'ranger-cap',
  'Ranger Field Cap',
  'Durable khaki field cap designed for outdoor adventures. UV-protective fabric.',
  20, 'ZWG 6,000', '/images/product-cap.jpg', 'Apparel', true, false
),
(
  'ranger-pack',
  'Support a Storyteller Pack',
  'Make a direct contribution to our fellowship fund or a specific reporting project.',
  50, 'ZWG 15,000', '/images/product-pack.jpg', 'Support', true, false
)
on conflict (id) do nothing;
