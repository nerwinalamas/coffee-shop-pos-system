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
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

-- Create function to automatically create user profile when auth user is created
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, business_name, first_name, last_name, phone, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'business_name', ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'Staff'),
    'Active'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to auto-create profile on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
-- Allow authenticated users to read all profiles
create policy "Users can view all profiles"
  on profiles for select
  to authenticated
  using (true);

-- Allow users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- Allow admins to update any profile
create policy "Admins can update all profiles"
  on profiles for update
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'Admin'
    )
  );

-- Allow admins to delete profiles
create policy "Admins can delete profiles"
  on profiles for delete
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'Admin'
    )
  );
