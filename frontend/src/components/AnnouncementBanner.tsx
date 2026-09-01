import React, { useState } from 'react';
import { Sparkles, X, Megaphone, ShieldCheck, Calendar } from 'lucide-react';
import { PlatformAnnouncement } from '../types';

interface Props {
  announcements: PlatformAnnouncement[];
}

export const AnnouncementBanner: React.FC<Props> = ({ announcements }) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeAnnouncement = announcements.find(
    (a) => a.isActive && !dismissedIds.includes(a.id)
  );

  if (!activeAnnouncement) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs py-2.5 px-4 sm:px-6 relative shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            {activeAnnouncement.type === 'event' && <Calendar className="w-3.5 h-3.5 text-emerald-200" />}
            {activeAnnouncement.type === 'feature' && <Sparkles className="w-3.5 h-3.5 text-emerald-200" />}
            {activeAnnouncement.type === 'info' && <Megaphone className="w-3.5 h-3.5 text-emerald-200" />}
            {activeAnnouncement.type === 'maintenance' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />}
          </div>
          <p className="truncate">
            <span className="font-bold mr-1.5">{activeAnnouncement.title}</span>
            <span className="text-emerald-100 hidden sm:inline">{activeAnnouncement.content}</span>
          </p>
        </div>

        <button
          onClick={() => setDismissedIds((prev) => [...prev, activeAnnouncement.id])}
          className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          title="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
