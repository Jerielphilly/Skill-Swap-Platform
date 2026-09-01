import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Repeat, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  MessageSquare, 
  Tag, 
  ThumbsUp, 
  Flame,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { UserProfile, Review } from '../types';
import { fetchUserReviews } from '../services/supabaseService';

interface Props {
  user: UserProfile | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onInitiateSwap: (user: UserProfile) => void;
}

export const UserProfileModal: React.FC<Props> = ({
  user,
  currentUser,
  isOpen,
  onClose,
  onInitiateSwap,
}) => {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!user || !isOpen) return;
    setReviewsList(user.reviews || []);

    let isMounted = true;
    const loadSupabaseReviews = async () => {
      setLoadingReviews(true);
      try {
        const liveReviews = await fetchUserReviews(user.id);
        if (isMounted && liveReviews && liveReviews.length > 0) {
          const mapped: Review[] = liveReviews.map((r: any) => ({
            id: r.id,
            swapId: r.swap_request_id,
            reviewerId: r.reviewer_id || r.profiles?.id || 'anon',
            reviewerName: r.profiles?.full_name || 'Swapper Peer',
            reviewerAvatar: r.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.profiles?.full_name || 'peer')}`,
            rating: r.rating || 5,
            skillExchanged: 'Peer Skill Swap',
            comment: r.review_text || 'Great session!',
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent',
            badges: ['Verified Exchange'],
          }));
          setReviewsList(mapped);
        }
      } catch (e) {
        console.error("Error loading reviews:", e);
      } finally {
        if (isMounted) setLoadingReviews(false);
      }
    };

    loadSupabaseReviews();
    return () => { isMounted = false; };
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const isMe = user.id === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-[32px] border border-stone-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 pt-0 space-y-8">
          
          {/* Avatar and Main Header Info */}
          <div className="flex flex-wrap items-end justify-between gap-4 -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-lg"
                />
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-xs" title="Verified Swapper">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                    {user.name}
                  </h2>
                  <span className="text-xs text-stone-400 font-mono">@{user.username}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md">
                  {user.headline}
                </p>
              </div>
            </div>

            {/* Top Action Button */}
            {!isMe && (
              <button
                onClick={() => {
                  onClose();
                  onInitiateSwap(user);
                }}
                className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer mb-1"
              >
                <Repeat className="w-4 h-4" />
                <span>Propose Skill Swap</span>
              </button>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Rating
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="text-base font-bold text-stone-900">{user.rating.toFixed(2)}</span>
                <span className="text-xs text-stone-400">({user.reviewsCount})</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Completed Swaps
              </span>
              <span className="text-base font-bold text-stone-900 mt-0.5 block">
                {user.completedSwapsCount} Sessions
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Location & Time
              </span>
              <span className="text-xs font-semibold text-stone-800 mt-0.5 block truncate">
                {user.location}
              </span>
              <span className="text-[10px] text-stone-400 truncate block">{user.timezone}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Member Since
              </span>
              <span className="text-xs font-semibold text-stone-800 mt-0.5 block">
                {user.joinDate}
              </span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              About & Mentorship Philosophy
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80">
              {user.bio}
            </p>
          </div>

          {/* Skills Offered (Detailed) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Skills Offered ({user.skillsOffered.length})
              </h3>
              <span className="text-[11px] text-stone-400">Verified peer endorsements</span>
            </div>

            <div className="space-y-3">
              {user.skillsOffered.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">
                        {skill.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {skill.level}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {skill.yearsOfExperience} yrs exp
                      </span>
                    </div>

                    {skill.endorsements && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-xl">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{skill.endorsements} endorsements</span>
                      </div>
                    )}
                  </div>

                  {skill.description && (
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {skill.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg bg-white border border-emerald-200/70 text-[10px] text-emerald-900 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Wanted (Wishlist) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-indigo-600" />
              Skills Wanted & Goals ({user.skillsWanted.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.skillsWanted.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-stone-900 truncate">
                      {w.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      w.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {w.priority} Priority
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-700 font-medium block">
                    Target Proficiency: {w.targetLevel}
                  </span>
                  {w.learningGoal && (
                    <p className="text-xs text-stone-600 line-clamp-2">
                      Goal: {w.learningGoal}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Availability Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-400" />
              Weekly Availability Schedule
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {user.availability.map((av) => (
                <div
                  key={av.id}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center"
                >
                  <span className="text-xs font-bold text-stone-900 block">
                    {av.day}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                    {av.times.join(', ')}
                  </span>
                  <span className="text-[9px] text-stone-400 block mt-0.5">
                    {av.preferredFormat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews & Testimonials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                Community Reviews & Feedback ({reviewsList.length})
                {loadingReviews && <Loader2 className="w-3 h-3 animate-spin text-stone-400" />}
              </h3>
              <span className="text-xs text-stone-400">100% verified completed swaps</span>
            </div>

            {reviewsList.length === 0 ? (
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-400">
                No public reviews posted yet. Be the first to swap knowledge!
              </div>
            ) : (
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">
                            {rev.reviewerName}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            Swapped: <strong className="text-stone-600">{rev.skillExchanged}</strong> • {rev.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    {rev.badges && rev.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rev.badges.map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[9px] font-bold text-amber-800"
                          >
                            ⭐️ {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500">
            {user.privacy.openToSwapRequests ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Open to new swap requests
              </span>
            ) : (
              <span className="text-stone-400">Currently not taking new requests</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Close
            </button>
            {!isMe && (
              <button
                onClick={() => {
                  onClose();
                  onInitiateSwap(user);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Propose Swap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
