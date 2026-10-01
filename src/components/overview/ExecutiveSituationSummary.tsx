import React from 'react';
import { Compass, Calendar, AlertTriangle, CheckSquare } from 'lucide-react';

interface ExecutiveSituationSummaryProps {
  answers: {
    currentSituation: string;
    next7to30DaysOutlook: string;
    increasingRisks: string[];
    farmerActions: string[];
  };
}

export function ExecutiveSituationSummary({ answers }: ExecutiveSituationSummaryProps) {
  return (
    <div className="rounded-md border border-[#CBD5E1] bg-white shadow-gov-card overflow-hidden">
      <div className="bg-[#0B1F33] text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1479C9] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
            Executive Command Briefing • Koraput Agro-Meteorological Situation
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#A4BCDA] uppercase">
          Synthesized from NWP & AWS Telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] p-0">
        {/* 1. What is happening in Koraput? */}
        <div className="p-4 space-y-2 bg-white">
          <div className="flex items-center gap-1.5 text-[#1479C9]">
            <Compass className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#0B1F33]">
              1. Current Situation
            </h4>
          </div>
          <p className="text-xs text-[#4B5B6D] leading-relaxed">
            {answers.currentSituation}
          </p>
        </div>

        {/* 2. What is expected during the next 7-30 days? */}
        <div className="p-4 space-y-2 bg-[#F5F7FA]/40">
          <div className="flex items-center gap-1.5 text-[#0B1F33]">
            <Calendar className="w-4 h-4 shrink-0 text-[#1479C9]" />
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#0B1F33]">
              2. 7 to 30-Day Outlook
            </h4>
          </div>
          <p className="text-xs text-[#4B5B6D] leading-relaxed">
            {answers.next7to30DaysOutlook}
          </p>
        </div>

        {/* 3. Which risks are increasing? */}
        <div className="p-4 space-y-2 bg-white">
          <div className="flex items-center gap-1.5 text-[#D99000]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#0B1F33]">
              3. Increasing Risks
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-[#4B5B6D]">
            {answers.increasingRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                <span className="text-[#C43D3D] font-bold shrink-0">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. What should farmers / officers do? */}
        <div className="p-4 space-y-2 bg-[#EDF7F1]/30">
          <div className="flex items-center gap-1.5 text-[#247A4A]">
            <CheckSquare className="w-4 h-4 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#0B1F33]">
              4. Immediate Action Plan
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-[#154D2F]">
            {answers.farmerActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                <span className="text-[#247A4A] font-bold shrink-0">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
