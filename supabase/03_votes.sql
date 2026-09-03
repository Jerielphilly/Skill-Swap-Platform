create table answer_votes (
  id uuid default gen_random_uuid() primary key,
  answer_id uuid references answers(id) on delete cascade not null,
  user_id uuid references profiles(id) not null,
  vote_value integer check (vote_value in (1, -1)) not null, -- 1 for Upvote, -1 for Downvote
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(answer_id, user_id) -- Prevents double voting!
);

alter table answer_votes enable row level security;

-- Policy 1: Anyone can view votes
create policy "Anyone can view votes" on answer_votes for select using (true);

-- Policy 2: Users can vote
create policy "Users can vote" on answer_votes for insert with check (auth.uid() = user_id);

-- Policy 3: Users can change their vote (from up to down)
create policy "Users can update own vote" on answer_votes for update using (auth.uid() = user_id);

-- Policy 4: Users can remove their vote
create policy "Users can delete own vote" on answer_votes for delete using (auth.uid() = user_id);
