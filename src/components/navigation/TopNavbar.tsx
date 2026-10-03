import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sprout, LayoutDashboard, Radio } from 'lucide-react';
import { useActiveRoute } from '../../hooks/useActiveRoute';
import { LocationSelector } from '../design-system/LocationSelector';
import { LiveWeatherTicker } from '../design-system/LiveWeatherTicker';
import { useI18n } from '../../i18n';
import { cn } from '../../utils/cn';

interface TopNavbarProps {
  onToggleMobileNav: () => void;
}

export function TopNavbar({ onToggleMobileNav }: TopNavbarProps) {
  const { pageTitle } = useActiveRoute();
  const location = useLocation();
  const isFarmerMode = location.pathname === '/farmer';
  const { language, setLanguage } = useI18n();

  const [fontScale, setFontScale] = React.useState<'sm' | 'md' | 'lg'>('md');

  const handleFontScaleChange = (scale: 'sm' | 'md' | 'lg') => {
    setFontScale(scale);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${scale}`);
  };

  return (
    <header className="h-14 bg-[#071324] border-b border-[#1E354D] px-3.5 md:px-5 flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_10px_rgba(0,0,0,0.25)] select-none text-white">
      {/* Left: Mobile Toggle & Regional Institutional Context */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="lg:hidden p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Branding & Current Region */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm font-mono tracking-wider text-white">
              MONSOON-X
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
          </div>

          {/* Region Badge with Coordinates */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-white/[0.07] px-2.5 py-1 rounded-sm border border-slate-700/80">
            <span className="text-[#38BDF8] font-bold">KORAPUT</span>
            <span className="text-slate-500 hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:inline font-sans">Odisha</span>
            <span className="text-slate-500 hidden xl:inline">· 18°48'N, 82°42'E</span>
          </div>

          {/* Page context breadcrumb on wider screens */}
          <span className="hidden xl:inline-block text-xs font-mono text-[#38BDF8] font-semibold">
            / {pageTitle}
          </span>
        </div>
      </div>

      {/* Right: Telemetry Status, Weather Summary, Language Switcher, Location Selector */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Live Status Indicator: LIVE / DATA UPDATED */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold tracking-tight shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>LIVE / DATA UPDATED</span>
        </div>

        {/* Current Weather Summary via LiveWeatherTicker */}
        <div className="hidden lg:block text-slate-300">
          <LiveWeatherTicker />
        </div>

        {/* Display Text Scaling: A- | A | A+ */}
        <div className="hidden sm:flex items-center bg-[#0B1F33] border border-[#1E354D] rounded-lg p-0.5 text-xs font-mono shadow-sm">
          <button
            type="button"
            onClick={() => handleFontScaleChange('sm')}
            className={cn(
              'px-2 py-0.5 rounded-md transition-all font-bold text-[11px] cursor-pointer',
              fontScale === 'sm' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            )}
            title="Compact Font (A-)"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => handleFontScaleChange('md')}
            className={cn(
              'px-2 py-0.5 rounded-md transition-all font-bold text-[11px] cursor-pointer',
              fontScale === 'md' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            )}
            title="Standard Font (A)"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => handleFontScaleChange('lg')}
            className={cn(
              'px-2 py-0.5 rounded-md transition-all font-bold text-[11px] cursor-pointer',
              fontScale === 'lg' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            )}
            title="Large Presentation Font (A+)"
          >
            A+
          </button>
        </div>

        {/* Language Selector: English | ଓଡ଼ିଆ | हिंदी */}
        <div className="flex items-center bg-[#0B1F33] border border-[#1E354D] rounded-lg p-0.5 text-[11px] font-medium font-sans shadow-sm">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={cn(
              'px-2 py-0.5 rounded-md transition-all font-semibold cursor-pointer',
              language === 'en'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
            title="Switch to English"
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('or')}
            className={cn(
              'px-2 py-0.5 rounded-md transition-all font-semibold cursor-pointer',
              language === 'or'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
            title="ଓଡ଼ିଆ ଭାଷାକୁ ପରିବର୍ତ୍ତନ କରନ୍ତୁ"
          >
            ଓଡ଼ିଆ
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={cn(
              'px-2 py-0.5 rounded-md transition-all font-semibold cursor-pointer',
              language === 'hi'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
            title="हिन्दी में बदलें"
          >
            हिंदी
          </button>
        </div>

        {/* Location Selector (14 Blocks) */}
        <LocationSelector />

        {/* Farmer / Officer Mode Quick Jump */}
        {isFarmerMode ? (
          <Link
            to="/officer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#0284C7] text-white text-xs font-semibold hover:bg-[#0369A1] transition-colors border border-[#38BDF8]/40 shadow-xs"
            title="Switch to Agriculture Officer Operations Command"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
            <span className="hidden lg:inline">Officer Command</span>
          </Link>
        ) : (
          <Link
            to="/farmer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#15803D]/30 text-[#86EFAC] border border-[#15803D]/60 text-xs font-semibold hover:bg-[#15803D]/50 transition-colors shadow-xs"
            title="Switch to Simplified Farmer Mode (Odia / Hindi / English)"
          >
            <Sprout className="w-3.5 h-3.5 text-[#86EFAC]" />
            <span className="hidden lg:inline">Farmer Mode</span>
          </Link>
        )}
      </div>
    </header>
  );
}

