import React from 'react';
import type { DecadalPeriod, HistoricalEnsoPhase } from '../../types/historical';
import { Search, Download, Filter } from 'lucide-react';

interface ClimatologyFilterBarProps {
  selectedDecade: DecadalPeriod | 'all';
  onSelectDecade: (decade: DecadalPeriod | 'all') => void;
  selectedEnso: HistoricalEnsoPhase | 'all';
  onSelectEnso: (enso: HistoricalEnsoPhase | 'all') => void;
  searchYear: string;
  onSearchYearChange: (val: string) => void;
  onExportCsv: () => void;
  totalFilteredCount: number;
  totalCount: number;
  className?: string;
}

export function ClimatologyFilterBar({
  selectedDecade,
  onSelectDecade,
  selectedEnso,
  onSelectEnso,
  searchYear,
  onSearchYearChange,
  onExportCsv,
  totalFilteredCount,
  totalCount,
  className = '',
}: ClimatologyFilterBarProps) {
  const decades: { key: DecadalPeriod | 'all'; label: string }[] = [
    { key: 'all', label: 'All Decades (1970–2025)' },
    { key: '1970-1979', label: '1970s' },
    { key: '1980-1989', label: '1980s' },
    { key: '1990-1999', label: '1990s' },
    { key: '2000-2009', label: '2000s' },
    { key: '2010-2019', label: '2010s' },
    { key: '2020-2025', label: '2020s' },
  ];

  const ensoPhases: (HistoricalEnsoPhase | 'all')[] = ['all', 'El Niño', 'La Niña', 'Neutral'];

  return (
    <div className={`p-4 rounded-md border border-[#E2E8F0] bg-white shadow-gov-card space-y-3 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Count Badge */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B1F33] flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-[#1479C9]" />
            CLIMATOLOGY FILTER CONTROLS:
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white">
            {totalFilteredCount} of {totalCount} YEARS
          </span>
        </div>

        {/* Search Year Box & Export CSV */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#6E7F94] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchYear}
              onChange={(e) => onSearchYearChange(e.target.value)}
              placeholder="Search year (e.g. 2002)..."
              className="w-full pl-8 pr-3 py-1 rounded-xs border border-[#CBD5E1] bg-white text-xs font-mono text-[#0B1F33] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#1479C9]"
            />
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-xs bg-[#247A4A] hover:bg-[#1E663E] text-white flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT 55-YR CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F0F3F7] text-xs">
        {/* Decade Selector */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[10px] font-mono font-bold text-[#6E7F94] uppercase mr-1">
            Decade:
          </span>
          {decades.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => onSelectDecade(d.key)}
              className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-xs transition-all whitespace-nowrap ${
                selectedDecade === d.key
                  ? 'bg-[#0B1F33] text-white shadow-xs'
                  : 'bg-white text-[#4B5B6D] border border-[#CBD5E1] hover:bg-slate-50'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* ENSO Selector */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[10px] font-mono font-bold text-[#6E7F94] uppercase mr-1">
            ENSO:
          </span>
          {ensoPhases.map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => onSelectEnso(phase)}
              className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-xs transition-all ${
                selectedEnso === phase
                  ? 'bg-[#1479C9] text-white shadow-xs'
                  : 'bg-white text-[#4B5B6D] border border-[#CBD5E1] hover:bg-slate-50'
              }`}
            >
              {phase === 'all' ? 'All Phases' : phase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
