import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  BatteryCharging, 
  Wrench, 
  Truck, 
  Fuel, 
  Key, 
  CheckCircle2, 
  Clock, 
  Radio, 
  User, 
  LogOut, 
  Sparkles,
  AlertTriangle,
  HeartHandshake,
  Navigation
} from 'lucide-react';
import { RegisteredUser } from '../types';

interface Props {
  user: RegisteredUser;
  onLogout: () => void;
  onOpenEmergencyHotline: () => void;
}

export const DriverDashboard: React.FC<Props> = ({
  user,
  onLogout,
  onOpenEmergencyHotline,
}) => {
  const [activeRescue, setActiveRescue] = useState<{
    type: string;
    status: 'dispatching' | 'en_route' | 'on_site' | 'resolved';
    driverName: string;
    driverPhone: string;
    truckPlate: string;
    etaMinutes: number;
  } | null>(null);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [locationAddress, setLocationAddress] = useState('I-280 South, Exit 12 (Current GPS Signal)');

  const handleRequestService = (serviceName: string) => {
    setActiveRescue({
      type: serviceName,
      status: 'dispatching',
      driverName: 'Marcus Vance',
      driverPhone: '(555) 892-1140',
      truckPlate: 'RESCUE-42',
      etaMinutes: 12,
    });

    // Simulate en_route after 3 seconds
    setTimeout(() => {
      setActiveRescue(prev => prev ? { ...prev, status: 'en_route', etaMinutes: 9 } : null);
    }, 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Top Welcome & Member Header */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-[#E3ECE7] shadow-natural-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3D5E51] to-[#4F7868] text-white flex items-center justify-center font-bold text-xl font-heading shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold font-heading text-[#242E28]">{user.name}</h2>
              <span className="text-[11px] font-bold text-[#355B4D] bg-[#E8F3EE] px-2.5 py-0.5 rounded-full border border-[#D0E4DC]">
                {user.membershipTier}
              </span>
            </div>
            <p className="text-xs text-[#63756C] flex items-center gap-2">
              <span>{user.vehicleType}</span>
              {user.vehiclePlate && <span>• Plate: <strong className="text-[#323E38]">{user.vehiclePlate}</strong></span>}
              <span>• Phone: <strong className="text-[#323E38]">{user.phone}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={onOpenEmergencyHotline}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FDF0EC] hover:bg-[#FCE2DA] text-[#C85A3F] border border-[#FAD8CE] text-xs font-bold transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 Hotline</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F4F7F5] hover:bg-[#EAEFEA] text-[#556960] border border-[#DEECE5] text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Active Rescue Live Tracker (if requested) */}
      <AnimatePresence>
        {activeRescue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#2D453C] rounded-[28px] p-6 sm:p-7 text-white shadow-xl overflow-hidden relative"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-emerald-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base">{activeRescue.type} in Progress</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-md">
                      {activeRescue.status === 'dispatching' ? 'Dispatching Unit' : 'Rescue Unit En Route'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/70">
                    Rescue Technician: <strong className="text-white">{activeRescue.driverName}</strong> ({activeRescue.truckPlate})
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[11px] text-emerald-200/80 block">Estimated Arrival</span>
                <span className="text-2xl font-bold font-heading text-emerald-300">
                  ~{activeRescue.etaMinutes} mins
                </span>
              </div>
            </div>

            {/* Progress line */}
            <div className="bg-black/20 rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs text-emerald-100/90 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span>GPS Target: <strong>{locationAddress}</strong></span>
              </div>
              <button
                onClick={() => setActiveRescue(null)}
                className="text-[11px] text-emerald-200 hover:text-white underline cursor-pointer"
              >
                Cancel request
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs text-emerald-200/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Technician is certified, background-checked, and equipped with GPS live telemetry.
              </span>
              <a
                href={`tel:${activeRescue.driverPhone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-bold text-xs transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call Driver</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instant Assistance Trigger Grid */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-[#E3ECE7] shadow-natural-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold font-heading text-[#232E28]">
              Request One-Touch Roadside Assistance
            </h3>
            <p className="text-xs text-[#63796E]">
              Select the service you need right now. A certified technician will be dispatched instantly to your coordinates.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-[#3E6657] font-semibold bg-[#EAF2EE] px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>24/7 Available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Flatbed Towing',
              desc: 'Towing up to 25 miles to mechanic or home',
              icon: <Truck className="w-5 h-5" />,
              color: 'bg-[#EBF3EF] text-[#2F594A]',
              btnColor: 'bg-[#375A4C]',
            },
            {
              name: 'Battery Boost & Jump',
              desc: 'High capacity jumpstart & battery test',
              icon: <BatteryCharging className="w-5 h-5" />,
              color: 'bg-[#FDF6EC] text-[#7A5424]',
              btnColor: 'bg-[#7A5424]',
            },
            {
              name: 'Flat Tire Replacement',
              desc: 'Spare tire swap or mobile tire sealant',
              icon: <Wrench className="w-5 h-5" />,
              color: 'bg-[#EFF5F9] text-[#34546B]',
              btnColor: 'bg-[#34546B]',
            },
            {
              name: 'Vehicle Lockout Rescue',
              desc: 'Damage-free vehicle unlocking',
              icon: <Key className="w-5 h-5" />,
              color: 'bg-[#F9EFF8] text-[#693E66]',
              btnColor: 'bg-[#693E66]',
            },
            {
              name: 'Emergency Fuel / EV Charge',
              desc: '2 Gallons of gas or quick mobile EV boost',
              icon: <Fuel className="w-5 h-5" />,
              color: 'bg-[#FDF1EE] text-[#9A422D]',
              btnColor: 'bg-[#9A422D]',
            },
            {
              name: 'Stuck / Winch-Out Rescue',
              desc: 'Extrication from snow, mud, or ditch',
              icon: <Navigation className="w-5 h-5" />,
              color: 'bg-[#F1F3EE] text-[#485642]',
              btnColor: 'bg-[#485642]',
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-[#E3ECE7] bg-[#FAFBF9] hover:bg-white hover:border-[#CCDED4] transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                  {s.icon}
                </div>
                <h4 className="font-bold text-xs text-[#243029] mb-1">{s.name}</h4>
                <p className="text-[11px] text-[#63796E] leading-relaxed mb-4">{s.desc}</p>
              </div>

              <button
                onClick={() => handleRequestService(s.name)}
                className={`w-full py-2 px-3 rounded-xl text-white text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 ${s.btnColor}`}
              >
                <span>Dispatch {s.name.split(' ')[0]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & ICE Contact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[#E3ECE7] p-5">
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake className="w-4 h-4 text-[#4A7A6B]" />
            <h4 className="font-bold text-xs text-[#25322B]">In Case of Emergency (ICE) Contact</h4>
          </div>
          <p className="text-xs text-[#63786E] mb-2">
            In the event of a serious breakdown, your designated ICE contact is notified automatically with status updates:
          </p>
          <div className="p-3 rounded-xl bg-[#F6FAF8] border border-[#DEECE5] text-xs">
            <div className="font-semibold text-[#2E3C35]">
              {user.emergencyContactName || 'Designated Family Contact'}
            </div>
            <div className="text-[#64796F]">
              {user.emergencyContactPhone || user.phone}
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[#E3ECE7] p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-[#4A7A6B]" />
            <h4 className="font-bold text-xs text-[#25322B]">Member Benefits Included</h4>
          </div>
          <ul className="text-xs text-[#5D7368] space-y-1.5">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7A6B]" />
              <span>Unlimited nationwide 24/7 callouts</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7A6B]" />
              <span>GPS live telemetry technician tracking</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7A6B]" />
              <span>Zero deductible on basic flat tire & jumpstarts</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};
