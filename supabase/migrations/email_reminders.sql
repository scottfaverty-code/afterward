-- email_reminders
-- Tracks which automated reminder emails have been sent to each user.
-- The unique index on (user_id, reminder_type) is the primary idempotency
-- guard — even if the cron fires twice on the same day, no duplicate sends.
--
-- reminder_type values:
--   'day3_nudge'      — purchased 3+ days ago, 0 answers written
--   'day7_progress'   — purchased 7+ days ago, incomplete story
--   'day14_invite'    — purchased 14+ days ago, no contributor invite sent
--   'day30_final'     — purchased 30+ days ago, still fewer than 3 sections written

create table if not exists email_reminders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  reminder_type text not null,
  sent_at     timestamptz not null default now()
);

create unique index if not exists email_reminders_user_type_idx
  on email_reminders (user_id, reminder_type);

-- Only the service role (admin client) reads/writes this table.
-- No RLS needed — users never query it directly.
alter table email_reminders enable row level security;
