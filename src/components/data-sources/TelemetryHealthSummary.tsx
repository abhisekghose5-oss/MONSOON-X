import React from 'react';
import type { TelemetryHealthStats } from '../../types/dataSources';
import { Database, Radio, Eye, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

interface TelemetryHealthSummaryProps {
  stats: TelemetryHealthStats;
  onRefresh?: () => void;
  className?: string;
}

export function TelemetryHealthSummary({
  stats,
  onRefresh,
  className = '',
}: TelemetryHealthSummaryProps) {
  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-md border border-[#E2E8F0] p-3.5 shadow-gov-card flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-xs bg-[#EDF7F1] text-[#154D2F] font-mono font-bold flex items-center gap-1.5 text-[11px] border border-[#ABD7C0]">
            <ShieldCheck className="w-4 h-4 text-[#247A4A]" />
            PIPELINE STATUS: {stats.pipelineStatus}
          </span>
          <span className="text-[11px] text-[#4B5B6D]">
            Telemetry Cycle: <strong className="text-[#0B1F33]">{stats.lastHealthCheck}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#6E7F94] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#1479C9]" /> Mean Latency: <strong>~{stats.avgLatencyMinutes} mins</strong>
          </span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#0B1F33] rounded-xs transition-colors border border-[#CBD5E1] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-[#1479C9]" />
              <span>SYNC CHECK</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Feeds */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-4 shadow-gov-card border-l-4 border-l-[#0B1F33] space-y-1.5">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              TOTAL CATALOGED FEEDS
            </span>
            <Database className="w-4 h-4 text-[#0B1F33]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#0B1F33] tracking-tight">
              {stats.totalFeeds} Sources
            </div>
            <p className="text-[11px] text-[#4B5B6D] mt-0.5">
              Across 6 Multi-Domain Categories
            </p>
          </div>
        </div>

        {/* Metric 2: Live In-Situ Feeds */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-4 shadow-gov-card border-l-4 border-l-[#247A4A] space-y-1.5">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              LIVE TELEMETRY
            </span>
            <Radio className="w-4 h-4 text-[#247A4A] animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#247A4A] tracking-tight">
              {stats.liveFeedsCount} Feeds
            </div>
            <p className="text-[11px] text-[#154D2F] font-semibold mt-0.5">
              Real-time AWS, Radar & Satellite
            </p>
          </div>
        </div>

        {/* Metric 3: Verified Observations */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-4 shadow-gov-card border-l-4 border-l-[#1479C9] space-y-1.5">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              PHYSICAL OBSERVATIONS
            </span>
            <Eye className="w-4 h-4 text-[#1479C9]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#1479C9] tracking-tight">
              17 Verified
            </div>
            <p className="text-[11px] text-[#4B5B6D] mt-0.5">
              Ground In-Situ, Radar & Sensors
            </p>
          </div>
        </div>

        {/* Metric 4: Simulation & Demo */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-4 shadow-gov-card border-l-4 border-l-[#D99000] space-y-1.5">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              DEMO / SIMULATION
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#D99000]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#D99000] tracking-tight">
              {stats.demoFeedsCount} Simulation Feed
            </div>
            <p className="text-[11px] text-[#8C5D00] font-semibold mt-0.5">
              Explicitly labeled SIH26086 Model
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
