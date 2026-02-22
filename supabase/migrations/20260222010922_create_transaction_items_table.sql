-- TABLE
create table if not exists transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references transactions(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  product_name text not null,
  product_price numeric(10, 2) not null check (product_price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists transaction_items_transaction_id_idx on transaction_items(transaction_id);
create index if not exists transaction_items_product_id_idx on transaction_items(product_id);

-- RLS
alter table transaction_items enable row level security;

create policy "Users can view transaction items"
  on transaction_items for select
  using (
    exists (
      select 1 from transactions
      where transactions.id = transaction_items.transaction_id
      and transactions.business_id = get_my_business_id()
    )
  );

create policy "Users can insert transaction items"
  on transaction_items for insert
  with check (
    exists (
      select 1 from transactions
      where transactions.id = transaction_items.transaction_id
      and transactions.business_id = get_my_business_id()
    )
  );

create policy "Users can update transaction items"
  on transaction_items for update
  using (
    exists (
      select 1 from transactions
      where transactions.id = transaction_items.transaction_id
      and transactions.business_id = get_my_business_id()
    )
  );

create policy "Owners and admins can delete transaction items"
  on transaction_items for delete
  using (is_admin_or_owner());
