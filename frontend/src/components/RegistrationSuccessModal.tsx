import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  ShieldCheck, 
  Car, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Compass,
  Zap,
  Check
} from 'lucide-react';
import { RegistrationFormData } from '../types';

interface Props {
  userData: RegistrationFormData;
  onContinue: () => void;
  onRequestRescueNow: () => void;
}

export const RegistrationSuccessModal: React.FC<Props> = ({
  userData,
  onContinue,
  onRequestRescueNow,
}) => {
  const memberNumber = `HR-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="relative bg-white/95 backdrop-blur-xl rounded-[32px] border border-[#E3ECE7] shadow-natural-card p-6 sm:p-9 text-[#2D332F] overflow-hidden">
        
        {/* Soft pastel decorative glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#E5F2EC]/80 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#FCEEE9]/90 blur-3xl pointer-events-none" />

        {/* Success Icon Badge */}
        <div className="w-14 h-14 rounded-full bg-[#E6F4ED] text-[#2F6B53] flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#CDE5D9]">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2EE] text-[#34594B] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Membership Active & Secured</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#222925] tracking-tight">
            Welcome to HavenRoad, {userData.name.split(' ')[0]}!
          </h2>
          <p className="text-xs sm:text-sm text-[#5F7369] mt-1">
            Your vehicle is now guarded with 24/7 priority emergency dispatch and roadside protection.
          </p>
        </div>

        {/* Digital Membership Card Preview */}
        <div className="relative bg-gradient-to-tr from-[#2D453C] via-[#3A5B4F] to-[#466C5E] rounded-2xl p-5 text-white shadow-md mb-6 overflow-hidden">
          {/* Card subtle pattern */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="font-heading font-bold text-sm tracking-wide">HAVENROAD SHIELD</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-300/30">
              Gold Tier Driver
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs mb-3">
            <div>
              <span className="text-[10px] text-emerald-200/70 block uppercase tracking-wider">Member Name</span>
              <span className="font-semibold text-white truncate block">{userData.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200/70 block uppercase tracking-wider">Member ID</span>
              <span className="font-mono font-medium text-white">{memberNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200/70 block uppercase tracking-wider">Vehicle</span>
              <span className="font-medium text-white truncate block">{userData.vehicleType}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200/70 block uppercase tracking-wider">Emergency Phone</span>
              <span className="font-medium text-white truncate block">{userData.phone}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100/80">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-300" />
              Instant Dispatch Ready
            </span>
            <span>24/7 Unlimited Callouts</span>
          </div>
        </div>

        {/* Benefits list */}
        <div className="space-y-2 mb-6">
          {[
            'Free emergency towing up to 25 miles per incident',
            'Mobile battery jumpstart & diagnostic check',
            'Lockout rescue & flat tire air/spare installation',
            'Emergency fuel delivery to your exact GPS coordinates',
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[#485E53]">
              <div className="w-4 h-4 rounded-full bg-[#E5F2EC] text-[#2F6B53] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onRequestRescueNow}
            className="py-3 px-4 rounded-2xl bg-[#C85A3F] hover:bg-[#B34A31] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Request Rescue Now</span>
          </button>

          <button
            onClick={onContinue}
            className="py-3 px-4 rounded-2xl bg-[#375449] hover:bg-[#2C453B] text-white text-xs font-bold shadow-natural-btn flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Go to Driver Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
