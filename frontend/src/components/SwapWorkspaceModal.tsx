import React, { useState } from 'react';
import { 
  X, 
  Video, 
  ExternalLink, 
  CheckCircle2, 
  Send, 
  Plus, 
  FileText, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  Check, 
  Repeat, 
  ShieldCheck,
  Paperclip,
  Smile
} from 'lucide-react';
import { SwapRequest, UserProfile, ChatMessage } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  swap: SwapRequest | null;
  currentUser: UserProfile;
  onSendMessage: (swapId: string, text: string) => void;
  onToggleObjective: (swapId: string, objectiveId: string) => void;
  onAddObjective: (swapId: string, text: string) => void;
  onUpdateSharedNotes: (swapId: string, notes: string) => void;
  onCompleteSwap: (swapId: string) => void;
}

export const SwapWorkspaceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  swap,
  currentUser,
  onSendMessage,
  onToggleObjective,
  onAddObjective,
  onUpdateSharedNotes,
  onCompleteSwap,
}) => {
  if (!isOpen || !swap) return null;

  const isSender = swap.senderId === currentUser.id;
  const partnerName = isSender ? swap.receiverName : swap.senderName;
  const partnerAvatar = isSender ? swap.receiverAvatar : swap.senderAvatar;

  const [messageInput, setMessageInput] = useState('');
  const [newObjText, setNewObjText] = useState('');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'chat' | 'objectives' | 'notes'>('chat');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    onSendMessage(swap.id, messageInput.trim());
    setMessageInput('');
  };

  const handleAddObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjText.trim()) return;
    onAddObjective(swap.id, newObjText.trim());
    setNewObjText('');
  };

  const handleCopyMeeting = () => {
    navigator.clipboard?.writeText(swap.meetingLink || 'https://meet.skillswap.io/room-default');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const completedObjsCount = swap.objectives.filter(o => o.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-hidden">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl sm:rounded-[32px] border border-stone-200 shadow-2xl overflow-hidden h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Workspace Top Header Bar */}
        <div className="p-4 sm:px-6 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={partnerAvatar}
                alt={partnerName}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-500/50"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-stone-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Active Swap Session with {partnerName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {swap.sessionFormat}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {swap.offeredSkill.name} ⇄ {swap.requestedSkill.name}
              </p>
            </div>
          </div>

          {/* Meeting Room Launcher & Finish action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMeeting}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Join Video Call'}</span>
            </button>

            <button
              onClick={() => {
                onCompleteSwap(swap.id);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete Swap</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden items-center justify-between border-b border-stone-200 bg-stone-50 px-2 py-1">
          <button
            onClick={() => setActiveWorkspaceTab('chat')}
            className={`flex-1 py-2 text-xs font-bold text-center rounded-xl cursor-pointer ${
              activeWorkspaceTab === 'chat' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            Live Chat
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('objectives')}
            className={`flex-1 py-2 text-xs font-bold text-center rounded-xl cursor-pointer ${
              activeWorkspaceTab === 'objectives' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            Milestones ({completedObjsCount}/{swap.objectives.length})
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('notes')}
            className={`flex-1 py-2 text-xs font-bold text-center rounded-xl cursor-pointer ${
              activeWorkspaceTab === 'notes' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            Shared Notes
          </button>
        </div>

        {/* Main Workspace Split Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Panel: Objectives Checklist & Shared Notes (Desktop: 5 cols) */}
          <div className={`md:col-span-5 border-r border-stone-200 bg-stone-50 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-6 ${
            activeWorkspaceTab === 'chat' ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* Learning Milestones & Objectives */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Swap Milestones
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {completedObjsCount} / {swap.objectives.length} Done
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-700 h-full transition-all duration-300"
                  style={{
                    width: swap.objectives.length > 0 
                      ? `${(completedObjsCount / swap.objectives.length) * 100}%` 
                      : '0%'
                  }}
                />
              </div>

              {/* Objectives List */}
              <div className="space-y-2 pt-1">
                {swap.objectives.map((obj) => (
                  <div
                    key={obj.id}
                    onClick={() => onToggleObjective(swap.id, obj.id)}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                      obj.completed
                        ? 'bg-emerald-50/60 border-emerald-200 text-stone-500 line-through'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800 font-medium'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                      obj.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 bg-white'
                    }`}>
                      {obj.completed && <Check className="w-3 h-3" />}
                    </div>
                    <span className="flex-1 leading-snug">{obj.text}</span>
                  </div>
                ))}
              </div>

              {/* Add Objective form */}
              <form onSubmit={handleAddObj} className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={newObjText}
                  onChange={(e) => setNewObjText(e.target.value)}
                  placeholder="Add target milestone..."
                  className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Shared Session Notepad */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Mutual Resource Notepad
                  </span>
                </div>
                <span className="text-[10px] text-stone-400">Live Auto-saved</span>
              </div>

              <textarea
                value={swap.sharedNotes || ''}
                onChange={(e) => onUpdateSharedNotes(swap.id, e.target.value)}
                placeholder="Paste code snippets, Figma tokens, lesson homework, or YouTube links..."
                className="w-full flex-1 min-h-[140px] text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"
              />
            </div>

          </div>

          {/* Right Panel: Real-time Live Chat Stream (Desktop: 7 cols) */}
          <div className={`md:col-span-7 flex flex-col bg-white overflow-hidden ${
            activeWorkspaceTab !== 'chat' ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* Chat message history */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              <div className="text-center my-2">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-[10px] font-semibold text-stone-500">
                  Swap Room Active • End-to-End Peer Channel
                </span>
              </div>

              {swap.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />

                    <div className={`max-w-[78%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 px-1">
                        <span className="text-[10px] font-semibold text-stone-500">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <span className="text-[9px] text-stone-400">
                          {msg.timestamp}
                        </span>
                      </div>

                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-stone-900 text-white rounded-tr-none'
                          : 'bg-stone-100 text-stone-900 rounded-tl-none border border-stone-200'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${partnerName.split(' ')[0]} in this swap session...`}
                className="flex-1 text-xs bg-white border border-stone-200 rounded-2xl px-4 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
              />

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 rounded-2xl bg-stone-900 hover:bg-emerald-800 disabled:opacity-40 text-white transition-all shadow-xs cursor-pointer"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
