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
      <div className="bg-white rounded-md border border-[#E2E8F0] p-3 shadow-gov-card flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-xs bg-[#FCEDEC] text-[#802626] border border-[#EEA9A7] font-mono font-bold flex items-center gap-1 text-[11px]">
            <AlertOctagon className="w-3.5 h-3.5" />
            SYNOPTIC STATE: {overview.monsoonPhase}
          </span>
          <span className="text-[11px] text-[#4B5B6D] hidden sm:inline">
            Monitored: <strong className="text-[#0B1F33]">{overview.blocksMonitored} Blocks</strong> · <strong className="text-[#0B1F33]">{overview.panchayatCoverage} Gram Panchayats</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-[#6E7F94]">
          <span className="flex items-center gap-1 text-[#1479C9]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry: Live Sync</span>
          </span>
          <span>|</span>
          <span className="flex items-center gap-1 text-[#0B1F33]">
            <Cpu className="w-3.5 h-3.5 text-[#247A4A]" />
            <span>{overview.lastModelRun}</span>
          </span>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Kharif Area */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-4 shadow-gov-card border-l-4 border-l-[#1479C9] space-y-2">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              TOTAL KHARIF ACREAGE
            </span>
            <MapPin className="w-4 h-4 text-[#1479C9]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#0B1F33] tracking-tight">
              {overview.totalKharifAreaHa.toLocaleString()} ha
            </div>
            <p className="text-[11px] text-[#4B5B6D] mt-0.5">
              Targeted across 14 Koraput Blocks
            </p>
          </div>
        </div>

        {/* Metric 2: High Risk Blocks */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-4 shadow-gov-card border-l-4 border-l-[#C43D3D] space-y-2">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              HIGH-RISK WATCHLIST
            </span>
            <AlertOctagon className="w-4 h-4 text-[#C43D3D]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#C43D3D] tracking-tight">
              {overview.highRiskBlocksCount} / 14 Blocks
            </div>
            <p className="text-[11px] text-[#802626] font-semibold mt-0.5">
              Requires immediate BAO field intervention
            </p>
          </div>
        </div>

        {/* Metric 3: Active False-Onset Alerts */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-4 shadow-gov-card border-l-4 border-l-[#D99000] space-y-2">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              FALSE-ONSET ALERTS
            </span>
            <ShieldAlert className="w-4 h-4 text-[#D99000]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#D99000] tracking-tight">
              {overview.criticalAlertsActive} Active Alerts
            </div>
            <p className="text-[11px] text-[#8C5D00] mt-0.5">
              Transient rain followed by dry break
            </p>
          </div>
        </div>

        {/* Metric 4: Advisory Broadcast Reach */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-4 shadow-gov-card border-l-4 border-l-[#247A4A] space-y-2">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              ADVISORY DISPATCH
            </span>
            <Send className="w-4 h-4 text-[#247A4A]" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#0B1F33] tracking-tight">
              {overview.farmerSmsReach.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#154D2F] font-semibold mt-0.5">
              Farmers reached via mKisan & WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
