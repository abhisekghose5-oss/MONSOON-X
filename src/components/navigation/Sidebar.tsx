import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../data/navigationItems';
import { SYSTEM_METADATA } from '../../data/systemMetadata';
import { StatusBadge } from '../design-system/StatusBadge';
import { cn } from '../../utils/cn';
import { Compass, Mountain, MapPin, Shield } from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const categories = [
    { id: 'core', title: 'OPERATIONAL COMMAND', items: NAVIGATION_ITEMS.filter((i) => i.category === 'core') },
    { id: 'hydrology', title: 'HYDROLOGY & MONSOON', items: NAVIGATION_ITEMS.filter((i) => i.category === 'hydrology') },
    { id: 'decision-support', title: 'AGRICULTURAL DECISIONS', items: NAVIGATION_ITEMS.filter((i) => i.category === 'decision-support') },
    { id: 'intelligence', title: 'VERIFICATION & TELEMETRY', items: NAVIGATION_ITEMS.filter((i) => i.category === 'intelligence') },
  ];

  return (
    <aside
      className={cn(
        'w-72 bg-gradient-to-b from-[#081524] via-[#0B1F33] to-[#050E18] text-white border-r border-[#1E354D]/80 flex flex-col h-full shrink-0 select-none shadow-xl',
        className
      )}
    >
      {/* Official Government / IMD Header Banner */}
      <div className="p-4 border-b border-[#1E354D]/70 bg-[#06121E]/60 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shrink-0 shadow-glow-blue border border-sky-400/40">
            <Compass className="w-5 h-5 animate-[spin_20s_linear_infinite]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider text-white font-display">MONSOON-X</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                DSS
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#A4BCDA] uppercase">
              Koraput Intelligence
            </span>
          </div>
        </div>

        {/* Institutional Accreditation Pill */}
        <div className="mt-3 pt-2.5 border-t border-[#1E354D]/60 flex items-center justify-between text-[11px]">
          <span className="text-[#A4BCDA] font-mono flex items-center gap-1">
            <Shield className="w-3 h-3 text-sky-400" /> SIH26086
          </span>
          <StatusBadge status="operational" size="sm" />
        </div>
      </div>

      {/* Navigation Links Grouped by Tier */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {categories.map((group) => (
          <div key={group.id} className="space-y-1">
            <h4 className="px-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300/70">
              {group.title}
            </h4>
            <div className="space-y-1 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-hidden',
                        isActive
                          ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold shadow-md shadow-sky-950/40'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0 transition-colors',
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-300'
                          )}
                        />
                        <span className="truncate flex-1 tracking-wide">{item.name}</span>
                        {item.id === 'farmer' && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                            LOW-TECH
                          </span>
                        )}
                        {item.id === 'officer' && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
                            GOV OPS
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pilot Region Institutional Card */}
      <div className="p-3 border-t border-[#1E354D] bg-[#071523]">
        <div className="p-2.5 rounded-sm bg-[#0B1F33] border border-[#1E354D] text-[#A4BCDA] text-[11px] space-y-1.5">
          <div className="flex items-center justify-between font-mono text-white text-[10px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1479C9]" /> 14 Blocks
            </span>
            <span className="flex items-center gap-1">
              <Mountain className="w-3 h-3 text-[#247A4A]" /> 380m - 1672m
            </span>
          </div>
          <p className="text-[10px] text-[#A4BCDA] leading-snug italic font-sans">
            "{SYSTEM_METADATA.tagline}"
          </p>
        </div>
      </div>
    </aside>
  );
}
