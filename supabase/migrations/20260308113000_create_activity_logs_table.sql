-- ENUM
create type activity_action as enum ('create', 'update', 'delete', 'view');
create type activity_subject as enum ('product', 'transaction', 'inventory', 'user', 'business', 'profile', 'other');

-- TABLE
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete set null,
  action activity_action not null,
  subject activity_subject not null,
  entity_id uuid,
  entity_name text,  -- Name of the entity (e.g. product name, transaction id)
  changes jsonb,     -- Store old and new values for updates: { old: {...}, new: {...} }
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists activity_logs_business_id_idx on activity_logs(business_id);
create index if not exists activity_logs_user_id_idx on activity_logs(user_id);
create index if not exists activity_logs_created_at_idx on activity_logs(created_at desc);
create index if not exists activity_logs_action_idx on activity_logs(action);
create index if not exists activity_logs_subject_idx on activity_logs(subject);
create index if not exists activity_logs_entity_id_idx on activity_logs(entity_id);
-- Most common query: logs for a specific business, sorted by recent
create index if not exists activity_logs_business_created_idx on activity_logs(business_id, created_at desc);

-- RLS
alter table activity_logs enable row level security;

create policy "Users can view activity logs in their business"
  on activity_logs for select
  using (business_id = get_my_business_id());

create policy "System can insert activity logs"
  on activity_logs for insert
  with check (business_id = get_my_business_id());

create policy "Only owners and admins can delete activity logs"
  on activity_logs for delete
  using (business_id = get_my_business_id() and is_admin_or_owner());
