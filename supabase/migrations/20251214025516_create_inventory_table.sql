-- Create enum for inventory status
create type inventory_status as enum ('In Stock', 'Low Stock', 'Out of Stock');

-- Create inventory table
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text unique not null,
  quantity integer not null default 0 check (quantity >= 0),
  reorder_level integer not null default 10 check (reorder_level >= 0),
  status inventory_status not null default 'In Stock',
  last_restocked timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create unique index on product_id (one inventory record per product)
create unique index if not exists inventory_product_id_idx on inventory(product_id);

-- Create index on status for filtering
create index if not exists inventory_status_idx on inventory(status);

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

-- Enable Row Level Security
alter table inventory enable row level security;

-- Create policies (development - adjust for production)
create policy "Anyone can view inventory"
  on inventory for select
  to authenticated, anon
  using (true);

create policy "Anyone can insert inventory"
  on inventory for insert
  to authenticated, anon
  with check (true);

create policy "Anyone can update inventory"
  on inventory for update
  to authenticated, anon
  using (true);

create policy "Anyone can delete inventory"
  on inventory for delete
  to authenticated, anon
  using (true);
  