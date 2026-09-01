import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ThumbsUp, 
  Award, 
  HeartHandshake,
  Send
} from 'lucide-react';
import { SwapRequest, UserProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  swap: SwapRequest | null;
  currentUser: UserProfile;
  onSubmitReview: (swapId: string, reviewData: {
    rating: number;
    comment: string;
    badges: string[];
    punctualityScore: number;
    clarityScore: number;
  }) => void;
}

const AVAILABLE_BADGES = [
  'Super Clear Explanations',
  'Patient & Encouraging',
  'Deep Technical Knowledge',
  'Punctual & Prepared',
  'Actionable Homework',
  'Inspiring Mentor',
  'Great Code Reviewer',
];

export const RatingFeedbackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  swap,
  currentUser,
  onSubmitReview,
}) => {
  if (!isOpen || !swap) return null;

  const isSender = swap.senderId === currentUser.id;
  const partnerName = isSender ? swap.receiverName : swap.senderName;
  const partnerAvatar = isSender ? swap.receiverAvatar : swap.senderAvatar;
  const skillLearned = isSender ? swap.requestedSkill.name : swap.offeredSkill.name;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([
    'Super Clear Explanations',
    'Patient & Encouraging',
  ]);
  const [punctualityScore, setPunctualityScore] = useState(5);
  const [clarityScore, setClarityScore] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleBadge = (badge: string) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter(b => b !== badge));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReview(swap.id, {
        rating,
        comment: comment.trim(),
        badges: selectedBadges,
        punctualityScore,
        clarityScore,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[32px] border border-stone-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-stone-100 flex items-center justify-between gap-4 bg-stone-50/80">
          <div className="flex items-center gap-3">
            <img
              src={partnerAvatar}
              alt={partnerName}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/30"
            />
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Rate Knowledge Swap
              </h2>
              <p className="text-xs text-stone-500">
                Review your session with <strong className="text-stone-800">{partnerName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Star Rating Select */}
          <div className="text-center py-2 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
              Overall Experience (Skill: {skillLearned})
            </span>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full inline-block border border-amber-200">
              {rating === 5 && '🌟 Exceptional Mentor & Clear Knowledge Transfer'}
              {rating === 4 && '👍 Great Productive Session'}
              {rating === 3 && '👌 Satisfactory Trade'}
              {rating <= 2 && '⚠️ Needs Improvement'}
            </span>
          </div>

          {/* Endorsement Badges */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Award Mentor Endorsements:
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_BADGES.map((badge) => {
                const isSelected = selectedBadges.includes(badge);
                return (
                  <button
                    type="button"
                    key={badge}
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {badge}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Feedback / Testimonial */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Public Testimonial & Review Note
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share what you learned from ${partnerName.split(' ')[0]}, how the session was structured, and why you would recommend them to other peers...`}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
            />
          </div>

        </form>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Skip for now
          </button>

          <button
            type="button"
            disabled={isSubmitting || !comment.trim()}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
