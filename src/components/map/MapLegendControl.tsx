import React from 'react';
import type { RiskMapLayerId } from '../../types/riskMap';
import { RISK_MAP_LAYERS } from '../../data/geo/layerConfigs';
import { cn } from '../../utils/cn';

interface MapLegendControlProps {
  activeLayer: RiskMapLayerId;
  className?: string;
}

export function MapLegendControl({ activeLayer, className }: MapLegendControlProps) {
  const config = RISK_MAP_LAYERS[activeLayer];

  return (
    <div
      className={cn(
        'rounded-sm border border-[#CBD5E1] bg-white/95 backdrop-blur-sm p-3 shadow-gov-elevated text-xs space-y-2 select-none z-[1000]',
        className
      )}
    >
      <div className="border-b border-[#F0F3F7] pb-1.5 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F33]">
            {config.name}
          </h4>
          <span className="text-[10px] text-[#6E7F94] font-mono">
            Unit: [{config.unit}] • Operational Scale
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {config.colorScale.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 font-mono text-[11px]">
            <span
              className="w-4 h-3 rounded-xs border border-black/10 shrink-0 shadow-xs"
              style={{ backgroundColor: step.color }}
            />
            <span className="text-[#16202A] font-medium leading-none">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#6E7F94] leading-tight pt-1 border-t border-[#F0F3F7]">
        {config.description}
      </p>
    </div>
  );
}
