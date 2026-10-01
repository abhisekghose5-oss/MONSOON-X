import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useGlobalFilters } from '../../store/filterStore';
import { cn } from '../../utils/cn';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  showModelSelector?: boolean;
  onReset?: () => void;
}

export function FilterBar({
  showModelSelector = false,
  onReset,
  className,
  ...props
}: FilterBarProps) {
  const [filters, setFilters] = useGlobalFilters();

  const horizons = [
    { id: '3d', label: '3-Day Convective' },
    { id: '7d', label: '7-Day Synoptic' },
    { id: '14d', label: '14-Day Extended' },
    { id: 'season', label: 'Seasonal Outlook' },
  ] as const;

  return (
    <div
      className={cn(
        'rounded-md border border-[#E2E8F0] bg-white p-2.5 shadow-gov-card flex flex-wrap items-center justify-between gap-3 text-xs',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[#4B5B6D] font-semibold uppercase text-[11px] pr-2 border-r border-[#E2E8F0]">
          <Filter className="w-3.5 h-3.5 text-[#1479C9]" />
          <span>Horizon:</span>
        </div>

        {/* Forecast Horizon Tabs */}
        <div className="inline-flex rounded-sm border border-[#CBD5E1] p-0.5 bg-[#F5F7FA]">
          {horizons.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setFilters({ selectedHorizon: h.id })}
              className={cn(
                'px-2.5 py-1 text-xs font-mono font-medium rounded-sm transition-colors',
                filters.selectedHorizon === h.id
                  ? 'bg-[#0B1F33] text-white shadow-xs'
                  : 'text-[#4B5B6D] hover:text-[#0B1F33] hover:bg-white'
              )}
            >
              {h.id.toUpperCase()}
            </button>
          ))}
        </div>

        {showModelSelector && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#E2E8F0]">
            <span className="text-[11px] font-mono uppercase text-[#6E7F94]">Ensemble:</span>
            <select
              defaultValue="blended"
              className="bg-[#F5F7FA] border border-[#CBD5E1] rounded-sm px-2 py-1 text-xs font-mono text-[#0B1F33] focus:outline-none"
            >
              <option value="blended">Multi-Model Blended (NCUM + IFS + GFS)</option>
              <option value="ncum">NCMRWF NCUM (12 km)</option>
              <option value="ecmwf">ECMWF IFS (9 km)</option>
              <option value="imd">IMD GFS (12 km)</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-[#6E7F94] bg-[#F0F3F7] px-2 py-1 rounded-sm border border-[#E2E8F0]">
          Kharif {filters.seasonYear}
        </span>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-[#4B5B6D] hover:text-[#0B1F33] px-2 py-1 rounded border border-[#CBD5E1] hover:bg-[#F5F7FA] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
