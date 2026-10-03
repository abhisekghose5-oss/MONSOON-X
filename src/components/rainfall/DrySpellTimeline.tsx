import React from 'react';
import type { DrySpell } from '../../types/rainfall';
import { DRY_SPELL_SEVERITY_THRESHOLDS } from '../../config/meteorology';

export interface DrySpellTimelineProps {
  drySpells: DrySpell[];
  isLoading?: boolean;
}

export function DrySpellTimeline({ drySpells, isLoading = false }: DrySpellTimelineProps) {
  if (isLoading) {
    return (
      <div className="bg-[#0A192F]/85 border border-[#1E354D] rounded-md p-4 animate-pulse h-40" />
    );
  }

  const getSeverityBadge = (severity: 'LOW' | 'MODERATE' | 'HIGH') => {
    switch (severity) {
      case 'HIGH':
        return {
          bg: 'bg-rose-950/50',
          text: 'text-rose-400',
          border: 'border-rose-500/40',
          label: 'HIGH SEVERITY (≥15d)',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-950/50',
          text: 'text-amber-400',
          border: 'border-amber-500/40',
          label: 'MODERATE (8–14d)',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-sky-950/50',
          text: 'text-sky-400',
          border: 'border-sky-500/40',
          label: 'LOW (5–7d)',
        };
    }
  };

  return (
    <div className="bg-[#0A192F]/85 backdrop-blur-md border border-[#1E354D] rounded-md p-4 space-y-3.5 shadow-command-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E354D] pb-2.5">
        <div>
          <h4 className="font-bold font-mono text-sm tracking-tight text-white">
            DRY SPELL EPISODES TIMELINE
          </h4>
          <p className="text-xs text-slate-400">
            Identified dry streaks during Kharif season with duration and agricultural risk severity.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
            <span>Low (5-7d)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span>Mod (8-14d)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
            <span>High (≥15d)</span>
          </span>
        </div>
      </div>

      {drySpells.length === 0 ? (
        <div className="p-6 text-center text-xs font-mono text-slate-400 bg-[#071324] rounded-xs border border-dashed border-[#1E354D]">
          No major dry spell episodes (≥{DRY_SPELL_SEVERITY_THRESHOLDS.MIN_DRY_SPELL_DAYS} days) detected in the selected window.
        </div>
      ) : (
        <div className="space-y-2.5">
          {drySpells.map((spell, idx) => {
            const badge = getSeverityBadge(spell.severity);
            return (
              <div
                key={spell.id || idx}
                className="p-3 rounded-xs border border-[#1E354D] bg-[#071324] hover:bg-[#0D2038] hover:border-[#38BDF8]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
              >
                {/* Left: Duration & Dates */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xs bg-[#030914] border border-[#1E354D] text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-base font-bold leading-none text-[#38BDF8]">{spell.durationDays}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Days</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {spell.startDate} to {spell.endDate}
                      </span>
                      {spell.status === 'ACTIVE' && (
                        <span className="px-1.5 py-0.2 rounded-xs bg-rose-950/60 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                          CURRENTLY ONGOING
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Max 24h rainfall during episode: <strong className="text-slate-200">{spell.maxDailyRainfallMm} mm</strong>
                    </div>
                  </div>
                </div>

                {/* Right: Severity Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-xs font-bold border text-[11px] ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default DrySpellTimeline;
