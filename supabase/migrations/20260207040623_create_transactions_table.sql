-- Create enum types for transactions
create type payment_method as enum ('Cash', 'Credit Card', 'Debit Card', 'E-Wallet');
create type transaction_status as enum ('Completed', 'Pending', 'Cancelled');

-- Create transactions table
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_number text unique not null,
  customer_name text,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  tax_rate numeric(5, 4) not null default 0.12,
  tax_amount numeric(10, 2) not null check (tax_amount >= 0),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  payment_method payment_method not null,
  status transaction_status not null default 'Pending',
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for better performance
create index if not exists transactions_transaction_number_idx on transactions(transaction_number);
create index if not exists transactions_status_idx on transactions(status);
create index if not exists transactions_payment_method_idx on transactions(payment_method);
create index if not exists transactions_user_id_idx on transactions(user_id);
create index if not exists transactions_created_at_idx on transactions(created_at desc);

-- Create trigger to automatically update updated_at
create trigger update_transactions_updated_at
  before update on transactions
  for each row
  execute function update_updated_at_column();

-- Function to generate transaction number (format: TRX-YYYY-XXXXXX)
create or replace function generate_transaction_number()
returns text as $$
declare
  year_part text;
  sequence_num text;
begin
  year_part := to_char(now(), 'YYYY');
  
  -- Get the next sequence number for this year
  select lpad((count(*) + 1)::text, 6, '0')
  into sequence_num
  from transactions
  where extract(year from created_at) = extract(year from now());
  
  return 'TRX-' || year_part || '-' || sequence_num;
end;
$$ language plpgsql;

-- Trigger to auto-generate transaction number
create or replace function set_transaction_number()
returns trigger as $$
begin
  if new.transaction_number is null then
    new.transaction_number := generate_transaction_number();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_transaction_number_trigger
  before insert on transactions
  for each row
  execute function set_transaction_number();

-- Function to auto-calculate transaction totals
create or replace function calculate_transaction_totals()
returns trigger as $$
begin
  -- Calculate tax_amount based on subtotal and tax_rate
  new.tax_amount := new.subtotal * new.tax_rate;
  
  -- Calculate total_amount
  new.total_amount := new.subtotal + new.tax_amount;
  
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-calculate totals
create trigger calculate_transaction_totals_trigger
  before insert or update of subtotal, tax_rate on transactions
  for each row
  execute function calculate_transaction_totals();

-- Enable Row Level Security
alter table transactions enable row level security;

-- Policies for transactions
create policy "Users can view their own transactions"
  on transactions for select
  using (auth.uid() = user_id or is_admin_or_owner());

create policy "Users can create transactions"
  on transactions for insert
  with check (auth.uid() = user_id or is_admin_or_owner());

create policy "Users can update their own transactions"
  on transactions for update
  using (auth.uid() = user_id or is_admin_or_owner());

create policy "Admins can delete transactions"
  on transactions for delete
  using (is_admin_or_owner());
