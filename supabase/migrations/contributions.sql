-- contribution_invites: tokens the memorial owner generates and shares
create table if not exists contribution_invites (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  token        text not null unique,
  label        text,                    -- owner's optional note, e.g. "For Aunt Carol"
  email        text,                    -- optional, for future direct-email flow
  used_at      timestamptz,             -- set when someone submits via this link
  expires_at   timestamptz not null default (now() + interval '90 days'),
  created_at   timestamptz not null default now()
);

alter table contribution_invites enable row level security;

-- Owners can see and manage their own invites
create policy "owner_select" on contribution_invites for select using (auth.uid() = user_id);
create policy "owner_insert" on contribution_invites for insert with check (auth.uid() = user_id);
create policy "owner_delete" on contribution_invites for delete using (auth.uid() = user_id);

-- Public read by token only (needed for the /contribute/[token] page)
create policy "public_read_by_token" on contribution_invites
  for select using (true);

-- contributions: the actual memories submitted by contributors
create table if not exists contributions (
  id                    uuid primary key default gen_random_uuid(),
  invite_id             uuid not null references contribution_invites(id) on delete cascade,
  memorial_slug         text not null,
  contributor_name      text not null,
  contributor_relationship text not null,
  memory_text           text not null,
  status                text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  discount_code         text,           -- Stripe promo code generated on submit
  discount_redeemed     boolean not null default false,
  created_at            timestamptz not null default now()
);

alter table contributions enable row level security;

-- Memorial owners can see contributions for their memorial
create policy "owner_select" on contributions for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.memorial_slug = contributions.memorial_slug
    )
  );

-- Memorial owners can update status (approve/reject)
create policy "owner_update" on contributions for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.memorial_slug = contributions.memorial_slug
    )
  );

-- Public can read approved contributions (for the memorial page)
create policy "public_read_approved" on contributions for select
  using (status = 'approved');

-- Allow insert from public (unauthenticated contributors)
create policy "public_insert" on contributions for insert with check (true);

-- Index for memorial page queries
create index if not exists contributions_memorial_slug_status
  on contributions(memorial_slug, status);

-- Index for owner approval queue
create index if not exists contributions_invite_id
  on contributions(invite_id);
