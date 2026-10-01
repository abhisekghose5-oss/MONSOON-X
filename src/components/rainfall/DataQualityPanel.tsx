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
      <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 animate-pulse h-36" />
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
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 space-y-3.5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0284C7]" />
            <h4 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33]">
              DATA QUALITY & COMPLETENESS TELEMETRY
            </h4>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Empirical data completeness calculated directly from ingested daily observation records without synthetic imputation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataStatusBadge status={status} size="xs" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Coverage % */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Coverage %
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#059669]">
              {coveragePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="h-full bg-[#059669] rounded-full"
              style={{ width: `${coveragePercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Records Available */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Records Available
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#0B1F33]">
              {recordsAvailable}
            </span>
            <span className="text-xs font-mono text-[#64748B]">/ {totalExpectedDays}</span>
          </div>
          <span className="text-[10px] font-mono text-[#64748B] block truncate">
            Valid daily observations
          </span>
        </div>

        {/* Metric 3: Missing Records */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Missing Records
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono ${missingRecords > 0 ? 'text-[#DC2626]' : 'text-[#0B1F33]'}`}>
              {missingRecords}
            </span>
            <span className="text-xs font-mono text-[#64748B]">({missingPct}%)</span>
          </div>
          <span className="text-[10px] font-mono text-[#64748B] block truncate">
            Unrecorded / gaps
          </span>
        </div>

        {/* Metric 4: Last Observation */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Last Observation
          </span>
          <div className="text-sm font-bold font-mono text-[#0B1F33] pt-1">
            {lastObservationDate}
          </div>
          <span className="text-[10px] font-mono text-[#64748B] block truncate">
            08:30 IST reading
          </span>
        </div>

        {/* Metric 5: Source */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono text-[#64748B] block truncate">
            Data Source
          </span>
          <div className="text-xs font-bold font-mono text-[#0284C7] truncate pt-1" title={source}>
            {source}
          </div>
          <span className="text-[10px] font-mono text-[#64748B] block truncate">
            Gridded 0.25° resolution
          </span>
        </div>
      </div>
    </div>
  );
}
export default DataQualityPanel;
