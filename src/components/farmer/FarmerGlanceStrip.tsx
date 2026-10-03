import React from 'react';
import { useI18n, type CropAdvisoryTranslation } from '../../i18n';

interface FarmerGlanceStripProps {
  advisory: CropAdvisoryTranslation;
  cropName: string;
  className?: string;
}

export function FarmerGlanceStrip({ advisory, cropName, className = '' }: FarmerGlanceStripProps) {
  const { language } = useI18n();

  const labels = {
    or: {
      rain: '🌧 ବର୍ଷା',
      crop: '🌱 ଫସଲ',
      sowing: '📅 ବୁଣିବା',
      warning: '⚠️ ଚେତାବନୀ',
      action: '✅ କାର୍ଯ୍ୟ',
      actionText: 'ନିଷ୍କାସନ ନାଳି ଖୋଳନ୍ତୁ',
    },
    hi: {
      rain: '🌧 बारिश',
      crop: '🌱 फसल',
      sowing: '📅 बुआई',
      warning: '⚠️ चेतावनी',
      action: '✅ कार्रवाई',
      actionText: 'जल निकासी नाली खोलें',
    },
    en: {
      rain: '🌧 Rain',
      crop: '🌱 Crop',
      sowing: '📅 Sowing',
      warning: '⚠️ Warning',
      action: '✅ Action',
      actionText: 'Open drainage furrows',
    },
  }[language] || {
    rain: '🌧 Rain',
    crop: '🌱 Crop',
    sowing: '📅 Sowing',
    warning: '⚠️ Warning',
    action: '✅ Action',
    actionText: 'Open drainage furrows',
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2.5 ${className}`}>
      {/* 1. 🌧 Rain */}
      <div className="p-3 rounded-xl bg-[#0A192F]/90 backdrop-blur-md border border-[#0284C7]/60 text-center shadow-command-panel">
        <span className="text-xs font-bold text-[#7DD3FC] block uppercase tracking-wider font-mono">{labels.rain}</span>
        <span className="text-base sm:text-lg font-black text-[#38BDF8] block mt-0.5">
          {advisory.rainfallOutlook}
        </span>
      </div>

      {/* 2. 🌱 Crop */}
      <div className="p-3 rounded-xl bg-[#0A192F]/90 backdrop-blur-md border border-[#15803D]/60 text-center shadow-command-panel">
        <span className="text-xs font-bold text-[#86EFAC] block uppercase tracking-wider font-mono">{labels.crop}</span>
        <span className="text-base sm:text-lg font-black text-[#4ADE80] block mt-0.5 truncate">
          {cropName}
        </span>
      </div>

      {/* 3. 📅 Sowing */}
      <div className="p-3 rounded-xl bg-[#0A192F]/90 backdrop-blur-md border border-[#1E354D] text-center shadow-command-panel">
        <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider font-mono">{labels.sowing}</span>
        <span className="text-xs sm:text-sm font-bold text-white block mt-1 truncate" title={advisory.whenToAct}>
          {advisory.whenToAct}
        </span>
      </div>

      {/* 4. ⚠️ Warning */}
      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-center shadow-command-panel">
        <span className="text-xs font-bold text-rose-300 block uppercase tracking-wider font-mono">{labels.warning}</span>
        <span className="text-xs sm:text-sm font-black text-rose-400 block mt-1">
          {advisory.heavyRainRiskLevel === 'high' ? 'High Rain Hazard' : 'Dry Spell Watch'}
        </span>
      </div>

      {/* 5. ✅ Action */}
      <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center shadow-command-panel">
        <span className="text-xs font-bold text-emerald-300 block uppercase tracking-wider font-mono">{labels.action}</span>
        <span className="text-xs sm:text-sm font-black text-[#4ADE80] block mt-1">
          {labels.actionText}
        </span>
      </div>
    </div>
  );
}
export default FarmerGlanceStrip;
