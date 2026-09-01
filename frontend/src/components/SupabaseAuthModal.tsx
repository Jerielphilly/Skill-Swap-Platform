import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Database,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userProfile: Partial<UserProfile>) => void;
  onSelectDemoUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
}

export const SupabaseAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onSelectDemoUser,
  allUsers,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email.split('@')[0],
            }
          }
        });

        if (error) throw error;

        // If user created, create profile
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName || email.split('@')[0],
            skills_offered: ['General Mentorship'],
            skills_wanted: ['Programming', 'UI/UX Design'],
            availability: ['Weekends'],
            is_public: true,
          });

          setSuccessMsg("Account created! Check your email or start exploring right away.");
          onAuthSuccess({
            id: data.user.id,
            name: fullName || email.split('@')[0],
            email: data.user.email,
            role: 'user',
          });
          setTimeout(() => onClose(), 1200);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setSuccessMsg("Logged in successfully!");
          onAuthSuccess({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
          });
          setTimeout(() => onClose(), 800);
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Failed to authenticate with Supabase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Database className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Supabase Auth & Database
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {mode === 'login' ? 'Sign In to SkillSwap' : 'Create Swapper Account'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            Connect to exchange knowledge, schedule swaps, and leave verified reviews.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs text-emerald-800 hover:underline font-semibold cursor-pointer"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign Up" 
                : 'Already have an account? Sign In'}
            </button>
          </div>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Instant Demo Profiles (1-Click Switch)
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Hackathon Ready</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {allUsers.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectDemoUser(u);
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 flex items-center gap-2 text-left transition-all cursor-pointer"
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-stone-900 block truncate">
                      {u.name}
                    </span>
                    <span className="text-[9px] text-stone-500 block truncate">
                      {u.role === 'admin' ? '🛡️ Admin' : u.skillsOffered[0]?.name || 'Swapper'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
