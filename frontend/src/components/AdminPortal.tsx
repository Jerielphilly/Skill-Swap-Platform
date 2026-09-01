import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Repeat, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Ban, 
  Check, 
  X, 
  Megaphone, 
  Layers, 
  SlidersHorizontal, 
  Flame, 
  Plus, 
  Trash2, 
  Lock, 
  Tag,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { 
  UserProfile, 
  SwapRequest, 
  AdminReport, 
  PlatformAnnouncement,
  SkillCategoryDefinition
} from '../types';
import { SKILL_CATEGORIES } from '../mockData';
import { exportSwapsToCsv } from '../services/supabaseService';

interface Props {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  swaps: SwapRequest[];
  reports: AdminReport[];
  announcements: PlatformAnnouncement[];
  onUpdateUserStatus: (userId: string, updates: Partial<UserProfile>) => void;
  onResolveReport: (reportId: string, actionTaken: string) => void;
  onPublishAnnouncement: (announcement: Omit<PlatformAnnouncement, 'id'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onOpenUserProfile: (user: UserProfile) => void;
  onExportCsv?: () => void;
  onBanUserRpc?: (userId: string) => Promise<void>;
}

export const AdminPortal: React.FC<Props> = ({
  currentUser,
  allUsers,
  swaps,
  reports,
  announcements,
  onUpdateUserStatus,
  onResolveReport,
  onPublishAnnouncement,
  onDeleteAnnouncement,
  onOpenUserProfile,
  onExportCsv,
  onBanUserRpc,
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'disputes' | 'skills' | 'announcements'>('overview');
  const [userSearch, setUserSearch] = useState('');
  
  // Announcement drafting state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<PlatformAnnouncement['type']>('event');

  // Stats calculation
  const totalSwappers = allUsers.length;
  const activeSwapsCount = swaps.filter(s => s.status === 'in_progress').length;
  const completedSwapsCount = swaps.filter(s => s.status === 'completed').length;
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    onPublishAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      type: annType,
      isActive: true,
      date: 'Just now',
      author: currentUser.name,
    });

    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-stone-900 to-rose-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                SkillSwap Admin & Moderation Console
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white uppercase">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-rose-200 mt-0.5">
              Review platform reports, manage user verification, resolve swap disputes, and broadcast community alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onExportCsv) {
                onExportCsv();
              } else {
                exportSwapsToCsv(swaps);
              }
            }}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md shadow-sm"
            title="Download CSV report of all swaps"
          >
            <Download className="w-4 h-4 text-rose-300" />
            <span>Export Swaps CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Swappers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-stone-900 block">{totalSwappers}</span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">100% active standing</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Swaps</span>
            <Repeat className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-extrabold text-stone-900 block">{activeSwapsCount}</span>
          <span className="text-[11px] text-indigo-700 font-semibold mt-1 block">Across 8 categories</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Trades</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-stone-900 block">{completedSwapsCount}</span>
          <span className="text-[11px] text-stone-500 font-semibold mt-1 block">Average 4.95★ rating</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Reports</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-extrabold text-rose-700 block">{pendingReportsCount}</span>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Action required</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-stone-200">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            adminTab === 'overview'
              ? 'border-rose-900 text-rose-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Moderation Dashboard
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            adminTab === 'users'
              ? 'border-rose-900 text-rose-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          User Management ({allUsers.length})
        </button>

        <button
          onClick={() => setAdminTab('disputes')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'disputes'
              ? 'border-rose-900 text-rose-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Disputes & Reports</span>
          {pendingReportsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
              {pendingReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('skills')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            adminTab === 'skills'
              ? 'border-rose-900 text-rose-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Skill Catalog Taxonomy
        </button>

        <button
          onClick={() => setAdminTab('announcements')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            adminTab === 'announcements'
              ? 'border-rose-900 text-rose-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Platform Announcements ({announcements.length})
        </button>
      </div>

      {/* TAB: Overview / Recent activity */}
      {adminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Flagged Reports */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Urgent Reports Queue
              </h3>
              <span className="text-xs text-rose-600 font-semibold">{pendingReportsCount} pending</span>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Target: {rep.targetName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      rep.status === 'pending' ? 'bg-rose-200 text-rose-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-rose-900 font-medium">{rep.reason}</p>
                  <p className="text-xs text-stone-600">{rep.details}</p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                    <span>Reported by <strong>{rep.reporterName}</strong></span>
                    {rep.status === 'pending' && (
                      <button
                        onClick={() => onResolveReport(rep.id, 'Warned target user and flagged record.')}
                        className="px-3 py-1 bg-stone-900 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                      >
                        Resolve Report
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform Controls */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-stone-600" />
              Community Health & Moderation Policy
            </h3>

            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">1. Zero Monetary Transactions</span>
                <p>SkillSwap strictly enforces knowledge exchange only. Any solicitations for crypto or paid external courses are auto-flagged.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">2. Punctuality & Respect Policy</span>
                <p>Users who ghost confirmed 1-on-1 swap video sessions receive warning strikes on their verified profile.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">3. Peer Review Integrity</span>
                <p>Reviews can only be submitted for completed swap requests with confirmed mutual message exchanges.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB: User Management Table */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs space-y-4">
          
          <div className="p-6 pb-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">User Moderation Roster</h3>
              <p className="text-xs text-stone-500">Search members, verify credentials, issue warnings, or restrict platform access.</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user..."
                className="pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-y border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Swaps</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span 
                            onClick={() => onOpenUserProfile(u)}
                            className="font-bold text-stone-900 hover:text-emerald-700 cursor-pointer block"
                          >
                            {u.name}
                          </span>
                          <span className="text-[10px] text-stone-400">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-800">
                      ★ {u.rating.toFixed(2)} ({u.reviewsCount})
                    </td>

                    <td className="py-3.5 px-4 text-stone-700 font-medium">
                      {u.completedSwapsCount} completed
                    </td>

                    <td className="py-3.5 px-4">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Suspended
                        </span>
                      ) : u.isVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Verified */}
                        <button
                          onClick={() => onUpdateUserStatus(u.id, { isVerified: !u.isVerified })}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                            u.isVerified
                              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {u.isVerified ? 'Unverify' : 'Verify'}
                        </button>

                        {/* Ban / Unban */}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => onUpdateUserStatus(u.id, { isBanned: !u.isBanned })}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                              u.isBanned
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                            }`}
                          >
                            {u.isBanned ? 'Unban' : 'Suspend'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB: Disputes & Reports */}
      {adminTab === 'disputes' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Disputed Swaps & Incident Reports
            </h3>
            <p className="text-xs text-stone-500">
              Investigate non-responsive swappers, content violations, or unfulfilled reciprocal agreements.
            </p>
          </div>

          <div className="space-y-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-800 uppercase">
                      Type: {rep.targetType}
                    </span>
                    <span className="font-bold text-xs text-stone-900">{rep.targetName}</span>
                  </div>

                  <span className="text-[10px] text-stone-400">
                    Reported {rep.createdAt} by {rep.reporterName}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                  <span className="font-bold text-rose-800 block">Incident Reason: {rep.reason}</span>
                  <p className="text-stone-600 leading-relaxed">{rep.details}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className={`text-xs font-semibold ${
                    rep.status === 'resolved' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    Status: {rep.status.toUpperCase()} {rep.actionTaken && `(${rep.actionTaken})`}
                  </span>

                  {rep.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onResolveReport(rep.id, 'Dismissed as non-actionable misunderstanding.')}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => onResolveReport(rep.id, 'Issued formal warning to target account.')}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                      >
                        Issue Warning & Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Skill Catalog Taxonomy */}
      {adminTab === 'skills' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Curated Skill Taxonomy & Categories
            </h3>
            <p className="text-xs text-stone-500">
              Overview of active platform domains and popular peer skill tags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">{cat.name}</span>
                  <span className="text-[10px] text-stone-400">{cat.popularSkills.length} Featured</span>
                </div>
                <p className="text-xs text-stone-500">{cat.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {cat.popularSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-[10px] text-stone-700 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Announcements Publisher */}
      {adminTab === 'announcements' && (
        <div className="space-y-6">
          
          {/* Draft Form */}
          <div className="bg-rose-50/40 rounded-3xl border border-rose-200/80 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-rose-700" />
              <h3 className="text-sm font-bold text-stone-900">
                Broadcast New Platform Announcement
              </h3>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. 🎉 Community Hackathon & Knowledge Sprint"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Banner Category
                  </label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                  >
                    <option value="event">Event / Community Challenge</option>
                    <option value="feature">New Feature Release</option>
                    <option value="info">General Info</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                  Announcement Body
                </label>
                <textarea
                  rows={2}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Details for all members visiting the platform..."
                  className="w-full text-xs bg-white border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-rose-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Publish Banner to All Members</span>
              </button>
            </form>
          </div>

          {/* Active Announcements List */}
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">{a.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                      {a.type}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">{a.content}</p>
                  <span className="text-[10px] text-stone-400 block pt-1">
                    Published {a.date} by {a.author}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteAnnouncement(a.id)}
                  className="text-stone-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
