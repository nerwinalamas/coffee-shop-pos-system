-- ENUM
create type inventory_status as enum ('In Stock', 'Low Stock', 'Out of Stock');

-- TABLE
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
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
create unique index if not exists inventory_owner_sku_idx on inventory(owner_id, sku);
create unique index if not exists inventory_owner_product_idx on inventory(owner_id, product_id);
create index if not exists inventory_owner_id_idx on inventory(owner_id);
create index if not exists inventory_status_idx on inventory(status);

-- FUNCTIONS & TRIGGERS
-- Create trigger to automatically update updated_at
create trigger update_inventory_updated_at
  before update on inventory
  for each row
  execute function update_updated_at_column();

-- Function to auto-update inventory status based on quantity
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

-- Create trigger to automatically update status when quantity changes
create trigger update_inventory_status_trigger
  before insert or update of quantity, reorder_level on inventory
  for each row
  execute function update_inventory_status();

-- RLS
alter table inventory enable row level security;

create policy "Users can view their own inventory"
  on inventory for select
  to authenticated
  using (owner_id = auth.uid());

create policy "Users can insert their own inventory"
  on inventory for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "Users can update their own inventory"
  on inventory for update
  to authenticated
  using (owner_id = auth.uid());

create policy "Users can delete their own inventory"
  on inventory for delete
  to authenticated
  using (owner_id = auth.uid());
