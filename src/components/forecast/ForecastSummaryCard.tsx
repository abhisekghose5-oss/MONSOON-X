import React from 'react';
import type { ForecastSummaryNarrative } from '../../types/forecast';
import { FileText, AlertTriangle, ShieldCheck, Zap, Wind } from 'lucide-react';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface ForecastSummaryCardProps {
  summary: ForecastSummaryNarrative;
}

export function ForecastSummaryCard({ summary }: ForecastSummaryCardProps) {
  return (
    <div className="rounded-md border border-[#1E354D] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Meteorological Forecast Synopsis
          </h3>
        </div>
        <DataSourceBadge source="IMD-NCMRWF Synoptic Desk" type="survey" size="sm" />
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Headline */}
        <div className="border-l-4 border-l-[#38BDF8] pl-3 py-0.5">
          <h4 className="text-sm font-bold text-white font-sans">
            {summary.headline}
          </h4>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          {/* Synoptic Dynamics */}
          <div className="space-y-1.5 p-3.5 rounded-sm bg-[#071324] border border-[#1E354D]">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-white uppercase">
              <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Synoptic Circulation & Dynamics</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {summary.synopticDynamics}
            </p>
          </div>

          {/* Primary Hazard Window */}
          <div className="space-y-1.5 p-3.5 rounded-sm bg-[#EF4444]/10 border border-[#EF4444]/30">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#F87171] uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Critical Risk Window</span>
            </div>
            <p className="text-rose-200 leading-relaxed font-semibold">
              {summary.primaryHazardWindow}
            </p>
          </div>

          {/* Agricultural Impact */}
          <div className="space-y-1.5 p-3.5 rounded-sm bg-[#10B981]/10 border border-[#10B981]/30">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#4ADE80] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Agronomic Impact & Operations</span>
            </div>
            <p className="text-emerald-200 leading-relaxed">
              {summary.agriculturalImpact}
            </p>
          </div>

          {/* Convective Thunderstorm Outlook */}
          <div className="space-y-1.5 p-3.5 rounded-sm bg-[#F59E0B]/10 border border-[#F59E0B]/30">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#FCD34D] uppercase">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Severe Convective & Lightning Risk</span>
            </div>
            <p className="text-amber-200 leading-relaxed">
              {summary.convectiveOutlook}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
