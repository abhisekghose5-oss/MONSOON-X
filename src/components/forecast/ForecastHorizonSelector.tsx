import React from 'react';
import type { ForecastHorizon } from '../../types/forecast';
import { Calendar } from 'lucide-react';

export interface ForecastHorizonSelectorProps {
  selectedHorizon: ForecastHorizon;
  onSelectHorizon: (horizon: ForecastHorizon) => void;
  confidenceScore?: number;
  confidenceTier?: 'High' | 'Moderate' | 'Low';
}

export function ForecastHorizonSelector({
  selectedHorizon,
  onSelectHorizon,
  confidenceScore,
  confidenceTier,
}: ForecastHorizonSelectorProps) {
  const horizons: {
    id: ForecastHorizon;
    label: string;
    sublabel: string;
    reliability: 'High' | 'Moderate' | 'Low' | 'Extended';
  }[] = [
    { id: '7d', label: '7 DAYS', sublabel: 'Synoptic Lead', reliability: 'High' },
    { id: '14d', label: '14 DAYS', sublabel: 'Sub-Seasonal', reliability: 'Moderate' },
    { id: '21d', label: '21 DAYS', sublabel: 'Extended Outlook', reliability: 'Low' },
    { id: '30d', label: '30 DAYS', sublabel: 'Monthly Trend', reliability: 'Extended' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A192F]/85 p-3.5 rounded-xl border border-[#1E354D] shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5 bg-[#071324] px-3 py-1.5 rounded-lg border border-[#1E354D]">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Forecast Horizon:</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {horizons.map((h) => {
          const isActive = selectedHorizon === h.id;
          return (
            <button
              key={h.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectHorizon(h.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-2 border cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'bg-[#071324] text-slate-400 border-[#1E354D] hover:bg-[#0E2845] hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <span>{h.label}</span>
              <span
                className={`text-[10px] uppercase font-mono ${
                  isActive ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                [{h.sublabel}]
              </span>
            </button>
          );
        })}
      </div>

      {confidenceScore !== undefined && (
        <div className="hidden lg:flex items-center gap-2 border-l border-[#1E354D] pl-3.5 text-xs font-mono">
          <span className="text-slate-400">Horizon Skill:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-lg text-[11px] font-mono ${
              confidenceTier === 'High'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                : confidenceTier === 'Moderate'
                ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40'
                : 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
            }`}
          >
            {confidenceScore}% ({confidenceTier})
          </span>
        </div>
      )}
    </div>
  );
}
