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
    <div className="rounded-lg border border-[#1E354D] bg-[#0A192F] shadow-command-panel overflow-hidden text-white">
      <div className="bg-[#071324] text-white px-4 py-3 flex items-center justify-between border-b border-[#1E354D]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
            Executive Command Briefing • Koraput Agro-Meteorological Situation
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#38BDF8] uppercase bg-[#0284C7]/20 px-2 py-0.5 rounded border border-[#0284C7]/30">
          Synthesized from NWP & AWS Telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1E354D]">
        {/* 1. What is happening in Koraput? */}
        <div className="p-4.5 space-y-2.5 bg-[#0A192F] border-t-2 border-t-[#38BDF8]">
          <div className="flex items-center gap-2 text-[#38BDF8]">
            <div className="p-1 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40">
              <Compass className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-white font-mono">
              1. Current Situation
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {answers.currentSituation}
          </p>
        </div>

        {/* 2. What is expected during the next 7-30 days? */}
        <div className="p-4.5 space-y-2.5 bg-[#09162A] border-t-2 border-t-[#0284C7]">
          <div className="flex items-center gap-2 text-[#38BDF8]">
            <div className="p-1 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40">
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-white font-mono">
              2. 7 to 30-Day Outlook
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {answers.next7to30DaysOutlook}
          </p>
        </div>

        {/* 3. Which risks are increasing? */}
        <div className="p-4.5 space-y-2.5 bg-[#0A192F] border-t-2 border-t-[#F59E0B]">
          <div className="flex items-center gap-2 text-[#FCD34D]">
            <div className="p-1 rounded-sm bg-[#F59E0B]/20 border border-[#F59E0B]/40">
              <AlertTriangle className="w-4 h-4 text-[#FCD34D]" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#FCD34D] font-mono">
              3. Increasing Risks
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {answers.increasingRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                <span className="text-[#F87171] font-bold shrink-0">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. What should farmers / officers do? */}
        <div className="p-4.5 space-y-2.5 bg-[#081C1B] border-t-2 border-t-[#10B981]">
          <div className="flex items-center gap-2 text-[#4ADE80]">
            <div className="p-1 rounded-sm bg-[#10B981]/20 border border-[#10B981]/40">
              <CheckSquare className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-[#4ADE80] font-mono">
              4. Immediate Action Plan
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-emerald-200">
            {answers.farmerActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                <span className="text-[#4ADE80] font-bold shrink-0">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
