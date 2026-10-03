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
  const horizons: ForecastHorizon[] = ['3D', '7D', '14D', '30D'];

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase text-slate-400">
        <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>Forecast Horizon:</span>
      </span>

      <div
        role="group"
        aria-label="Forecast Horizon Selector"
        className="inline-flex rounded-xl border border-[#1E354D] p-1 bg-[#071324]/90 backdrop-blur-md shadow-2xl gap-1"
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
                'px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer border',
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:border-[#1E354D]'
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
