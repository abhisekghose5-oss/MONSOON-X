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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-md border border-[#E2E8F0] shadow-gov-card">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F33] flex items-center gap-1.5 bg-[#EAF0F6] px-2.5 py-1 rounded-sm border border-[#CBD5E1]">
          <Calendar className="w-3.5 h-3.5 text-[#1479C9]" />
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
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all flex flex-col sm:flex-row items-center gap-1 sm:gap-2 border focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden ${
                isActive
                  ? 'bg-[#0B1F33] text-white border-[#0B1F33] font-bold shadow-xs'
                  : 'bg-white text-[#4B5B6D] border-[#E2E8F0] hover:bg-[#F5F7FA] hover:text-[#16202A]'
              }`}
            >
              <span>{h.label}</span>
              <span
                className={`text-[10px] uppercase ${
                  isActive ? 'text-[#7BBAE9]' : 'text-[#6E7F94]'
                }`}
              >
                [{h.sublabel}]
              </span>
            </button>
          );
        })}
      </div>

      {confidenceScore !== undefined && (
        <div className="hidden lg:flex items-center gap-2 border-l border-[#F0F3F7] pl-3 text-xs font-mono">
          <span className="text-[#6E7F94]">Horizon Skill:</span>
          <span
            className={`font-bold px-1.5 py-0.5 rounded-sm text-[11px] ${
              confidenceTier === 'High'
                ? 'bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0]'
                : confidenceTier === 'Moderate'
                ? 'bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2]'
                : 'bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C]'
            }`}
          >
            {confidenceScore}% ({confidenceTier})
          </span>
        </div>
      )}
    </div>
  );
}
