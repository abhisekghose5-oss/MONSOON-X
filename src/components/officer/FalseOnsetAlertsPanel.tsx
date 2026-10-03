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
    <div className={`bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] shadow-command-panel p-4 space-y-3.5 text-white ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#1E354D] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-rose-950/60 text-rose-300 border border-rose-500/40">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              FALSE-ONSET ALERT REGISTRY (IMD/CRIDA DIAGNOSTIC)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Coupled signal: Transient convective rainfall followed by &gt;50% subsequent dry-spell hazard
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-xs">
          {alertedBlocks.length} BLOCKS TRIGGERED
        </span>
      </div>

      {/* Diagnostic Signal Banner */}
      <div className="p-3 rounded-lg bg-[#1C1608]/70 border border-amber-500/30 text-xs text-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="leading-snug">
            <strong className="text-amber-300">Meteorological Criterion Met:</strong> 850 hPa Findlater Low-Level Jet shows zonal deceleration (&lt;15 kts) post June 13, causing rapid moisture divergence over Eastern Ghats highlands.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300 bg-[#071324] px-2 py-0.5 rounded-xs border border-[#1E354D]">
            <Wind className="w-3.5 h-3.5 text-[#38BDF8]" /> Zonal Shear: Decelerating
          </span>
          <span className="flex items-center gap-1.5 text-slate-300 bg-[#071324] px-2 py-0.5 rounded-xs border border-[#1E354D]">
            <Droplets className="w-3.5 h-3.5 text-[#4ADE80]" /> PWV: 48mm &gt; 42mm
          </span>
        </div>
      </div>

      {/* Grid of Alerted Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {alertedBlocks.map((b) => (
          <div
            key={b.blockId}
            className="p-3 rounded-lg border border-rose-500/30 bg-[#071324]/90 space-y-2 flex flex-col justify-between hover:border-rose-500/60 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">
                  {b.blockName}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-rose-950/70 text-rose-300 border border-rose-500/40">
                  WATCH
                </span>
              </div>

              <div className="mt-1.5 text-[11px] text-slate-400 font-mono space-y-0.5">
                <div>Dry Spell: <strong className="text-rose-400 font-semibold">{b.drySpellProbability}%</strong></div>
                <div>GPs Affected: <strong className="text-white font-semibold">{b.panchayatsWithAlert} / {b.panchayatCount}</strong></div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onInspectBlock(b)}
              className="mt-2 py-1 px-2 rounded-xs bg-[#0B1F33] hover:bg-[#0284C7] text-white text-[10px] font-bold font-mono transition-all border border-[#1E354D] hover:border-[#38BDF8]/50 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>INSPECT</span>
              <ArrowRight className="w-3 h-3 text-[#38BDF8]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
