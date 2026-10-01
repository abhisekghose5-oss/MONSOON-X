import React from 'react';
import type { RiskLayer } from '../../types/riskMap';
import { RISK_MAP_LAYERS } from '../../data/geo/layerConfigs';
import { cn } from '../../utils/cn';

interface RiskColorScaleProps {
  layer: RiskLayer;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}

export function RiskColorScale({
  layer,
  orientation = 'horizontal',
  showLabels = true,
  compact = false,
  className,
}: RiskColorScaleProps) {
  const config = RISK_MAP_LAYERS[layer];
  const steps = config.colorScale;

  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col gap-1 font-mono text-[11px]', className)}>
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-4 h-3 rounded-xs border border-black/10 shrink-0 shadow-xs"
              style={{ backgroundColor: step.color }}
            />
            {showLabels && (
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="font-semibold text-[#0B1F33]">{step.label}</span>
                {step.subLabel && (
                  <span className="text-[10px] text-[#6E7F94]">({step.subLabel})</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1 select-none', className)}>
      {/* Continuous-segmented color bar */}
      <div className="flex h-3.5 w-full rounded-xs overflow-hidden border border-[#CBD5E1] shadow-xs">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex-1 h-full transition-opacity hover:opacity-90 relative group"
            style={{ backgroundColor: step.color }}
            title={`${step.label}: ${step.subLabel || ''}`}
          />
        ))}
      </div>

      {/* Numerical Ticks & Qualitative SubLabels */}
      {showLabels && (
        <div className="flex justify-between items-start text-[10px] font-mono text-[#4B5B6D] pt-0.5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col text-center',
                compact ? 'text-[9px]' : 'text-[10px]',
                idx === 0 && 'text-left items-start',
                idx === steps.length - 1 && 'text-right items-end'
              )}
              style={{ width: `${100 / steps.length}%` }}
            >
              <span className="font-semibold text-[#0B1F33] leading-none">{step.label}</span>
              {!compact && step.subLabel && (
                <span className="text-[9px] text-[#6E7F94] mt-0.5 leading-none truncate max-w-full">
                  {step.subLabel}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RiskColorScale;
