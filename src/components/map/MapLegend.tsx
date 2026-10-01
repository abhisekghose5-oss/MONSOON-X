import React from 'react';
import type { RiskLayer } from '../../types/riskMap';
import { RISK_MAP_LAYERS } from '../../data/geo/layerConfigs';
import { RiskColorScale } from './RiskColorScale';
import { Layers } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MapLegendProps {
  activeLayer: RiskLayer;
  className?: string;
}

export function MapLegend({ activeLayer, className }: MapLegendProps) {
  const config = RISK_MAP_LAYERS[activeLayer];

  return (
    <aside
      aria-label="Map Color Legend"
      className={cn(
        'rounded-sm border border-[#CBD5E1] bg-white/95 backdrop-blur-md p-3 shadow-gov-elevated text-xs space-y-2 select-none z-[1000] w-72 sm:w-80',
        className
      )}
    >
      <div className="border-b border-[#F0F3F7] pb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#1479C9] shrink-0" />
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F33] truncate">
            {config.name}
          </h4>
        </div>
        <span className="text-[10px] text-[#6E7F94] font-mono shrink-0">
          [{config.unit}]
        </span>
      </div>

      {/* Scientific Color Scale Visualizer */}
      <RiskColorScale layer={activeLayer} orientation="horizontal" showLabels={true} />

      {/* Meteorological Parameter Context */}
      <p className="text-[10px] text-[#6E7F94] leading-relaxed pt-1 border-t border-[#F0F3F7]">
        {config.description}
      </p>
    </aside>
  );
}

export default MapLegend;
