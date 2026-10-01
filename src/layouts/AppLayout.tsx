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
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F5F8FB] via-[#EEF4F9] to-[#F8FAFC] text-slate-800 font-sans">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:font-mono focus:text-xs focus:font-bold focus:shadow-lg focus:rounded-md focus:outline-hidden"
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
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar with Live Weather Ticker */}
        <TopNavbar onToggleMobileNav={() => setMobileNavOpen(true)} />

        {/* Dynamic Route Content Canvas */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-6 gov-grid focus:outline-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

        {/* Institutional Operational Status Bar */}
        <footer className="h-8.5 bg-[#06121E] text-white border-t border-[#182B3F] px-4 md:px-6 flex items-center justify-between text-[11px] font-mono select-none shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>{SYSTEM_METADATA.spatialResolution}</span>
            </span>
            <span className="hidden sm:inline-block text-slate-700">•</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>IMD / ECMWF / Open-Meteo Pipeline</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">SIH26086 Koraput Pilot Node</span>
              <span className="md:hidden">SIH26086</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">DSS {SYSTEM_METADATA.engineVersion}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
