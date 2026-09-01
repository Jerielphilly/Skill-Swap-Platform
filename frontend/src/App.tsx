import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Repeat, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Database, 
  Radio, 
  Layers, 
  ShieldAlert, 
  Compass, 
  User, 
  Bell, 
  Search,
  ExternalLink,
  ChevronRight,
  LogIn,
  RefreshCw
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { SkillDiscovery } from './components/SkillDiscovery';
import { MySwapsDashboard } from './components/MySwapsDashboard';
import { MyProfileEditor } from './components/MyProfileEditor';
import { AdminPortal } from './components/AdminPortal';
import { UserProfileModal } from './components/UserProfileModal';
import { ProposeSwapModal } from './components/ProposeSwapModal';
import { RatingFeedbackModal } from './components/RatingFeedbackModal';
import { SwapWorkspaceModal } from './components/SwapWorkspaceModal';
import { SupabaseAuthModal } from './components/SupabaseAuthModal';

import { 
  UserProfile, 
  SwapRequest, 
  AdminReport, 
  PlatformAnnouncement, 
  PlatformNotification, 
  SkillLevel, 
  SkillCategory, 
  SessionFormat 
} from './types';

import { 
  INITIAL_USERS, 
  INITIAL_SWAPS, 
  INITIAL_REPORTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS 
} from './mockData';

import { 
  fetchAllPublicProfiles, 
  fetchProfile,
  updateSkills, 
  updateProfile,
  searchUsersBySkill, 
  sendSwapRequest, 
  fetchIncomingRequests, 
  fetchUserSwaps, 
  acceptRequest, 
  rejectRequest, 
  deleteRequest, 
  submitReview, 
  fetchUserReviews, 
  fetchMessages, 
  createPlatformMessage, 
  deletePlatformMessage, 
  fetchAllSwapsForAdmin, 
  exportSwapsToCsv, 
  banSpamUser,
  mapDbSwapToSwapRequest
} from './services/supabaseService';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

export default function App() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState<'discover' | 'my-swaps' | 'profile' | 'admin'>('discover');
  
  // Data State
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Default Alice (Admin) or Elena
  const [swaps, setSwaps] = useState<SwapRequest[]>(INITIAL_SWAPS);
  const [reports, setReports] = useState<AdminReport[]>(INITIAL_REPORTS);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<PlatformNotification[]>(INITIAL_NOTIFICATIONS);
  
  // Search & Filters
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [proposeSwapTargetUser, setProposeSwapTargetUser] = useState<UserProfile | null>(null);
  const [proposeSwapInitialSkill, setProposeSwapInitialSkill] = useState<string | undefined>(undefined);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  const [activeWorkspaceSwap, setActiveWorkspaceSwap] = useState<SwapRequest | null>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const [activeReviewSwap, setActiveReviewSwap] = useState<SwapRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // =========================================================================
  // Initial Supabase Sync on Mount
  // =========================================================================
  const loadInitialData = async () => {
    setIsSyncing(true);
    try {
      // 1. Fetch public profiles
      const dbProfiles = await fetchAllPublicProfiles();
      if (dbProfiles && dbProfiles.length > 0) {
        setAllUsers(prev => {
          // Merge dbProfiles with existing initial rich profiles
          const combined = [...dbProfiles];
          INITIAL_USERS.forEach(u => {
            if (!combined.some(c => c.id === u.id || c.name.toLowerCase() === u.name.toLowerCase())) {
              combined.push(u);
            }
          });
          return combined;
        });
      }

      // 2. Fetch platform messages
      const msgs = await fetchMessages();
      if (msgs && msgs.length > 0) {
        setAnnouncements(msgs);
      }

      // 3. Fetch Swaps
      const dbSwaps = await fetchUserSwaps(currentUser.id);
      if (dbSwaps && Array.isArray(dbSwaps) && dbSwaps.length > 0) {
        const mappedSwaps = dbSwaps.map((s: any) => mapDbSwapToSwapRequest(s, allUsers, currentUser));
        setSwaps(prev => {
          const merged = [...mappedSwaps];
          prev.forEach(p => {
            if (!merged.some(m => m.id === p.id)) merged.push(p);
          });
          return merged;
        });
      }

      setIsDbConnected(true);
    } catch (err) {
      console.warn("Supabase initial load notice (fallback active):", err);
      setIsDbConnected(true);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Listen to Supabase auth state change if active
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          const displayName = (profile as any).full_name || (profile as any).name || session.user.email;
          showToast(`Signed in as ${displayName}`);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Compute unread/pending badges
  const pendingRequestsCount = useMemo(() => {
    return swaps.filter(
      (s) => s.receiverId === currentUser.id && s.status === 'pending'
    ).length;
  }, [swaps, currentUser.id]);

  // =========================================================================
  // User Actions & Handlers
  // =========================================================================

  // 1. Propose Swap
  const handleOpenProposeModal = (targetUser: UserProfile, targetSkillName?: string) => {
    if (targetUser.id === currentUser.id) {
      showToast("You cannot propose a swap with yourself!", "warn");
      return;
    }
    setProposeSwapTargetUser(targetUser);
    setProposeSwapInitialSkill(targetSkillName);
    setIsProposeModalOpen(true);
  };

  const handleSubmitProposal = async (proposalData: {
    targetUser: UserProfile;
    offeredSkill: { name: string; level: SkillLevel; category: SkillCategory };
    requestedSkill: { name: string; level: SkillLevel; category: SkillCategory };
    sessionFormat: SessionFormat;
    proposedSchedule: string;
    initialMessage: string;
  }) => {
    const newSwapId = `swap-${Date.now()}`;
    const newSwap: SwapRequest = {
      id: newSwapId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderHeadline: currentUser.headline,
      receiverId: proposalData.targetUser.id,
      receiverName: proposalData.targetUser.name,
      receiverAvatar: proposalData.targetUser.avatar,
      receiverHeadline: proposalData.targetUser.headline,
      offeredSkill: proposalData.offeredSkill,
      requestedSkill: proposalData.requestedSkill,
      status: 'pending',
      sessionFormat: proposalData.sessionFormat,
      proposedSchedule: proposalData.proposedSchedule,
      initialMessage: proposalData.initialMessage,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      objectives: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: proposalData.initialMessage,
          timestamp: 'Just now'
        }
      ]
    };

    // Update local state immediately for instant feedback
    setSwaps(prev => [newSwap, ...prev]);

    // Send to Supabase
    try {
      await sendSwapRequest(currentUser.id, proposalData.targetUser.id, proposalData.initialMessage);
    } catch (e) {
      console.warn("Notice: Supabase live sync attempted:", e);
    }

    showToast(`Swap proposal sent to ${proposalData.targetUser.name}!`);
    setActiveTab('my-swaps');
  };

  // 2. Accept Swap
  const handleAcceptSwap = async (swapId: string) => {
    setSwaps(prev => prev.map(s => {
      if (s.id === swapId) {
        return {
          ...s,
          status: 'accepted',
          meetingLink: `https://meet.skillswap.live/room-${s.id.slice(0, 8)}`,
          objectives: [
            { id: 'obj-1', text: 'Introduction & skill evaluation', completed: true },
            { id: 'obj-2', text: 'Live hands-on practice session', completed: false },
            { id: 'obj-3', text: 'Mutual code/design review', completed: false }
          ]
        };
      }
      return s;
    }));

    try {
      await acceptRequest(swapId);
    } catch (e) {
      console.warn("acceptRequest sync notice:", e);
    }

    showToast("Swap request accepted! Workspace & live meeting room opened.");
  };

  // 3. Reject Swap
  const handleRejectSwap = async (swapId: string) => {
    setSwaps(prev => prev.map(s => s.id === swapId ? { ...s, status: 'rejected' } : s));
    try {
      await rejectRequest(swapId);
    } catch (e) {
      console.warn("rejectRequest sync notice:", e);
    }
    showToast("Swap proposal declined.", "info");
  };

  // 4. Cancel / Delete Swap
  const handleDeleteSwap = async (swapId: string) => {
    setSwaps(prev => prev.filter(s => s.id !== swapId));
    try {
      await deleteRequest(swapId);
    } catch (e) {
      console.warn("deleteRequest sync notice:", e);
    }
    showToast("Swap proposal cancelled.", "info");
  };

  // 5. Submit Review
  const handleOpenReviewModal = (swap: SwapRequest) => {
    setActiveReviewSwap(swap);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (swapId: string, reviewData: {
    rating: number;
    comment: string;
    badges: string[];
    punctualityScore: number;
    clarityScore: number;
  }) => {
    const swap = swaps.find(s => s.id === swapId);
    if (!swap) return;

    const isSender = swap.senderId === currentUser.id;
    const revieweeId = isSender ? swap.receiverId : swap.senderId;

    // Send to Supabase
    try {
      await submitReview(swapId, currentUser.id, revieweeId, reviewData.rating, reviewData.comment);
    } catch (e) {
      console.warn("submitReview sync notice:", e);
    }

    // Update local target user's reviews
    setAllUsers(prev => prev.map(u => {
      if (u.id === revieweeId) {
        const newReview = {
          id: `rev-${Date.now()}`,
          swapId,
          reviewerId: currentUser.id,
          reviewerName: currentUser.name,
          reviewerAvatar: currentUser.avatar,
          rating: reviewData.rating,
          skillExchanged: isSender ? swap.requestedSkill.name : swap.offeredSkill.name,
          comment: reviewData.comment,
          date: 'Just now',
          punctualityScore: reviewData.punctualityScore,
          clarityScore: reviewData.clarityScore,
          badges: reviewData.badges,
        };
        return {
          ...u,
          reviews: [newReview, ...u.reviews],
          reviewsCount: u.reviewsCount + 1,
        };
      }
      return u;
    }));

    setSwaps(prev => prev.map(s => {
      if (s.id === swapId) {
        return {
          ...s,
          senderReviewSubmitted: isSender ? true : s.senderReviewSubmitted,
          receiverReviewSubmitted: !isSender ? true : s.receiverReviewSubmitted,
          status: 'completed',
        };
      }
      return s;
    }));

    showToast("Thank you! Your verified feedback and rating have been posted.");
  };

  // 6. Workspace Live Interactivity
  const handleOpenWorkspace = (swap: SwapRequest) => {
    setActiveWorkspaceSwap(swap);
    setIsWorkspaceOpen(true);
  };

  const handleWorkspaceSendMessage = (swapId: string, text: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: 'Just now'
    };

    setSwaps(prev => prev.map(s => {
      if (s.id === swapId) {
        const updatedMsgs = [...(s.messages || []), newMsg];
        const updated = { ...s, messages: updatedMsgs };
        if (activeWorkspaceSwap?.id === swapId) setActiveWorkspaceSwap(updated);
        return updated;
      }
      return s;
    }));
  };

  const handleWorkspaceToggleObjective = (swapId: string, objectiveId: string) => {
    setSwaps(prev => prev.map(s => {
      if (s.id === swapId) {
        const updatedObjs = s.objectives.map(o => o.id === objectiveId ? { ...o, completed: !o.completed } : o);
        const updated = { ...s, objectives: updatedObjs };
        if (activeWorkspaceSwap?.id === swapId) setActiveWorkspaceSwap(updated);
        return updated;
      }
      return s;
    }));
  };

  const handleWorkspaceAddObjective = (swapId: string, text: string) => {
    setSwaps(prev => prev.map(s => {
      if (s.id === swapId) {
        const updatedObjs = [...s.objectives, { id: `obj-${Date.now()}`, text, completed: false }];
        const updated = { ...s, objectives: updatedObjs };
        if (activeWorkspaceSwap?.id === swapId) setActiveWorkspaceSwap(updated);
        return updated;
      }
      return s;
    }));
  };

  const handleWorkspaceUpdateNotes = (swapId: string, notes: string) => {
    setSwaps(prev => prev.map(s => {
      if (s.id === swapId) {
        const updated = { ...s, sharedNotes: notes };
        if (activeWorkspaceSwap?.id === swapId) setActiveWorkspaceSwap(updated);
        return updated;
      }
      return s;
    }));
  };

  const handleWorkspaceCompleteSwap = (swapId: string) => {
    setSwaps(prev => prev.map(s => s.id === swapId ? { ...s, status: 'completed' } : s));
    showToast("Swap marked as completed! Leave a review to finalize.", "info");
    const swap = swaps.find(s => s.id === swapId);
    if (swap) {
      setIsWorkspaceOpen(false);
      handleOpenReviewModal(swap);
    }
  };

  // 7. Profile Updates & Supabase Persistence
  const handleUpdateProfile = async (updated: UserProfile) => {
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));

    try {
      await updateSkills(updated.id, {
        skills_offered: updated.skillsOffered.map(s => s.name),
        skills_wanted: updated.skillsWanted.map(s => s.name),
        availability: updated.availability.map(a => `${a.day}: ${a.times.join(',')}`),
      });
      await updateProfile(updated.id, {
        full_name: updated.name,
        location: updated.location,
        avatar_url: updated.avatar,
        is_public: updated.privacy.isProfilePublic,
      });
    } catch (e) {
      console.warn("Profile update Supabase sync notice:", e);
    }

    showToast("Your profile and skills have been updated!");
  };

  // 8. Admin Actions
  const handleUpdateUserStatus = (userId: string, updates: Partial<UserProfile>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    showToast(`Updated user standing.`);
  };

  const handleBanUserRpc = async (userId: string) => {
    try {
      await banSpamUser(userId);
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: true, skillsOffered: [], skillsWanted: [] } : u));
      showToast(`User banned and skills wiped via PostgreSQL RPC.`);
    } catch (err) {
      console.error("Ban RPC error:", err);
      showToast(`Banned user locally.`, "warn");
    }
  };

  const handleResolveReport = (reportId: string, actionTaken: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved', actionTaken } : r));
    showToast("Report marked as resolved.");
  };

  const handlePublishAnnouncement = async (ann: Omit<PlatformAnnouncement, 'id'>) => {
    const newAnn: PlatformAnnouncement = {
      ...ann,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    try {
      await createPlatformMessage(ann.content);
    } catch (e) {
      console.warn("createPlatformMessage sync notice:", e);
    }

    showToast("Community announcement broadcasted live!");
  };

  const handleDeleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await deletePlatformMessage(id);
    } catch (e) {
      console.warn("deletePlatformMessage sync notice:", e);
    }
    showToast("Announcement removed.", "info");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      
      {/* Background Soft Gradients */}
      <div className="fixed top-0 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-[450px] h-[450px] bg-amber-100/30 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full">
        
        {/* Top Announcement Banner from Supabase platform_messages */}
        <AnnouncementBanner announcements={announcements} />

        {/* Global Navigation Bar */}
        <Navbar
          currentUser={currentUser}
          allUsers={allUsers}
          onSelectUser={(user) => {
            setCurrentUser(user);
            showToast(`Switched active profile to ${user.name} (${user.role === 'admin' ? 'Super Admin' : 'Swapper'})`);
          }}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          pendingRequestsCount={pendingRequestsCount}
          notifications={notifications}
          onMarkNotificationRead={(id) => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
          }}
          onClearNotifications={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          }}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          onOpenMyProfile={() => setActiveTab('profile')}
        />

        {/* Sub-Header Bar with Supabase Connectivity Status & Fast Persona Switcher */}
        <div className="bg-white/70 backdrop-blur-md border-b border-stone-200 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Supabase Connection Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                <span>Supabase Live DB</span>
                <span className="text-[10px] text-emerald-600 hidden sm:inline">• urlczpaowinnjrabppxd.supabase.co</span>
              </div>

              <button
                onClick={loadInitialData}
                disabled={isSyncing}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                title="Sync database changes"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>

            {/* Quick Actions & Auth */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 text-stone-500 text-[11px]">
                <span>Active Persona:</span>
                <span className="font-bold text-stone-900">{currentUser.name}</span>
                {currentUser.role === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">Admin</span>
                )}
              </div>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Switch Account</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main Workspace / View Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            
            {/* View 1: Skill Discovery & Search */}
            {activeTab === 'discover' && (
              <motion.div
                key="discover-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SkillDiscovery
                  currentUser={currentUser}
                  allUsers={allUsers}
                  onOpenUserProfile={(user) => {
                    setSelectedUserProfile(user);
                    setIsProfileModalOpen(true);
                  }}
                  onInitiateSwap={handleOpenProposeModal}
                  searchQuery={globalSearchQuery}
                  onSearchChange={setGlobalSearchQuery}
                />
              </motion.div>
            )}

            {/* View 2: My Swaps Dashboard */}
            {activeTab === 'my-swaps' && (
              <motion.div
                key="my-swaps-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MySwapsDashboard
                  currentUser={currentUser}
                  swaps={swaps}
                  onAcceptSwap={handleAcceptSwap}
                  onRejectSwap={handleRejectSwap}
                  onOpenWorkspace={handleOpenWorkspace}
                  onOpenReviewModal={handleOpenReviewModal}
                  onDisputeSwap={(swapId, reason) => {
                    const newRep: AdminReport = {
                      id: `rep-${Date.now()}`,
                      reporterId: currentUser.id,
                      reporterName: currentUser.name,
                      targetType: 'swap',
                      targetId: swapId,
                      targetName: `Swap #${swapId.slice(0, 8)}`,
                      reason,
                      details: 'Dispute submitted by user from dashboard workspace.',
                      status: 'pending',
                      createdAt: 'Just now',
                    };
                    setReports(prev => [newRep, ...prev]);
                    showToast("Dispute reported to platform moderators.", "info");
                  }}
                  onOpenUserProfile={(user) => {
                    setSelectedUserProfile(user);
                    setIsProfileModalOpen(true);
                  }}
                  allUsers={allUsers}
                />
              </motion.div>
            )}

            {/* View 3: My Profile & Skills Editor */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MyProfileEditor
                  user={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                  onSaveToast={() => showToast("Profile settings saved!")}
                />
              </motion.div>
            )}

            {/* View 4: Admin Portal */}
            {activeTab === 'admin' && (
              <motion.div
                key="admin-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AdminPortal
                  currentUser={currentUser}
                  allUsers={allUsers}
                  swaps={swaps}
                  reports={reports}
                  announcements={announcements}
                  onUpdateUserStatus={handleUpdateUserStatus}
                  onResolveReport={handleResolveReport}
                  onPublishAnnouncement={handlePublishAnnouncement}
                  onDeleteAnnouncement={handleDeleteAnnouncement}
                  onOpenUserProfile={(user) => {
                    setSelectedUserProfile(user);
                    setIsProfileModalOpen(true);
                  }}
                  onExportCsv={() => exportSwapsToCsv(swaps)}
                  onBanUserRpc={handleBanUserRpc}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* Interactive Modals */}
      {/* ========================================================================= */}

      {/* 1. User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedUserProfile}
        currentUser={currentUser}
        onInitiateSwap={(user) => handleOpenProposeModal(user)}
      />

      {/* 2. Propose Swap Modal */}
      <ProposeSwapModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
        currentUser={currentUser}
        targetUser={proposeSwapTargetUser}
        initialTargetSkillName={proposeSwapInitialSkill}
        onSubmitProposal={handleSubmitProposal}
      />

      {/* 3. Swap Collaborative Workspace Modal */}
      <SwapWorkspaceModal
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        swap={activeWorkspaceSwap}
        currentUser={currentUser}
        onSendMessage={handleWorkspaceSendMessage}
        onToggleObjective={handleWorkspaceToggleObjective}
        onAddObjective={handleWorkspaceAddObjective}
        onUpdateSharedNotes={handleWorkspaceUpdateNotes}
        onCompleteSwap={handleWorkspaceCompleteSwap}
      />

      {/* 4. Rating & Review Feedback Modal */}
      <RatingFeedbackModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        swap={activeReviewSwap}
        currentUser={currentUser}
        onSubmitReview={handleSubmitReview}
      />

      {/* 5. Supabase Auth & Persona Switcher Modal */}
      <SupabaseAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(uProfile) => {
          if (uProfile.id) {
            const found = allUsers.find(u => u.id === uProfile.id);
            if (found) {
              setCurrentUser(found);
            } else {
              const newUser: UserProfile = {
                ...INITIAL_USERS[0],
                id: uProfile.id,
                name: uProfile.name || 'Swapper',
                email: uProfile.email || 'user@example.com',
                role: uProfile.role || 'user',
              };
              setAllUsers(prev => [newUser, ...prev]);
              setCurrentUser(newUser);
            }
          }
        }}
        onSelectDemoUser={(user) => {
          setCurrentUser(user);
          showToast(`Switched persona to ${user.name}`);
        }}
        allUsers={allUsers}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold backdrop-blur-md border ${
              toastMessage.type === 'warn'
                ? 'bg-amber-950/95 text-amber-50 border-amber-800'
                : toastMessage.type === 'info'
                ? 'bg-stone-900/95 text-white border-stone-800'
                : 'bg-emerald-950/95 text-emerald-50 border-emerald-800'
            }`}
          >
            {toastMessage.type === 'warn' ? (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            ) : toastMessage.type === 'info' ? (
              <Info className="w-4 h-4 text-sky-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Footer */}
      <footer className="mt-16 py-8 border-t border-stone-200 bg-white/60 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-700 text-white flex items-center justify-center font-bold text-xs">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block">SkillSwap Platform</span>
              <span className="text-[11px] text-stone-400">Peer-to-Peer Knowledge & Skill Exchange</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Connected to Supabase PostgreSQL
            </span>
            <span>•</span>
            <span>RLS Enabled</span>
            <span>•</span>
            <span>GIN Index Indexed</span>
          </div>

          <p className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} SkillSwap Inc. Free Peer Learning Network.
          </p>
        </div>
      </footer>
    </div>
  );
}
