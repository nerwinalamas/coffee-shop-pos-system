
-- TABLE
create table if not exists promo_codes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  code text not null,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10, 2) not null check (value > 0),
  min_order numeric(10, 2) not null default 0 check (min_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (business_id, code)
);

-- INDEXES
create index if not exists promo_codes_business_id_idx on promo_codes(business_id);
create index if not exists promo_codes_code_idx on promo_codes(code);
create index if not exists promo_codes_is_active_idx on promo_codes(is_active);

create trigger update_promo_codes_updated_at
  before update on promo_codes
  for each row
  execute function update_updated_at_column();

-- RLS
alter table promo_codes enable row level security;

create policy "Users can view promo codes in their business"
  on promo_codes for select
  using (business_id = get_my_business_id());

create policy "Owners and admins can manage promo codes"
  on promo_codes for all
  using (business_id = get_my_business_id() and is_admin_or_owner());
