import React, { useState } from 'react';
import { useBlockSelection } from '../../hooks/useBlockSelection';
import { useI18n } from '../../i18n';
import type { KoraputBlockId } from '../../types/geo';
import { MapPin, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface FarmerLocationCardProps {
  className?: string;
}

export function FarmerLocationCard({ className = '' }: FarmerLocationCardProps) {
  const { selectedBlockId, selectBlock, allBlocks, isDistrictWide } = useBlockSelection();
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  const locT = t.sections.myLocation;

  // Localized block name lookup
  const getLocalizedName = (id: string, fallback: string) => {
    return locT.blockNames[id] || fallback;
  };

  const currentDisplayName = isDistrictWide
    ? locT.allKoraput
    : getLocalizedName(selectedBlockId, selectedBlockId);

  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-xl border border-[#1E354D] shadow-command-panel overflow-hidden ${className}`}>
      {/* Header / Active Location Bar */}
      <div className="p-4 bg-[#071324] border-b border-[#1E354D]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] font-mono flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#38BDF8]" />
            <span>{locT.title}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-[#0A192F] px-2 py-0.5 rounded border border-[#1E354D]">
            Odisha · Koraput
          </span>
        </div>

        {/* Current Active Location Display */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {currentDisplayName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {locT.selectedNotice}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0284C7]/20 hover:bg-[#0284C7]/30 text-[#38BDF8] font-bold text-xs flex items-center gap-1.5 transition-all touch-manipulation active:scale-95 border border-[#38BDF8]/40 cursor-pointer"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'ସଙ୍କୁଚିତ / Close' : 'ବଦଳାନ୍ତୁ / Change'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Horizontal Selector Bar (Always visible for top blocks) */}
      <div className="p-3 bg-[#071324]/60 border-b border-[#1E354D] overflow-x-auto scrollbar-none flex gap-2">
        <button
          type="button"
          onClick={() => selectBlock('all')}
          className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 touch-manipulation active:scale-95 cursor-pointer ${
            isDistrictWide
              ? 'bg-[#0284C7] text-white shadow-md border border-[#38BDF8]'
              : 'bg-[#0A192F] text-slate-300 hover:bg-[#132844] border border-[#1E354D]'
          }`}
        >
          {isDistrictWide && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
          <span>{locT.allKoraput}</span>
        </button>

        {allBlocks.slice(0, 5).map((block) => {
          const isSelected = selectedBlockId === block.id;
          return (
            <button
              key={block.id}
              type="button"
              onClick={() => selectBlock(block.id as KoraputBlockId)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 touch-manipulation active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-[#0284C7] text-white shadow-md border border-[#38BDF8]'
                  : 'bg-[#0A192F] text-slate-300 hover:bg-[#132844] border border-[#1E354D]'
              }`}
            >
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              <span>{getLocalizedName(block.id, block.name)}</span>
            </button>
          );
        })}
      </div>

      {/* Expandable Full Block Grid (All 14 Koraput Blocks) */}
      {isExpanded && (
        <div className="p-3 bg-[#071324] space-y-2 animate-in fade-in duration-200 border-t border-[#1E354D]">
          <p className="text-[11px] font-bold text-slate-400 uppercase px-1 font-mono">
            {locT.selectBlock} (14 Blocks)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                selectBlock('all');
                setIsExpanded(false);
              }}
              className={`min-h-[48px] p-2.5 rounded-lg text-left text-xs font-bold transition-all flex items-center justify-between border touch-manipulation active:scale-95 cursor-pointer ${
                isDistrictWide
                  ? 'bg-[#0284C7] border-[#38BDF8] text-white'
                  : 'bg-[#0A192F] border-[#1E354D] text-slate-300 hover:bg-[#132844]'
              }`}
            >
              <span>{locT.allKoraput}</span>
              {isDistrictWide && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
            </button>

            {allBlocks.map((block) => {
              const isSelected = selectedBlockId === block.id;
              return (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => {
                    selectBlock(block.id as KoraputBlockId);
                    setIsExpanded(false);
                  }}
                  className={`min-h-[48px] p-2.5 rounded-lg text-left text-xs font-bold transition-all flex items-center justify-between border touch-manipulation active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0284C7] border-[#38BDF8] text-white'
                      : 'bg-[#0A192F] border-[#1E354D] text-slate-300 hover:bg-[#132844]'
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{getLocalizedName(block.id, block.name)}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{block.name}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default FarmerLocationCard;
