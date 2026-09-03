-- 1. Profiles Table
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique not null,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table profiles enable row level security;
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- 2. Questions Table
create table questions (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) not null,
  title text not null,
  description text not null, -- Stores Rich Text HTML
  tags text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table questions enable row level security;
create policy "Anyone can view questions" on questions for select using (true);
create policy "Users can ask questions" on questions for insert with check (auth.uid() = author_id);
create policy "Authors can edit their own questions" on questions for update using (auth.uid() = author_id);
create policy "Authors can delete their own questions" on questions for delete using (auth.uid() = author_id);
