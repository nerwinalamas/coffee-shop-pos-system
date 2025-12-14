-- Create enum type for product category
create type product_category as enum ('Coffee', 'Food', 'Dessert');

-- Create products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  image text,
  category product_category not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index on category for filtering
create index if not exists products_category_idx on products(category);

-- Create index on name for searching
create index if not exists products_name_idx on products(name);

-- Create function to update updated_at timestamp (if not already created)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

-- Enable Row Level Security (RLS)
alter table products enable row level security;

-- Create policies
-- Allow everyone to view products
create policy "Anyone can view products"
  on products for select
  to authenticated, anon
  using (true);

-- Allow anyone to insert products (for development - change later!)
create policy "Anyone can insert products"
  on products for insert
  to authenticated, anon
  with check (true);

-- Allow anyone to update products (for development - change later!)
create policy "Anyone can update products"
  on products for update
  to authenticated, anon
  using (true);

-- Allow anyone to delete products (for development - change later!)
create policy "Anyone can delete products"
  on products for delete
  to authenticated, anon
  using (true);
