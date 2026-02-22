-- ENUM
create type product_category as enum ('Coffee', 'Food', 'Dessert');

-- TABLE
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  image text,
  category product_category not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INDEXES
create index if not exists products_business_id_idx on products(business_id);
create index if not exists products_category_idx on products(category);
create index if not exists products_name_idx on products(name);

-- TRIGGERS
create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column(); -- defined in businesses migration

-- RLS
alter table products enable row level security;

create policy "Users can view products in their business"
  on products for select
  to authenticated
  using (business_id = get_my_business_id());

create policy "Users can insert products in their business"
  on products for insert
  to authenticated
  with check (business_id = get_my_business_id());

create policy "Owners and admins can update products"
  on products for update
  to authenticated
  using (business_id = get_my_business_id() and is_admin_or_owner());

create policy "Owners and admins can delete products"
  on products for delete
  to authenticated
  using (business_id = get_my_business_id() and is_admin_or_owner());
