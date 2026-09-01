import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  PhoneCall, 
  AlertCircle,
  Car,
  Heart
} from 'lucide-react';
import { LoginFormData } from '../types';

interface Props {
  onSuccess: (data: LoginFormData) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onOpenEmergencyHotline: () => void;
}

export const LoginForm: React.FC<Props> = ({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
  onOpenEmergencyHotline,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your registered email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(formData);
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="relative bg-white/90 backdrop-blur-xl rounded-[28px] border border-[#E8EEEA] shadow-natural-card p-6 sm:p-9 text-[#2D332F] overflow-hidden">
        
        {/* Subtle Pastel Accent Glows */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#E5F0EC]/70 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[#FCEEE9]/80 blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF3EF] border border-[#D5E5DE] text-[#3D5A50] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4A7A6B]" />
            <span>Driver Safety Portal</span>
          </div>

          <button
            type="button"
            onClick={onOpenEmergencyHotline}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C85A3F] hover:text-[#9E3F27] bg-[#FDF0EC] hover:bg-[#FCE6DF] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">24/7 Urgent Dispatch</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#242A27] tracking-tight mb-2">
            Welcome back to HavenRoad
          </h2>
          <p className="text-sm text-[#61746B] leading-relaxed">
            Log in to manage your active roadside dispatches, vehicle registrations, and emergency contacts.
          </p>
        </div>

        {/* Quick Demo Credentials helper */}
        <div className="mb-6 p-3 rounded-2xl bg-[#F4F8F6] border border-[#DEECE5] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-[#40564D]">
            <Car className="w-4 h-4 text-[#4A7A6B] shrink-0" />
            <span>Need quick testing? Tap to fill demo driver credentials.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormData({
                email: 'driver.elena@havenroad.org',
                password: 'HavenPassword123!',
                rememberMe: true,
              });
              setErrors({});
            }}
            className="text-xs font-bold text-[#32584C] hover:text-[#1F3E34] px-2.5 py-1 rounded-xl bg-white border border-[#CCDED5] shadow-2xs hover:bg-[#EAF2EE] transition-colors cursor-pointer shrink-0"
          >
            Demo Auto-Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#323D38] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7B8E85] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F9FBFA] text-sm text-[#262D29] placeholder-[#94A59D] border transition-all focus:outline-none focus:bg-white ${
                  errors.email 
                    ? 'border-[#E89E8C] focus:ring-2 focus:ring-[#E89E8C]/30 bg-[#FEF6F4]' 
                    : 'border-[#E0E9E4] focus:border-[#4A7A6B] focus:ring-2 focus:ring-[#4A7A6B]/20'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-[#C85A3F] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#323D38]">
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-[#4A7A6B] hover:text-[#2E5448] font-semibold cursor-pointer transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7B8E85] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-11 py-2.5 rounded-2xl bg-[#F9FBFA] text-sm text-[#262D29] placeholder-[#94A59D] border transition-all focus:outline-none focus:bg-white ${
                  errors.password 
                    ? 'border-[#E89E8C] focus:ring-2 focus:ring-[#E89E8C]/30 bg-[#FEF6F4]' 
                    : 'border-[#E0E9E4] focus:border-[#4A7A6B] focus:ring-2 focus:ring-[#4A7A6B]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7B8E85] hover:text-[#4A5D54] transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-[#C85A3F] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4F6258] select-none">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                className="rounded border-[#C8DAD2] text-[#4A7A6B] focus:ring-[#4A7A6B]"
              />
              <span>Remember this device for faster roadside login</span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#38594E] via-[#4A7264] to-[#38594E] hover:from-[#2F4C42] hover:to-[#2F4C42] text-white font-semibold text-sm shadow-natural-btn flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verifying driver account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In to HavenRoad</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-7 pt-5 border-t border-[#E8EEEA] text-center">
          <p className="text-xs text-[#5D7067]">
            New to HavenRoad?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-[#32584C] hover:text-[#1F3E34] underline decoration-[#94B3A8] underline-offset-4 transition-colors cursor-pointer"
            >
              Create a free membership
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
