-- ENUM
create type inventory_status as enum ('In Stock', 'Low Stock', 'Out of Stock');

-- TABLE
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  sku text not null,
  quantity integer not null default 0 check (quantity >= 0),
  reorder_level integer not null default 10 check (reorder_level >= 0),
  status inventory_status not null default 'In Stock',
  last_restocked timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INDEXES
create unique index if not exists inventory_business_sku_idx on inventory(business_id, sku);
create unique index if not exists inventory_business_product_idx on inventory(business_id, product_id);
create index if not exists inventory_business_id_idx on inventory(business_id);
create index if not exists inventory_status_idx on inventory(status);

-- FUNCTIONS & TRIGGERS
create trigger update_inventory_updated_at
  before update on inventory
  for each row
  execute function update_updated_at_column(); -- defined in businesses migration

create or replace function update_inventory_status()
returns trigger as $$
begin
  if new.quantity = 0 then
    new.status = 'Out of Stock';
  elsif new.quantity <= new.reorder_level then
    new.status = 'Low Stock';
  else
    new.status = 'In Stock';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger update_inventory_status_trigger
  before insert or update of quantity, reorder_level on inventory
  for each row
  execute function update_inventory_status();

-- RLS
alter table inventory enable row level security;

create policy "Users can view inventory in their business"
  on inventory for select
  to authenticated
  using (business_id = get_my_business_id());

create policy "Owners and admins can insert inventory"
  on inventory for insert
  to authenticated
  with check (business_id = get_my_business_id() and is_admin_or_owner());

create policy "Owners and admins can update inventory"
  on inventory for update
  to authenticated
  using (business_id = get_my_business_id() and is_admin_or_owner());

create policy "Owners and admins can delete inventory"
  on inventory for delete
  to authenticated
  using (business_id = get_my_business_id() and is_admin_or_owner());
