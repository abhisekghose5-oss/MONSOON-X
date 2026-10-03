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
        'rounded-xl border border-cyan-500/30 bg-[#0A192F]/90 backdrop-blur-md p-3.5 shadow-2xl text-xs space-y-2 select-none z-[1000]',
        className
      )}
    >
      <div className="border-b border-[#1E354D] pb-2 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">
            {config.name}
          </h4>
          <span className="text-[10px] text-cyan-400 font-mono">
            Unit: [{config.unit}] • Operational Scale
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {config.colorScale.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 font-mono text-[11px]">
            <span
              className="w-4 h-3 rounded-xs border border-white/20 shrink-0 shadow-xs"
              style={{ backgroundColor: step.color }}
            />
            <span className="text-slate-200 font-medium leading-none">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 leading-tight pt-1.5 border-t border-[#1E354D]">
        {config.description}
      </p>
    </div>
  );
}
