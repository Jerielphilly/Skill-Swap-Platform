import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Repeat, 
  Compass, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronDown, 
  LogOut, 
  SlidersHorizontal,
  ExternalLink,
  Users,
  Layers
} from 'lucide-react';
import { UserProfile, PlatformNotification } from '../types';

interface Props {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser?: (user: UserProfile) => void;
  onSwitchUser?: (user: UserProfile) => void;
  activeTab?: 'discover' | 'my-swaps' | 'profile' | 'admin';
  currentView?: 'discover' | 'my-swaps' | 'profile' | 'admin';
  onChangeTab?: (tab: 'discover' | 'my-swaps' | 'profile' | 'admin') => void;
  onNavigate?: (tab: 'discover' | 'my-swaps' | 'profile' | 'admin') => void;
  pendingSwapsCount?: number;
  pendingRequestsCount?: number;
  notifications?: PlatformNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onClearNotifications?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenMyProfile?: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onSwitchUser,
  activeTab,
  currentView,
  onChangeTab,
  onNavigate,
  pendingSwapsCount,
  pendingRequestsCount,
  notifications = [],
  onMarkNotificationRead,
  onClearNotifications,
  searchQuery = '',
  onSearchChange,
  onOpenMyProfile,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const active = activeTab || currentView || 'discover';
  const handleTabChange = (tab: 'discover' | 'my-swaps' | 'profile' | 'admin') => {
    if (onChangeTab) onChangeTab(tab);
    if (onNavigate) onNavigate(tab);
  };
  const handleUserSelect = (u: UserProfile) => {
    if (onSelectUser) onSelectUser(u);
    if (onSwitchUser) onSwitchUser(u);
  };
  const pendingCount = pendingSwapsCount ?? pendingRequestsCount ?? 0;
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => handleTabChange('discover')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
                <Repeat className="w-5 h-5 transition-transform group-hover:rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-stone-900 tracking-tight">
                    Skill<span className="text-emerald-700">Swap</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Peer v2.4
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium hidden md:block">
                  Knowledge Exchange & Mentorship
                </p>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleTabChange('discover')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active === 'discover'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Discover Skills</span>
              </button>

              <button
                onClick={() => handleTabChange('my-swaps')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                  active === 'my-swaps'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span>My Swaps</span>
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-bold animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabChange('profile')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active === 'profile'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile & Availability</span>
              </button>

              {/* Admin Portal Tab */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleTabChange('admin')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active === 'admin'
                      ? 'bg-rose-900 text-white shadow-xs'
                      : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Moderation</span>
                </button>
              )}
            </nav>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search skills, e.g., 'Rust', 'Figma', 'Japanese', 'Sourdough'..."
                className="w-full pl-9.5 pr-4 py-2 bg-stone-100 hover:bg-stone-100/80 focus:bg-white border border-stone-200 focus:border-emerald-600 rounded-2xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Tools & User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Role / User Switcher for testing */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-medium transition-all cursor-pointer"
                title="Switch test user / role"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-600/30"
                />
                <span className="hidden sm:inline-block font-semibold truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className={`hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  currentUser.role === 'admin'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentUser.role === 'admin' ? 'Admin' : 'Swapper'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {/* User Switcher Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Active User Profile
                    </span>
                    <span className="font-semibold text-xs text-stone-900 block truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[11px] text-stone-500 block truncate">
                      {currentUser.headline}
                    </span>
                  </div>

                  <div className="py-1">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Switch Demo Persona
                    </span>
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          handleUserSelect(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          u.id === currentUser.id
                            ? 'bg-emerald-50 text-emerald-900 font-semibold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{u.name}</span>
                            {u.role === 'admin' && (
                              <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1 rounded">
                                Admin
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 block truncate">
                            Offers: {u.skillsOffered[0]?.name || 'N/A'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        if (onOpenMyProfile) {
                          onOpenMyProfile();
                        } else {
                          handleTabChange('profile');
                        }
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-700 hover:bg-stone-100 font-medium cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
                      <span>Edit My Profile & Privacy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-2xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100">
                    <span className="font-bold text-xs text-stone-900">
                      Notifications ({unreadCount} unread)
                    </span>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && onClearNotifications && (
                        <button
                          onClick={onClearNotifications}
                          className="text-[10px] text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
                        >
                          Clear all
                        </button>
                      )}
                      <span className="text-[10px] text-stone-400">Platform Alerts</span>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-50">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-stone-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onMarkNotificationRead?.(n.id);
                            if (n.swapId) handleTabChange('my-swaps');
                            setShowNotifMenu(false);
                          }}
                          className={`p-3 rounded-xl transition-colors cursor-pointer ${
                            !n.read ? 'bg-emerald-50/60 hover:bg-emerald-50' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs font-semibold ${!n.read ? 'text-emerald-950' : 'text-stone-800'}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-stone-400 shrink-0">
                              {n.createdAt}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2.5 border-t border-stone-100 gap-1 overflow-x-auto">
          <button
            onClick={() => handleTabChange('discover')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center text-xs font-semibold shrink-0 cursor-pointer ${
              active === 'discover' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => handleTabChange('my-swaps')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center text-xs font-semibold shrink-0 relative cursor-pointer ${
              active === 'my-swaps' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            My Swaps
            {pendingCount > 0 && (
              <span className="ml-1 px-1 rounded-full bg-emerald-500 text-white text-[9px]">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange('profile')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center text-xs font-semibold shrink-0 cursor-pointer ${
              active === 'profile' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Profile
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-center text-xs font-semibold shrink-0 cursor-pointer ${
                active === 'admin' ? 'bg-rose-900 text-white' : 'text-rose-700 bg-rose-50'
              }`}
            >
              Admin
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
