export interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  vehicleType: 'Sedan / Hatchback' | 'SUV / Crossover' | 'Electric Vehicle (EV)' | 'Truck / Van' | 'Motorcycle' | 'Other';
  vehiclePlate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  preferredAssistanceType?: string;
  agreeToTerms: boolean;
  receiveSafetyAlerts: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehiclePlate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  membershipTier: 'Silver Guard' | 'Gold Haven' | 'Platinum Shield';
  memberSince: string;
  activeRequestsCount: number;
  avatar?: string;
}

export interface RoadsideServiceType {
  id: string;
  title: string;
  description: string;
  eta: string;
  iconName: string;
  color: string;
  accentBg: string;
  badge: string;
}

export interface EmergencyHotlineContact {
  label: string;
  number: string;
  description: string;
  available: string;
  priority: 'urgent' | 'standard';
}


export type SkillCategory = 
  | 'Programming & Tech'
  | 'Design & Creative'
  | 'Languages & Culture'
  | 'Music & Audio'
  | 'Business & Growth'
  | 'Culinary & Crafts'
  | 'Health & Fitness'
  | 'Academics & Science';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience?: number;
  description?: string;
  tags: string[];
  endorsements?: number;
}

export interface WantedSkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  targetLevel: SkillLevel;
  learningGoal?: string;
  priority: 'High' | 'Medium' | 'Low';
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type SessionFormat = 'Video Call' | 'Live Chat' | 'Code / Design Review' | 'In-Person';

export interface AvailabilitySlot {
  id: string;
  day: DayOfWeek;
  times: TimeOfDay[];
  preferredFormat: SessionFormat;
}

export interface PrivacySettings {
  isProfilePublic: boolean;
  showEmail: boolean;
  showLocation: boolean;
  allowDirectMessages: boolean;
  openToSwapRequests: boolean;
  hideCompletedSwaps: boolean;
}

export interface Review {
  id: string;
  swapId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1 to 5
  skillExchanged: string;
  comment: string;
  date: string;
  punctualityScore?: number;
  clarityScore?: number;
  badges?: string[]; // e.g. "Great Mentor", "Patient", "Super Clear"
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin' | 'moderator';
  headline: string;
  bio: string;
  location: string;
  timezone: string;
  rating: number;
  reviewsCount: number;
  completedSwapsCount: number;
  skillsOffered: SkillItem[];
  skillsWanted: WantedSkillItem[];
  availability: AvailabilitySlot[];
  preferredFormats: SessionFormat[];
  privacy: PrivacySettings;
  reviews: Review[];
  joinDate: string;
  isVerified: boolean;
  isBanned?: boolean;
  statusMessage?: string;
  strikes?: number;
}

export type SwapStatus = 
  | 'pending' 
  | 'accepted' 
  | 'in_progress' 
  | 'completed' 
  | 'rejected' 
  | 'cancelled';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface SwapSessionObjective {
  id: string;
  text: string;
  completed: boolean;
}

export interface SwapRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderHeadline: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  receiverHeadline: string;
  
  // Exchanged Skills
  offeredSkill: {
    name: string;
    level: SkillLevel;
    category: SkillCategory;
  };
  requestedSkill: {
    name: string;
    level: SkillLevel;
    category: SkillCategory;
  };
  
  status: SwapStatus;
  sessionFormat: SessionFormat;
  proposedSchedule: string;
  initialMessage: string;
  createdAt: string;
  updatedAt: string;
  
  // Workspace & Live Interaction
  objectives: SwapSessionObjective[];
  messages: ChatMessage[];
  meetingLink?: string;
  sharedNotes?: string;
  
  // Post-completion reviews
  senderReviewSubmitted?: boolean;
  receiverReviewSubmitted?: boolean;
  
  // Moderation / Disputes
  isDisputed?: boolean;
  disputeReason?: string;
  disputeResolved?: boolean;
}

export interface SkillCategoryDefinition {
  id: string;
  name: SkillCategory;
  description: string;
  iconName: string;
  popularSkills: string[];
  colorTheme: string;
}

export interface AdminReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'user' | 'swap' | 'message' | 'skill';
  targetId: string;
  targetName: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  actionTaken?: string;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'maintenance' | 'feature' | 'event';
  isActive: boolean;
  date: string;
  author: string;
}

export interface PlatformNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_completed' | 'new_message' | 'admin_alert' | 'review_received';
  createdAt: string;
  read: boolean;
  swapId?: string;
}
