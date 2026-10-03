import React, { useState, useMemo } from 'react';
import { DataStatusBadge } from '../components/design-system/DataStatusBadge';
import { getDataProvider } from '../services/data';
import type { DataSource, DataStatus } from '../types/dataArchitecture';
import {
  Database,
  Search,
  ExternalLink,
  ShieldCheck,
  FileText,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '../utils/cn';

export function DataExplorerPage() {
  const provider = getDataProvider();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  // Load datasets on mount
  React.useEffect(() => {
    provider.getDataSources().then((sources) => setDataSources(sources));
  }, [provider]);

  // Status Counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: dataSources.length };
    for (const s of dataSources) {
      counts[s.qualityStatus] = (counts[s.qualityStatus] || 0) + 1;
    }
    return counts;
  }, [dataSources]);

  // Filtered Sources
  const filteredSources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return dataSources.filter((s) => {
      const matchesStatus = statusFilter === 'ALL' || s.qualityStatus === statusFilter;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.source.toLowerCase().includes(q) ||
        s.spatialResolution.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [dataSources, searchQuery, statusFilter]);

  const availableStatuses: ('ALL' | DataStatus)[] = [
    'ALL',
    'OFFICIAL',
    'HISTORICAL',
    'LIVE',
    'MODEL',
    'DEMO',
    'MISSING',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Ribbon */}
      <div className="rounded-xl border border-cyan-500/20 bg-[#0A192F]/85 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/50 text-cyan-300 tracking-wider">
                SIH26086 ARCHITECTURE
              </span>
              <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Data Provenance & Scientific Transparency Inspector
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Database className="w-6 h-6 text-cyan-400" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                DATA EXPLORER & REGISTRY
              </span>
            </h1>

            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Transparent operational audit of every meteorological baseline, geospatial polygon,
              climatological normal, and numerical model feed ingested by MONSOON-X.
            </p>
          </div>

          {/* Provider pill */}
          <div className="flex flex-col items-start lg:items-end font-mono text-xs text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Active Provider Engine</span>
            <div className="mt-1 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{provider.name} ({provider.type.toUpperCase()})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Transparency Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#0A192F]/75 border border-[#1E354D] rounded-xl font-mono shadow-lg backdrop-blur-md hover:border-cyan-500/40 transition-colors">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold tracking-wider">Total Datasets</span>
          <span className="text-2xl font-black text-white mt-0.5 block">{dataSources.length}</span>
        </div>

        <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl font-mono shadow-lg backdrop-blur-md">
          <span className="text-[10px] text-cyan-300 uppercase block font-semibold tracking-wider">Official IMD/Gov</span>
          <span className="text-2xl font-black text-cyan-400 mt-0.5 block">{statusCounts['OFFICIAL'] || 0}</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl font-mono shadow-lg backdrop-blur-md">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold tracking-wider">Historical Gridded</span>
          <span className="text-2xl font-black text-slate-200 mt-0.5 block">{statusCounts['HISTORICAL'] || 0}</span>
        </div>

        <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl font-mono shadow-lg backdrop-blur-md">
          <span className="text-[10px] text-purple-300 uppercase block font-semibold tracking-wider">Model Ensembles</span>
          <span className="text-2xl font-black text-purple-400 mt-0.5 block">{statusCounts['MODEL'] || 0}</span>
        </div>

        <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl font-mono shadow-lg backdrop-blur-md">
          <span className="text-[10px] text-amber-300 uppercase block font-semibold tracking-wider">Demo Fallbacks</span>
          <span className="text-2xl font-black text-amber-400 mt-0.5 block">{statusCounts['DEMO'] || 0}</span>
        </div>

        <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl font-mono shadow-lg backdrop-blur-md">
          <span className="text-[10px] text-rose-300 uppercase block font-semibold tracking-wider">Pending Ingestion</span>
          <span className="text-2xl font-black text-rose-400 mt-0.5 block">{statusCounts['MISSING'] || 0}</span>
        </div>
      </div>

      {/* 3. Search and Status Filtering Ribbon */}
      <div className="p-4 bg-[#0A192F]/80 border border-[#1E354D] rounded-xl shadow-xl backdrop-blur-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dataset, parameter, or source agency..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#071324] border border-[#1E354D] text-xs font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Status:</span>
            {availableStatuses.map((st) => {
              const count = statusCounts[st] || 0;
              const isActive = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border flex items-center gap-1.5',
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'bg-[#071324] text-slate-400 hover:text-slate-200 border-[#1E354D] hover:border-slate-600'
                  )}
                >
                  <span>{st}</span>
                  <span className={cn('text-[10px] px-1.5 py-0.2 rounded font-mono', isActive ? 'bg-cyan-400/30 text-white' : 'bg-[#1E354D] text-slate-300')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Transparency Data Table */}
      <div className="rounded-xl border border-[#1E354D] bg-[#0A192F]/85 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071324] text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-[#1E354D]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Dataset Name</th>
                <th className="py-3.5 px-3 font-bold">Source Agency</th>
                <th className="py-3.5 px-3 font-bold">Temporal / Spatial Resolution</th>
                <th className="py-3.5 px-3 font-bold">Historical Period</th>
                <th className="py-3.5 px-3 font-bold">Records Ingested</th>
                <th className="py-3.5 px-3 font-bold">Data Status</th>
                <th className="py-3.5 px-3 font-bold">Last Synchronized</th>
                <th className="py-3.5 px-4 text-right font-bold">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E354D]/60 font-sans">
              {filteredSources.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-cyan-950/20 transition-colors cursor-pointer group"
                  onClick={() => setSelectedSource(s)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{s.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
                      {s.description}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-slate-200">
                    {s.source}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                    <div className="text-slate-200">{s.temporalResolution}</div>
                    <div className="text-[10px] text-slate-500">{s.spatialResolution}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                    {s.period}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px] font-semibold text-slate-200">
                    {s.recordsCount || 'Continuous'}
                  </td>

                  <td className="py-3.5 px-3">
                    <DataStatusBadge status={s.qualityStatus} size="xs" />
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                    {s.retrievedAt}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSource(s);
                      }}
                      className="px-3 py-1 text-[11px] font-mono font-bold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all shadow-sm"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Dataset Inspector Modal / Drawer */}
      {selectedSource && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-[#0A192F] rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-[#071324] border-b border-[#1E354D] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <DataStatusBadge status={selectedSource.qualityStatus} size="xs" />
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">ID: {selectedSource.id}</span>
                </div>
                <h3 className="text-base font-black mt-1 text-white tracking-tight uppercase">
                  {selectedSource.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSource(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Dataset Description
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedSource.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#071324] border border-[#1E354D] font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Source Agency:</span>
                  <span className="font-bold text-slate-200">{selectedSource.source}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Historical Coverage:</span>
                  <span className="font-bold text-slate-200">{selectedSource.period}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Spatial Resolution:</span>
                  <span className="text-slate-300">{selectedSource.spatialResolution}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Temporal Resolution:</span>
                  <span className="text-slate-300">{selectedSource.temporalResolution}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Unit of Measure:</span>
                  <span className="text-cyan-400 font-bold">{selectedSource.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Last Synchronized:</span>
                  <span className="text-slate-300">{selectedSource.retrievedAt}</span>
                </div>
              </div>

              {/* Data Ingestion Pipeline Path */}
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-[11px] font-mono space-y-1 text-emerald-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Architecture Pipeline Path</span>
                </div>
                <div className="text-[10px] text-emerald-400/90">
                  UI Component → Services Layer → DataProvider ({provider.type}) → {selectedSource.source}
                </div>
              </div>

              {/* Source Link */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1E354D]">
                <a
                  href={selectedSource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
                >
                  <span>Official Repository / Documentation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedSource(null)}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-colors shadow-lg shadow-cyan-600/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataExplorerPage;
