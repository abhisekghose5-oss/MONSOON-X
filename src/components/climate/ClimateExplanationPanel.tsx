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
          <span className="px-2 py-0.5 rounded-sm bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2] font-mono text-[10px] font-bold uppercase tracking-wider">
            Model Input
          </span>
        );
      case 'Potential influence':
        return (
          <span className="px-2 py-0.5 rounded-sm bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] font-mono text-[10px] font-bold uppercase tracking-wider">
            Potential Influence
          </span>
        );
      case 'Statistical relationship':
        return (
          <span className="px-2 py-0.5 rounded-sm bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] font-mono text-[10px] font-bold uppercase tracking-wider">
            Statistical Relationship
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-sm bg-[#F0F3F7] text-[#4B5B6D] border border-[#CBD5E1] font-mono text-[10px] font-bold uppercase tracking-wider">
            {term}
          </span>
        );
    }
  };

  return (
    <div className="rounded-md border border-[#E2E8F0] bg-white shadow-gov-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F5F7FA]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#1479C9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#6E7F94]">
            [Scientific Governance Protocol]
          </span>
          <DataSourceBadge source="WMO S2S Scientific Council" type="survey" size="sm" />
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Core Non-Deterministic Governance Callout */}
        <div className="rounded-sm border-l-4 border-l-[#D99000] border border-[#F4D79C] bg-[#FDF7EB] p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8C5D00] uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-[#D99000]" />
            <span>Non-Deterministic Causation Principle</span>
          </div>
          <p className="text-xs text-[#8C5D00] leading-relaxed">
            {disclaimer}
          </p>
        </div>

        {/* 3 Core Scientific Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {principles.map((principle, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#6E7F94] font-semibold uppercase">
                    Protocol #{idx + 1}
                  </span>
                  {getTerminologyBadge(principle.keyTerminology)}
                </div>

                <h4 className="text-xs font-bold text-[#0B1F33] font-sans">
                  {principle.principleTitle}
                </h4>

                <p className="text-xs text-[#4B5B6D] leading-relaxed">
                  {principle.scientificExplanation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] text-[11px] font-mono text-[#0C4E83] bg-[#EDF6FC] p-2 rounded-xs border border-[#ACD5F2] leading-tight">
                <span className="font-bold block mb-0.5">Operational Application:</span>
                {principle.operationalApplication}
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Summary Footer */}
        <div className="pt-2 border-t border-[#F0F3F7] text-[11px] font-mono text-[#6E7F94] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>
            Terminology standard: All teleconnections are described as "model inputs", "potential influences", or "statistical relationships".
          </span>
          <span className="text-[#0B1F33] font-semibold">
            Koraput Mausam Intelligence v2.4
          </span>
        </div>
      </div>
    </div>
  );
}
