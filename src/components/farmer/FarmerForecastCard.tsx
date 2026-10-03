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
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/50',
          text: 'text-rose-400',
          indicator: 'bg-[#F43F5E]',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          indicator: 'bg-[#F59E0B]',
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/50',
          text: 'text-emerald-400',
          indicator: 'bg-[#4ADE80]',
        };
    }
  };

  const rainStyle = getBadgeStyle(advisory.rainfallOutlookLevel);
  const dryStyle = getBadgeStyle(advisory.drySpellRiskLevel);
  const heavyRainStyle = getBadgeStyle(advisory.heavyRainRiskLevel);

  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-xl border border-[#1E354D] p-4 shadow-command-panel space-y-3 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
          <span>{comingT.title}</span>
        </span>
        <span className="text-[11px] font-mono text-[#38BDF8] bg-[#071324] px-2 py-0.5 rounded border border-[#1E354D]">
          14 Days Horizon
        </span>
      </div>

      <p className="text-xs text-slate-400">
        {comingT.subtitle}
      </p>

      {/* 3 Primary Simple Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* 1. Rainfall Outlook */}
        <div
          className={`p-3.5 rounded-xl border ${rainStyle.border} ${rainStyle.bg} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              {comingT.rainfallOutlookLabel}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#071324] border border-[#1E354D] flex items-center justify-center shadow-xs">
              <CloudRain className="w-4 h-4 text-[#38BDF8]" />
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
          className={`p-3.5 rounded-xl border ${dryStyle.border} ${dryStyle.bg} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              {comingT.drySpellRiskLabel}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#071324] border border-[#1E354D] flex items-center justify-center shadow-xs">
              <Sun className="w-4 h-4 text-[#F59E0B]" />
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
          className={`p-3.5 rounded-xl border ${heavyRainStyle.border} ${heavyRainStyle.bg} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              {comingT.heavyRainRiskLabel}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#071324] border border-[#1E354D] flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-4 h-4 text-[#4ADE80]" />
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
      <div className="p-3 rounded-lg bg-[#071324] border border-[#1E354D] text-xs text-slate-300 leading-relaxed flex items-start gap-2">
        <span className="text-base leading-none">📢</span>
        <span>{comingT.summaryNote}</span>
      </div>
    </div>
  );
}
export default FarmerForecastCard;
