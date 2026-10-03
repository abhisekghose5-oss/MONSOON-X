import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { MobileNav } from '../components/navigation/MobileNav';
import { SYSTEM_METADATA } from '../data/systemMetadata';
import { ShieldCheck, Cpu, Database } from 'lucide-react';

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060D17] text-slate-100 font-sans">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#0284C7] focus:text-white focus:font-mono focus:text-xs focus:font-bold focus:shadow-lg focus:rounded-xs focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Desktop Persistent Institutional Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Slide-over Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#060D17]">
        {/* Top Navbar with Live Weather Ticker & Trilingual Selector */}
        <TopNavbar onToggleMobileNav={() => setMobileNavOpen(true)} />

        {/* Dynamic Route Content Canvas with Tactical Atmospheric Backdrop */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto px-3.5 py-5 sm:px-6 sm:py-6 gov-grid focus:outline-hidden relative"
        >
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#0284C7]/8 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-[#10B981]/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-6 relative z-10">
            <Outlet />
          </div>
        </main>

        {/* Institutional Operational Status Bar */}
        <footer className="h-8 bg-[#071324] text-slate-300 border-t border-[#1E354D] px-4 md:px-6 flex items-center justify-between text-[11px] font-mono select-none shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#38BDF8]">
              <Cpu className="w-3.5 h-3.5" />
              <span>{SYSTEM_METADATA.spatialResolution}</span>
            </span>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>IMD / ECMWF / Open-Meteo Pipeline</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden md:inline">SIH26086 Koraput Pilot Node</span>
              <span className="md:hidden">SIH26086</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">DSS {SYSTEM_METADATA.engineVersion}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
