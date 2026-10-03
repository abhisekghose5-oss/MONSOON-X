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
    <div className={`space-y-4 ${className}`}>
      {/* Top Banner */}
      <div className="bg-[#0A192F]/85 rounded-xl border border-[#1E354D] p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 font-mono font-bold flex items-center gap-1.5 text-[11px] border border-emerald-500/40 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            PIPELINE STATUS: {stats.pipelineStatus}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Telemetry Cycle: <strong className="text-white">{stats.lastHealthCheck}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Mean Latency: <strong className="text-cyan-300">~{stats.avgLatencyMinutes} mins</strong>
          </span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="px-3 py-1 text-xs font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg transition-colors border border-cyan-500/30 flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span>SYNC CHECK</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Feeds */}
        <div className="bg-[#0A192F]/80 rounded-xl border border-[#1E354D] p-5 shadow-xl border-l-4 border-l-cyan-500 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              TOTAL CATALOGED FEEDS
            </span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              {stats.totalFeeds} Sources
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Across 6 Multi-Domain Categories
            </p>
          </div>
        </div>

        {/* Metric 2: Live In-Situ Feeds */}
        <div className="bg-[#0A192F]/80 rounded-xl border border-[#1E354D] p-5 shadow-xl border-l-4 border-l-emerald-500 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              LIVE TELEMETRY
            </span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
              {stats.liveFeedsCount} Feeds
            </div>
            <p className="text-[11px] text-emerald-300/90 font-medium mt-0.5 font-mono">
              Real-time AWS, Radar & Satellite
            </p>
          </div>
        </div>

        {/* Metric 3: Verified Observations */}
        <div className="bg-[#0A192F]/80 rounded-xl border border-[#1E354D] p-5 shadow-xl border-l-4 border-l-sky-500 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              PHYSICAL OBSERVATIONS
            </span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-sky-400 tracking-tight">
              17 Verified
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Ground In-Situ, Radar & Sensors
            </p>
          </div>
        </div>

        {/* Metric 4: Simulation & Demo */}
        <div className="bg-[#0A192F]/80 rounded-xl border border-[#1E354D] p-5 shadow-xl border-l-4 border-l-amber-500 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              DEMO / SIMULATION
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-amber-400 tracking-tight">
              {stats.demoFeedsCount} Simulation Feed
            </div>
            <p className="text-[11px] text-amber-300/90 font-medium mt-0.5 font-mono">
              Explicitly labeled SIH26086 Model
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
