-- Afterword database schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- purchases
create table if not exists public.purchases (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid references auth.users on delete set null,
  email                     text,
  stripe_session_id         text,
  amount_paid               integer,
  plaque_status             text not null default 'pending',
  plaque_tracking_url       text,
  shipping_address_deferred boolean not null default false,
  created_at                timestamptz not null default now()
);

alter table public.purchases enable row level security;

create policy "Users can read own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

create policy "Users can update own purchases"
  on public.purchases for update
  using (auth.uid() = user_id);

-- Service role inserts purchases (Stripe webhook / server-side)
create policy "Service role can insert purchases"
  on public.purchases for insert
  with check (true);


-- shipping_addresses
create table if not exists public.shipping_addresses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete cascade,
  delivery_type   text,
  recipient_name  text,
  contact_name    text,
  address_line_1  text,
  address_line_2  text,
  city            text,
  state_province  text,
  postal_code     text,
  country         text,
  attorney_note   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.shipping_addresses enable row level security;

create policy "Users can manage own shipping address"
  on public.shipping_addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- profiles
create table if not exists public.profiles (
  id                  uuid references auth.users on delete cascade primary key,
  first_name          text,
  last_name           text,
  avatar_url          text,
  has_seen_dashboard  boolean not null default false,
  page_is_public      boolean not null default false,
  memorial_slug       text unique,
  created_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);


-- story_answers
create table if not exists public.story_answers (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete cascade,
  section_slug    text not null,
  question_id     text not null,
  answer_text     text,
  skipped         boolean not null default false,
  updated_at      timestamptz not null default now(),
  unique (user_id, question_id)
);

alter table public.story_answers enable row level security;

create policy "Users can manage own story answers"
  on public.story_answers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- guestbook_entries
create table if not exists public.guestbook_entries (
  id              uuid primary key default gen_random_uuid(),
  memorial_slug   text not null,
  author_name     text not null,
  message         text not null,
  created_at      timestamptz not null default now()
);

alter table public.guestbook_entries enable row level security;

create policy "Anyone can read guestbook entries"
  on public.guestbook_entries for select
  using (true);

create policy "Anyone can insert guestbook entries"
  on public.guestbook_entries for insert
  with check (true);


-- Supabase Storage: profile-photos bucket
-- Run this separately or via the Supabase dashboard:
-- insert into storage.buckets (id, name, public) values ('profile-photos', 'profile-photos', true);

-- Storage RLS
-- create policy "Public read access" on storage.objects for select using (bucket_id = 'profile-photos');
-- create policy "Auth users can upload own photo" on storage.objects for insert
--   with check (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Auth users can update own photo" on storage.objects for update
--   using (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);
