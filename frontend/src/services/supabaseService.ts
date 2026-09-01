import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  UserProfile, 
  SwapRequest, 
  Review, 
  PlatformAnnouncement, 
  SessionFormat, 
  SkillCategory, 
  SkillLevel,
  SkillItem,
  WantedSkillItem
} from '../types';
import { INITIAL_USERS, INITIAL_SWAPS, INITIAL_ANNOUNCEMENTS } from '../mockData';

// Helper to check if a string is a valid UUID
export const isUuid = (id?: string | null): boolean => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

// ==========================================
// Database Schema Types from Supabase
// ==========================================
export interface DbProfile {
  id: string;
  full_name: string;
  location?: string | null;
  avatar_url?: string | null;
  is_public?: boolean;
  is_admin?: boolean;
  is_banned?: boolean;
  skills_offered?: string[] | null;
  skills_wanted?: string[] | null;
  availability?: string[] | null;
  created_at?: string;
}

export interface DbSwapRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
  profiles?: DbProfile;
  sender?: DbProfile;
  receiver?: DbProfile;
}

export interface DbReview {
  id: string;
  swap_request_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  review_text?: string | null;
  created_at?: string;
  profiles?: DbProfile;
}

export interface DbPlatformMessage {
  id: string;
  message: string;
  created_at?: string;
}

// ==========================================
// Helper Mappers (DB <-> UI Models)
// ==========================================

export function mapDbProfileToUserProfile(db: DbProfile, existingUser?: UserProfile): UserProfile {
  const fallback = existingUser || INITIAL_USERS[0];
  
  const skillsOffered: SkillItem[] = (db.skills_offered || []).map((skillName, idx) => ({
    id: `sk-offered-${db.id}-${idx}`,
    name: skillName,
    category: inferCategory(skillName),
    level: 'Advanced' as SkillLevel,
    yearsOfExperience: 3,
    description: `Experienced in ${skillName}`,
    tags: [skillName],
    endorsements: 5 + (idx % 10),
  }));

  const skillsWanted: WantedSkillItem[] = (db.skills_wanted || []).map((skillName, idx) => ({
    id: `sk-wanted-${db.id}-${idx}`,
    name: skillName,
    category: inferCategory(skillName),
    targetLevel: 'Intermediate' as SkillLevel,
    learningGoal: `Looking to level up in ${skillName}`,
    priority: idx === 0 ? 'High' : 'Medium',
  }));

  return {
    id: db.id,
    name: db.full_name || 'Skill Swapper',
    username: (db.full_name || 'user').toLowerCase().replace(/\s+/g, '_'),
    email: `${(db.full_name || 'user').toLowerCase().replace(/\s+/g, '')}@skillswap.io`,
    avatar: db.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(db.full_name || db.id)}`,
    role: db.is_admin ? 'admin' : 'user',
    headline: skillsOffered.length > 0 
      ? `Specialist in ${skillsOffered.map(s => s.name).slice(0, 2).join(' & ')}` 
      : 'Eager Learner & Peer Mentor',
    bio: `Passionate about learning and sharing skills. Offering ${db.skills_offered?.join(', ') || 'knowledge'}, looking to learn ${db.skills_wanted?.join(', ') || 'new domains'}.`,
    location: db.location || 'Remote / Worldwide',
    timezone: 'UTC±00:00',
    rating: 4.9,
    reviewsCount: 12,
    completedSwapsCount: 8,
    joinDate: db.created_at ? new Date(db.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2025',
    isVerified: true,
    isBanned: Boolean(db.is_banned),
    skillsOffered: skillsOffered.length > 0 ? skillsOffered : fallback.skillsOffered,
    skillsWanted: skillsWanted.length > 0 ? skillsWanted : fallback.skillsWanted,
    availability: (db.availability && db.availability.length > 0)
      ? db.availability.map((availStr, idx) => ({
          id: `avail-${idx}`,
          day: 'Sat',
          times: ['Afternoon', 'Evening'],
          preferredFormat: 'Video Call' as SessionFormat,
        }))
      : fallback.availability,
    preferredFormats: ['Video Call', 'Code / Design Review'],
    privacy: {
      isProfilePublic: db.is_public !== false,
      showEmail: false,
      showLocation: true,
      allowDirectMessages: true,
      openToSwapRequests: !db.is_banned,
      hideCompletedSwaps: false,
    },
    reviews: [],
  };
}

function inferCategory(skillName: string): SkillCategory {
  const lower = skillName.toLowerCase();
  if (lower.includes('python') || lower.includes('sql') || lower.includes('react') || lower.includes('postgres') || lower.includes('node') || lower.includes('rust') || lower.includes('code')) {
    return 'Programming & Tech';
  }
  if (lower.includes('figma') || lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('photoshop') || lower.includes('3d') || lower.includes('blender')) {
    return 'Design & Creative';
  }
  if (lower.includes('spanish') || lower.includes('japanese') || lower.includes('french') || lower.includes('german') || lower.includes('language')) {
    return 'Languages & Culture';
  }
  if (lower.includes('guitar') || lower.includes('piano') || lower.includes('music') || lower.includes('audio') || lower.includes('ableton')) {
    return 'Music & Audio';
  }
  if (lower.includes('seo') || lower.includes('business') || lower.includes('pitch') || lower.includes('marketing')) {
    return 'Business & Growth';
  }
  return 'Programming & Tech';
}

export function mapDbSwapToSwapRequest(
  dbSwap: DbSwapRequest, 
  allUsers: UserProfile[],
  currentUser: UserProfile
): SwapRequest {
  const senderProfile = (dbSwap as any).sender || (dbSwap as any).profiles;
  const receiverProfile = (dbSwap as any).receiver;

  const sender = allUsers.find(u => u.id === dbSwap.sender_id) || (senderProfile ? mapDbProfileToUserProfile(senderProfile) : {
    id: dbSwap.sender_id,
    name: senderProfile?.full_name || 'Sender',
    avatar: senderProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    headline: 'Skill Enthusiast',
  });

  const receiver = allUsers.find(u => u.id === dbSwap.receiver_id) || (receiverProfile ? mapDbProfileToUserProfile(receiverProfile) : {
    id: dbSwap.receiver_id,
    name: receiverProfile?.full_name || 'Receiver',
    avatar: receiverProfile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    headline: 'Peer Mentor',
  });

  const senderSkill = (sender as any).skillsOffered?.[0]?.name || senderProfile?.skills_offered?.[0] || 'Technical Mentorship';
  const receiverSkill = (receiver as any).skillsOffered?.[0]?.name || receiverProfile?.skills_offered?.[0] || 'Interactive Tutoring';

  return {
    id: dbSwap.id,
    senderId: dbSwap.sender_id,
    senderName: (sender as any).name || 'Sender',
    senderAvatar: (sender as any).avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    senderHeadline: (sender as any).headline || 'Skill Contributor',
    receiverId: dbSwap.receiver_id,
    receiverName: (receiver as any).name || 'Receiver',
    receiverAvatar: (receiver as any).avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    receiverHeadline: (receiver as any).headline || 'Peer Mentor',
    offeredSkill: {
      name: senderSkill,
      level: 'Advanced',
      category: inferCategory(senderSkill),
    },
    requestedSkill: {
      name: receiverSkill,
      level: 'Intermediate',
      category: inferCategory(receiverSkill),
    },
    status: dbSwap.status,
    sessionFormat: 'Video Call',
    proposedSchedule: 'Flexible / As agreed',
    initialMessage: dbSwap.message,
    createdAt: dbSwap.created_at || new Date().toISOString(),
    updatedAt: dbSwap.created_at || new Date().toISOString(),
    objectives: [
      { id: 'obj-1', text: 'Introduction & skill evaluation', completed: dbSwap.status === 'accepted' },
      { id: 'obj-2', text: 'Live hands-on practice session', completed: false },
      { id: 'obj-3', text: 'Mutual code/design review', completed: false }
    ],
    messages: [
      {
        id: `msg-${dbSwap.id}-init`,
        senderId: dbSwap.sender_id,
        senderName: (sender as any).name || 'Sender',
        senderAvatar: (sender as any).avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        text: dbSwap.message,
        timestamp: 'Initial Proposal'
      }
    ],
    meetingLink: dbSwap.status === 'accepted' ? `https://meet.skillswap.live/room-${dbSwap.id.slice(0, 8)}` : undefined,
  };
}

// ==========================================
// 1. PROFILES & SKILLS API CONTRACTS
// ==========================================

/**
 * Fetch all public profiles
 */
export const fetchAllPublicProfiles = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true);

    if (error) {
      return INITIAL_USERS;
    }

    if (!data || data.length === 0) {
      return INITIAL_USERS;
    }

    return data.map(p => mapDbProfileToUserProfile(p));
  } catch (err) {
    return INITIAL_USERS;
  }
};

/**
 * Fetch a user's public profile (Contract #1)
 */
export const fetchProfile = async (userId: string) => {
  if (!isUuid(userId)) {
    const local = INITIAL_USERS.find(u => u.id === userId);
    return local || null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, location, avatar_url, skills_offered, skills_wanted, availability, is_public, is_admin, is_banned')
      .eq('id', userId)
      .single();

    if (error) {
      const local = INITIAL_USERS.find(u => u.id === userId);
      return local || null;
    }
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Updating a user's skills (Contract #2)
 */
export const updateSkills = async (
  userId: string, 
  payload: {
    skills_offered?: string[];
    skills_wanted?: string[];
    availability?: string[];
  }
) => {
  if (!isUuid(userId)) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        skills_offered: payload.skills_offered || ['Python', 'SQL', 'Postgres'],
        skills_wanted: payload.skills_wanted || ['Figma', 'UI Design'],
        availability: payload.availability || ['Weekends', 'Evenings'],
      })
      .eq('id', userId)
      .select();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

/**
 * Update complete profile details
 */
export const updateProfile = async (
  userId: string,
  updates: Partial<DbProfile>
) => {
  if (!isUuid(userId)) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

/**
 * Searching for users who offer a specific skill (Contract #3)
 * Uses PostgreSQL GIN index on skills_offered!
 */
export const searchUsersBySkill = async (skillToFind: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, skills_offered, avatar_url, skills_wanted, location, availability')
      .contains('skills_offered', [skillToFind]) // The .contains() method uses GIN index!
      .eq('is_public', true); // Only search public profiles

    if (error || !data) {
      return INITIAL_USERS.filter(u => 
        u.skillsOffered.some(s => s.name.toLowerCase().includes(skillToFind.toLowerCase()))
      );
    }
    return data;
  } catch (err) {
    return [];
  }
};

// ==========================================
// 2. SWAP REQUESTS API CONTRACTS
// ==========================================

/**
 * Send a swap request with custom text (Contract #4.1)
 */
export const sendSwapRequest = async (
  myUserId: string, 
  receiverId: string, 
  customMessage: string
) => {
  if (!isUuid(myUserId) || !isUuid(receiverId)) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('swap_requests')
      .insert({
        sender_id: myUserId,
        receiver_id: receiverId,
        message: customMessage,
        status: 'pending'
      })
      .select()
      .single();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

/**
 * Fetch INCOMING pending requests joined with sender's profile info (Contract #4.2)
 */
export const fetchIncomingRequests = async (myUserId: string) => {
  if (!isUuid(myUserId)) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('swap_requests')
      .select(`
        id,
        message,
        status,
        created_at,
        profiles!swap_requests_sender_id_fkey (
          id,
          full_name,
          avatar_url,
          skills_offered
        )
      `)
      .eq('receiver_id', myUserId)
      .eq('status', 'pending');

    if (error) {
      return [];
    }
    return data || [];
  } catch (err) {
    return [];
  }
};

/**
 * Fetch all swap requests (sent and received) for a user
 */
export const fetchUserSwaps = async (myUserId: string) => {
  if (!isUuid(myUserId)) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('swap_requests')
      .select(`
        id,
        sender_id,
        receiver_id,
        message,
        status,
        created_at,
        sender:profiles!swap_requests_sender_id_fkey(id, full_name, avatar_url, skills_offered),
        receiver:profiles!swap_requests_receiver_id_fkey(id, full_name, avatar_url, skills_offered)
      `)
      .or(`sender_id.eq.${myUserId},receiver_id.eq.${myUserId}`)
      .order('created_at', { ascending: false });

    if (error) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Accept a request - Receiver action (Contract #4.3)
 */
export const acceptRequest = async (requestId: string) => {
  if (!isUuid(requestId)) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('swap_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
};

/**
 * Reject a request - Receiver action
 */
export const rejectRequest = async (requestId: string) => {
  if (!isUuid(requestId)) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('swap_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
};

/**
 * Delete an unaccepted request - Sender action (Contract #4.4)
 */
export const deleteRequest = async (requestId: string) => {
  if (!isUuid(requestId)) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('swap_requests')
      .delete()
      .eq('id', requestId);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
};

// ==========================================
// 3. REVIEWS API CONTRACTS
// ==========================================

/**
 * Submit a review after a swap is completed (Contract #5.1)
 */
export const submitReview = async (
  swapId: string, 
  myUserId: string, 
  revieweeId: string, 
  starRating: number, 
  reviewText: string
) => {
  if (!isUuid(swapId) || !isUuid(myUserId) || !isUuid(revieweeId)) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('swap_reviews')
      .insert({
        swap_request_id: swapId,
        reviewer_id: myUserId,
        reviewee_id: revieweeId,
        rating: starRating, // integer between 1 and 5
        review_text: reviewText
      })
      .select()
      .single();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

/**
 * Fetch all reviews for a specific user to display on their profile (Contract #5.2)
 */
export const fetchUserReviews = async (userIdToDisplay: string) => {
  if (!isUuid(userIdToDisplay)) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('swap_reviews')
      .select(`
        id,
        rating,
        review_text,
        created_at,
        swap_request_id,
        profiles!swap_reviews_reviewer_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('reviewee_id', userIdToDisplay)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }
    return data || [];
  } catch (err) {
    return [];
  }
};

// ==========================================
// 4. ADMIN & PLATFORM ANNOUNCEMENTS CONTRACTS
// ==========================================

/**
 * Fetch platform messages - Show these on the homepage (Contract #6.1)
 */
export const fetchMessages = async (): Promise<PlatformAnnouncement[]> => {
  try {
    const { data, error } = await supabase
      .from('platform_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_ANNOUNCEMENTS;
    }

    return data.map((msg, idx) => ({
      id: msg.id,
      title: 'Platform Announcement',
      content: msg.message,
      type: idx === 0 ? 'info' : 'feature',
      isActive: true,
      date: msg.created_at ? new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
      author: 'Platform Admin',
    }));
  } catch (err) {
    return INITIAL_ANNOUNCEMENTS;
  }
};

/**
 * Create a new platform message announcement (Admin only)
 */
export const createPlatformMessage = async (messageText: string) => {
  try {
    const { data, error } = await supabase
      .from('platform_messages')
      .insert({
        message: messageText
      })
      .select()
      .single();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

/**
 * Delete a platform message announcement (Admin only)
 */
export const deletePlatformMessage = async (messageId: string) => {
  if (!isUuid(messageId)) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('platform_messages')
      .delete()
      .eq('id', messageId);

    return { error };
  } catch (err: any) {
    return { error: err };
  }
};

/**
 * Fetch ALL swap requests globally - Admin only (Contract #6.2)
 */
export const fetchAllSwapsForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('swap_requests')
      .select(`
        *,
        sender:profiles!swap_requests_sender_id_fkey(full_name, avatar_url, skills_offered),
        receiver:profiles!swap_requests_receiver_id_fkey(full_name, avatar_url, skills_offered)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Export swaps to CSV for admin reporting
 */
export const exportSwapsToCsv = (swaps: any[]) => {
  const headers = ['Swap ID', 'Sender ID', 'Receiver ID', 'Status', 'Message', 'Created At'];
  const rows = swaps.map(s => [
    `"${s.id || ''}"`,
    `"${s.sender_id || s.senderId || ''}"`,
    `"${s.receiver_id || s.receiverId || ''}"`,
    `"${s.status || ''}"`,
    `"${(s.message || s.initialMessage || '').replace(/"/g, '""')}"`,
    `"${s.created_at || s.createdAt || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `skillswap_swaps_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Ban a user and wipe their skills - Admin only RPC (Contract #6.3)
 */
export const banSpamUser = async (badUserId: string) => {
  if (!isUuid(badUserId)) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .rpc('ban_user_and_wipe_skills', { target_user_id: badUserId });

    return { error };
  } catch (err: any) {
    return { error: err };
  }
};
