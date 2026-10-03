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
      <div className="bg-[#0A192F]/90 backdrop-blur-md rounded-xl border border-[#1E354D] p-4 shadow-command-panel space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4ADE80] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
            <span>{doT.title}</span>
          </span>
          <span className="text-[11px] font-mono font-bold bg-emerald-950/60 text-[#4ADE80] px-2 py-0.5 rounded border border-emerald-500/40">
            {cropName}
          </span>
        </div>

        {/* PRIMARY ACTION HEADLINE (Massive Typography & High Contrast) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-sky-950/40 border border-emerald-500/40 shadow-xs">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4ADE80] block mb-1">
            {doT.doThisLabel}:
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
            {advisory.actionHeadline}
          </h2>
        </div>

        {/* Action Steps Checklist */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
            ପଦକ୍ଷେପ / Recommended Steps:
          </span>
          <div className="space-y-2">
            {advisory.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#071324] border border-[#1E354D] text-sm text-slate-200 font-medium leading-relaxed"
              >
                <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid Action Warning Box */}
        {advisory.avoidAction && (
          <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/50 flex items-start gap-2.5 text-xs text-rose-200">
            <XCircle className="w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block uppercase text-rose-300">{doT.avoidThisLabel}:</span>
              <span className="font-medium mt-0.5 block">{advisory.avoidAction}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. WHEN SHOULD I ACT? CARD */}
      <div className="bg-[#0A192F]/90 backdrop-blur-md rounded-xl border border-[#1E354D] p-4 shadow-command-panel space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] font-mono flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            <span>{whenT.title}</span>
          </span>
          <span className="text-[11px] font-mono text-[#F59E0B] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
            Time Sensitive
          </span>
        </div>

        <p className="text-xs text-slate-400">
          {whenT.subtitle}
        </p>

        {/* Big Time Target Window Banner */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 block">
              {whenT.targetWindowLabel}
            </span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#F59E0B]" />
              <span>{advisory.whenToAct}</span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#071324] text-amber-300 border border-amber-500/40 shadow-xs">
              <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{advisory.urgencyText}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FarmerActionCard;
