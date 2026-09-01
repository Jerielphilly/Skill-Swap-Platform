import React from 'react';
import { 
  Car, 
  BatteryCharging, 
  Key, 
  Fuel, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles,
  Truck
} from 'lucide-react';
import { RoadsideServiceType } from '../types';

export const RoadsideHighlights: React.FC<{ onSelectService?: (service: string) => void }> = ({ onSelectService }) => {
  const services: RoadsideServiceType[] = [
    {
      id: 'towing',
      title: 'Flatbed Towing',
      description: 'Damage-free flatbed tow to the nearest certified mechanic or home.',
      eta: '12-18 min',
      iconName: 'truck',
      color: 'text-[#3E6354]',
      accentBg: 'bg-[#EBF3EF] border-[#D7E8DF]',
      badge: 'Certified Drivers',
    },
    {
      id: 'battery',
      title: 'Battery Boost & Jump',
      description: 'Rapid alternator test and high-capacity portable jumpstart.',
      eta: '10-15 min',
      iconName: 'battery',
      color: 'text-[#8A612D]',
      accentBg: 'bg-[#FDF6ED] border-[#F4E3D0]',
      badge: 'All 12V & EV',
    },
    {
      id: 'tire',
      title: 'Flat Tire Change',
      description: 'Spare tire swap or on-site tire inflation and sealing.',
      eta: '15-20 min',
      iconName: 'wrench',
      color: 'text-[#3D5B73]',
      accentBg: 'bg-[#EFF5F9] border-[#D4E4EE]',
      badge: 'Lug nut & Jacking',
    },
    {
      id: 'lockout',
      title: 'Key & Lockout Service',
      description: 'Gentle non-destructive door unlock for locked keys inside vehicle.',
      eta: '14-19 min',
      iconName: 'key',
      color: 'text-[#70486D]',
      accentBg: 'bg-[#F9EFF8] border-[#EED7EC]',
      badge: 'Damage-Free',
    },
    {
      id: 'fuel',
      title: 'Emergency Fuel / EV Boost',
      description: '2 gallons of regular/premium gas, diesel, or mobile EV top-up.',
      eta: '12-16 min',
      iconName: 'fuel',
      color: 'text-[#9E4935]',
      accentBg: 'bg-[#FDF1EE] border-[#F6DCD4]',
      badge: 'Delivered to GPS',
    },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'battery': return <BatteryCharging className="w-5 h-5" />;
      case 'wrench': return <Wrench className="w-5 h-5" />;
      case 'key': return <Key className="w-5 h-5" />;
      case 'fuel': return <Fuel className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold font-heading text-[#27352E]">
            Included Roadside Protections
          </h3>
          <p className="text-xs text-[#63796E]">
            Available 24 hours a day, 365 days a year across all 50 states.
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#3C6454] bg-[#EAF2EE] px-2.5 py-1 rounded-full border border-[#D5E5DC]">
          <Clock className="w-3 h-3" />
          <span>Avg 14 min arrival</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectService?.(s.title)}
            className={`p-3.5 rounded-2xl border ${s.accentBg} transition-all hover:scale-[1.01] cursor-pointer bg-white/70 backdrop-blur-xs`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color} bg-white shadow-2xs`}>
                {renderIcon(s.iconName)}
              </div>
              <span className="text-[10px] font-bold text-[#4B6156] bg-white/80 px-2 py-0.5 rounded-md border border-[#E0ECE5]">
                {s.eta}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#232F28] mb-1">{s.title}</h4>
            <p className="text-[11px] text-[#63786E] leading-snug">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
