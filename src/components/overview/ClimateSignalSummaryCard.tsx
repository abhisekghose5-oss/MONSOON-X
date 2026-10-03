import React from 'react';
import type { ClimateSignalOverview } from '../../types/overview';
import { Globe2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ClimateSignalSummaryCardProps {
  signals: ClimateSignalOverview[];
}

export function ClimateSignalSummaryCard({ signals }: ClimateSignalSummaryCardProps) {
  const trendBadges = {
    Favorable: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    Neutral: 'bg-slate-800/60 text-slate-300 border-slate-600/40',
    Suppressing: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    Delayed: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {signals.map((signal) => (
        <div
          key={signal.index}
          className="rounded-lg border border-[#1E354D] bg-[#0A192F] p-4 shadow-command-panel hover:border-[#0284C7]/50 transition-all space-y-2.5 text-white"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              {signal.index}
            </span>
            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded-xs border font-semibold uppercase',
                trendBadges[signal.monsoonTrendContribution]
              )}
            >
              {signal.monsoonTrendContribution}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white leading-snug font-sans">
              {signal.currentPhase}
            </div>
            <div className="text-[11px] font-mono text-[#38BDF8]">
              {signal.anomalyValue}
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-[#1E354D] font-sans">
            {signal.impactOnKoraput}
          </p>
        </div>
      ))}
    </div>
  );
}
