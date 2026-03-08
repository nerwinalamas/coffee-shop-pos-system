-- ENUM
create type notification_type as enum ('low_stock', 'out_of_stock', 'pending_order');

-- TABLE
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  type notification_type not null,
  title text not null,
  message text not null,
  entity_id uuid,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists notifications_business_id_idx on notifications(business_id);
create index if not exists notifications_user_id_idx on notifications(user_id);
create index if not exists notifications_is_read_idx on notifications(is_read);
create index if not exists notifications_created_at_idx on notifications(created_at desc);
-- Composite index for the most common query: unread notifications per business
create index if not exists notifications_business_unread_idx on notifications(business_id, is_read)
  where is_read = false;

-- REALTIME
alter publication supabase_realtime add table notifications;

-- RLS
alter table notifications enable row level security;

create policy "Users can view notifications in their business"
  on notifications for select
  using (business_id = get_my_business_id());

create policy "System can insert notifications"
  on notifications for insert
  with check (business_id = get_my_business_id());

create policy "Users can update notifications in their business"
  on notifications for update
  using (business_id = get_my_business_id())
  with check (business_id = get_my_business_id());

create policy "Owners and admins can delete notifications"
  on notifications for delete
  using (business_id = get_my_business_id() and is_admin_or_owner());


-- ============================================================
-- UPDATED INVENTORY TRIGGER
-- Extends the existing update_inventory_status function to
-- also insert notifications for low stock / out of stock.
-- Replace the function defined in the inventory migration.
-- ============================================================

create or replace function update_inventory_status()
returns trigger as $$
declare
  v_product_name text;
begin
  -- Get product name once for use in notifications
  select name into v_product_name
  from products
  where id = new.product_id;

  if new.quantity = 0 then
    new.status = 'Out of Stock';

    insert into notifications (business_id, type, title, message, entity_id)
    values (
      new.business_id,
      'out_of_stock',
      'Out of Stock',
      v_product_name || ' is out of stock.',
      new.product_id
    );

  elsif new.quantity <= new.reorder_level then
    new.status = 'Low Stock';

    insert into notifications (business_id, type, title, message, entity_id)
    values (
      new.business_id,
      'low_stock',
      'Low Stock Alert',
      v_product_name || ' is running low (' || new.quantity || ' remaining).',
      new.product_id
    );

  else
    new.status = 'In Stock';
  end if;

  return new;
end;
$$ language plpgsql security definer;
