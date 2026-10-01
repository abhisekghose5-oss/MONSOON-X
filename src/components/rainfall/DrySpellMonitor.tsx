import React from 'react';
import { Sun, ShieldCheck, Flame } from 'lucide-react';
import type { DrySpellMonitorStats } from '../../types/rainfall';
import { DRY_DAY_RAINFALL_THRESHOLD_MM } from '../../config/meteorology';

export interface DrySpellMonitorProps {
  stats: DrySpellMonitorStats;
  isLoading?: boolean;
}

export function DrySpellMonitor({ stats, isLoading = false }: DrySpellMonitorProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 animate-pulse h-48" />
    );
  }

  const {
    currentConsecutiveDryDays,
    longestDrySpellDays,
    averageDrySpellDays,
    totalDrySpellsCount,
    maxDrySpellCurrentMonsoon,
    activeDrySpell,
  } = stats;

  const isUnderStress = currentConsecutiveDryDays >= 5;

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#D97706]" />
            <h3 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33]">
              DRY SPELL MONITOR
            </h3>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Agricultural drought & break-monsoon tracking calibrated to IMD dry day threshold (&lt;{DRY_DAY_RAINFALL_THRESHOLD_MM} mm/day).
          </p>
        </div>

        {/* Active Status Badge */}
        <div className="flex items-center gap-2">
          {activeDrySpell ? (
            <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-xs bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              ACTIVE DRY SPELL ({activeDrySpell.durationDays} DAYS)
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-xs bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              NO ACTIVE BREAK MONSOON
            </span>
          )}
        </div>
      </div>

      {/* 5 Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Current Consecutive Dry Days */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Current Dry Days
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono ${isUnderStress ? 'text-[#DC2626]' : 'text-[#0B1F33]'}`}>
              {currentConsecutiveDryDays}
            </span>
            <span className="text-xs font-mono text-[#64748B]">days</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] block truncate">
            {currentConsecutiveDryDays === 0 ? 'Rainfall observed today' : `${currentConsecutiveDryDays} consecutive dry`}
          </span>
        </div>

        {/* Metric 2: Longest Dry Spell */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Longest Dry Spell
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#D97706]">
              {longestDrySpellDays}
            </span>
            <span className="text-xs font-mono text-[#64748B]">days</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] block truncate">
            Historical season max
          </span>
        </div>

        {/* Metric 3: Average Dry Spell */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Average Dry Spell
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#0B1F33]">
              {averageDrySpellDays}
            </span>
            <span className="text-xs font-mono text-[#64748B]">days</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] block truncate">
            Mean streak length
          </span>
        </div>

        {/* Metric 4: Number of Dry Spells */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Number of Dry Spells
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#0284C7]">
              {totalDrySpellsCount}
            </span>
            <span className="text-xs font-mono text-[#64748B]">episodes</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] block truncate">
            ≥3 consecutive dry days
          </span>
        </div>

        {/* Metric 5: Maximum Dry Spell Current Monsoon */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Max Spell (Current)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#B45309]">
              {maxDrySpellCurrentMonsoon}
            </span>
            <span className="text-xs font-mono text-[#64748B]">days</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] block truncate">
            Peak break episode
          </span>
        </div>
      </div>
    </div>
  );
}
export default DrySpellMonitor;
