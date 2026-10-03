import React from 'react';
import type { BlockRiskStatus } from '../../types/overview';
import { RiskBadge } from '../design-system/RiskBadge';
import { useBlockSelection } from '../../hooks/useBlockSelection';
import { Mountain, Droplets, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface KoraputRiskMapPreviewProps {
  blockRisks: BlockRiskStatus[];
}

export function KoraputRiskMapPreview({ blockRisks }: KoraputRiskMapPreviewProps) {
  const { selectedBlockId, selectBlock } = useBlockSelection();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono">
          Click any block to focus dashboard telemetry ({blockRisks.length} Blocks):
        </span>
        <Link
          to="/risk-map"
          className="text-[#38BDF8] hover:underline font-semibold flex items-center gap-1 text-[11px]"
        >
          <span>Open Full Spatial GIS Map</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {blockRisks.map((block) => {
          const isSelected = selectedBlockId === block.blockId;

          const borderColors = {
            nominal: 'border-l-[#10B981]',
            watch: 'border-l-[#0284C7]',
            alert: 'border-l-[#F59E0B]',
            warning: 'border-l-[#EF4444]',
          };

          return (
            <div
              key={block.blockId}
              onClick={() => selectBlock(block.blockId as any)}
              className={cn(
                'rounded-lg border border-[#1E354D] border-l-4 p-3 bg-[#0A192F] hover:bg-[#0D2038] hover:border-[#0284C7]/50 transition-all cursor-pointer shadow-command-panel space-y-2 text-white',
                borderColors[block.riskLevel],
                isSelected && 'ring-2 ring-[#0284C7] bg-[#0E2845]'
              )}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">
                      {block.blockName}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                    )}
                  </div>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                    <Mountain className="w-2.5 h-2.5 text-[#4ADE80]" /> {block.elevationMeters}m MSL
                  </span>
                </div>
                <RiskBadge level={block.riskLevel} size="sm" showIcon={false} />
              </div>

              <div className="text-[11px] text-slate-300 line-clamp-1 font-sans">
                {block.primaryRisk}
              </div>

              <div className="pt-1.5 border-t border-[#1E354D] flex items-center justify-between text-[10px] font-mono">
                <span className="flex items-center gap-1 text-[#38BDF8] font-medium">
                  <Droplets className="w-3 h-3" /> {block.expected7dRainfallMm.toFixed(0)}mm (7D)
                </span>
                <span className={cn(
                  'font-semibold px-1.5 py-0.5 rounded-xs border',
                  block.sowingReadiness.includes('Caution')
                    ? 'text-amber-300 bg-amber-950/60 border-amber-500/40'
                    : 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                )}>
                  {block.sowingReadiness}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
