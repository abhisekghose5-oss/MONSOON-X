import React from 'react';
import { useI18n } from '../../i18n';
import { Sprout, Check } from 'lucide-react';

export type FarmerCropKey = 'paddy' | 'ragi' | 'maize' | 'groundnut' | 'pulses' | 'cotton' | 'vegetables';

interface FarmerCropSelectorProps {
  selectedCrop: FarmerCropKey;
  onSelectCrop: (crop: FarmerCropKey) => void;
  className?: string;
}

const CROP_ICONS: Record<FarmerCropKey, string> = {
  paddy: '🌾',
  ragi: '🥣',
  maize: '🌽',
  groundnut: '🥜',
  pulses: '🍲',
  cotton: '⚪',
  vegetables: '🥬',
};

export function FarmerCropSelector({
  selectedCrop,
  onSelectCrop,
  className = '',
}: FarmerCropSelectorProps) {
  const { t } = useI18n();
  const cropT = t.sections.myCrop;

  const cropKeys: FarmerCropKey[] = ['paddy', 'ragi', 'maize', 'groundnut', 'pulses', 'cotton', 'vegetables'];

  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-xl border border-[#1E354D] p-4 shadow-command-panel space-y-3 ${className}`}>
      {/* Title & Help Text */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4ADE80] font-mono flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-[#4ADE80]" />
          <span>{cropT.title}</span>
        </span>
        <span className="text-[11px] font-mono text-[#4ADE80] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 font-semibold">
          7 Kharif Crops
        </span>
      </div>

      <p className="text-xs text-slate-400">
        {cropT.subtitle}
      </p>

      {/* Large Thumb-Friendly Crop Grid (min-h-[64px]) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {cropKeys.map((key) => {
          const isSelected = selectedCrop === key;
          const info = cropT.crops[key] || { name: key, localName: key, category: '' };
          const icon = CROP_ICONS[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectCrop(key)}
              className={`p-3 rounded-xl text-left transition-all relative flex flex-col justify-between min-h-[72px] touch-manipulation select-none active:scale-95 border-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#15803D]/25 border-[#4ADE80] text-white ring-2 ring-[#4ADE80]/30 shadow-[0_0_12px_rgba(74,222,128,0.35)]'
                  : 'bg-[#071324] border-[#1E354D] text-slate-300 hover:bg-[#0D2038] hover:border-slate-600'
              }`}
              aria-pressed={isSelected}
            >
              {/* Header with Emoji & Selected Checkmark */}
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl" role="img" aria-label={info.name}>
                  {icon}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#4ADE80] text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Localized and Subtext Names */}
              <div className="mt-1">
                <span className="text-base font-extrabold block leading-tight text-white">
                  {info.name}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block">
                  {info.localName}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default FarmerCropSelector;
