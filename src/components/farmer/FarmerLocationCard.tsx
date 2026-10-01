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
    <div className={`bg-white rounded-xl border-2 border-[#CBD5E1] shadow-sm overflow-hidden ${className}`}>
      {/* Header / Active Location Bar */}
      <div className="p-4 bg-gradient-to-r from-[#F0F6FA] to-white border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1479C9] font-mono flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#1479C9]" />
            <span>{locT.title}</span>
          </span>
          <span className="text-[11px] font-mono text-[#6E7F94] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
            Odisha · Koraput
          </span>
        </div>

        {/* Current Active Location Display */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-[#0B1F33] tracking-tight">
              {currentDisplayName}
            </h3>
            <p className="text-xs text-[#4B5B6D] mt-0.5">
              {locT.selectedNotice}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-[#1479C9]/10 hover:bg-[#1479C9]/20 text-[#1479C9] font-bold text-xs flex items-center gap-1.5 transition-all touch-manipulation active:scale-95 border border-[#1479C9]/30"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'ସଙ୍କୁଚିତ / Close' : 'ବଦଳାନ୍ତୁ / Change'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Horizontal Selector Bar (Always visible for top blocks) */}
      <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-x-auto scrollbar-none flex gap-2">
        <button
          type="button"
          onClick={() => selectBlock('all')}
          className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 touch-manipulation active:scale-95 ${
            isDistrictWide
              ? 'bg-[#0B1F33] text-white shadow-sm'
              : 'bg-white text-[#4B5B6D] hover:bg-slate-100 border border-[#CBD5E1]'
          }`}
        >
          {isDistrictWide && <CheckCircle2 className="w-3.5 h-3.5 text-[#247A4A]" />}
          <span>{locT.allKoraput}</span>
        </button>

        {allBlocks.slice(0, 5).map((block) => {
          const isSelected = selectedBlockId === block.id;
          return (
            <button
              key={block.id}
              type="button"
              onClick={() => selectBlock(block.id as KoraputBlockId)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 touch-manipulation active:scale-95 ${
                isSelected
                  ? 'bg-[#1479C9] text-white shadow-sm'
                  : 'bg-white text-[#4B5B6D] hover:bg-slate-100 border border-[#CBD5E1]'
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
        <div className="p-3 bg-white space-y-2 animate-in fade-in duration-200">
          <p className="text-[11px] font-bold text-[#6E7F94] uppercase px-1">
            {locT.selectBlock} (14 Blocks)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                selectBlock('all');
                setIsExpanded(false);
              }}
              className={`min-h-[48px] p-2.5 rounded-lg text-left text-xs font-bold transition-all flex items-center justify-between border-2 touch-manipulation active:scale-95 ${
                isDistrictWide
                  ? 'bg-[#EAF5FC] border-[#1479C9] text-[#0B1F33]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#4B5B6D] hover:bg-slate-100'
              }`}
            >
              <span>{locT.allKoraput}</span>
              {isDistrictWide && <CheckCircle2 className="w-4 h-4 text-[#1479C9] shrink-0" />}
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
                  className={`min-h-[48px] p-2.5 rounded-lg text-left text-xs font-bold transition-all flex items-center justify-between border-2 touch-manipulation active:scale-95 ${
                    isSelected
                      ? 'bg-[#EAF5FC] border-[#1479C9] text-[#0B1F33]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#4B5B6D] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{getLocalizedName(block.id, block.name)}</span>
                    <span className="text-[10px] text-[#6E7F94] font-normal">{block.name}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1479C9] shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
