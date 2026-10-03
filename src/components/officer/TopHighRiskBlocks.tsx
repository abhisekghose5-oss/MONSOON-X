import React from 'react';
import type { BlockRiskEntry } from '../../types/officer';
import { AlertOctagon, ArrowRight, Mountain } from 'lucide-react';

interface TopHighRiskBlocksProps {
  blocks: BlockRiskEntry[];
  onSelectBlock: (block: BlockRiskEntry) => void;
  className?: string;
}

export function TopHighRiskBlocks({
  blocks,
  onSelectBlock,
  className = '',
}: TopHighRiskBlocksProps) {
  // Filter top critical/high blocks
  const criticalBlocks = blocks
    .filter((b) => b.overallRiskLevel === 'critical' || b.overallRiskLevel === 'high')
    .slice(0, 4);

  return (
    <div className={`bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] shadow-command-panel p-4 space-y-3.5 text-white ${className}`}>
      <div className="flex items-center justify-between border-b border-[#1E354D] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-rose-950/60 text-rose-300 border border-rose-500/40">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              PRIORITY HIGH-RISK BLOCKS (DAO INTERVENTION LIST)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Immediate administrative attention required prior to dry break onset
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-xs">
          {criticalBlocks.length} BLOCKS ACTIVE
        </span>
      </div>

      {/* Grid of Priority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {criticalBlocks.map((b) => (
          <div
            key={b.blockId}
            className="p-3.5 rounded-lg border border-rose-500/40 bg-[#071324]/90 space-y-2.5 flex flex-col justify-between hover:border-rose-400/80 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all relative overflow-hidden group"
          >
            {/* Top Risk Indicator Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />

            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                    {b.blockName}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mountain className="w-3 h-3 text-[#4ADE80]" /> {b.elevationMeters}m · {b.headquarters}
                  </span>
                </div>
                <span className="font-mono text-xs font-black text-rose-400 bg-rose-950/70 px-2 py-0.5 rounded-xs border border-rose-500/40">
                  {b.drySpellProbability}% RISK
                </span>
              </div>

              {/* Vulnerability Metrics */}
              <div className="mt-2.5 pt-2.5 border-t border-[#1E354D] space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Kharif Crop Area:</span>
                  <span className="font-mono font-bold text-white">
                    {b.kharifAcreageHa.toLocaleString()} ha
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Vulnerable Crop:</span>
                  <span className="font-semibold text-rose-400 truncate max-w-[130px]">
                    {b.primaryCropVulnerable}
                  </span>
                </div>
              </div>

              {/* Administrative Directive */}
              <div className="mt-2.5 p-2 rounded-xs bg-[#1C1608]/70 border border-amber-500/30 text-[11px] text-amber-200/90 leading-snug">
                <strong className="block text-[10px] uppercase font-mono text-amber-400">
                  BAO Action Directive:
                </strong>
                {b.recommendedDirective}
              </div>
            </div>

            {/* Drilldown Trigger Button */}
            <button
              type="button"
              onClick={() => onSelectBlock(b)}
              className="w-full mt-2 py-1.5 px-2 rounded-sm bg-[#0B1F33] hover:bg-[#0284C7] text-white text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1.5 border border-[#1E354D] hover:border-[#38BDF8]/50 shadow-xs cursor-pointer"
            >
              <span>INSPECT BLOCK</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
