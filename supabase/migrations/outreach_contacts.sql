-- Outreach tracking table for beta contacts
create table if not exists outreach_contacts (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  relationship text not null default 'friend' check (relationship in ('family', 'friend')),
  notes        text,
  status       text not null default 'to_contact'
               check (status in ('to_contact', 'reached_out', 'interested', 'signed_up', 'not_interested')),
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Access is enforced at the API layer (super_admin only via service role client).
-- No RLS needed — table is never accessed from the browser directly.
