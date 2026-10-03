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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0A192F] text-white rounded-lg border border-[#1E354D] shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#071324] text-white flex items-center justify-between border-b border-[#1E354D] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40 flex items-center justify-center text-[#38BDF8] shrink-0">
              <MapPin className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div>
              <h3 id="block-detail-title" className="text-base font-bold font-mono uppercase tracking-wider text-white">
                {block.blockName} BLOCK PROFILE
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                HQ: {block.headquarters} · Koraput District, Odisha
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden cursor-pointer"
            aria-label="Close block profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Top Quick Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-[#071324]/90 border border-[#1E354D]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Elevation</span>
              <span className="text-sm font-bold font-mono text-white block mt-0.5">{block.elevationMeters}m</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071324]/90 border border-[#1E354D]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Kharif Area</span>
              <span className="text-sm font-bold font-mono text-white block mt-0.5">{block.kharifAcreageHa.toLocaleString()} ha</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071324]/90 border border-[#1E354D]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Panchayats</span>
              <span className="text-sm font-bold font-mono text-white block mt-0.5">{block.panchayatCount} GPs</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071324]/90 border border-[#1E354D]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Risk Level</span>
              <span className="text-sm font-bold font-mono uppercase text-rose-400 block mt-0.5">{block.overallRiskLevel}</span>
            </div>
          </div>

          {/* Agro-Ecological Zone */}
          <div className="p-3 rounded-lg bg-[#071324]/90 border border-[#1E354D]">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
              Agro-Ecological Classification:
            </span>
            <span className="text-xs font-semibold text-white mt-0.5 block font-mono">
              {block.agroEcologicalZone}
            </span>
          </div>

          {/* Hazard Summary */}
          <div className="p-3.5 rounded-lg bg-[#071324]/90 border border-[#1E354D] space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase text-[#38BDF8] flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              Hydrometeorological Risk Assessment:
            </span>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between p-2 rounded-xs bg-[#0A192F] border border-[#1E354D]">
                <span className="text-slate-400">Dry Spell Probability:</span>
                <strong className="font-mono text-rose-400">{block.drySpellProbability}% ({block.drySpellSeverity})</strong>
              </div>
              <div className="flex justify-between p-2 rounded-xs bg-[#0A192F] border border-[#1E354D]">
                <span className="text-slate-400">Heavy Rain Risk:</span>
                <strong className="font-mono text-white">{block.heavyRainProbability}%</strong>
              </div>
              <div className="flex justify-between p-2 rounded-xs bg-[#0A192F] border border-[#1E354D]">
                <span className="text-slate-400">False Onset Alert:</span>
                <strong className="font-mono text-rose-400">{block.isFalseOnsetAlert ? 'ACTIVE WATCH' : 'NONE'}</strong>
              </div>
              <div className="flex justify-between p-2 rounded-xs bg-[#0A192F] border border-[#1E354D]">
                <span className="text-slate-400">Soil Moisture Deficit:</span>
                <strong className="font-mono text-amber-400">-{block.soilMoistureDeficitPercent}%</strong>
              </div>
            </div>
          </div>

          {/* Administrative Directive */}
          <div className="p-3.5 rounded-lg bg-[#1C1608]/70 border border-amber-500/30 text-amber-200/90 space-y-1">
            <strong className="block text-xs font-mono uppercase text-amber-400">
              MANDATORY EXTENSION DIRECTIVE (BAO ACTION):
            </strong>
            <p className="text-xs leading-relaxed text-slate-200">
              {block.recommendedDirective}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#071324] border-t border-[#1E354D] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewPanchayats(block);
            }}
            className="px-3.5 py-1.5 rounded-sm bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-xs border border-[#38BDF8]/40 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>VIEW PANCHAYATS ({block.panchayatCount})</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-[#0B1F33] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold font-mono transition-all border border-[#1E354D] cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
