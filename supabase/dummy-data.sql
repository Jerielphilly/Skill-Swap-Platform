-- Execute this entire block in your Supabase SQL Editor AFTER running scripts 01 through 04!
DO $$
DECLARE
  u_alice uuid := gen_random_uuid();
  u_bob uuid := gen_random_uuid();
  u_charlie uuid := gen_random_uuid();
  q1_id uuid := gen_random_uuid();
  q2_id uuid := gen_random_uuid();
  ans1_id uuid := gen_random_uuid();
  ans2_id uuid := gen_random_uuid();
BEGIN
  -- 1. Create Auth Users (Required by Supabase)
  insert into auth.users (id, aud, role, email) values
  (u_alice, 'authenticated', 'authenticated', 'alice@stackit.com'),
  (u_bob, 'authenticated', 'authenticated', 'bob@stackit.com'),
  (u_charlie, 'authenticated', 'authenticated', 'charlie@stackit.com');

  -- 2. Create Profiles
  insert into profiles (id, username, is_admin) values
  (u_alice, 'alice_dev', true),
  (u_bob, 'bob_builder', false),
  (u_charlie, 'charlie_db', false);

  -- 3. Ask Questions
  insert into questions (id, author_id, title, description, tags) values
  (q1_id, u_alice, 'How do I center a div in React?', '<p>I have tried <b>everything</b>, but flexbox is confusing me. Help!</p>', '{"React", "CSS"}'),
  (q2_id, u_bob, 'Why is PostgreSQL so fast?', '<p>I am building a backend and Postgres seems blazingly fast. Why?</p>', '{"Postgres", "Database"}');

  -- 4. Post Answers 
  -- 🚨 IMPORTANT: When this SQL runs, our Database Trigger will AUTOMATICALLY fire 
  -- and create notification rows for Alice and Bob behind the scenes!
  insert into answers (id, question_id, author_id, content, is_accepted) values
  (ans1_id, q1_id, u_bob, '<p>Just use <code>display: flex; justify-content: center; align-items: center;</code> on the parent container.</p>', true),
  (ans2_id, q2_id, u_charlie, '<p>It is fast because of its advanced query planner and caching mechanism.</p>', false);

  -- 5. Cast Votes
  -- Charlie upvotes Bob's answer
  insert into answer_votes (answer_id, user_id, vote_value) values (ans1_id, u_charlie, 1);
  -- Alice upvotes Charlie's answer
  insert into answer_votes (answer_id, user_id, vote_value) values (ans2_id, u_alice, 1);

END $$;
