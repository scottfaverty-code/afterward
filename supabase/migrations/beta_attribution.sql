-- Beta program + contributor attribution
--
-- is_beta: marks accounts created by Scott for free beta testing
-- referred_by_user_id: the Afterword author whose contributor invite chain led to this purchase
-- source_invite_id: the specific contribution_invite that generated the promo code used

alter table purchases
  add column if not exists is_beta boolean not null default false,
  add column if not exists referred_by_user_id uuid references auth.users(id) on delete set null,
  add column if not exists source_invite_id uuid references contribution_invites(id) on delete set null;

-- Index for querying "show me everyone referred by this user"
create index if not exists purchases_referred_by_idx
  on purchases (referred_by_user_id)
  where referred_by_user_id is not null;
