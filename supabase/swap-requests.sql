"create table swap_requests (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) not null,
  receiver_id uuid references profiles(id) not null,
  message text not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Turn on security!
alter table swap_requests enable row level security;

-- Policy 1: Senders and Receivers can view the request
create policy "Users can view their own swap requests"
  on swap_requests for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

-- Policy 2: Users can only send requests as themselves
create policy "Users can send swap requests"
  on swap_requests for insert
  with check ( auth.uid() = sender_id );

-- Policy 3: Only the receiver can accept or reject (update the status)
create policy "Receivers can update request status"
  on swap_requests for update
  using ( auth.uid() = receiver_id );

-- Policy 4: Senders can delete unaccepted requests
create policy "Senders can delete unaccepted requests"
  on swap_requests for delete
  using ( auth.uid() = sender_id and status != 'accepted' );"