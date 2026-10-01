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
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#FCEDEC] text-[#802626]">
            <AlertOctagon className="w-4 h-4 text-[#C43D3D]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
              PRIORITY HIGH-RISK BLOCKS (DAO INTERVENTION LIST)
            </h3>
            <span className="text-[11px] text-[#6E7F94] font-mono">
              Immediate administrative attention required prior to dry break onset
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#C43D3D] text-white">
          {criticalBlocks.length} BLOCKS ACTIVE
        </span>
      </div>

      {/* Grid of Priority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {criticalBlocks.map((b) => (
          <div
            key={b.blockId}
            className="p-3.5 rounded-md border-2 border-[#EEA9A7] bg-[#FFFDFD] space-y-2.5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Top Risk Indicator Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C43D3D]" />

            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#0B1F33]">
                    {b.blockName}
                  </h4>
                  <span className="text-[10px] font-mono text-[#6E7F94] flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-[#247A4A]" /> {b.elevationMeters}m · {b.headquarters}
                  </span>
                </div>
                <span className="font-mono text-xs font-black text-[#C43D3D] bg-[#FCEDEC] px-1.5 py-0.5 rounded border border-[#EEA9A7]">
                  {b.drySpellProbability}% RISK
                </span>
              </div>

              {/* Vulnerability Metrics */}
              <div className="mt-2 pt-2 border-t border-[#F0F3F7] space-y-1 text-xs">
                <div className="flex justify-between text-[#4B5B6D]">
                  <span>Kharif Crop Area:</span>
                  <span className="font-mono font-bold text-[#0B1F33]">
                    {b.kharifAcreageHa.toLocaleString()} ha
                  </span>
                </div>
                <div className="flex justify-between text-[#4B5B6D]">
                  <span>Vulnerable Crop:</span>
                  <span className="font-semibold text-[#802626] truncate max-w-[130px]">
                    {b.primaryCropVulnerable}
                  </span>
                </div>
              </div>

              {/* Administrative Directive */}
              <div className="mt-2.5 p-2 rounded-xs bg-[#FDF7EB] border border-[#F4D79C] text-[11px] text-[#8C5D00] leading-snug">
                <strong className="block text-[10px] uppercase font-mono text-[#D99000]">
                  BAO Action Directive:
                </strong>
                {b.recommendedDirective}
              </div>
            </div>

            {/* Drilldown Trigger Button */}
            <button
              type="button"
              onClick={() => onSelectBlock(b)}
              className="w-full mt-1 py-1.5 px-2 rounded-xs bg-[#0B1F33] hover:bg-[#142B44] text-white text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1.5"
            >
              <span>INSPECT BLOCK</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1479C9]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
