import React from 'react';
import type { CropDefinition } from '../../types/agriculture';
import { Sprout } from 'lucide-react';

export interface CropSelectorProps {
  crops: CropDefinition[];
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
}

export function CropSelector({
  crops,
  selectedCropId,
  onSelectCrop,
}: CropSelectorProps) {
  return (
    <div className="bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-3 sm:p-4 space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F3F7] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-[#247A4A] text-white">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Active Crop Decision Selector
            </h3>
            <span className="text-[10px] text-[#6E7F94] font-mono">
              Dynamically configured from OUAT / KVK Koraput Agronomic Database
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-[#6E7F94]">
          {crops.length} Crops Active in Season
        </span>
      </div>

      {/* Dynamic Crop Buttons Grid / Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {crops.map((crop) => {
          const isSelected = selectedCropId === crop.id;
          return (
            <button
              key={crop.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCrop(crop.id)}
              className={`px-3 py-2 rounded-sm border text-left transition-all flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#247A4A] focus-visible:outline-hidden ${
                isSelected
                  ? 'bg-[#247A4A] text-white border-[#247A4A] shadow-xs'
                  : 'bg-[#F8FAFC] text-[#16202A] border-[#CBD5E1] hover:bg-[#EDF7F1] hover:border-[#ABD7C0]'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-sans">
                    {crop.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? 'text-[#D5ECE0]' : 'text-[#6E7F94]'
                    }`}
                  >
                    ({crop.localName.split(' ')[0]})
                  </span>
                </div>
                <div
                  className={`text-[9px] uppercase font-mono tracking-wider ${
                    isSelected ? 'text-[#ABD7C0]' : 'text-[#6E7F94]'
                  }`}
                >
                  {crop.category} · {crop.typicalDurationDays}d
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
