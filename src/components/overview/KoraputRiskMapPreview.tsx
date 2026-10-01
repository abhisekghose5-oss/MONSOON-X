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
        <span className="text-[#6E7F94] font-mono">
          Click any block to focus dashboard telemetry ({blockRisks.length} Blocks):
        </span>
        <Link
          to="/risk-map"
          className="text-[#1479C9] hover:underline font-semibold flex items-center gap-1 text-[11px]"
        >
          <span>Open Full Spatial GIS Map</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {blockRisks.map((block) => {
          const isSelected = selectedBlockId === block.blockId;

          const borderColors = {
            nominal: 'border-l-[#247A4A]',
            watch: 'border-l-[#1479C9]',
            alert: 'border-l-[#D99000]',
            warning: 'border-l-[#C43D3D]',
          };

          return (
            <div
              key={block.blockId}
              onClick={() => selectBlock(block.blockId as any)}
              className={cn(
                'rounded-sm border border-[#CBD5E1] border-l-4 p-3 bg-white hover:bg-[#F5F7FA] transition-all cursor-pointer shadow-gov-card space-y-2',
                borderColors[block.riskLevel],
                isSelected && 'ring-2 ring-[#1479C9] bg-[#EDF6FC]/60'
              )}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-[#0B1F33]">
                      {block.blockName}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1479C9]" />
                    )}
                  </div>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[#6E7F94]">
                    <Mountain className="w-2.5 h-2.5 text-[#247A4A]" /> {block.elevationMeters}m MSL
                  </span>
                </div>
                <RiskBadge level={block.riskLevel} size="sm" showIcon={false} />
              </div>

              <div className="text-[11px] text-[#4B5B6D] line-clamp-1 font-sans">
                {block.primaryRisk}
              </div>

              <div className="pt-1.5 border-t border-[#F0F3F7] flex items-center justify-between text-[10px] font-mono">
                <span className="flex items-center gap-1 text-[#1479C9] font-medium">
                  <Droplets className="w-3 h-3" /> {block.expected7dRainfallMm.toFixed(0)}mm (7D)
                </span>
                <span className={cn(
                  'font-semibold px-1 py-0.2 rounded-xs',
                  block.sowingReadiness.includes('Caution')
                    ? 'text-[#8C5D00] bg-[#FDF7EB]'
                    : 'text-[#154D2F] bg-[#EDF7F1]'
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
