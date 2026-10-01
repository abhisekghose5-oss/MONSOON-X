import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sprout, LayoutDashboard } from 'lucide-react';
import { useActiveRoute } from '../../hooks/useActiveRoute';
import { LocationSelector } from '../design-system/LocationSelector';
import { LastUpdated } from '../design-system/LastUpdated';
import { LiveWeatherTicker } from '../design-system/LiveWeatherTicker';
import { SYSTEM_METADATA } from '../../data/systemMetadata';

interface TopNavbarProps {
  onToggleMobileNav: () => void;
}

export function TopNavbar({ onToggleMobileNav }: TopNavbarProps) {
  const { pageTitle, pageDescription } = useActiveRoute();
  const location = useLocation();
  const isFarmerMode = location.pathname === '/farmer';

  return (
    <header className="h-16 glass-panel border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Navigation Button & Active Section */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-bold font-display text-slate-900 tracking-tight uppercase">
              {pageTitle}
            </h1>
            <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              {SYSTEM_METADATA.sihProblemId}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden md:block truncate max-w-md">
            {pageDescription}
          </span>
        </div>
      </div>

      {/* Right: Operational Controls, Weather Telemetry & Location Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Atmospheric Weather Ticker */}
        <LiveWeatherTicker />

        {/* Farmer / Officer Mode Quick Switcher */}
        {isFarmerMode ? (
          <Link
            to="/officer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs border border-slate-700 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-hidden"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Officer Mode</span>
            <span className="sm:hidden">Officer</span>
          </Link>
        ) : (
          <Link
            to="/farmer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-hidden"
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Farmer Mode (କୃଷକ)</span>
            <span className="sm:hidden">Farmer</span>
          </Link>
        )}

        {/* District & Block Location Selector */}
        <LocationSelector />

        {/* Real-time Synoptic Cycle Indicator */}
        <div className="hidden xl:flex items-center pl-3 border-l border-slate-200">
          <LastUpdated isLive={true} cycle="Synoptic 03Z" />
        </div>
      </div>
    </header>
  );
}
