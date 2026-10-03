import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../data/navigationItems';
import { SYSTEM_METADATA } from '../../data/systemMetadata';
import { cn } from '../../utils/cn';
import {
  Compass,
  MapPin,
  Mountain,
  Activity,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  // 6 Exact Command Center Navigation Groups requested
  const categories = [
    {
      id: 'overview',
      title: 'OVERVIEW',
      items: NAVIGATION_ITEMS.filter((i) => i.category === 'overview'),
    },
    {
      id: 'monsoon-climate',
      title: 'MONSOON & CLIMATE',
      items: NAVIGATION_ITEMS.filter((i) => i.category === 'monsoon-climate'),
    },
    {
      id: 'precipitation',
      title: 'PRECIPITATION',
      items: NAVIGATION_ITEMS.filter((i) => i.category === 'precipitation'),
    },
    {
      id: 'agriculture',
      title: 'AGRICULTURE',
      items: NAVIGATION_ITEMS.filter((i) => i.category === 'agriculture'),
    },
    {
      id: 'operations',
      title: 'OPERATIONS',
      items: NAVIGATION_ITEMS.filter((i) => i.category === 'operations'),
    },
    {
      id: 'data',
      title: 'DATA',
      items: NAVIGATION_ITEMS.filter((i) => i.category === 'data'),
    },
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-[#0A192F] text-slate-200 border-r border-[#1E354D] flex flex-col h-full shrink-0 select-none shadow-command-panel',
        className
      )}
    >
      {/* Brand & Mission Header */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324]/80">
        <div className="flex items-center gap-3">
          {/* Professional Weather Radar / Climate Symbol */}
          <div className="w-9 h-9 rounded-md bg-[#0284C7]/20 border border-[#0284C7]/50 flex items-center justify-center text-[#38BDF8] shrink-0">
            <Compass className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider text-white font-mono">
                MONSOON-X
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-[#0284C7]/30 text-[#7DD3FC] border border-[#0284C7]/40">
                DSS
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans tracking-tight">
              Climate → Crop Intelligence
            </span>
          </div>
        </div>

        {/* Node & Telemetry Status Pill */}
        <div className="mt-3 pt-2.5 border-t border-[#1E354D]/70 flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] telemetry-pulse" />
            <span>KORAPUT NODE</span>
          </span>
          <span className="text-[#38BDF8] font-semibold bg-[#0284C7]/15 px-1.5 py-0.2 rounded-xs border border-[#0284C7]/30">
            {SYSTEM_METADATA.sihProblemId}
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {categories.map((group) => (
          <div key={group.id} className="space-y-0.5">
            <h4 className="px-2.5 text-[10px] font-mono font-bold tracking-wider text-slate-400/90 uppercase">
              {group.title}
            </h4>
            <div className="space-y-0.5 pt-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors group relative',
                        isActive
                          ? 'bg-[#0284C7] text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0 transition-colors',
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        />
                        <span className="truncate flex-1 tracking-tight">{item.name}</span>
                        {item.id === 'farmer' && (
                          <span
                            className={cn(
                              'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs shrink-0',
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#15803D]/30 text-[#86EFAC] border border-[#15803D]/40'
                            )}
                          >
                            ଓଡ଼ିଆ/हिंदी
                          </span>
                        )}
                        {item.id === 'officer' && (
                          <span
                            className={cn(
                              'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs shrink-0',
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#0284C7]/20 text-[#7DD3FC] border border-[#0284C7]/30'
                            )}
                          >
                            DAO
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

      {/* Pilot Region Institutional Operational Card */}
      <div className="p-3 border-t border-[#1E354D] bg-[#071324]">
        <div className="p-2 rounded-md bg-[#0A192F] border border-[#1E354D] text-slate-300 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-[#38BDF8]" /> Koraput (14 Blocks)
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Mountain className="w-3 h-3 text-[#4ADE80]" /> ~870m MSL
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-[#1E354D]/60">
            <span>Grid: 1.2 km² Downscaled</span>
            <span className="text-[#38BDF8]">IMD / ECMWF</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

