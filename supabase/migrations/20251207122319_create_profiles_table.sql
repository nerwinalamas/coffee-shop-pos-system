-- Create enum types for role and status
create type user_role as enum ('Admin', 'Manager', 'Staff');
create type user_status as enum ('Active', 'Inactive');

-- Create profiles table (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  role user_role not null default 'Staff',
  status user_status not null default 'Active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for faster lookups
create index if not exists profiles_status_idx on profiles(status);
create index if not exists profiles_role_idx on profiles(role);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger to automatically update updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

-- Function to auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    business_name,
    first_name,
    last_name,
    phone,
    role,
    status
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'business_name', ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'Admin'::user_role,
    'Active'::user_status
  );
  return new;
exception
  when others then
    raise log 'Error in handle_new_user: %', sqlerrm;
    return new;
end;
$$;

-- Trigger that fires after user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Enable RLS on profiles table
alter table profiles enable row level security;

-- Policy: Users can read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Policy: Allow insert during signup (needed for trigger)
create policy "Enable insert during signup"
  on profiles for insert
  with check (true);

-- Policy: Admins can view all profiles
create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'Admin'
    )
  );
