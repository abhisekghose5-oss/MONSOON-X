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
    <div className={`bg-white rounded-xl border-2 border-[#CBD5E1] p-4 shadow-sm space-y-3 ${className}`}>
      {/* Title & Help Text */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#247A4A] font-mono flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-[#247A4A]" />
          <span>{cropT.title}</span>
        </span>
        <span className="text-[11px] font-mono text-[#6E7F94] bg-[#EDF7F1] text-[#154D2F] px-2 py-0.5 rounded border border-[#ABD7C0] font-semibold">
          7 Kharif Crops
        </span>
      </div>

      <p className="text-xs text-[#4B5B6D]">
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
              className={`p-3 rounded-xl text-left transition-all relative flex flex-col justify-between min-h-[72px] touch-manipulation select-none active:scale-95 border-2 ${
                isSelected
                  ? 'bg-[#EAF5FC] border-[#1479C9] text-[#0B1F33] ring-2 ring-[#1479C9]/20 shadow-sm'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-slate-100 hover:border-[#CBD5E1]'
              }`}
              aria-pressed={isSelected}
            >
              {/* Header with Emoji & Selected Checkmark */}
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl" role="img" aria-label={info.name}>
                  {icon}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#1479C9] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Localized and Subtext Names */}
              <div className="mt-1">
                <span className="text-base font-extrabold block leading-tight text-[#0B1F33]">
                  {info.name}
                </span>
                <span className="text-[11px] text-[#6E7F94] font-medium block">
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
