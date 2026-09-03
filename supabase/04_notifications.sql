create table notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null, -- The person receiving it
  type text not null, -- 'answer', 'mention', 'system'
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table notifications enable row level security;

-- Policy: Users can only see and update their own notifications
create policy "Users can view own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users can mark notifications read" on notifications for update using (auth.uid() = user_id);

-- ==========================================
-- THE MAGIC: AUTOMATIC DATABASE TRIGGER
-- ==========================================

-- 1. Define the function that runs when a new answer is posted
create or replace function notify_question_author_on_answer()
returns trigger as $$
declare
  q_author uuid;
  q_title text;
begin
  -- Find the user who asked the original question
  select author_id, title into q_author, q_title 
  from questions where id = NEW.question_id;

  -- If the person answering is NOT the person who asked, send a notification!
  if q_author != NEW.author_id then
    insert into notifications (user_id, type, message)
    values (
      q_author, 
      'answer', 
      'You have a new answer on your question: "' || q_title || '"'
    );
  end if;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- 2. Attach the function to the 'answers' table
create trigger on_new_answer
  after insert on answers
  for each row execute function notify_question_author_on_answer();
