import React, { useState } from 'react';
import { 
  X, 
  Repeat, 
  CheckCircle2, 
  Calendar, 
  Video, 
  MessageSquare, 
  Code, 
  MapPin, 
  Send, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { UserProfile, SessionFormat, SkillLevel, SkillCategory } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  targetUser: UserProfile | null;
  initialTargetSkillName?: string;
  onSubmitProposal: (proposalData: {
    targetUser: UserProfile;
    offeredSkill: { name: string; level: SkillLevel; category: SkillCategory };
    requestedSkill: { name: string; level: SkillLevel; category: SkillCategory };
    sessionFormat: SessionFormat;
    proposedSchedule: string;
    initialMessage: string;
  }) => void;
}

export const ProposeSwapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  targetUser,
  initialTargetSkillName,
  onSubmitProposal,
}) => {
  if (!isOpen || !targetUser) return null;

  // Selected skill to offer (from current user's skills)
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<number>(0);
  
  // Selected skill to learn (from target user's offered skills)
  const initialReqIndex = targetUser.skillsOffered.findIndex(
    s => s.name === initialTargetSkillName
  );
  const [selectedReqIndex, setSelectedReqIndex] = useState<number>(
    initialReqIndex >= 0 ? initialReqIndex : 0
  );

  const [sessionFormat, setSessionFormat] = useState<SessionFormat>('Video Call');
  const [proposedSchedule, setProposedSchedule] = useState('2x weekly sessions (e.g., Tuesday & Thursday evenings)');
  const [initialMessage, setInitialMessage] = useState(
    `Hi ${targetUser.name.split(' ')[0]}! I noticed your expertise and would love to exchange skills. Let me know if you would be interested in learning together!`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const mySkill = currentUser.skillsOffered[selectedOfferIndex] || {
      name: 'General Consultation & Coaching',
      level: 'Intermediate' as SkillLevel,
      category: 'Programming & Tech' as SkillCategory,
    };

    const theirSkill = targetUser.skillsOffered[selectedReqIndex] || {
      name: 'Custom Skill Mentorship',
      level: 'Intermediate' as SkillLevel,
      category: 'Programming & Tech' as SkillCategory,
    };

    setTimeout(() => {
      onSubmitProposal({
        targetUser,
        offeredSkill: {
          name: mySkill.name,
          level: mySkill.level,
          category: mySkill.category,
        },
        requestedSkill: {
          name: theirSkill.name,
          level: theirSkill.level,
          category: theirSkill.category,
        },
        sessionFormat,
        proposedSchedule,
        initialMessage,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[32px] border border-stone-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-100 flex items-center justify-between gap-4 bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Propose Skill Swap
              </h2>
              <p className="text-xs text-stone-500">
                Exchange knowledge with <strong className="text-stone-800">{targetUser.name}</strong>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Mutual Exchange Summary Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* You Offer */}
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                What You Teach
              </span>
              <span className="font-bold text-xs sm:text-sm text-stone-900 block mt-0.5">
                {currentUser.skillsOffered[selectedOfferIndex]?.name || 'Select a skill'}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                {currentUser.name}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Repeat className="w-4 h-4" />
            </div>

            {/* They Teach */}
            <div className="flex-1 text-center sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                What You Learn
              </span>
              <span className="font-bold text-xs sm:text-sm text-stone-900 block mt-0.5">
                {targetUser.skillsOffered[selectedReqIndex]?.name || 'Select a skill'}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                {targetUser.name}
              </span>
            </div>

          </div>

          {/* Step 1: Select Your Skill to Offer */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              1. Choose what you will teach {targetUser.name.split(' ')[0]}:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {currentUser.skillsOffered.map((skill, idx) => {
                const isSelected = selectedOfferIndex === idx;
                return (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedOfferIndex(idx)}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>
                      <span className="block">{skill.name}</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        Level: {skill.level} • {skill.category}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Skill You Want to Learn */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              2. Choose what you want to learn from {targetUser.name.split(' ')[0]}:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {targetUser.skillsOffered.map((skill, idx) => {
                const isSelected = selectedReqIndex === idx;
                return (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedReqIndex(idx)}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>
                      <span className="block">{skill.name}</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        Level: {skill.level} • {skill.yearsOfExperience} yrs experience
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Preferred Format & Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Session Format
              </label>
              <select
                value={sessionFormat}
                onChange={(e) => setSessionFormat(e.target.value as SessionFormat)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Video Call">1-on-1 Video Call (Google Meet / Zoom)</option>
                <option value="Live Chat">Live Text Chat & Async Sandbox</option>
                <option value="Code / Design Review">Code / Design Review & Handoff</option>
                <option value="In-Person">In-Person (Local Coffee / Co-working)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Proposed Schedule & Rhythm
              </label>
              <input
                type="text"
                value={proposedSchedule}
                onChange={(e) => setProposedSchedule(e.target.value)}
                placeholder="e.g. 2x weekly sessions on Tuesday & Thursday"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Step 4: Personal Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Introductory Message & Learning Goals
            </label>
            <textarea
              rows={3}
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Introduce your background, specific project goals, and what you are excited to build..."
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
            />
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Swap Request</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
