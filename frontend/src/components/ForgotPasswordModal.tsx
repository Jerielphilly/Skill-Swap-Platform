import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, X, ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid account email');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2622]/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-[#FCFDFB] rounded-[28px] border border-[#E3ECE7] shadow-2xl p-6 sm:p-8 text-[#2D332F] overflow-hidden"
      >
        {/* Soft pastel accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#E5F0EC]/80 blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#697B72] hover:text-[#2E3B35] hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#E9F5EF] text-[#3E7D63] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-[#222925] mb-2">
              Check your inbox
            </h3>
            <p className="text-xs text-[#5E7268] leading-relaxed mb-6">
              We've sent a safe, one-time recovery link to <span className="font-semibold text-[#2C3B34]">{email}</span>. You can reset your driver access in seconds.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[#3E6657] text-white font-semibold text-xs hover:bg-[#315246] transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF5F1] text-[#3E6657] text-xs font-semibold mb-4">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Safe Driver Account Recovery</span>
            </div>

            <h3 className="text-xl font-bold font-heading text-[#222925] mb-2">
              Forgot your password?
            </h3>
            <p className="text-xs text-[#5E7268] leading-relaxed mb-5">
              Enter your registered email address and we'll send you a secure link to regain access to your roadside membership.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#323D38] mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7B8E85] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="driver@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F9FBFA] text-sm text-[#262D29] placeholder-[#94A59D] border border-[#E0E9E4] focus:border-[#4A7A6B] focus:outline-none transition-all"
                  />
                </div>
                {error && <p className="mt-1 text-xs text-[#C85A3F] font-medium">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-[#3E6657] hover:bg-[#315246] text-white font-semibold text-xs shadow-natural-btn flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Send Safe Recovery Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
