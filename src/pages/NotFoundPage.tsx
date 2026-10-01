import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-6 bg-white rounded-md border border-[#CBD5E1] shadow-gov-card space-y-4">
        <div className="w-12 h-12 rounded-sm bg-[#EAF0F6] border border-[#CBD5E1] mx-auto flex items-center justify-center text-[#1479C9]">
          <Compass className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#802626] bg-[#FCEDEC] px-2 py-0.5 rounded-xs border border-[#EEA9A7] uppercase tracking-wider inline-block">
            HTTP 404 • ROUTE UNMAPPED
          </span>
          <h2 className="text-base font-bold text-[#0B1F33] uppercase font-mono tracking-tight mt-1">
            Atmospheric Coordinate Not Found
          </h2>
          <p className="text-xs text-[#4B5B6D] leading-relaxed">
            The requested meteorological route does not exist within the Koraput Mausam Intelligence decision support system.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/overview"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-[#0B1F33] hover:bg-[#142B44] text-white text-xs font-mono font-bold tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#439EE0]" />
            <span>Return to District Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
