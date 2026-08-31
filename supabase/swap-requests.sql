3. API Contract (For your Frontend Friend)
Pass this to your friend. Pay special attention to snippet #2—because there are two relationships between swap_requests and profiles (sender and receiver), we have to explicitly tell Supabase which one to join on!

javascript


// 1. Send a swap request with custom text
const sendSwapRequest = async (myUserId, receiverId, customMessage) => {
  const { error } = await supabase
    .from('swap_requests')
    .insert({
      sender_id: myUserId, 
      receiver_id: receiverId,
      message: customMessage
    });
};
// 2. Fetch INCOMING pending requests (Joined with the sender's profile info!)
const fetchIncomingRequests = async (myUserId) => {
  const { data, error } = await supabase
    .from('swap_requests')
    .select(`
      id, 
      message, 
      status,
      profiles!swap_requests_sender_id_fkey(full_name, avatar_url, skills_offered)
    `)
    .eq('receiver_id', myUserId)
    .eq('status', 'pending');
    
  return data; // Friend will get an array of requests containing the sender's name/skills!
};
// 3. Accept a request (Receiver action)
const acceptRequest = async (requestId) => {
  const { error } = await supabase
    .from('swap_requests')
    .update({ status: 'accepted' })
    .eq('id', requestId);
};
// 4. Delete an unaccepted request (Sender action)
const deleteRequest = async (requestId) => {
  const { error } = await supabase
    .from('swap_requests')
    .delete()
    .eq('id', requestId);
};