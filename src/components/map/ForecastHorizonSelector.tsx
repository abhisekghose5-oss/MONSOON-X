import React from 'react';
import type { ForecastHorizon } from '../../types/riskMap';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ForecastHorizonSelectorProps {
  value: ForecastHorizon;
  onChange: (horizon: ForecastHorizon) => void;
  className?: string;
}

export function ForecastHorizonSelector({
  value,
  onChange,
  className,
}: ForecastHorizonSelectorProps) {
  const horizons: ForecastHorizon[] = ['7D', '14D', '21D', '30D'];

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase text-[#6E7F94]">
        <Calendar className="w-3.5 h-3.5 text-[#1479C9]" />
        <span>Forecast Horizon:</span>
      </span>

      <div
        role="group"
        aria-label="Forecast Horizon Selector"
        className="inline-flex rounded-sm border border-[#CBD5E1] p-0.5 bg-[#F5F7FA] shadow-xs"
      >
        {horizons.map((h) => {
          const isActive = value === h;
          return (
            <button
              key={h}
              type="button"
              onClick={() => onChange(h)}
              aria-pressed={isActive}
              className={cn(
                'px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all',
                isActive
                  ? 'bg-[#0B1F33] text-white shadow-xs'
                  : 'text-[#4B5B6D] hover:text-[#0B1F33] hover:bg-[#EAF0F6]'
              )}
            >
              {h}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ForecastHorizonSelector;
