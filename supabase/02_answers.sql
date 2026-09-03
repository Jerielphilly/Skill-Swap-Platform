create table answers (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references questions(id) on delete cascade not null,
  author_id uuid references profiles(id) not null,
  content text not null,
  is_accepted boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table answers enable row level security;

-- Policy 1: Anyone can read answers
create policy "Anyone can view answers" on answers for select using (true);

-- Policy 2: Logged in users can post answers
create policy "Users can post answers" on answers for insert with check (auth.uid() = author_id);

-- Policy 3: Answer authors can edit/delete their own text
create policy "Authors can edit own answers" on answers for update using (auth.uid() = author_id);
create policy "Authors can delete own answers" on answers for delete using (auth.uid() = author_id);

-- Policy 4: ONLY Question owners can update an answer (to mark is_accepted = true)
create policy "Question owners can accept answers" on answers for update
using ( 
  (select author_id from questions where id = answers.question_id) = auth.uid()
);
