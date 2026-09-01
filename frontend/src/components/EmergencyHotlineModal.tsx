import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PhoneCall, 
  X, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Radio, 
  Sparkles,
  AlertTriangle,
  Car
} from 'lucide-react';
import { EmergencyHotlineContact } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHotlineModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [requestedImmediateCall, setRequestedImmediateCall] = useState(false);
  const [userLocationNote, setUserLocationNote] = useState('Highway 101 North, Mile Marker 42 (Simulated)');

  if (!isOpen) return null;

  const hotlines: EmergencyHotlineContact[] = [
    {
      label: '24/7 National Roadside Dispatch',
      number: '1-800-555-SAFE (7233)',
      description: 'Immediate live dispatcher for breakdowns, engine stalling, lockouts, flat tires, and fuel rescue.',
      available: '24/7 • Instant connection',
      priority: 'urgent',
    },
    {
      label: 'Critical Highway SOS & Hazard Patrol',
      number: '1-888-911-ROAD (7623)',
      description: 'For vehicles stuck in active traffic lanes, freeway shoulders, night darkness, or extreme weather.',
      available: 'Priority emergency response',
      priority: 'urgent',
    },
    {
      label: 'HavenRoad Calming & Reassurance Line',
      number: '1-800-444-CALM (2256)',
      description: 'Live roadside operator to stay on the line with you, guide breathing, and reassure you while the truck arrives.',
      available: 'Free with all memberships',
      priority: 'standard',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2622]/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative w-full max-w-lg bg-[#FAFBF9] rounded-[32px] border border-[#E3ECE7] shadow-2xl p-6 sm:p-8 text-[#2D332F] overflow-hidden my-8"
      >
        {/* Soft pastel ambient gradient */}
        <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-[#FDECE6]/90 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-[#E5F1EB]/90 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/80 border border-[#E3ECE7] text-[#697B72] hover:text-[#2E3B35] hover:bg-white transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF0EC] border border-[#FAD9D0] text-[#B84E34] text-xs font-bold mb-4">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#C85A3F]" />
          <span>Priority Emergency Assistance Line</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#222925] mb-2">
          You are not alone on the road.
        </h3>
        <p className="text-xs sm:text-sm text-[#5D7067] leading-relaxed mb-6">
          If you are in immediate danger or stalled in a hazardous spot, tap any number below to connect with a certified rescue operator instantly.
        </p>

        {/* One-Touch Quick Dispatch Button */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#FDF2EE] to-[#FAF8F5] border border-[#F5DDD5] shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C85A3F]" />
              <span className="font-bold text-sm text-[#2E3632]">Instant GPS Rescue Request</span>
            </div>
            <span className="text-[11px] font-semibold text-[#A3432C] bg-white px-2 py-0.5 rounded-full border border-[#FAD9D0]">
              Avg. 12m ETA
            </span>
          </div>

          <p className="text-xs text-[#63756C] mb-3">
            Simulates emergency satellite ping with your estimated coordinates: <span className="font-medium text-[#2E3632]">{userLocationNote}</span>
          </p>

          {requestedImmediateCall ? (
            <div className="p-3 rounded-xl bg-[#EAF5EF] border border-[#BEDECF] flex items-center gap-2.5 text-xs text-[#264D3E] font-medium animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-[#357A5F] shrink-0" />
              <span>Rescue team dispatched! Operator pinging your device now.</span>
            </div>
          ) : (
            <button
              onClick={() => setRequestedImmediateCall(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#C85A3F] hover:bg-[#B34A31] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tap for One-Touch Emergency Dispatch</span>
            </button>
          )}
        </div>

        {/* Hotlines list */}
        <div className="space-y-3 mb-6">
          {hotlines.map((h, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-white border border-[#E3ECE7] shadow-2xs hover:border-[#CADED4] transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-[#2A342F]">{h.label}</span>
                <span className="text-[10px] font-semibold text-[#3D5A4E] bg-[#EAF2EE] px-2 py-0.5 rounded-full">
                  {h.available}
                </span>
              </div>
              <p className="text-[11px] text-[#63756C] mb-2 leading-relaxed">{h.description}</p>
              <a
                href={`tel:${h.number.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#356353] hover:text-[#1F4437] bg-[#F2F7F4] hover:bg-[#E5EFE9] px-3 py-1.5 rounded-xl border border-[#D3E5DC] transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{h.number}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Calming roadside tip */}
        <div className="p-3 rounded-xl bg-[#F0F5F2] border border-[#DAE8DF] flex items-center gap-2 text-xs text-[#485E53]">
          <Sparkles className="w-4 h-4 text-[#4A7A6B] shrink-0" />
          <span>Tip: Turn on your hazard lights, stay inside your vehicle if safe, and breathe slowly.</span>
        </div>
      </motion.div>
    </div>
  );
};
