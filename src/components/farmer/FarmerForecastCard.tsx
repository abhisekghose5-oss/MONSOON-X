import React from 'react';
import { useI18n, type CropAdvisoryTranslation } from '../../i18n';
import { CloudRain, Sun, AlertTriangle, HelpCircle } from 'lucide-react';

interface FarmerForecastCardProps {
  advisory: CropAdvisoryTranslation;
  className?: string;
}

export function FarmerForecastCard({ advisory, className = '' }: FarmerForecastCardProps) {
  const { t } = useI18n();
  const comingT = t.sections.whatIsComing;

  // Level badge styling (strictly high contrast and accessible)
  const getBadgeStyle = (level: 'low' | 'moderate' | 'high') => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-[#FCEDEC]',
          border: 'border-[#EEA9A7]',
          text: 'text-[#802626]',
          indicator: 'bg-[#C43D3D]',
        };
      case 'moderate':
        return {
          bg: 'bg-[#FDF7EB]',
          border: 'border-[#F4D79C]',
          text: 'text-[#8C5D00]',
          indicator: 'bg-[#D99000]',
        };
      case 'low':
      default:
        return {
          bg: 'bg-[#EDF7F1]',
          border: 'border-[#ABD7C0]',
          text: 'text-[#154D2F]',
          indicator: 'bg-[#247A4A]',
        };
    }
  };

  const rainStyle = getBadgeStyle(advisory.rainfallOutlookLevel);
  const dryStyle = getBadgeStyle(advisory.drySpellRiskLevel);
  const heavyRainStyle = getBadgeStyle(advisory.heavyRainRiskLevel);

  return (
    <div className={`bg-white rounded-xl border-2 border-[#CBD5E1] p-4 shadow-sm space-y-3 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#1479C9]" />
          <span>{comingT.title}</span>
        </span>
        <span className="text-[11px] font-mono text-[#6E7F94] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">
          14 Days Horizon
        </span>
      </div>

      <p className="text-xs text-[#4B5B6D]">
        {comingT.subtitle}
      </p>

      {/* 3 Primary Simple Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* 1. Rainfall Outlook */}
        <div
          className={`p-3.5 rounded-xl border-2 ${rainStyle.border} ${rainStyle.bg} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4B5B6D]">
              {comingT.rainfallOutlookLabel}
            </span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              <CloudRain className="w-4 h-4 text-[#1479C9]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${rainStyle.indicator}`} />
              <span className={`text-lg md:text-xl font-black ${rainStyle.text}`}>
                {advisory.rainfallOutlook}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Dry Spell Risk */}
        <div
          className={`p-3.5 rounded-xl border-2 ${dryStyle.border} ${dryStyle.bg} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4B5B6D]">
              {comingT.drySpellRiskLabel}
            </span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              <Sun className="w-4 h-4 text-[#D99000]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${dryStyle.indicator}`} />
              <span className={`text-lg md:text-xl font-black ${dryStyle.text}`}>
                {advisory.drySpellRisk}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Heavy Rain Risk */}
        <div
          className={`p-3.5 rounded-xl border-2 ${heavyRainStyle.border} ${heavyRainStyle.bg} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4B5B6D]">
              {comingT.heavyRainRiskLabel}
            </span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-4 h-4 text-[#247A4A]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${heavyRainStyle.indicator}`} />
              <span className={`text-lg md:text-xl font-black ${heavyRainStyle.text}`}>
                {advisory.heavyRainRisk}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plain Language Summary Box */}
      <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] leading-relaxed flex items-start gap-2">
        <span className="text-base leading-none">📢</span>
        <span>{comingT.summaryNote}</span>
      </div>
    </div>
  );
}
