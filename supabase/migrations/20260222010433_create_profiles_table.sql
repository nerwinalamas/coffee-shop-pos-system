-- ENUMS
create type user_role as enum ('Owner', 'Admin', 'Manager', 'Staff');
create type user_status as enum ('Active', 'Inactive');

-- TABLE
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete set null,
  email text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  role user_role not null default 'Staff',
  status user_status not null default 'Active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INDEXES
create index if not exists profiles_business_id_idx on profiles(business_id);
create index if not exists profiles_status_idx on profiles(status);
create index if not exists profiles_role_idx on profiles(role);
create index if not exists profiles_email_idx on profiles(email);

-- FUNCTIONS & TRIGGERS
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column(); -- defined in businesses migration

-- Helper: check if current user is Owner or Admin (used in RLS, avoids recursion)
create or replace function is_admin_or_owner()
returns boolean as $$
begin
  return (
    select role in ('Owner', 'Admin')
    from profiles
    where id = auth.uid()
    limit 1
  );
end;
$$ language plpgsql security definer stable;

-- Helper: get current user's business_id
create or replace function get_my_business_id()
returns uuid as $$
begin
  return (
    select business_id
    from profiles
    where id = auth.uid()
    limit 1
  );
end;
$$ language plpgsql security definer stable;

-- Auto-create profile + business on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_id uuid;
begin
  -- Create business first
  insert into public.businesses (name, owner_id)
  values (
    coalesce(new.raw_user_meta_data->>'business_name', 'My Business'),
    new.id
  )
  returning id into v_business_id;

  -- Create profile linked to business
  insert into public.profiles (id, business_id, email, first_name, last_name, phone, role, status)
  values (
    new.id,
    v_business_id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'Owner'::user_role,
    'Active'::user_status
  );

  return new;
exception
  when others then
    raise log 'Error in handle_new_user: %', sqlerrm;
    return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- RLS
alter table profiles enable row level security;

create policy "Users can view profiles in their business"
  on profiles for select
  using (business_id = get_my_business_id());

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Enable insert for signup and admins"
  on profiles for insert
  with check (auth.uid() = id or is_admin_or_owner());

create policy "Owners and admins can delete profiles"
  on profiles for delete
  using (is_admin_or_owner());
