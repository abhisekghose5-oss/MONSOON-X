import React, { useEffect } from 'react';
import type { BlockRiskEntry } from '../../types/officer';
import { X, MapPin, AlertOctagon, Layers } from 'lucide-react';

interface BlockDetailModalProps {
  block: BlockRiskEntry | null;
  onClose: () => void;
  onViewPanchayats: (block: BlockRiskEntry) => void;
}

export function BlockDetailModal({ block, onClose, onViewPanchayats }: BlockDetailModalProps) {
  useEffect(() => {
    if (!block) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [block, onClose]);

  if (!block) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-md border border-[#CBD5E1] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0B1F33] text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#1479C9] flex items-center justify-center text-white shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 id="block-detail-title" className="text-base font-bold font-mono uppercase tracking-wider text-white">
                {block.blockName} BLOCK PROFILE
              </h3>
              <span className="text-[11px] text-[#A4BCDA] font-mono">
                HQ: {block.headquarters} · Koraput District, Odisha
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xs text-[#A4BCDA] hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden"
            aria-label="Close block profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Top Quick Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">Elevation</span>
              <span className="text-sm font-bold font-mono text-[#0B1F33] block mt-0.5">{block.elevationMeters}m</span>
            </div>

            <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">Kharif Area</span>
              <span className="text-sm font-bold font-mono text-[#0B1F33] block mt-0.5">{block.kharifAcreageHa.toLocaleString()} ha</span>
            </div>

            <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">Panchayats</span>
              <span className="text-sm font-bold font-mono text-[#0B1F33] block mt-0.5">{block.panchayatCount} GPs</span>
            </div>

            <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">Risk Level</span>
              <span className="text-sm font-bold font-mono uppercase text-[#C43D3D] block mt-0.5">{block.overallRiskLevel}</span>
            </div>
          </div>

          {/* Agro-Ecological Zone */}
          <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] font-mono font-bold uppercase text-[#6E7F94] block">
              Agro-Ecological Classification:
            </span>
            <span className="text-xs font-semibold text-[#0B1F33] mt-0.5 block">
              {block.agroEcologicalZone}
            </span>
          </div>

          {/* Hazard Summary */}
          <div className="p-3.5 rounded-xs bg-white border border-[#CBD5E1] space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase text-[#0B1F33] flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-[#C43D3D]" />
              Hydrometeorological Risk Assessment:
            </span>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between p-2 rounded-xs bg-[#F8FAFC]">
                <span className="text-[#4B5B6D]">Dry Spell Probability:</span>
                <strong className="font-mono text-[#C43D3D]">{block.drySpellProbability}% ({block.drySpellSeverity})</strong>
              </div>
              <div className="flex justify-between p-2 rounded-xs bg-[#F8FAFC]">
                <span className="text-[#4B5B6D]">Heavy Rain Risk:</span>
                <strong className="font-mono text-[#0B1F33]">{block.heavyRainProbability}%</strong>
              </div>
              <div className="flex justify-between p-2 rounded-xs bg-[#F8FAFC]">
                <span className="text-[#4B5B6D]">False Onset Alert:</span>
                <strong className="font-mono text-[#802626]">{block.isFalseOnsetAlert ? 'ACTIVE WATCH' : 'NONE'}</strong>
              </div>
              <div className="flex justify-between p-2 rounded-xs bg-[#F8FAFC]">
                <span className="text-[#4B5B6D]">Soil Moisture Deficit:</span>
                <strong className="font-mono text-[#D99000]">-{block.soilMoistureDeficitPercent}%</strong>
              </div>
            </div>
          </div>

          {/* Administrative Directive */}
          <div className="p-3.5 rounded-xs bg-[#FDF7EB] border border-[#F4D79C] text-[#8C5D00] space-y-1">
            <strong className="block text-xs font-mono uppercase text-[#D99000]">
              MANDATORY EXTENSION DIRECTIVE (BAO ACTION):
            </strong>
            <p className="text-xs leading-relaxed text-[#0B1F33]">
              {block.recommendedDirective}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F5F7FA] border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewPanchayats(block);
            }}
            className="px-3.5 py-1.5 rounded-xs bg-[#1479C9] hover:bg-[#0E63A8] text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#0B1F33] focus-visible:outline-hidden"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>VIEW PANCHAYATS ({block.panchayatCount})</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xs bg-white hover:bg-slate-100 text-[#4B5B6D] text-xs font-bold font-mono transition-all border border-[#CBD5E1] focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
