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
    <div className="bg-[#0A192F] rounded-lg border border-[#1E354D] shadow-command-panel p-3.5 sm:p-4.5 space-y-3 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E354D] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-sm bg-[#10B981]/20 border border-[#10B981]/40 text-[#4ADE80]">
            <Sprout className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Active Crop Decision Selector
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Dynamically configured from OUAT / KVK Koraput Agronomic Database
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
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
              className={`px-3 py-2 rounded-md border text-left transition-all flex items-center gap-2.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:outline-hidden ${
                isSelected
                  ? 'bg-[#10B981] text-white border-[#10B981] shadow-xs'
                  : 'bg-[#071324] text-slate-200 border-[#1E354D] hover:bg-[#0D2038] hover:border-[#10B981]/50'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-sans">
                    {crop.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    ({crop.localName.split(' ')[0]})
                  </span>
                </div>
                <div
                  className={`text-[9px] uppercase font-mono tracking-wider ${
                    isSelected ? 'text-emerald-100' : 'text-slate-400'
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
