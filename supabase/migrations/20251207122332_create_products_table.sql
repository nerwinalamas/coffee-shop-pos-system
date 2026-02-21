-- ENUM
create type product_category as enum ('Coffee', 'Food', 'Dessert');

-- TABLE
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  image text,
  category product_category not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INDEXES
create index if not exists products_owner_id_idx on products(owner_id);
create index if not exists products_category_idx on products(category);
create index if not exists products_name_idx on products(name);

-- TRIGGERS
create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

-- RLS
alter table products enable row level security;

create policy "Users can view their own products"
  on products for select
  to authenticated
  using (owner_id = auth.uid());

create policy "Users can insert their own products"
  on products for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "Users can update their own products"
  on products for update
  to authenticated
  using (owner_id = auth.uid());

create policy "Users can delete their own products"
  on products for delete
  to authenticated
  using (owner_id = auth.uid());
