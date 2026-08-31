-- Execute this entire block in your Supabase SQL Editor
DO $$
DECLARE
  user1_id uuid := gen_random_uuid();
  user2_id uuid := gen_random_uuid();
  user3_id uuid := gen_random_uuid();
BEGIN
  -- 1. Create Auth Users (Required by Supabase before creating profiles)
  -- Note: These users won't be able to actually log in (no passwords), but they work perfectly for UI testing!
  insert into auth.users (id, aud, role, email) values
  (user1_id, 'authenticated', 'authenticated', 'alice@hackathon.com'),
  (user2_id, 'authenticated', 'authenticated', 'bob@hackathon.com'),
  (user3_id, 'authenticated', 'authenticated', 'charlie@hackathon.com');

  -- 2. Create Dummy Profiles
  insert into profiles (id, full_name, location, skills_offered, skills_wanted, availability, is_admin) values
  (user1_id, 'Alice Designer', 'New York', '{"Figma", "Photoshop", "UI/UX"}', '{"Python", "SQL"}', '{"Weekends"}', true),
  (user2_id, 'Bob The Dev', 'London', '{"Python", "React", "Node.js"}', '{"Figma", "CSS"}', '{"Evenings"}', false),
  (user3_id, 'Charlie Data', 'Remote', '{"SQL", "Postgres", "Data Analysis"}', '{"React"}', '{"Weekdays", "Weekends"}', false);

  -- 3. Create Dummy Swap Requests
  insert into swap_requests (sender_id, receiver_id, message, status) values
  -- Alice asking Bob (Pending)
  (user1_id, user2_id, 'Hey Bob! I can teach you Figma if you can help me set up a Python server.', 'pending'),
  -- Charlie asking Alice (Accepted)
  (user3_id, user1_id, 'Hi Alice, I need some quick design help for my dashboard. I can write your SQL queries in return!', 'accepted');

  -- 4. Create a Dummy Review (Charlie reviewing Alice for their accepted swap)
  insert into swap_reviews (swap_request_id, reviewer_id, reviewee_id, rating, review_text) 
  select id, user3_id, user1_id, 5, 'Alice is an incredible designer! Highly recommend swapping skills with her.'
  from swap_requests where sender_id = user3_id limit 1;

  -- 5. Add a Platform Message
  insert into platform_messages (message) values
  ('Welcome to the Skill Swap Platform Hackathon Demo! Start exploring skills today.');

END $$;
