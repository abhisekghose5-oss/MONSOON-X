import React from 'react';
import type { BlockRiskEntry } from '../../types/officer';
import { ShieldAlert, Wind, Droplets, AlertTriangle, ArrowRight } from 'lucide-react';

interface FalseOnsetAlertsPanelProps {
  blocks: BlockRiskEntry[];
  onInspectBlock: (block: BlockRiskEntry) => void;
  className?: string;
}

export function FalseOnsetAlertsPanel({
  blocks,
  onInspectBlock,
  className = '',
}: FalseOnsetAlertsPanelProps) {
  const alertedBlocks = blocks.filter((b) => b.isFalseOnsetAlert);

  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-3.5 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#FCEDEC] text-[#802626]">
            <ShieldAlert className="w-4 h-4 text-[#C43D3D]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
              FALSE-ONSET ALERT REGISTRY (IMD/CRIDA DIAGNOSTIC)
            </h3>
            <span className="text-[11px] text-[#6E7F94] font-mono">
              Coupled signal: Transient convective rainfall followed by &gt;50% subsequent dry-spell hazard
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#C43D3D] text-white">
          {alertedBlocks.length} BLOCKS TRIGGERED
        </span>
      </div>

      {/* Diagnostic Signal Banner */}
      <div className="p-3 rounded-xs bg-[#FDF7EB] border border-[#F4D79C] text-xs text-[#8C5D00] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-[#D99000] shrink-0" />
          <span className="leading-snug">
            <strong>Meteorological Criterion Met:</strong> 850 hPa Findlater Low-Level Jet shows zonal deceleration (&lt;15 kts) post June 13, causing rapid moisture divergence over Eastern Ghats highlands.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-[#0B1F33]">
            <Wind className="w-3.5 h-3.5 text-[#1479C9]" /> Zonal Shear: Decelerating
          </span>
          <span className="flex items-center gap-1 text-[#0B1F33]">
            <Droplets className="w-3.5 h-3.5 text-[#247A4A]" /> PWV: 48mm &gt; 42mm
          </span>
        </div>
      </div>

      {/* Grid of Alerted Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {alertedBlocks.map((b) => (
          <div
            key={b.blockId}
            className="p-3 rounded-xs border border-[#EEA9A7] bg-[#FFFBFB] space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0B1F33]">
                  {b.blockName}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-[#FCEDEC] text-[#802626] border border-[#EEA9A7]">
                  WATCH
                </span>
              </div>

              <div className="mt-1.5 text-[11px] text-[#4B5B6D] font-mono space-y-0.5">
                <div>Dry Spell: <strong className="text-[#C43D3D]">{b.drySpellProbability}%</strong></div>
                <div>GPs Affected: <strong className="text-[#0B1F33]">{b.panchayatsWithAlert} / {b.panchayatCount}</strong></div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onInspectBlock(b)}
              className="mt-2 py-1 px-2 rounded-xs bg-white hover:bg-slate-50 text-[#0B1F33] text-[10px] font-bold font-mono transition-all border border-[#CBD5E1] flex items-center justify-center gap-1"
            >
              <span>INSPECT</span>
              <ArrowRight className="w-3 h-3 text-[#1479C9]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
