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
    <div className={`bg-gradient-to-r from-[#0B1F33] to-[#142B44] text-white rounded-xl p-4 shadow-md space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#247A4A] flex items-center justify-center shrink-0">
          <PhoneCall className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-tight">
            {helpT.title}
          </h4>
          <span className="text-[11px] text-[#A4BCDA] block font-mono">
            Direct Agronomist Line · Koraput & Odisha
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Kisan Call Centre (Toll Free) */}
        <a
          href={`tel:${helpT.tollFreeNumber}`}
          className="min-h-[50px] p-2.5 rounded-lg bg-[#247A4A] hover:bg-[#1D633C] text-white flex items-center justify-between transition-all touch-manipulation active:scale-95 shadow-sm border border-[#3CA76B]"
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-white shrink-0" />
            <div>
              <span className="text-xs font-bold block leading-tight">
                Kisan Call Centre (କିଷାନ କଲ୍ ସେଣ୍ଟର)
              </span>
              <span className="text-sm font-mono font-black text-white/90">
                {helpT.tollFreeNumber}
              </span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded">
            Free
          </span>
        </a>

        {/* Krishi Vigyan Kendra Koraput */}
        <a
          href={`tel:${helpT.kvkPhone}`}
          className="min-h-[50px] p-2.5 rounded-lg bg-[#1479C9] hover:bg-[#0E63A8] text-white flex items-center justify-between transition-all touch-manipulation active:scale-95 shadow-sm border border-[#439EE0]"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-white shrink-0" />
            <div>
              <span className="text-xs font-bold block leading-tight">
                {helpT.kvkKoraput}
              </span>
              <span className="text-sm font-mono font-black text-white/90">
                {helpT.kvkPhone}
              </span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded">
            KVK
          </span>
        </a>
      </div>
    </div>
  );
}
