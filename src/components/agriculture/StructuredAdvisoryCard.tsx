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
    <div className="rounded-md border border-[#1E354D] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Agrometeorological Decision Directive
              </h3>
              <span className="font-mono text-xs font-bold text-[#4ADE80] bg-[#10B981]/15 px-2 py-0.5 rounded-xs border border-[#10B981]/30">
                {advisory.cropName} ({advisory.localName})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Region: {advisory.targetBlock} · Valid: {advisory.issuanceDate} to {advisory.validUntil}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge source="OUAT-RRTTS Semiliguda" type="survey" size="sm" />
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-sm border border-[#1E354D] bg-[#0A192F] text-slate-300 hover:bg-[#132844] hover:text-white transition-colors"
            title="Print Advisory Bulletin"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* 1. WHAT IS HAPPENING? */}
        <div className="p-3.5 rounded-sm bg-[#0369A1]/10 border border-[#0284C7]/30 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-[#38BDF8]" />
            <span>WHAT IS HAPPENING?</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans pl-6">
            {advisory.whatIsHappening}
          </p>
        </div>

        {/* 2. WHY? */}
        <div className="p-3.5 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>WHY? (METEOROLOGICAL DRIVER)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans pl-6">
            {advisory.why}
          </p>
        </div>

        {/* 3. WHAT SHOULD THE FARMER DO? (PROMINENT ACTION DIRECTIVE) */}
        <div className="p-4 rounded-md bg-[#064E3B]/20 border-2 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.12)] space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider">
              <span className="p-1 rounded bg-[#10B981] text-[#062419]">
                <CheckSquare className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold tracking-normal font-sans text-white">WHAT SHOULD THE FARMER DO?</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#10B981] text-[#062419] uppercase tracking-wider shadow-sm">
              MANDATORY DIRECTIVE
            </span>
          </div>
          <ul className="space-y-2 pl-2 text-xs text-slate-200 font-sans">
            {advisory.whatShouldIDo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed bg-[#0A192F]/80 p-2.5 rounded border border-[#10B981]/30">
                <span className="font-bold font-mono text-[#062419] bg-[#4ADE80] rounded-xs px-1.5 py-0.5 text-[10px] shrink-0 mt-0.5">
                  STEP {idx + 1}
                </span>
                <span className="font-medium text-slate-100">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. WHEN? & 5. CONFIDENCE? DUAL ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 4. WHEN? */}
          <div className="p-3.5 rounded-sm bg-[#D97706]/10 border border-[#F59E0B]/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FCD34D] uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              <span>WHEN? (OPERATIONAL TIMING)</span>
            </div>
            <p className="text-xs text-amber-200 font-semibold leading-relaxed pl-6">
              {advisory.when}
            </p>
          </div>

          {/* 5. CONFIDENCE? */}
          <div className="p-3.5 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#38BDF8]" />
                <span>MODEL CONFIDENCE</span>
              </div>
              <span className="text-[11px] font-bold text-[#4ADE80] bg-[#10B981]/15 px-2 py-0.5 rounded-xs border border-[#10B981]/30">
                {advisory.confidence.score}% [{advisory.confidence.tier}]
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {advisory.confidence.statement}
            </p>
          </div>
        </div>
      </div>

      {/* Advisory Footer */}
      <div className="px-4 py-2.5 border-t border-[#1E354D] bg-[#071324]/80 text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>Complies with IMD Gramin Krishi Mausam Sewa (GKMS) bi-weekly bulletin standards.</span>
        <span>Issued by: Agro-Meteorological Field Unit (AMFU), Koraput</span>
      </div>
    </div>
  );
}
