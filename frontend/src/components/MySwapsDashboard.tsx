import React, { useState } from 'react';
import { 
  Repeat, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Video, 
  Calendar, 
  ArrowRight, 
  Star, 
  ShieldAlert, 
  Sparkles,
  Layers,
  Check,
  X,
  Send,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { SwapRequest, SwapStatus, UserProfile } from '../types';

interface Props {
  currentUser: UserProfile;
  swaps: SwapRequest[];
  onAcceptSwap: (swapId: string) => void;
  onRejectSwap: (swapId: string) => void;
  onOpenWorkspace: (swap: SwapRequest) => void;
  onOpenReviewModal: (swap: SwapRequest) => void;
  onDisputeSwap: (swapId: string, reason: string) => void;
  onOpenUserProfile: (user: UserProfile) => void;
  allUsers: UserProfile[];
}

export const MySwapsDashboard: React.FC<Props> = ({
  currentUser,
  swaps,
  onAcceptSwap,
  onRejectSwap,
  onOpenWorkspace,
  onOpenReviewModal,
  onDisputeSwap,
  onOpenUserProfile,
  allUsers,
}) => {
  const [statusFilter, setStatusFilter] = useState<SwapStatus | 'all' | 'pending_incoming' | 'pending_outgoing'>('all');
  const [disputingSwapId, setDisputingSwapId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  // Filter swaps relevant to current user
  const userSwaps = swaps.filter(
    (s) => s.senderId === currentUser.id || s.receiverId === currentUser.id
  );

  const pendingIncoming = userSwaps.filter(
    (s) => s.receiverId === currentUser.id && s.status === 'pending'
  );
  const pendingOutgoing = userSwaps.filter(
    (s) => s.senderId === currentUser.id && s.status === 'pending'
  );
  const inProgress = userSwaps.filter((s) => s.status === 'in_progress');
  const completed = userSwaps.filter((s) => s.status === 'completed');

  const filteredSwaps = userSwaps.filter((s) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending_incoming') {
      return s.receiverId === currentUser.id && s.status === 'pending';
    }
    if (statusFilter === 'pending_outgoing') {
      return s.senderId === currentUser.id && s.status === 'pending';
    }
    return s.status === statusFilter;
  });

  const handleSendDispute = (swapId: string) => {
    if (!disputeReason.trim()) return;
    onDisputeSwap(swapId, disputeReason);
    setDisputingSwapId(null);
    setDisputeReason('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Knowledge Swaps
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track incoming proposals, ongoing learning sessions, and completed skill trades.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-white border border-stone-200 shadow-2xs text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              In Progress
            </span>
            <span className="text-base font-extrabold text-emerald-800">
              {inProgress.length}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-white border border-stone-200 shadow-2xs text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Pending
            </span>
            <span className="text-base font-extrabold text-amber-600">
              {pendingIncoming.length + pendingOutgoing.length}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-white border border-stone-200 shadow-2xs text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Completed
            </span>
            <span className="text-base font-extrabold text-stone-900">
              {completed.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-stone-200">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          All Swaps ({userSwaps.length})
        </button>

        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'in_progress'
              ? 'border-emerald-600 text-emerald-900 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Sessions ({inProgress.length})</span>
        </button>

        <button
          onClick={() => setStatusFilter('pending_incoming')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'pending_incoming'
              ? 'border-amber-600 text-amber-900 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Incoming Requests</span>
          {pendingIncoming.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingIncoming.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setStatusFilter('pending_outgoing')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            statusFilter === 'pending_outgoing'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Outgoing Sent ({pendingOutgoing.length})
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            statusFilter === 'completed'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Completed Trades ({completed.length})
        </button>
      </div>

      {/* Swap Cards List */}
      {filteredSwaps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
            <Repeat className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">
            No swap requests in this view
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed mb-4">
            Browse the skill discovery hub to explore passionate peers and propose your next knowledge exchange!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => {
            const isSender = swap.senderId === currentUser.id;
            const partnerName = isSender ? swap.receiverName : swap.senderName;
            const partnerAvatar = isSender ? swap.receiverAvatar : swap.senderAvatar;
            const partnerHeadline = isSender ? swap.receiverHeadline : swap.senderHeadline;
            const partnerId = isSender ? swap.receiverId : swap.senderId;
            const partnerObj = allUsers.find(u => u.id === partnerId);

            // What I Teach vs What I Learn in this swap
            const whatITeach = isSender ? swap.offeredSkill : swap.requestedSkill;
            const whatILearn = isSender ? swap.requestedSkill : swap.offeredSkill;

            return (
              <div
                key={swap.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  swap.status === 'in_progress'
                    ? 'border-emerald-300 ring-1 ring-emerald-400/20'
                    : swap.status === 'pending'
                    ? 'border-amber-200'
                    : 'border-stone-200'
                }`}
              >
                {/* Header Status Bar */}
                <div className="p-6 pb-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Partner snippet */}
                  <div className="flex items-center gap-3">
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-stone-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => partnerObj && onOpenUserProfile(partnerObj)}
                          className="text-xs sm:text-sm font-bold text-stone-900 hover:text-emerald-700 cursor-pointer transition-colors"
                        >
                          {partnerName}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          ({isSender ? 'Outgoing proposal' : 'Incoming proposal'})
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        {partnerHeadline}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {swap.status === 'in_progress' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Live In-Progress Session
                      </span>
                    )}

                    {swap.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Agreement
                      </span>
                    )}

                    {swap.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Exchange Completed
                      </span>
                    )}

                    {swap.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Declined
                      </span>
                    )}
                  </div>

                </div>

                {/* Exchange Breakdown Body */}
                <div className="p-6 space-y-4">
                  
                  {/* Two Columns: You Teach ⇄ You Learn */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* You Teach Card */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                        You Teach {partnerName.split(' ')[0]}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                        {whatITeach.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-emerald-900">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-semibold">
                          Level: {whatITeach.level}
                        </span>
                        <span>{whatITeach.category}</span>
                      </div>
                    </div>

                    {/* You Learn Card */}
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                        You Learn from {partnerName.split(' ')[0]}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                        {whatILearn.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-indigo-900">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-[10px] font-semibold">
                          Level: {whatILearn.level}
                        </span>
                        <span>{whatILearn.category}</span>
                      </div>
                    </div>

                  </div>

                  {/* Schedule & Notes */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Video className="w-4 h-4 text-stone-400" />
                      <span className="font-semibold">{swap.sessionFormat}</span>
                      <span>•</span>
                      <span className="text-stone-500">{swap.proposedSchedule}</span>
                    </div>

                    <span className="text-[11px] text-stone-400">
                      Initiated {swap.createdAt}
                    </span>
                  </div>

                  {/* Initial Message quote */}
                  {swap.initialMessage && (
                    <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200 text-xs text-stone-700 leading-relaxed italic">
                      "{swap.initialMessage}"
                    </div>
                  )}

                  {/* Dispute Banner if flagged */}
                  {swap.isDisputed && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span><strong>Dispute Flagged:</strong> {swap.disputeReason}</span>
                      </div>
                      <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold">
                        Under Admin Review
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="p-4 sm:px-6 bg-stone-50 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Left: Report / Dispute or details */}
                  <div>
                    {!swap.isDisputed && swap.status !== 'rejected' && (
                      <button
                        onClick={() => setDisputingSwapId(disputingSwapId === swap.id ? null : swap.id)}
                        className="text-[11px] text-stone-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Report / Dispute</span>
                      </button>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    
                    {/* Incoming Pending Actions */}
                    {!isSender && swap.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onRejectSwap(swap.id)}
                          className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 text-stone-500" />
                          <span>Decline</span>
                        </button>

                        <button
                          onClick={() => onAcceptSwap(swap.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Swap Agreement</span>
                        </button>
                      </>
                    )}

                    {/* Outgoing Pending Action */}
                    {isSender && swap.status === 'pending' && (
                      <button
                        onClick={() => onRejectSwap(swap.id)}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-200 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel Proposal
                      </button>
                    )}

                    {/* In Progress Action: Open Workspace */}
                    {swap.status === 'in_progress' && (
                      <button
                        onClick={() => onOpenWorkspace(swap)}
                        className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open Live Workspace & Chat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Completed Action: Leave Feedback */}
                    {swap.status === 'completed' && (
                      <button
                        onClick={() => onOpenReviewModal(swap)}
                        className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>Rate & Review Session</span>
                      </button>
                    )}

                  </div>

                </div>

                {/* Dispute Form Drawer */}
                {disputingSwapId === swap.id && (
                  <div className="p-4 bg-rose-50/70 border-t border-rose-200 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in">
                    <input
                      type="text"
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      placeholder="Reason for dispute (e.g., No-show, inappropriate conduct, unfulfilled trade terms)..."
                      className="flex-1 text-xs bg-white border border-rose-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setDisputingSwapId(null)}
                        className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendDispute(swap.id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                      >
                        Submit to Moderation
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
