import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sprout, LayoutDashboard } from 'lucide-react';
import { useActiveRoute } from '../../hooks/useActiveRoute';
import { LocationSelector } from '../design-system/LocationSelector';
import { LastUpdated } from '../design-system/LastUpdated';
import { SYSTEM_METADATA } from '../../data/systemMetadata';

interface TopNavbarProps {
  onToggleMobileNav: () => void;
}

export function TopNavbar({ onToggleMobileNav }: TopNavbarProps) {
  const { pageTitle, pageDescription } = useActiveRoute();
  const location = useLocation();
  const isFarmerMode = location.pathname === '/farmer';

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-gov-card">
      {/* Left: Mobile Navigation Button & Active Section */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-sm text-[#4B5B6D] hover:text-[#0B1F33] hover:bg-[#F5F7FA] border border-[#CBD5E1] focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-bold text-[#0B1F33] tracking-tight uppercase">
              {pageTitle}
            </h1>
            <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[#EAF0F6] text-[#0B1F33] border border-[#CBD5E1]">
              {SYSTEM_METADATA.sihProblemId}
            </span>
          </div>
          <span className="text-[11px] text-[#6E7F94] hidden md:block truncate max-w-md">
            {pageDescription}
          </span>
        </div>
      </div>

      {/* Right: Operational Controls & Location Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Farmer / Officer Mode Quick Switcher */}
        {isFarmerMode ? (
          <Link
            to="/officer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B1F33] text-white text-xs font-bold hover:bg-[#142B44] transition-all shadow-xs border border-[#1E354D] focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#1479C9]" />
            <span className="hidden sm:inline">Officer Mode</span>
            <span className="sm:hidden">Officer</span>
          </Link>
        ) : (
          <Link
            to="/farmer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] text-xs font-bold hover:bg-[#DDF0E5] transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-[#247A4A] focus-visible:outline-hidden"
          >
            <Sprout className="w-3.5 h-3.5 text-[#247A4A]" />
            <span className="hidden sm:inline">Farmer Mode (କୃଷକ)</span>
            <span className="sm:hidden">Farmer</span>
          </Link>
        )}

        {/* District & Block Location Selector */}
        <LocationSelector />

        {/* Real-time Synoptic Cycle Indicator */}
        <div className="hidden xl:flex items-center pl-3 border-l border-[#E2E8F0]">
          <LastUpdated isLive={true} cycle="Synoptic 03Z" />
        </div>
      </div>
    </header>
  );
}
