"-- Create a table for user profiles linked to Supabase Auth
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text not null,
  location text,
  avatar_url text,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) for data protection
alter table profiles enable row level security;

-- Policy 1: Anyone can view profiles that are set to public
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( is_public = true );

-- Policy 2: Users can insert/update only their own profile
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
-- Add arrays for skills and availability to the existing profiles table
alter table profiles 
add column skills_offered text[] default '{}',
add column skills_wanted text[] default '{}',
add column availability text[] default '{}';

-- Create GIN indexes to make array searching blazing fast
create index idx_skills_offered on profiles using gin (skills_offered);
create index idx_skills_wanted on profiles using gin (skills_wanted);
" 
