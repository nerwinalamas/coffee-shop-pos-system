-- TABLE
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INDEXES
create index if not exists businesses_owner_id_idx on businesses(owner_id);

-- FUNCTIONS & TRIGGERS
-- Auto-update updated_at (shared across all tables)
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_businesses_updated_at
  before update on businesses
  for each row
  execute function update_updated_at_column();

-- RLS
alter table businesses enable row level security;

create policy "Users can view their own business"
  on businesses for select
  to authenticated
  using (owner_id = auth.uid());

create policy "Users can insert their own business"
  on businesses for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "Users can update their own business"
  on businesses for update
  to authenticated
  using (owner_id = auth.uid());

create policy "Users can delete their own business"
  on businesses for delete
  to authenticated
  using (owner_id = auth.uid());
