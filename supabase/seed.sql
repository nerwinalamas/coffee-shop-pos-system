-- ============================================================
-- SEED: Brewhaus Coffee
--
-- Accounts:
--   Owner:   owner@brewhaus.com   / Brewhaus2024!
--   Admin:   admin@brewhaus.com   / Brewhaus2024!
--   Manager: manager@brewhaus.com / Brewhaus2024!
--   Staff 1: staff1@brewhaus.com  / Brewhaus2024!
--   Staff 2: staff2@brewhaus.com  / Brewhaus2024!
-- ============================================================

-- EXTENSIONS
create extension if not exists pgcrypto;


-- ============================================================
-- AUTH USERS
-- ============================================================

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at,
  recovery_token, recovery_sent_at, email_change_token_new, email_change,
  email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, created_at, updated_at, phone, phone_confirmed_at,
  phone_change, phone_change_token, phone_change_sent_at,
  email_change_token_current, email_change_confirm_status, banned_until,
  reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at
) values
  -- Owner
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'owner@brewhaus.com',
    extensions.crypt('Brewhaus2024!', extensions.gen_salt('bf')),
    now(), null, '', null, '', null, '', '', null, now(),
    '{"provider":"email","providers":["email"]}',
    '{"business_name":"Brewhaus Coffee","first_name":"Miguel","last_name":"Santos","phone":"09171234567"}'::jsonb,
    null, now(), now(), null, null, '', '', null, '', 0, null, '', null, false, null
  ),
  -- Admin
  (
    'b1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin@brewhaus.com',
    extensions.crypt('Brewhaus2024!', extensions.gen_salt('bf')),
    now(), null, '', null, '', null, '', '', null, now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Isabella","last_name":"Reyes","phone":"09181234567"}'::jsonb,
    null, now(), now(), null, null, '', '', null, '', 0, null, '', null, false, null
  ),
  -- Manager
  (
    'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'manager@brewhaus.com',
    extensions.crypt('Brewhaus2024!', extensions.gen_salt('bf')),
    now(), null, '', null, '', null, '', '', null, now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Carlos","last_name":"Mendoza","phone":"09191234567"}'::jsonb,
    null, now(), now(), null, null, '', '', null, '', 0, null, '', null, false, null
  ),
  -- Staff 1
  (
    'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'staff1@brewhaus.com',
    extensions.crypt('Brewhaus2024!', extensions.gen_salt('bf')),
    now(), null, '', null, '', null, '', '', null, now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Anna","last_name":"Cruz","phone":"09201234567"}'::jsonb,
    null, now(), now(), null, null, '', '', null, '', 0, null, '', null, false, null
  ),
  -- Staff 2
  (
    'e1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'staff2@brewhaus.com',
    extensions.crypt('Brewhaus2024!', extensions.gen_salt('bf')),
    now(), null, '', null, '', null, '', '', null, now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Rico","last_name":"Dela Cruz","phone":"09211234567"}'::jsonb,
    null, now(), now(), null, null, '', '', null, '', 0, null, '', null, false, null
  )
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = excluded.updated_at;


-- ============================================================
-- AUTH IDENTITIES
-- ============================================================

insert into auth.identities (
  id, user_id, provider, identity_data, provider_id, created_at, updated_at
) values
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'email',
    '{"sub":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","email":"owner@brewhaus.com"}'::jsonb,
    'owner@brewhaus.com', now(), now()
  ),
  (
    'b1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'b1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'email',
    '{"sub":"b1b2c3d4-e5f6-7890-abcd-ef1234567890","email":"admin@brewhaus.com"}'::jsonb,
    'admin@brewhaus.com', now(), now()
  ),
  (
    'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'email',
    '{"sub":"c1b2c3d4-e5f6-7890-abcd-ef1234567890","email":"manager@brewhaus.com"}'::jsonb,
    'manager@brewhaus.com', now(), now()
  ),
  (
    'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'email',
    '{"sub":"d1b2c3d4-e5f6-7890-abcd-ef1234567890","email":"staff1@brewhaus.com"}'::jsonb,
    'staff1@brewhaus.com', now(), now()
  ),
  (
    'e1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'e1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'email',
    '{"sub":"e1b2c3d4-e5f6-7890-abcd-ef1234567890","email":"staff2@brewhaus.com"}'::jsonb,
    'staff2@brewhaus.com', now(), now()
  )
on conflict (provider_id, provider) do nothing;


-- ============================================================
-- BUSINESS
-- ============================================================

insert into public.businesses (id, name, address, phone, owner_id)
values (
  'f1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Brewhaus Coffee',
  '123 Katipunan Ave, Quezon City, Metro Manila',
  '(02) 8123-4567',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
)
on conflict (id) do update set
  name    = excluded.name,
  address = excluded.address,
  phone   = excluded.phone;


-- ============================================================
-- PROFILES
-- (trigger won't fire on direct auth.users insert)
-- ============================================================

insert into public.profiles (id, business_id, email, first_name, last_name, phone, role, status)
values
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'f1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'owner@brewhaus.com', 'Miguel', 'Santos', '09171234567',
    'Owner', 'Active'
  ),
  (
    'b1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'f1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'admin@brewhaus.com', 'Isabella', 'Reyes', '09181234567',
    'Admin', 'Active'
  ),
  (
    'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'f1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'manager@brewhaus.com', 'Carlos', 'Mendoza', '09191234567',
    'Manager', 'Active'
  ),
  (
    'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'f1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'staff1@brewhaus.com', 'Anna', 'Cruz', '09201234567',
    'Staff', 'Active'
  ),
  (
    'e1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'f1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'staff2@brewhaus.com', 'Rico', 'Dela Cruz', '09211234567',
    'Staff', 'Active'
  )
on conflict (id) do update set
  business_id = excluded.business_id,
  first_name  = excluded.first_name,
  last_name   = excluded.last_name,
  phone       = excluded.phone,
  role        = excluded.role,
  status      = excluded.status;


-- ============================================================
-- PRODUCTS
-- ============================================================

insert into public.products (name, price, image, category, business_id) values
  ('Chocolate Chip Cookie', 2.49, 'https://picsum.photos/300/300?random=12', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Americano',             3.49, 'https://picsum.photos/300/300?random=4',  'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Chicken Wrap',          8.49, 'https://picsum.photos/300/300?random=31', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Strawberry Tart',       5.49, 'https://picsum.photos/300/300?random=45', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Chai Latte',            4.59, 'https://picsum.photos/300/300?random=9',  'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Soup of the Day',       5.99, 'https://picsum.photos/300/300?random=35', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Red Velvet Cake',       5.99, 'https://picsum.photos/300/300?random=49', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Frappuccino',           5.29, 'https://picsum.photos/300/300?random=24', 'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Avocado Toast',         6.99, 'https://picsum.photos/300/300?random=28', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Tiramisu',              6.49, 'https://picsum.photos/300/300?random=44', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Espresso',              3.99, 'https://picsum.photos/300/300?random=1',  'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('French Toast',          7.99, 'https://picsum.photos/300/300?random=39', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Macarons (6 pack)',     8.99, 'https://picsum.photos/300/300?random=52', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Gibraltar',             4.49, 'https://picsum.photos/300/300?random=27', 'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Caesar Salad',          8.99, 'https://picsum.photos/300/300?random=30', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Blueberry Muffin',      3.29, 'https://picsum.photos/300/300?random=7',  'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Matcha Latte',          4.89, 'https://picsum.photos/300/300?random=11', 'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Breakfast Burrito',     8.99, 'https://picsum.photos/300/300?random=37', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Creme Brulee',          6.99, 'https://picsum.photos/300/300?random=51', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Latte',                 4.29, 'https://picsum.photos/300/300?random=3',  'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Croissant',             2.99, 'https://picsum.photos/300/300?random=6',  'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Lemon Tart',            5.79, 'https://picsum.photos/300/300?random=47', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Cold Brew',             3.89, 'https://picsum.photos/300/300?random=23', 'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Club Sandwich',         9.49, 'https://picsum.photos/300/300?random=34', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Apple Pie',             4.99, 'https://picsum.photos/300/300?random=43', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Vienna Coffee',         5.19, 'https://picsum.photos/300/300?random=26', 'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Quinoa Bowl',           9.99, 'https://picsum.photos/300/300?random=32', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Chocolate Mousse',      5.49, 'https://picsum.photos/300/300?random=54', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Iced Coffee',           4.19, 'https://picsum.photos/300/300?random=8',  'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Eggs Benedict',        11.99, 'https://picsum.photos/300/300?random=40', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Chocolate Eclair',      4.79, 'https://picsum.photos/300/300?random=48', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Cappuccino',            4.49, 'https://picsum.photos/300/300?random=2',  'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Bagel with Cream Cheese',3.99,'https://picsum.photos/300/300?random=10', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Fruit Tart',            6.29, 'https://picsum.photos/300/300?random=56', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Turkish Coffee',        4.99, 'https://picsum.photos/300/300?random=25', 'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Acai Bowl',            10.99, 'https://picsum.photos/300/300?random=38', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Chocolate Brownie',     4.49, 'https://picsum.photos/300/300?random=42', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Mocha',                 4.79, 'https://picsum.photos/300/300?random=5',  'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Panini',                7.99, 'https://picsum.photos/300/300?random=36', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Banana Bread',          3.99, 'https://picsum.photos/300/300?random=50', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Macchiato',             4.69, 'https://picsum.photos/300/300?random=22', 'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Grilled Sandwich',      7.49, 'https://picsum.photos/300/300?random=29', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Ice Cream Sundae',      4.99, 'https://picsum.photos/300/300?random=53', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Flat White',            4.39, 'https://picsum.photos/300/300?random=21', 'Coffee',  'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Pasta Salad',           6.99, 'https://picsum.photos/300/300?random=33', 'Food',    'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('New York Cheesecake',   5.99, 'https://picsum.photos/300/300?random=41', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Pecan Pie',             5.79, 'https://picsum.photos/300/300?random=55', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Carrot Cake',           5.29, 'https://picsum.photos/300/300?random=46', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Donut Assortment',      7.99, 'https://picsum.photos/300/300?random=57', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Panna Cotta',           5.99, 'https://picsum.photos/300/300?random=58', 'Dessert', 'f1b2c3d4-e5f6-7890-abcd-ef1234567890');


-- ============================================================
-- INVENTORY
-- ============================================================

insert into public.inventory (business_id, product_id, sku, quantity, reorder_level)
select
  'f1b2c3d4-e5f6-7890-abcd-ef1234567890',
  id,
  'SKU-' || upper(substring(md5(name) from 1 for 8)),
  case
    when category = 'Coffee'  then floor(random() * 50 + 50)::int
    when category = 'Food'    then floor(random() * 30 + 20)::int
    when category = 'Dessert' then floor(random() * 40 + 30)::int
  end,
  case
    when category = 'Coffee'  then 15
    when category = 'Food'    then 10
    when category = 'Dessert' then 10
  end
from public.products
where business_id = 'f1b2c3d4-e5f6-7890-abcd-ef1234567890';


-- ============================================================
-- TRANSACTIONS + TRANSACTION ITEMS
-- 30 transactions over the last 30 days
-- ============================================================

do $$
declare
  v_business_id uuid := 'f1b2c3d4-e5f6-7890-abcd-ef1234567890';
  v_staff_ids   uuid[] := array[
    'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'e1b2c3d4-e5f6-7890-abcd-ef1234567890'
  ];
  v_tx_id       uuid;
  v_tx_number   text;
  v_subtotal    numeric(10,2);
  v_product     record;
  v_qty         int;
  v_item_subtotal numeric(10,2);
  v_item_count  int;
  v_payments    payment_method[]      := array['Cash', 'Credit Card', 'Debit Card', 'E-Wallet']::payment_method[];
  v_statuses    transaction_status[]  := array['Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Pending', 'Pending', 'Cancelled']::transaction_status[];
  v_customers   text[]                := array['Maria', 'Jose', 'Anna', 'Carlo', 'Lea', 'Rico', 'Diana', 'Mark', 'Sofia', 'Luis', null, null, null];
begin
  for i in 1..30 loop
    v_tx_id     := gen_random_uuid();
    v_tx_number := 'TRX-2026-' || lpad(i::text, 6, '0');
    v_subtotal  := 0;

    insert into public.transactions (
      id, business_id, transaction_number, customer_name,
      subtotal, tax_rate, tax_amount, total_amount,
      payment_method, status, user_id,
      created_at, updated_at
    ) values (
      v_tx_id,
      v_business_id,
      v_tx_number,
      v_customers[1 + (i % array_length(v_customers, 1))],
      0, 0.12, 0, 0,
      v_payments[1 + (i % array_length(v_payments, 1))],
      v_statuses[1 + (i % array_length(v_statuses, 1))],
      v_staff_ids[1 + (i % array_length(v_staff_ids, 1))], -- alternates between staff1 and staff2
      now() - ((30 - i) || ' days')::interval,
      now() - ((30 - i) || ' days')::interval
    );

    v_item_count := 1 + (i % 4);

    for j in 1..v_item_count loop
      select * into v_product
      from public.products
      where business_id = v_business_id
      order by id
      offset ((i * j) % 50)
      limit 1;

      v_qty           := 1 + (j % 3);
      v_item_subtotal := v_product.price * v_qty;
      v_subtotal      := v_subtotal + v_item_subtotal;

      insert into public.transaction_items (
        transaction_id, product_id, product_name,
        product_price, quantity, subtotal
      ) values (
        v_tx_id, v_product.id, v_product.name,
        v_product.price, v_qty, v_item_subtotal
      );
    end loop;

    update public.transactions
    set
      subtotal     = v_subtotal,
      tax_amount   = round(v_subtotal * 0.12, 2),
      total_amount = round(v_subtotal * 1.12, 2)
    where id = v_tx_id;

  end loop;
end;
$$;
