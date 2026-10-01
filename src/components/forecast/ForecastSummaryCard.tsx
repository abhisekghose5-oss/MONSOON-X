import React from 'react';
import type { ForecastSummaryNarrative } from '../../types/forecast';
import { FileText, AlertTriangle, ShieldCheck, Zap, Wind } from 'lucide-react';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface ForecastSummaryCardProps {
  summary: ForecastSummaryNarrative;
}

export function ForecastSummaryCard({ summary }: ForecastSummaryCardProps) {
  return (
    <div className="rounded-md border border-[#E2E8F0] bg-white shadow-gov-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F5F7FA]/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#1479C9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
            Meteorological Forecast Synopsis
          </h3>
        </div>
        <DataSourceBadge source="IMD-NCMRWF Synoptic Desk" type="survey" size="sm" />
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Headline */}
        <div className="border-l-4 border-l-[#1479C9] pl-3 py-0.5">
          <h4 className="text-sm font-bold text-[#0B1F33] font-sans">
            {summary.headline}
          </h4>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          {/* Synoptic Dynamics */}
          <div className="space-y-1.5 p-3 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1]">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#0B1F33] uppercase">
              <Wind className="w-3.5 h-3.5 text-[#1479C9]" />
              <span>Synoptic Circulation & Dynamics</span>
            </div>
            <p className="text-[#4B5B6D] leading-relaxed">
              {summary.synopticDynamics}
            </p>
          </div>

          {/* Primary Hazard Window */}
          <div className="space-y-1.5 p-3 rounded-sm bg-[#FCEDEC] border border-[#EEA9A7]">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#802626] uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-[#C43D3D]" />
              <span>Critical Risk Window</span>
            </div>
            <p className="text-[#802626] leading-relaxed font-semibold">
              {summary.primaryHazardWindow}
            </p>
          </div>

          {/* Agricultural Impact */}
          <div className="space-y-1.5 p-3 rounded-sm bg-[#EDF7F1] border border-[#ABD7C0]">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#154D2F] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#247A4A]" />
              <span>Agronomic Impact & Operations</span>
            </div>
            <p className="text-[#154D2F] leading-relaxed">
              {summary.agriculturalImpact}
            </p>
          </div>

          {/* Convective Thunderstorm Outlook */}
          <div className="space-y-1.5 p-3 rounded-sm bg-[#FDF7EB] border border-[#F4D79C]">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#8C5D00] uppercase">
              <Zap className="w-3.5 h-3.5 text-[#D99000]" />
              <span>Severe Convective & Lightning Risk</span>
            </div>
            <p className="text-[#8C5D00] leading-relaxed">
              {summary.convectiveOutlook}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
