import React from 'react';
import type { StructuredAdvisory } from '../../types/agriculture';
import {
  FileText,
  AlertCircle,
  HelpCircle,
  CheckSquare,
  Clock,
  Gauge,
  Printer,
} from 'lucide-react';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface StructuredAdvisoryCardProps {
  advisory: StructuredAdvisory;
}

export function StructuredAdvisoryCard({ advisory }: StructuredAdvisoryCardProps) {
  return (
    <div className="rounded-md border border-[#E2E8F0] bg-white shadow-gov-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F5F7FA]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-sm bg-[#0B1F33] text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Agrometeorological Decision Directive
              </h3>
              <span className="font-mono text-xs font-bold text-[#247A4A] bg-[#EDF7F1] px-2 py-0.5 rounded-xs border border-[#ABD7C0]">
                {advisory.cropName} ({advisory.localName})
              </span>
            </div>
            <p className="text-[11px] text-[#6E7F94] font-mono mt-0.5">
              Region: {advisory.targetBlock} · Valid: {advisory.issuanceDate} to {advisory.validUntil}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge source="OUAT-RRTTS Semiliguda" type="survey" size="sm" />
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-sm border border-[#CBD5E1] bg-white text-[#4B5B6D] hover:bg-[#F5F7FA] transition-colors"
            title="Print Advisory Bulletin"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* 1. WHAT IS HAPPENING? */}
        <div className="p-3.5 rounded-sm bg-[#EDF6FC] border border-[#ACD5F2] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0C4E83] uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-[#1479C9]" />
            <span>WHAT IS HAPPENING?</span>
          </div>
          <p className="text-xs text-[#0B1F33] leading-relaxed font-sans pl-6">
            {advisory.whatIsHappening}
          </p>
        </div>

        {/* 2. WHY? */}
        <div className="p-3.5 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4B5B6D] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#4B5B6D]" />
            <span>WHY?</span>
          </div>
          <p className="text-xs text-[#16202A] leading-relaxed font-sans pl-6">
            {advisory.why}
          </p>
        </div>

        {/* 3. WHAT SHOULD I DO? */}
        <div className="p-3.5 rounded-sm bg-[#EDF7F1] border border-[#ABD7C0] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#154D2F] uppercase tracking-wider">
            <CheckSquare className="w-4 h-4 text-[#247A4A]" />
            <span>WHAT SHOULD I DO?</span>
          </div>
          <ul className="space-y-2 pl-6 text-xs text-[#154D2F] font-sans">
            {advisory.whatShouldIDo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="font-bold font-mono text-[#247A4A] shrink-0 mt-0.5">
                  [{idx + 1}]
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. WHEN? & 5. CONFIDENCE? DUAL ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 4. WHEN? */}
          <div className="p-3.5 rounded-sm bg-[#FDF7EB] border border-[#F4D79C] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8C5D00] uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#D99000]" />
              <span>WHEN? (OPERATIONAL TIMING)</span>
            </div>
            <p className="text-xs text-[#8C5D00] font-semibold leading-relaxed pl-6">
              {advisory.when}
            </p>
          </div>

          {/* 5. CONFIDENCE? */}
          <div className="p-3.5 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0B1F33] uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#1479C9]" />
                <span>CONFIDENCE?</span>
              </div>
              <span className="text-[11px] font-bold text-[#247A4A] bg-[#EDF7F1] px-2 py-0.2 rounded-xs border border-[#ABD7C0]">
                {advisory.confidence.score}% [{advisory.confidence.tier}]
              </span>
            </div>
            <p className="text-xs text-[#4B5B6D] leading-relaxed pl-6">
              {advisory.confidence.statement}
            </p>
          </div>
        </div>
      </div>

      {/* Advisory Footer */}
      <div className="px-4 py-2.5 border-t border-[#F0F3F7] bg-[#F5F7FA]/40 text-[11px] font-mono text-[#6E7F94] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>Complies with IMD Gramin Krishi Mausam Sewa (GKMS) bi-weekly bulletin standards.</span>
        <span>Issued by: Agro-Meteorological Field Unit (AMFU), Koraput</span>
      </div>
    </div>
  );
}
