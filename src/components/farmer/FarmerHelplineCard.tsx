import React from 'react';
import { useI18n } from '../../i18n';
import { PhoneCall, Building2 } from 'lucide-react';

interface FarmerHelplineCardProps {
  className?: string;
}

export function FarmerHelplineCard({ className = '' }: FarmerHelplineCardProps) {
  const { t } = useI18n();
  const helpT = t.helpline;

  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md text-white rounded-xl p-4 shadow-command-panel border border-[#1E354D] space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#15803D]/30 border border-[#4ADE80]/50 flex items-center justify-center shrink-0">
          <PhoneCall className="w-4 h-4 text-[#4ADE80]" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-tight font-mono">
            {helpT.title}
          </h4>
          <span className="text-[11px] text-slate-400 block font-mono">
            Direct Agronomist Line · Koraput & Odisha
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Kisan Call Centre (Toll Free) */}
        <a
          href={`tel:${helpT.tollFreeNumber}`}
          className="min-h-[50px] p-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-white flex items-center justify-between transition-all touch-manipulation active:scale-95 shadow-sm border border-emerald-500/50 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[#4ADE80] shrink-0" />
            <div>
              <span className="text-xs font-bold block leading-tight">
                Kisan Call Centre (କିଷାନ କଲ୍ ସେଣ୍ଟର)
              </span>
              <span className="text-sm font-mono font-black text-[#4ADE80]">
                {helpT.tollFreeNumber}
              </span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold bg-[#15803D]/40 text-[#86EFAC] px-2 py-0.5 rounded border border-[#15803D]/60 font-mono">
            Free
          </span>
        </a>

        {/* Krishi Vigyan Kendra Koraput */}
        <a
          href={`tel:${helpT.kvkPhone}`}
          className="min-h-[50px] p-2.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 text-white flex items-center justify-between transition-all touch-manipulation active:scale-95 shadow-sm border border-sky-500/50 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#38BDF8] shrink-0" />
            <div>
              <span className="text-xs font-bold block leading-tight">
                {helpT.kvkKoraput}
              </span>
              <span className="text-sm font-mono font-black text-[#38BDF8]">
                {helpT.kvkPhone}
              </span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold bg-[#0284C7]/40 text-[#7DD3FC] px-2 py-0.5 rounded border border-[#0284C7]/60 font-mono">
            KVK
          </span>
        </a>
      </div>
    </div>
  );
}
export default FarmerHelplineCard;
