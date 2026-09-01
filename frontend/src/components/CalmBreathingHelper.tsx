import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, X, Sparkles, Heart } from 'lucide-react';

export const CalmBreathingHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            if (currentPhase === 'Inhale') return 'Hold';
            if (currentPhase === 'Hold') return 'Exhale';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#DDEAE3] shadow-natural-card p-5 text-[#2D332F] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#E5F2EC] text-[#3D6B5A] flex items-center justify-center">
                  <Wind className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#2A3932]">Calm Roadside Breath</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-[#7B8F85] hover:text-[#2D332F] hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close breathing widget"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Breathing Animation Circle */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative flex items-center justify-center w-36 h-36">
                {/* Pulsing ring */}
                <motion.div
                  animate={{
                    scale: phase === 'Inhale' ? 1.25 : phase === 'Hold' ? 1.25 : 0.85,
                    backgroundColor: phase === 'Inhale' ? '#E2F3EB' : phase === 'Hold' ? '#FBF1E8' : '#EFF5F2',
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border border-[#BEDECF]/60"
                />

                {/* Center text */}
                <div className="relative z-10 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#4E6A5E] block">
                    {phase}
                  </span>
                  <span className="text-3xl font-bold font-heading text-[#273B32]">
                    {counter}s
                  </span>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-[#5D7368] leading-relaxed px-2">
                Help is on the way. Slow, steady breaths soothe nervous tension while you wait safely in your car.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D5E6DE] text-xs font-semibold text-[#324B40] shadow-natural-btn hover:bg-[#F3F9F6] transition-all cursor-pointer"
          >
            <Wind className="w-4 h-4 text-[#4A7A6B] animate-pulse" />
            <span>Stressed? Take a calm breath</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
