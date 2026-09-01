-- Optional: Run this in your Supabase SQL Editor if you want to allow anonymous / demo users
-- to insert and view swap_requests without requiring full email-verification JWT sessions.

-- 1. Enable public read and write on swap_requests for Demo & Hackathon testing
create policy "Allow all operations for demo on swap_requests"
  on swap_requests for all
  using (true)
  with check (true);

-- 2. Enable public insert on swap_reviews for demo
create policy "Allow all inserts for demo on swap_reviews"
  on swap_reviews for insert
  with check (true);

-- 3. Enable public insert/update on profiles for demo
create policy "Allow all updates for demo on profiles"
  on profiles for update
  using (true);
