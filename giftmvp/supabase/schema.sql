-- Enable pgcrypto for random share IDs
create extension if not exists pgcrypto;
-- Optional: enable pgvector for future embeddings
-- create extension if not exists vector;

-- Users handled by Supabase Auth

create table if not exists giftees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relationship text,
  interests text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  giftee_id uuid references giftees(id) on delete set null,
  title text not null default 'My Wishlist',
  share_id text unique not null default encode(gen_random_bytes(9), 'base64'),
  visibility text not null default 'public', -- 'public' | 'link' | 'private'
  created_at timestamptz default now()
);

create table if not exists gift_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  url text not null,
  merchant text,
  image_url text,
  price_cents int,
  tags text[] default '{}',
  affiliate_url text,
  -- descriptor vector, -- if pgvector enabled
  created_at timestamptz default now()
);

create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references wishlists(id) on delete cascade,
  gift_idea_id uuid references gift_ideas(id) on delete set null,
  note text,
  priority int default 2, -- 1=high,2=med,3=low
  status text not null default 'open', -- open | claimed | bought
  created_at timestamptz default now()
);

create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  wishlist_item_id uuid not null references wishlist_items(id) on delete cascade,
  claimer_email text,
  claimer_name text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table giftees enable row level security;
alter table wishlists enable row level security;
alter table gift_ideas enable row level security;
alter table wishlist_items enable row level security;
alter table claims enable row level security;

-- Basic policies: users can manage their data; public can read wishlists by share_id
create policy "own giftees" on giftees
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own gift ideas" on gift_ideas
  for all using (user_id is null or auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own wishlists" on wishlists
  for select using (visibility <> 'private' or auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own wishlist_items" on wishlist_items
  for all using (exists (select 1 from wishlists w where w.id = wishlist_items.wishlist_id and w.user_id = auth.uid()))
  with check (exists (select 1 from wishlists w where w.id = wishlist_items.wishlist_id and w.user_id = auth.uid()));

-- Claims: viewers can insert claims if they know wishlist via a share link;
-- owner cannot see claims (to preserve surprise) — app-level enforcement + optional view below.
create policy "insert claims anyone" on claims
  for insert with check (true);

create policy "select claims non-owners only" on claims
  for select using (
    not exists (
      select 1 from wishlist_items wi
      join wishlists w on w.id = wi.wishlist_id
      where wi.id = claims.wishlist_item_id and w.user_id = auth.uid()
    )
  );

-- Optional: create a view for the public wishlist, exposing item status without revealing claimers to owner
create or replace view public_wishlist_items as
select wi.*, coalesce(NULLIF(wi.status, 'claimed'), wi.status) as public_status
from wishlist_items wi;