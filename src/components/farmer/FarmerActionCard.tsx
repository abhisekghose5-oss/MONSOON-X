import React from 'react';
import { useI18n, type CropAdvisoryTranslation } from '../../i18n';
import { CheckCircle2, XCircle, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface FarmerActionCardProps {
  advisory: CropAdvisoryTranslation;
  cropName: string;
  className?: string;
}

export function FarmerActionCard({ advisory, cropName, className = '' }: FarmerActionCardProps) {
  const { t } = useI18n();
  const doT = t.sections.whatShouldIDo;
  const whenT = t.sections.whenShouldIAct;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. WHAT SHOULD I DO? CARD */}
      <div className="bg-white rounded-xl border-2 border-[#CBD5E1] p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#247A4A] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#247A4A]" />
            <span>{doT.title}</span>
          </span>
          <span className="text-[11px] font-mono font-bold bg-[#EDF7F1] text-[#154D2F] px-2 py-0.5 rounded border border-[#ABD7C0]">
            {cropName}
          </span>
        </div>

        {/* PRIMARY ACTION HEADLINE (Massive Typography & High Contrast) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#EDF7F1] to-[#EAF5FC] border-2 border-[#ABD7C0]">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#154D2F] block mb-1">
            {doT.doThisLabel}:
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B1F33] leading-snug tracking-tight">
            {advisory.actionHeadline}
          </h2>
        </div>

        {/* Action Steps Checklist */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-[#4B5B6D] uppercase font-mono block">
            ପଦକ୍ଷେପ / Recommended Steps:
          </span>
          <div className="space-y-2">
            {advisory.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0B1F33] font-medium leading-relaxed"
              >
                <CheckCircle2 className="w-5 h-5 text-[#247A4A] shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid Action Warning Box */}
        {advisory.avoidAction && (
          <div className="p-3.5 rounded-lg bg-[#FCEDEC] border border-[#EEA9A7] flex items-start gap-2.5 text-xs text-[#802626]">
            <XCircle className="w-4 h-4 text-[#C43D3D] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block uppercase">{doT.avoidThisLabel}:</span>
              <span className="font-medium mt-0.5 block">{advisory.avoidAction}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. WHEN SHOULD I ACT? CARD */}
      <div className="bg-white rounded-xl border-2 border-[#CBD5E1] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D99000] font-mono flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#D99000]" />
            <span>{whenT.title}</span>
          </span>
          <span className="text-[11px] font-mono text-[#6E7F94] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">
            Time Sensitive
          </span>
        </div>

        <p className="text-xs text-[#4B5B6D]">
          {whenT.subtitle}
        </p>

        {/* Big Time Target Window Banner */}
        <div className="p-4 rounded-xl bg-[#FDF7EB] border-2 border-[#F4D79C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5D00] block">
              {whenT.targetWindowLabel}
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#0B1F33] mt-0.5 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#D99000]" />
              <span>{advisory.whenToAct}</span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-white text-[#8C5D00] border border-[#F4D79C] shadow-xs">
              <AlertCircle className="w-3.5 h-3.5 text-[#D99000]" />
              <span>{advisory.urgencyText}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
