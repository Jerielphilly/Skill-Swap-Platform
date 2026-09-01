import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  HeartHandshake, 
  Car, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Zap,
  PhoneCall
} from 'lucide-react';
import { RegistrationFormData } from '../types';

interface Props {
  onSuccess: (data: RegistrationFormData) => void;
  onSwitchToLogin: () => void;
  onOpenEmergencyHotline: () => void;
}

export const RegisterForm: React.FC<Props> = ({
  onSuccess,
  onSwitchToLogin,
  onOpenEmergencyHotline,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    vehicleType: 'Sedan / Hatchback',
    vehiclePlate: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    agreeToTerms: true,
    receiveSafetyAlerts: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmergencyFields, setShowEmergencyFields] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passStrength = calculatePasswordStrength(formData.password);

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
        return { label: 'Too short', color: 'bg-stone-200 text-stone-500', barColor: 'bg-stone-300' };
      case 1:
        return { label: 'Gentle start', color: 'bg-amber-50 text-amber-700 border-amber-200', barColor: 'bg-amber-400' };
      case 2:
        return { label: 'Getting safer', color: 'bg-blue-50 text-blue-700 border-blue-200', barColor: 'bg-blue-400' };
      case 3:
        return { label: 'Strong & secure', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', barColor: 'bg-emerald-500' };
      case 4:
        return { label: 'Wonderfully protected', color: 'bg-teal-50 text-teal-800 border-teal-200', barColor: 'bg-teal-600' };
      default:
        return { label: 'Safe', color: 'bg-stone-100 text-stone-600', barColor: 'bg-stone-400' };
    }
  };

  const strengthInfo = getStrengthLabel(passStrength);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Allow digits, dashes, parens, spaces, and plus
    val = val.replace(/[^\d\s\-()+]/g, '');
    setFormData(prev => ({ ...prev, phone: val }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please tell us your full name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please provide a valid name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Please create a secure password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password should have at least 6 characters';
    }

    if (formData.confirmPassword !== undefined && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for dispatch SMS & call';
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a complete phone number';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Please agree to our safe service guidelines';
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
    }, 900);
  };

  const vehicleOptions: Array<RegistrationFormData['vehicleType']> = [
    'Sedan / Hatchback',
    'SUV / Crossover',
    'Electric Vehicle (EV)',
    'Truck / Van',
    'Motorcycle',
    'Other'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Outer Card with Soft Natural Shadow & Pastel Border */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-[28px] border border-[#E8EEEA] shadow-natural-card p-6 sm:p-9 text-[#2D332F] overflow-hidden">
        
        {/* Subtle Pastel Accent Glows */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#E5F0EC]/70 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[#FCEEE9]/80 blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF3EF] border border-[#D5E5DE] text-[#3D5A50] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4A7A6B]" />
            <span>24/7 Roadside & Emergency Dispatch</span>
          </div>

          <button
            type="button"
            onClick={onOpenEmergencyHotline}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C85A3F] hover:text-[#9E3F27] bg-[#FDF0EC] hover:bg-[#FCE6DF] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Need urgent help?</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>

        {/* Title & Sweet Subtitle */}
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#242A27] tracking-tight mb-2">
            Create your safe account
          </h2>
          <p className="text-sm text-[#61746B] leading-relaxed">
            Register your vehicle for peace-of-mind roadside assistance, flat-tire rescue, battery boosts, and certified towing.
          </p>
        </div>

        {/* Quick Social / Instant Enrollment options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                name: 'Taylor Swift',
                email: 'taylor.swift@example.com',
                phone: '(555) 342-8819',
                vehicleType: 'Electric Vehicle (EV)',
                vehiclePlate: 'EV-8821',
              }));
            }}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF5F2] border border-[#E3ECE7] text-xs font-semibold text-[#3B4641] transition-all hover:border-[#CCDED5] cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                name: 'Alex Morgan',
                email: 'alex.morgan@icloud.com',
                phone: '(555) 791-0024',
                vehicleType: 'SUV / Crossover',
                vehiclePlate: 'SAFE-99',
              }));
            }}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-2xl bg-[#F8FAF9] hover:bg-[#EFF5F2] border border-[#E3ECE7] text-xs font-semibold text-[#3B4641] transition-all hover:border-[#CCDED5] cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73 1.01.08 2.03-.48 2.65-1.23z" />
            </svg>
            <span>Sign up with Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full border-t border-[#E6EDE8]" />
          <span className="absolute px-3 bg-white text-[11px] font-medium text-[#7D8F86] uppercase tracking-wider">
            or with email & phone
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Field */}
          <div>
            <label className="block text-xs font-semibold text-[#323D38] mb-1.5">
              Full Name <span className="text-[#D96B4F]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#7B8E85] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Jordan Miller"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F9FBFA] text-sm text-[#262D29] placeholder-[#94A59D] border transition-all focus:outline-none focus:bg-white ${
                  errors.name 
                    ? 'border-[#E89E8C] focus:ring-2 focus:ring-[#E89E8C]/30 bg-[#FEF6F4]' 
                    : 'border-[#E0E9E4] focus:border-[#4A7A6B] focus:ring-2 focus:ring-[#4A7A6B]/20'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-[#C85A3F] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-xs font-semibold text-[#323D38] mb-1.5">
              Email Address <span className="text-[#D96B4F]">*</span>
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
                placeholder="jordan@example.com"
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

          {/* Phone Number Field */}
          <div>
            <label className="block text-xs font-semibold text-[#323D38] mb-1.5 flex items-center justify-between">
              <span>Phone Number (For Rescue & Dispatch) <span className="text-[#D96B4F]">*</span></span>
              <span className="text-[11px] text-[#6A7F75] font-normal">SMS Live Tracking</span>
            </label>
            <div className="relative flex">
              <div className="inline-flex items-center px-3 rounded-l-2xl bg-[#EEF4F1] border border-r-0 border-[#E0E9E4] text-xs font-semibold text-[#384942]">
                🇺🇸 +1
              </div>
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-[#7B8E85] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(555) 234-5678"
                  className={`w-full pl-9.5 pr-4 py-2.5 rounded-r-2xl bg-[#F9FBFA] text-sm text-[#262D29] placeholder-[#94A59D] border transition-all focus:outline-none focus:bg-white ${
                    errors.phone 
                      ? 'border-[#E89E8C] focus:ring-2 focus:ring-[#E89E8C]/30 bg-[#FEF6F4]' 
                    : 'border-[#E0E9E4] focus:border-[#4A7A6B] focus:ring-2 focus:ring-[#4A7A6B]/20'
                  }`}
                />
              </div>
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-[#C85A3F] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#323D38]">
                Password <span className="text-[#D96B4F]">*</span>
              </label>
              {formData.password && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${strengthInfo.color}`}>
                  {strengthInfo.label}
                </span>
              )}
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
                placeholder="Create a strong password (6+ chars)"
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

            {/* Password strength meter bar */}
            {formData.password && (
              <div className="mt-2 flex items-center gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      passStrength >= step ? strengthInfo.barColor : 'bg-[#E5ECE8]'
                    }`}
                  />
                ))}
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-xs text-[#C85A3F] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Vehicle Information (Sweet pastel pill selection) */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#323D38] mb-2 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#4A7A6B]" />
              <span>Primary Vehicle Category (For accurate dispatch equipment)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vehicleOptions.map((v) => {
                const isSelected = formData.vehicleType === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, vehicleType: v }))}
                    className={`text-left p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAF3EF] border-[#4A7A6B] text-[#294B40] shadow-xs'
                        : 'bg-[#F9FBFA] border-[#E3EDE8] text-[#556960] hover:bg-[#F2F7F4]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{v}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7A6B] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional License Plate & Emergency Contact toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowEmergencyFields(!showEmergencyFields)}
              className="text-xs font-semibold text-[#4A7A6B] hover:text-[#32584C] flex items-center gap-1.5 py-1 cursor-pointer transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{showEmergencyFields ? 'Hide optional safety details' : '+ Add License Plate & Emergency ICE Contact (Optional)'}</span>
            </button>

            <AnimatePresence>
              {showEmergencyFields && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F6F9F7] border border-[#E3EDE8]">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3D4F46] mb-1">
                        License Plate / Color
                      </label>
                      <input
                        type="text"
                        value={formData.vehiclePlate}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value }))}
                        placeholder="e.g. 7XYZ890 / Silver"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D9E6E0] text-xs text-[#262D29] focus:outline-none focus:border-[#4A7A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3D4F46] mb-1">
                        Emergency Contact (ICE Name)
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                        placeholder="e.g. Spouse / Parent"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D9E6E0] text-xs text-[#262D29] focus:outline-none focus:border-[#4A7A6B]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkboxes: Terms and safety alerts */}
          <div className="pt-2 space-y-2.5">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#4F6258] select-none">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }));
                  if (errors.agreeToTerms) setErrors(prev => ({ ...prev, agreeToTerms: '' }));
                }}
                className="mt-0.5 rounded border-[#C8DAD2] text-[#4A7A6B] focus:ring-[#4A7A6B]"
              />
              <span>
                I agree to HavenRoad's <span className="underline text-[#324B41] font-medium">Safe Response Terms</span> and certified roadside privacy guarantee.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-xs text-[#C85A3F] font-medium pl-6">{errors.agreeToTerms}</p>
            )}

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#4F6258] select-none">
              <input
                type="checkbox"
                checked={formData.receiveSafetyAlerts}
                onChange={(e) => setFormData(prev => ({ ...prev, receiveSafetyAlerts: e.target.checked }))}
                className="mt-0.5 rounded border-[#C8DAD2] text-[#4A7A6B] focus:ring-[#4A7A6B]"
              />
              <span>Send me real-time severe weather alerts and road safety updates via SMS.</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#38594E] via-[#4A7264] to-[#38594E] hover:from-[#2F4C42] hover:to-[#2F4C42] text-white font-semibold text-sm shadow-natural-btn flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Enrolling your vehicle safely...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Complete Haven Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Footer: Switch to Login */}
        <div className="mt-7 pt-5 border-t border-[#E8EEEA] text-center">
          <p className="text-xs text-[#5D7067]">
            Already have a HavenRoad membership?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-[#32584C] hover:text-[#1F3E34] underline decoration-[#94B3A8] underline-offset-4 transition-colors cursor-pointer"
            >
              Log in to your account
            </button>
          </p>
        </div>
      </div>

      {/* Gentle reassurance badge below the card */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#6F8278]">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#5C8577]" />
          <span>Avg. 14 min dispatch</span>
        </div>
        <span className="text-[#C2D4CC]">•</span>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#5C8577]" />
          <span>GPS Live Telemetry</span>
        </div>
        <span className="text-[#C2D4CC]">•</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5C8577]" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>
    </motion.div>
  );
};
