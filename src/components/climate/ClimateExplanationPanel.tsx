import React from 'react';
import type { ClimateGuidancePrinciple } from '../../types/climate';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface ClimateExplanationPanelProps {
  title: string;
  disclaimer: string;
  principles: ClimateGuidancePrinciple[];
}

export function ClimateExplanationPanel({
  title,
  disclaimer,
  principles,
}: ClimateExplanationPanelProps) {
  const getTerminologyBadge = (term: string) => {
    switch (term) {
      case 'Model input':
        return (
          <span className="px-2 py-0.5 rounded-sm bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 font-mono text-[10px] font-bold uppercase tracking-wider">
            Model Input
          </span>
        );
      case 'Potential influence':
        return (
          <span className="px-2 py-0.5 rounded-sm bg-[#F59E0B]/20 text-[#FCD34D] border border-[#F59E0B]/40 font-mono text-[10px] font-bold uppercase tracking-wider">
            Potential Influence
          </span>
        );
      case 'Statistical relationship':
        return (
          <span className="px-2 py-0.5 rounded-sm bg-[#10B981]/20 text-[#4ADE80] border border-[#10B981]/40 font-mono text-[10px] font-bold uppercase tracking-wider">
            Statistical Relationship
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-sm bg-[#1E354D] text-slate-300 border border-[#334E68] font-mono text-[10px] font-bold uppercase tracking-wider">
            {term}
          </span>
        );
    }
  };

  return (
    <div className="rounded-md border border-[#1E354D] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-400">
            [Scientific Governance Protocol]
          </span>
          <DataSourceBadge source="WMO S2S Scientific Council" type="survey" size="sm" />
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Core Non-Deterministic Governance Callout */}
        <div className="rounded-sm border-l-4 border-l-[#F59E0B] border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FCD34D] uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Non-Deterministic Causation Principle</span>
          </div>
          <p className="text-xs text-amber-200 leading-relaxed">
            {disclaimer}
          </p>
        </div>

        {/* 3 Core Scientific Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {principles.map((principle, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-sm bg-[#071324] border border-[#1E354D] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase">
                    Protocol #{idx + 1}
                  </span>
                  {getTerminologyBadge(principle.keyTerminology)}
                </div>

                <h4 className="text-xs font-bold text-white font-sans">
                  {principle.principleTitle}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {principle.scientificExplanation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1E354D] text-[11px] font-mono text-sky-200 bg-[#0A192F] p-2 rounded-xs border border-[#0284C7]/30 leading-tight">
                <span className="font-bold block mb-0.5 text-sky-300">Operational Application:</span>
                {principle.operationalApplication}
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Summary Footer */}
        <div className="pt-2 border-t border-[#1E354D] text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>
            Terminology standard: All teleconnections are described as "model inputs", "potential influences", or "statistical relationships".
          </span>
          <span className="text-white font-semibold">
            MONSOON-X v2.4
          </span>
        </div>
      </div>
    </div>
  );
}
