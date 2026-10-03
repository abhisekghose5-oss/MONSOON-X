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
    <div className={`p-4 rounded-xl border border-[#1E354D] bg-[#0A192F]/80 shadow-xl backdrop-blur-md space-y-3 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Count Badge */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-cyan-400" />
            CLIMATOLOGY FILTER CONTROLS:
          </span>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 font-bold">
            {totalFilteredCount} of {totalCount} YEARS
          </span>
        </div>

        {/* Search Year Box & Export CSV */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchYear}
              onChange={(e) => onSearchYearChange(e.target.value)}
              placeholder="Search year (e.g. 2002)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#1E354D] bg-[#071324] text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/30 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT 55-YR CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#1E354D] text-xs">
        {/* Decade Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">
            Decade:
          </span>
          {decades.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => onSelectDecade(d.key)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all whitespace-nowrap border ${
                selectedDecade === d.key
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'bg-[#071324] text-slate-400 hover:text-slate-200 border-[#1E354D] hover:border-slate-600'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* ENSO Selector */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">
            ENSO:
          </span>
          {ensoPhases.map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => onSelectEnso(phase)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all border ${
                selectedEnso === phase
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'bg-[#071324] text-slate-400 hover:text-slate-200 border-[#1E354D] hover:border-slate-600'
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
