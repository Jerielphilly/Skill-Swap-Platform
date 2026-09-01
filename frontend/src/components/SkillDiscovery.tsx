import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Star, 
  MapPin, 
  Clock, 
  Video, 
  MessageSquare, 
  Code, 
  CheckCircle2, 
  ArrowRight, 
  SlidersHorizontal,
  Flame,
  Zap,
  BookOpen,
  HelpCircle,
  Repeat
} from 'lucide-react';
import { UserProfile, SkillCategory, SkillLevel, SessionFormat } from '../types';
import { SKILL_CATEGORIES } from '../mockData';

interface Props {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onOpenUserProfile: (user: UserProfile) => void;
  onInitiateSwap: (targetUser: UserProfile, targetSkillName?: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const SkillDiscovery: React.FC<Props> = ({
  currentUser,
  allUsers,
  onOpenUserProfile,
  onInitiateSwap,
  searchQuery,
  onSearchChange,
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const activeSearchQuery = searchQuery !== undefined ? searchQuery : internalQuery;
  const handleQueryChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalQuery(val);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'All'>('All');
  const [selectedFormat, setSelectedFormat] = useState<SessionFormat | 'All'>('All');
  const [onlyMutualMatches, setOnlyMutualMatches] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Compute smart mutual match score between current user and a target user
  const calculateMatchInfo = (target: UserProfile) => {
    if (target.id === currentUser.id) return { score: 0, reason: '' };

    // My wanted skills that target offers
    const myWantedOfferedByTarget = currentUser.skillsWanted.filter(w => 
      target.skillsOffered.some(o => 
        o.name.toLowerCase().includes(w.name.toLowerCase()) || 
        w.name.toLowerCase().includes(o.name.toLowerCase()) ||
        o.category === w.category
      )
    );

    // Target's wanted skills that I offer
    const targetWantedOfferedByMe = target.skillsWanted.filter(tw => 
      currentUser.skillsOffered.some(co => 
        co.name.toLowerCase().includes(tw.name.toLowerCase()) || 
        tw.name.toLowerCase().includes(co.name.toLowerCase()) ||
        co.category === tw.category
      )
    );

    const isMutual = myWantedOfferedByTarget.length > 0 && targetWantedOfferedByMe.length > 0;
    
    let score = 70;
    if (myWantedOfferedByTarget.length > 0) score += 15;
    if (targetWantedOfferedByMe.length > 0) score += 15;
    if (target.rating >= 4.9) score += 5;
    score = Math.min(score, 99);

    let reason = '';
    if (isMutual) {
      reason = `Perfect Match! Offers ${myWantedOfferedByTarget[0]?.name.split(' ')[0]} • Wants ${targetWantedOfferedByMe[0]?.name.split(' ')[0]}`;
    } else if (myWantedOfferedByTarget.length > 0) {
      reason = `Teaches what you want: ${myWantedOfferedByTarget[0]?.name.split(' ')[0]}`;
    } else if (targetWantedOfferedByMe.length > 0) {
      reason = `Seeking your skill: ${targetWantedOfferedByMe[0]?.name.split(' ')[0]}`;
    } else {
      reason = 'High Quality Knowledge Swapper';
    }

    return { score, reason, isMutual };
  };

  // Filtered users (excluding myself and banned users, respecting privacy)
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      if (user.id === currentUser.id) return false;
      if (user.isBanned) return false;
      if (!user.privacy.isProfilePublic) return false;

      // Match search query
      const trimmedQuery = (activeSearchQuery || '').trim();
      if (trimmedQuery) {
        const q = trimmedQuery.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesBio = user.bio.toLowerCase().includes(q) || user.headline.toLowerCase().includes(q);
        const matchesOffered = user.skillsOffered.some(
          s => s.name.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q))
        );
        const matchesWanted = user.skillsWanted.some(w => w.name.toLowerCase().includes(q));

        if (!matchesName && !matchesBio && !matchesOffered && !matchesWanted) {
          return false;
        }
      }

      // Match category
      if (selectedCategory !== 'All') {
        const hasOfferedCategory = user.skillsOffered.some(s => s.category === selectedCategory);
        const hasWantedCategory = user.skillsWanted.some(w => w.category === selectedCategory);
        if (!hasOfferedCategory && !hasWantedCategory) return false;
      }

      // Match level
      if (selectedLevel !== 'All') {
        const hasLevel = user.skillsOffered.some(s => s.level === selectedLevel);
        if (!hasLevel) return false;
      }

      // Match format
      if (selectedFormat !== 'All') {
        if (!user.preferredFormats.includes(selectedFormat)) return false;
      }

      // Match rating
      if (minRating > 0 && user.rating < minRating) {
        return false;
      }

      // Match mutual match toggle
      if (onlyMutualMatches) {
        const { isMutual } = calculateMatchInfo(user);
        if (!isMutual) return false;
      }

      return true;
    });
  }, [allUsers, currentUser, activeSearchQuery, selectedCategory, selectedLevel, selectedFormat, minRating, onlyMutualMatches]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Discovery Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white p-6 sm:p-10 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero-Cash Peer Knowledge Exchange</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Exchange Skills 1-on-1 with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200">
              Passionate Mentors & Peers
            </span>
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl font-normal">
            Teach what you know best (like Rust, Figma, Sourdough, or Languages) in return for personal guidance from experienced peers. Build real projects, get immediate feedback, and level up together.
          </p>

          {/* Quick Search & Smart Match Toggle */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOnlyMutualMatches(!onlyMutualMatches)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                onlyMutualMatches
                  ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-300 font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${onlyMutualMatches ? 'text-stone-950' : 'text-amber-300'}`} />
              <span>Smart Mutual Match (Teach & Learn Synergy)</span>
            </button>

            <span className="text-xs text-stone-400">
              Showing <strong className="text-white">{filteredUsers.length}</strong> active knowledge swappers
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Browse by Skill Category
          </span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              Reset Category
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            🌟 All Categories
          </button>

          {SKILL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs font-semibold'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Refinement Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search skill, mentor, tag..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {activeSearchQuery && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold ml-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Level selector */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="All">Level: Any Proficiency</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>

          {/* Session Format */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="All">Format: Any Format</option>
            <option value="Video Call">Video Call</option>
            <option value="Live Chat">Live Chat</option>
            <option value="Code / Design Review">Code / Design Review</option>
            <option value="In-Person">In-Person</option>
          </select>

          {/* Rating */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="0">Rating: All Ratings</option>
            <option value="4.5">⭐️ 4.5+ Stars</option>
            <option value="4.8">⭐️ 4.8+ Stars</option>
            <option value="4.9">⭐️ 4.9+ Stars</option>
          </select>
        </div>

        {(selectedLevel !== 'All' || selectedFormat !== 'All' || minRating > 0 || onlyMutualMatches || activeSearchQuery) && (
          <button
            onClick={() => {
              setSelectedLevel('All');
              setSelectedFormat('All');
              setMinRating(0);
              setOnlyMutualMatches(false);
              handleQueryChange('');
            }}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Swappers Grid */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">
            No matching mentors or swappers found
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed mb-6">
            Try adjusting your search query or loosening filter constraints to discover more peers open to swapping skills.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedLevel('All');
              setSelectedFormat('All');
              setMinRating(0);
              setOnlyMutualMatches(false);
              handleQueryChange('');
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredUsers.map((user) => {
            const { score, reason, isMutual } = calculateMatchInfo(user);

            return (
              <div
                key={user.id}
                className="bg-white rounded-3xl border border-stone-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top: Match Pill & Rating */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    
                    {/* User info */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100 group-hover:ring-emerald-400 transition-all"
                        />
                        {user.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white" title="Verified SkillSwapper">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 
                            onClick={() => onOpenUserProfile(user)}
                            className="font-bold text-stone-900 hover:text-emerald-700 text-base cursor-pointer transition-colors"
                          >
                            {user.name}
                          </h3>
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                          {user.headline}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" /> {user.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {user.timezone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Swap Count */}
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{user.rating.toFixed(2)}</span>
                        <span className="text-stone-400 font-normal text-[10px]">({user.reviewsCount})</span>
                      </div>
                      <span className="text-[10px] text-stone-400 block mt-1">
                        {user.completedSwapsCount} swaps completed
                      </span>
                    </div>

                  </div>

                  {/* Match Banner Pill */}
                  <div className={`px-3 py-1.5 rounded-xl text-xs flex items-center justify-between gap-2 mb-4 ${
                    isMutual
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium'
                      : 'bg-stone-50 text-stone-700 border border-stone-200'
                  }`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isMutual ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <span className="truncate">{reason}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isMutual ? 'bg-emerald-200 text-emerald-950' : 'bg-stone-200 text-stone-800'
                    }`}>
                      {score}% Match
                    </span>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {user.bio}
                  </p>

                  {/* Skills Offered Section */}
                  <div className="space-y-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-600" />
                      Offers to Teach ({user.skillsOffered.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skillsOffered.map((skill) => (
                        <div
                          key={skill.id}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 text-xs flex items-center gap-1.5"
                        >
                          <span className="font-semibold">{skill.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/70 text-emerald-900 font-bold">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Wanted Section */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-indigo-600" />
                      Wants to Learn ({user.skillsWanted.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skillsWanted.map((w) => (
                        <div
                          key={w.id}
                          className="px-2.5 py-1 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-indigo-950 text-xs flex items-center gap-1.5"
                        >
                          <span className="font-medium">{w.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-200/60 text-indigo-900 font-bold">
                            Goal: {w.targetLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Formats & Action Buttons */}
                <div className="p-4 sm:px-6 bg-stone-50/80 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="text-[11px] font-medium text-stone-400">Formats:</span>
                    <div className="flex items-center gap-1.5">
                      {user.preferredFormats.map((fmt) => (
                        <span 
                          key={fmt}
                          className="px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-[10px] text-stone-600 font-medium"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenUserProfile(user)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onInitiateSwap(user)}
                      className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <span>Propose Swap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
