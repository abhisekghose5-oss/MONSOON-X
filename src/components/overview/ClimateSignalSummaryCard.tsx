import React from 'react';
import type { ClimateSignalOverview } from '../../types/overview';
import { Globe2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ClimateSignalSummaryCardProps {
  signals: ClimateSignalOverview[];
}

export function ClimateSignalSummaryCard({ signals }: ClimateSignalSummaryCardProps) {
  const trendBadges = {
    Favorable: 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]',
    Neutral: 'bg-[#F0F3F7] text-[#4B5B6D] border-[#CBD5E1]',
    Suppressing: 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]',
    Delayed: 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {signals.map((signal) => (
        <div
          key={signal.index}
          className="rounded-sm border border-[#E2E8F0] bg-white p-3.5 shadow-gov-card space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#0B1F33] flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#1479C9]" />
              {signal.index}
            </span>
            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.2 rounded-xs border font-semibold uppercase',
                trendBadges[signal.monsoonTrendContribution]
              )}
            >
              {signal.monsoonTrendContribution}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#16202A] leading-snug">
              {signal.currentPhase}
            </div>
            <div className="text-[11px] font-mono text-[#6E7F94]">
              {signal.anomalyValue}
            </div>
          </div>

          <p className="text-[11px] text-[#4B5B6D] leading-relaxed pt-1.5 border-t border-[#F0F3F7]">
            {signal.impactOnKoraput}
          </p>
        </div>
      ))}
    </div>
  );
}
