-- TABLE
create table if not exists public.sales_targets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  month date not null,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CONSTRAINTS
alter table public.sales_targets
  add constraint sales_targets_business_id_month_key unique (business_id, month);

-- INDEXES
create index if not exists sales_targets_business_id_idx on public.sales_targets(business_id);
create index if not exists sales_targets_month_idx on public.sales_targets(month);

create trigger update_sales_targets_updated_at
  before update on public.sales_targets
  for each row
  execute function update_updated_at_column();

-- RLS
alter table public.sales_targets enable row level security;

create policy "users can view sales targets in their business"
  on public.sales_targets for select
  using (business_id = get_my_business_id());

create policy "owners and admins can manage sales targets"
  on public.sales_targets for all
  using (business_id = get_my_business_id() and is_admin_or_owner());
