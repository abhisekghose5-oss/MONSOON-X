import React from 'react';
import { Activity } from 'lucide-react';
import { DataStatusBadge } from '../design-system/DataStatusBadge';
import type { RainfallDataQuality } from '../../types/rainfall';

export interface DataQualityPanelProps {
  quality: RainfallDataQuality;
  isLoading?: boolean;
}

export function DataQualityPanel({
  quality,
  isLoading = false,
}: DataQualityPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-[#0A192F]/85 border border-[#1E354D] rounded-md p-4 animate-pulse h-36" />
    );
  }

  const {
    totalExpectedDays,
    recordsAvailable,
    missingRecords,
    coveragePercentage,
    lastObservationDate,
    source,
    status,
  } = quality;

  const missingPct = totalExpectedDays > 0
    ? Math.round((missingRecords / totalExpectedDays) * 1000) / 10
    : 0;

  return (
    <div className="bg-[#0A192F]/85 backdrop-blur-md border border-[#1E354D] rounded-md p-4 space-y-3.5 shadow-command-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E354D] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            <h4 className="font-bold font-mono text-sm tracking-tight text-white">
              DATA QUALITY & COMPLETENESS TELEMETRY
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical data completeness calculated directly from ingested daily observation records without synthetic imputation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataStatusBadge status={status} size="xs" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Coverage % */}
        <div className="p-3 rounded-xs bg-[#071324] border border-[#1E354D] space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block truncate">
            Coverage %
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#4ADE80]">
              {coveragePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-[#030914] border border-[#1E354D] rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="h-full bg-[#10B981] rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]"
              style={{ width: `${coveragePercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Records Available */}
        <div className="p-3 rounded-xs bg-[#071324] border border-[#1E354D] space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block truncate">
            Records Available
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">
              {recordsAvailable}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {totalExpectedDays}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 block truncate">
            Valid daily observations
          </span>
        </div>

        {/* Metric 3: Missing Records */}
        <div className="p-3 rounded-xs bg-[#071324] border border-[#1E354D] space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block truncate">
            Missing Records
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono ${missingRecords > 0 ? 'text-[#F87171]' : 'text-white'}`}>
              {missingRecords}
            </span>
            <span className="text-xs font-mono text-slate-400">({missingPct}%)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 block truncate">
            Unrecorded / gaps
          </span>
        </div>

        {/* Metric 4: Last Observation */}
        <div className="p-3 rounded-xs bg-[#071324] border border-[#1E354D] space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block truncate">
            Last Observation
          </span>
          <div className="text-sm font-bold font-mono text-white pt-1">
            {lastObservationDate}
          </div>
          <span className="text-[10px] font-mono text-slate-500 block truncate">
            08:30 IST reading
          </span>
        </div>

        {/* Metric 5: Source */}
        <div className="p-3 rounded-xs bg-[#071324] border border-[#1E354D] space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono text-slate-400 block truncate">
            Data Source
          </span>
          <div className="text-xs font-bold font-mono text-[#38BDF8] truncate pt-1" title={source}>
            {source}
          </div>
          <span className="text-[10px] font-mono text-slate-500 block truncate">
            Gridded 0.25° resolution
          </span>
        </div>
      </div>
    </div>
  );
}
export default DataQualityPanel;
