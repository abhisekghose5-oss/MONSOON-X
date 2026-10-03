import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 bg-[#0A192F]/90 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-5 backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
          <Compass className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-bold text-rose-300 bg-rose-950/40 px-2.5 py-0.5 rounded-lg border border-rose-500/40 uppercase tracking-wider inline-block">
            HTTP 404 • ROUTE UNMAPPED
          </span>
          <h2 className="text-lg font-black text-white uppercase font-mono tracking-tight mt-1">
            Atmospheric Coordinate Not Found
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested meteorological route does not exist within the MONSOON-X decision support system.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/overview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-cyan-600/30"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-200" />
            <span>Return to District Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
