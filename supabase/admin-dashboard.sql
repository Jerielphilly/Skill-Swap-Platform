-- 1. Add Admin and Banned status to profiles
alter table profiles 
add column is_admin boolean default false,
add column is_banned boolean default false;

-- 2. Create a table for platform-wide announcements
create table platform_messages (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table platform_messages enable row level security;
create policy "Everyone can read messages" on platform_messages for select using (true);

-- 3. RLS Policy: Allow Admins to see ALL swap requests in the database (for monitoring)
create policy "Admins can monitor all swaps"
  on swap_requests for select
  using ( (select is_admin from profiles where id = auth.uid()) = true );

-- 4. Custom Function: Safely ban a user and wipe their skills if you are an Admin
create or replace function ban_user_and_wipe_skills(target_user_id uuid)
returns void as $$
begin
  -- Check if the person calling this function is an admin
  if (select is_admin from profiles where id = auth.uid()) = true then
    update profiles 
    set is_banned = true, skills_offered = '{}', skills_wanted = '{}' 
    where id = target_user_id;
  else
    raise exception 'Unauthorized: You are not an admin';
  end if;
end;
$$ language plpgsql security definer;
