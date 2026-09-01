import React, { useState } from 'react';
import { 
  User, 
  BookOpen, 
  Repeat, 
  Calendar, 
  Lock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Save, 
  SlidersHorizontal,
  Globe,
  Clock,
  Sparkles,
  ShieldCheck,
  Video
} from 'lucide-react';
import { 
  UserProfile, 
  SkillItem, 
  WantedSkillItem, 
  AvailabilitySlot, 
  SkillCategory, 
  SkillLevel, 
  DayOfWeek, 
  TimeOfDay,
  SessionFormat 
} from '../types';
import { SKILL_CATEGORIES } from '../mockData';

interface Props {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onSaveToast: () => void;
}

const ALL_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const ALL_TIMES: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Night'];
const ALL_FORMATS: SessionFormat[] = ['Video Call', 'Live Chat', 'Code / Design Review', 'In-Person'];

export const MyProfileEditor: React.FC<Props> = ({
  user,
  onUpdateProfile,
  onSaveToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'offered' | 'wanted' | 'availability' | 'privacy'>('profile');
  
  // Local editable state clone
  const [profile, setProfile] = useState<UserProfile>({ ...user });

  // Add new skill offered modal / form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Programming & Tech');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
  const [newSkillYears, setNewSkillYears] = useState(3);
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillTags, setNewSkillTags] = useState('');

  // Add new skill wanted modal / form state
  const [newWantedName, setNewWantedName] = useState('');
  const [newWantedCategory, setNewWantedCategory] = useState<SkillCategory>('Languages & Culture');
  const [newWantedLevel, setNewWantedLevel] = useState<SkillLevel>('Intermediate');
  const [newWantedGoal, setNewWantedGoal] = useState('');
  const [newWantedPriority, setNewWantedPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const handleSave = () => {
    onUpdateProfile(profile);
    onSaveToast();
  };

  // Skill offered handlers
  const handleAddOfferedSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: SkillItem = {
      id: 'sk-' + Date.now(),
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      yearsOfExperience: newSkillYears,
      description: newSkillDesc.trim(),
      tags: newSkillTags.split(',').map(t => t.trim()).filter(Boolean),
      endorsements: 0,
    };

    setProfile(prev => ({
      ...prev,
      skillsOffered: [...prev.skillsOffered, newSkill],
    }));

    setNewSkillName('');
    setNewSkillDesc('');
    setNewSkillTags('');
  };

  const handleRemoveOfferedSkill = (id: string) => {
    setProfile(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s.id !== id),
    }));
  };

  // Skill wanted handlers
  const handleAddWantedSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWantedName.trim()) return;

    const newWanted: WantedSkillItem = {
      id: 'w-' + Date.now(),
      name: newWantedName.trim(),
      category: newWantedCategory,
      targetLevel: newWantedLevel,
      learningGoal: newWantedGoal.trim(),
      priority: newWantedPriority,
    };

    setProfile(prev => ({
      ...prev,
      skillsWanted: [...prev.skillsWanted, newWanted],
    }));

    setNewWantedName('');
    setNewWantedGoal('');
  };

  const handleRemoveWantedSkill = (id: string) => {
    setProfile(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(w => w.id !== id),
    }));
  };

  // Toggle availability slot time
  const handleToggleSlotTime = (day: DayOfWeek, time: TimeOfDay) => {
    setProfile(prev => {
      const existing = prev.availability.find(a => a.day === day);
      if (existing) {
        let updatedTimes = existing.times.includes(time)
          ? existing.times.filter(t => t !== time)
          : [...existing.times, time];

        if (updatedTimes.length === 0) {
          return {
            ...prev,
            availability: prev.availability.filter(a => a.day !== day),
          };
        } else {
          return {
            ...prev,
            availability: prev.availability.map(a => 
              a.day === day ? { ...a, times: updatedTimes } : a
            ),
          };
        }
      } else {
        return {
          ...prev,
          availability: [
            ...prev.availability,
            { id: 'av-' + Date.now(), day, times: [time], preferredFormat: 'Video Call' },
          ],
        };
      }
    });
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Profile, Skills & Availability
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage the knowledge you offer, your learning goals, availability schedule, and privacy.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-stone-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('offered')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'offered'
              ? 'border-emerald-600 text-emerald-900 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Skills Offered ({profile.skillsOffered.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wanted')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'wanted'
              ? 'border-indigo-600 text-indigo-900 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Wishlist Skills ({profile.skillsWanted.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('availability')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'availability'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Availability Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Privacy & Security</span>
        </button>
      </div>

      {/* TAB 1: Profile Details & Bio */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center gap-5 pb-6 border-b border-stone-100">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-3xl object-cover ring-2 ring-stone-200"
            />
            <div className="flex-1 min-w-[240px] space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Avatar Image URL
              </label>
              <input
                type="text"
                value={profile.avatar}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Username Handle
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Professional Headline
            </label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              placeholder="e.g., Senior Product Designer • Design System & 3D Specialist"
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Location (City, Country)
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Primary Timezone
              </label>
              <input
                type="text"
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              About Me & Mentorship Philosophy
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
            />
          </div>
        </div>
      )}

      {/* TAB 2: Skills Offered */}
      {activeTab === 'offered' && (
        <div className="space-y-6">
          
          {/* Add New Skill Card */}
          <div className="bg-emerald-50/50 rounded-3xl border border-emerald-200/80 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-stone-900">
                Add a Skill You Can Teach
              </h3>
            </div>

            <form onSubmit={handleAddOfferedSkill} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. Figma Design Tokens"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Category
                  </label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {SKILL_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Your Proficiency
                  </label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Syllabus / What You Cover
                  </label>
                  <input
                    type="text"
                    value={newSkillDesc}
                    onChange={(e) => setNewSkillDesc(e.target.value)}
                    placeholder="e.g. Component architecture, auto-layout tokens, dev handoff..."
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Search Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newSkillTags}
                    onChange={(e) => setNewSkillTags(e.target.value)}
                    placeholder="e.g. Figma, UI, Tokens, DesignSystems"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to My Offered Skills</span>
              </button>
            </form>
          </div>

          {/* Current Offered List */}
          <div className="space-y-3">
            {profile.skillsOffered.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">{skill.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {skill.level}
                    </span>
                    <span className="text-[10px] text-stone-400">{skill.category}</span>
                  </div>
                  {skill.description && (
                    <p className="text-xs text-stone-600">{skill.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {skill.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-stone-100 text-[10px] text-stone-600 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveOfferedSkill(skill.id)}
                  className="text-stone-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: Skills Wanted (Wishlist) */}
      {activeTab === 'wanted' && (
        <div className="space-y-6">
          
          {/* Add New Wanted Skill Form */}
          <div className="bg-indigo-50/50 rounded-3xl border border-indigo-200/80 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-indigo-700" />
              <h3 className="text-sm font-bold text-stone-900">
                Add a Skill You Want to Learn
              </h3>
            </div>

            <form onSubmit={handleAddWantedSkill} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Skill Wishlist Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newWantedName}
                    onChange={(e) => setNewWantedName(e.target.value)}
                    placeholder="e.g. Rust Tokio Concurrency"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Category
                  </label>
                  <select
                    value={newWantedCategory}
                    onChange={(e) => setNewWantedCategory(e.target.value as SkillCategory)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {SKILL_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Target Goal Level
                  </label>
                  <select
                    value={newWantedLevel}
                    onChange={(e) => setNewWantedLevel(e.target.value as SkillLevel)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Specific Learning Goal
                  </label>
                  <input
                    type="text"
                    value={newWantedGoal}
                    onChange={(e) => setNewWantedGoal(e.target.value)}
                    placeholder="e.g. Master memory safety, Tokio async, and build a CLI tool"
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    Urgency Priority
                  </label>
                  <select
                    value={newWantedPriority}
                    onChange={(e) => setNewWantedPriority(e.target.value as any)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="High">High Priority (Actively Seeking Swap)</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-indigo-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Learning Wishlist</span>
              </button>
            </form>
          </div>

          {/* Wanted List */}
          <div className="space-y-3">
            {profile.skillsWanted.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">{w.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      Target: {w.targetLevel}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      w.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {w.priority}
                    </span>
                  </div>
                  {w.learningGoal && (
                    <p className="text-xs text-stone-600">{w.learningGoal}</p>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveWantedSkill(w.id)}
                  className="text-stone-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: Availability Schedule & Formats */}
      {activeTab === 'availability' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Weekly Availability Matrix
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click time slots to toggle when you are open for 1-on-1 swap sessions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-2.5 px-3 font-bold text-stone-400 uppercase text-[10px]">Day</th>
                  {ALL_TIMES.map(time => (
                    <th key={time} className="py-2.5 px-3 font-bold text-stone-700 uppercase text-[10px] text-center">
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {ALL_DAYS.map((day) => {
                  const daySlot = profile.availability.find(a => a.day === day);

                  return (
                    <tr key={day} className="hover:bg-stone-50/50">
                      <td className="py-3 px-3 font-bold text-stone-900">{day}</td>
                      {ALL_TIMES.map((time) => {
                        const isAvailable = daySlot?.times.includes(time);

                        return (
                          <td key={time} className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSlotTime(day, time)}
                              className={`w-full py-2 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                                isAvailable
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-stone-100 hover:bg-stone-200 text-stone-400'
                              }`}
                            >
                              {isAvailable ? '✓ Open' : '—'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Preferred Formats */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Supported Session Formats
            </span>
            <div className="flex flex-wrap gap-2">
              {ALL_FORMATS.map((fmt) => {
                const isSelected = profile.preferredFormats.includes(fmt);

                return (
                  <button
                    type="button"
                    key={fmt}
                    onClick={() => {
                      const updated = isSelected
                        ? profile.preferredFormats.filter(f => f !== fmt)
                        : [...profile.preferredFormats, fmt];
                      setProfile({ ...profile, preferredFormats: updated });
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Privacy Controls */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Privacy & Inbound Swap Settings
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Control who can see your profile details and who can propose swap requests.
            </p>
          </div>

          <div className="divide-y divide-stone-100 space-y-4">
            
            {/* Open to swaps toggle */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Accept New Swap Requests
                </span>
                <span className="text-xs text-stone-500">
                  Allow members to propose 1-on-1 swaps with you.
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.privacy.openToSwapRequests}
                onChange={(e) => setProfile({
                  ...profile,
                  privacy: { ...profile.privacy, openToSwapRequests: e.target.checked }
                })}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Public profile */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Public Profile Visibility
                </span>
                <span className="text-xs text-stone-500">
                  Display your profile card in the public Skill Discovery feed.
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.privacy.isProfilePublic}
                onChange={(e) => setProfile({
                  ...profile,
                  privacy: { ...profile.privacy, isProfilePublic: e.target.checked }
                })}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Hide Email */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Display Email Address
                </span>
                <span className="text-xs text-stone-500">
                  Show your contact email on your profile card.
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.privacy.showEmail}
                onChange={(e) => setProfile({
                  ...profile,
                  privacy: { ...profile.privacy, showEmail: e.target.checked }
                })}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Direct messages */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Allow Direct Inquiries
                </span>
                <span className="text-xs text-stone-500">
                  Permit direct messages before an official swap proposal is accepted.
                </span>
              </div>
              <input
                type="checkbox"
                checked={profile.privacy.allowDirectMessages}
                onChange={(e) => setProfile({
                  ...profile,
                  privacy: { ...profile.privacy, allowDirectMessages: e.target.checked }
                })}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
