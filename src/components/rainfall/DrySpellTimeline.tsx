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
      <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 animate-pulse h-40" />
    );
  }

  const getSeverityBadge = (severity: 'LOW' | 'MODERATE' | 'HIGH') => {
    switch (severity) {
      case 'HIGH':
        return {
          bg: 'bg-[#FEF2F2]',
          text: 'text-[#DC2626]',
          border: 'border-[#FECACA]',
          label: 'HIGH SEVERITY (≥15d)',
        };
      case 'MODERATE':
        return {
          bg: 'bg-[#FFFBEB]',
          text: 'text-[#D97706]',
          border: 'border-[#FDE68A]',
          label: 'MODERATE (8–14d)',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-[#EFF6FF]',
          text: 'text-[#0284C7]',
          border: 'border-[#BFDBFE]',
          label: 'LOW (5–7d)',
        };
    }
  };

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 space-y-3.5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2.5">
        <div>
          <h4 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33]">
            DRY SPELL EPISODES TIMELINE
          </h4>
          <p className="text-xs text-[#64748B]">
            Identified dry streaks during Kharif season with duration and agricultural risk severity.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <span>Low (5-7d)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
            <span>Mod (8-14d)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <span>High (≥15d)</span>
          </span>
        </div>
      </div>

      {drySpells.length === 0 ? (
        <div className="p-6 text-center text-xs font-mono text-[#64748B] bg-[#F8FAFC] rounded-xs border border-dashed border-[#CBD5E1]">
          No major dry spell episodes (≥{DRY_SPELL_SEVERITY_THRESHOLDS.MIN_DRY_SPELL_DAYS} days) detected in the selected window.
        </div>
      ) : (
        <div className="space-y-2.5">
          {drySpells.map((spell, idx) => {
            const badge = getSeverityBadge(spell.severity);
            return (
              <div
                key={spell.id || idx}
                className="p-3 rounded-xs border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white hover:border-[#94A3B8] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
              >
                {/* Left: Duration & Dates */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xs bg-[#0B1F33] text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-base font-bold leading-none">{spell.durationDays}</span>
                    <span className="text-[9px] uppercase tracking-wider text-[#94A3B8]">Days</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0B1F33]">
                        {spell.startDate} to {spell.endDate}
                      </span>
                      {spell.status === 'ACTIVE' && (
                        <span className="px-1.5 py-0.2 rounded-xs bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[10px] font-bold">
                          CURRENTLY ONGOING
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Max 24h rainfall during episode: <strong>{spell.maxDailyRainfallMm} mm</strong>
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
