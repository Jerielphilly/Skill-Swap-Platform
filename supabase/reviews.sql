"create table swap_reviews (
  id uuid default gen_random_uuid() primary key,
  swap_request_id uuid references swap_requests(id) not null,
  reviewer_id uuid references profiles(id) not null,
  reviewee_id uuid references profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  review_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  -- Ensure a user can only leave one review per swap
  unique (swap_request_id, reviewer_id) 
);

alter table swap_reviews enable row level security;

-- Policy 1: Reviews are public so they can be shown on user profiles
create policy "Reviews are viewable by everyone"
  on swap_reviews for select
  using ( true );

-- Policy 2: Users can only submit reviews as themselves
create policy "Users can insert own reviews"
  on swap_reviews for insert
  with check ( auth.uid() = reviewer_id );"