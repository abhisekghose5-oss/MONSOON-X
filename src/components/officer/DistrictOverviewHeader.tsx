import React from 'react';
import type { DistrictOfficerOverview } from '../../types/officer';
import {
  MapPin,
  AlertOctagon,
  ShieldAlert,
  Send,
  Radio,
  Cpu,
} from 'lucide-react';

interface DistrictOverviewHeaderProps {
  overview: DistrictOfficerOverview;
  className?: string;
}

export function DistrictOverviewHeader({ overview, className = '' }: DistrictOverviewHeaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Institutional Banner with Synoptic Cycle */}
      <div className="bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] p-3 shadow-command-panel flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-white">
        <div className="flex items-center gap-2">
          <span className="p-1 px-2.5 rounded-sm bg-rose-950/60 text-rose-300 border border-rose-500/40 font-mono font-bold flex items-center gap-1.5 text-[11px] tracking-wide">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            SYNOPTIC STATE: {overview.monsoonPhase}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
            Monitored: <strong className="text-white">{overview.blocksMonitored} Blocks</strong> · <strong className="text-white">{overview.panchayatCoverage} Gram Panchayats</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-[#38BDF8] bg-[#0284C7]/15 px-2 py-0.5 rounded-xs border border-[#0284C7]/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#38BDF8]" />
            <span>Telemetry: Live Sync</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>{overview.lastModelRun}</span>
          </span>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Kharif Area */}
        <div className="bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] p-4 shadow-command-panel border-l-4 border-l-[#0284C7] space-y-2 hover:border-[#0284C7]/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              TOTAL KHARIF ACREAGE
            </span>
            <div className="w-7 h-7 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#38BDF8]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              {overview.totalKharifAreaHa.toLocaleString()} ha
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Targeted across 14 Koraput Blocks
            </p>
          </div>
        </div>

        {/* Metric 2: High Risk Blocks */}
        <div className="bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] p-4 shadow-command-panel border-l-4 border-l-rose-500 space-y-2 hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300">
              HIGH-RISK WATCHLIST
            </span>
            <div className="w-7 h-7 rounded-sm bg-rose-950/60 border border-rose-500/40 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-rose-400 tracking-tight">
              {overview.highRiskBlocksCount} / 14 Blocks
            </div>
            <p className="text-[11px] text-rose-300/80 font-medium mt-0.5">
              Requires immediate BAO field intervention
            </p>
          </div>
        </div>

        {/* Metric 3: Active False-Onset Alerts */}
        <div className="bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] p-4 shadow-command-panel border-l-4 border-l-amber-500 space-y-2 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
              FALSE-ONSET ALERTS
            </span>
            <div className="w-7 h-7 rounded-sm bg-amber-950/60 border border-amber-500/40 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-amber-400 tracking-tight">
              {overview.criticalAlertsActive} Active Alerts
            </div>
            <p className="text-[11px] text-amber-300/80 mt-0.5">
              Transient rain followed by dry break
            </p>
          </div>
        </div>

        {/* Metric 4: Advisory Broadcast Reach */}
        <div className="bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] p-4 shadow-command-panel border-l-4 border-l-[#10B981] space-y-2 hover:border-[#10B981]/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
              ADVISORY DISPATCH
            </span>
            <div className="w-7 h-7 rounded-sm bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center">
              <Send className="w-4 h-4 text-[#4ADE80]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-white tracking-tight">
              {overview.farmerSmsReach.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5 font-mono">
              Farmers reached via mKisan & WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistrictOverviewHeader;
