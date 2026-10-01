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
      <div className="rounded-md border border-[#CBD5E1] bg-white p-5 shadow-gov-card border-l-4 border-l-[#1479C9]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white">
                SIH26086 ARCHITECTURE
              </span>
              <span className="font-mono text-[11px] text-[#4B5B6D]">
                Data Provenance & Scientific Transparency Inspector
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-[#0B1F33] flex items-center gap-2.5">
              <Database className="w-6 h-6 text-[#1479C9]" />
              <span>DATA EXPLORER & REGISTRY</span>
            </h1>

            <p className="text-xs text-[#4B5B6D] max-w-3xl leading-relaxed">
              Transparent operational audit of every meteorological baseline, geospatial polygon,
              climatological normal, and numerical model feed ingested by Koraput Mausam Intelligence.
            </p>
          </div>

          {/* Provider pill */}
          <div className="flex flex-col items-start lg:items-end font-mono text-xs text-[#6E7F94]">
            <span className="text-[10px] uppercase font-bold text-[#0B1F33]">Active Provider Engine</span>
            <div className="mt-1 px-2.5 py-1 rounded-sm bg-[#EDF6FC] border border-[#ACD5F2] text-[#0C4E83] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1479C9]" />
              <span>{provider.name} ({provider.type.toUpperCase()})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Transparency Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-white border border-[#CBD5E1] rounded-sm font-mono shadow-gov-card">
          <span className="text-[10px] text-[#6E7F94] uppercase block font-bold">Total Datasets</span>
          <span className="text-xl font-bold text-[#0B1F33]">{dataSources.length}</span>
        </div>

        <div className="p-3 bg-[#EDF6FC] border border-[#ACD5F2] rounded-sm font-mono shadow-gov-card">
          <span className="text-[10px] text-[#0C4E83] uppercase block font-bold">Official IMD/Gov</span>
          <span className="text-xl font-bold text-[#0C4E83]">{statusCounts['OFFICIAL'] || 0}</span>
        </div>

        <div className="p-3 bg-[#F1F5F9] border border-[#CBD5E1] rounded-sm font-mono shadow-gov-card">
          <span className="text-[10px] text-[#334155] uppercase block font-bold">Historical Gridded</span>
          <span className="text-xl font-bold text-[#334155]">{statusCounts['HISTORICAL'] || 0}</span>
        </div>

        <div className="p-3 bg-[#F3E8FF] border border-[#D8B4FE] rounded-sm font-mono shadow-gov-card">
          <span className="text-[10px] text-[#6B21A8] uppercase block font-bold">Model Ensembles</span>
          <span className="text-xl font-bold text-[#6B21A8]">{statusCounts['MODEL'] || 0}</span>
        </div>

        <div className="p-3 bg-[#FDF7EB] border border-[#F4D79C] rounded-sm font-mono shadow-gov-card">
          <span className="text-[10px] text-[#8C5D00] uppercase block font-bold">Demo Fallbacks</span>
          <span className="text-xl font-bold text-[#8C5D00]">{statusCounts['DEMO'] || 0}</span>
        </div>

        <div className="p-3 bg-[#FCEDEC] border border-[#EEA9A7] rounded-sm font-mono shadow-gov-card">
          <span className="text-[10px] text-[#802626] uppercase block font-bold">Pending Ingestion</span>
          <span className="text-xl font-bold text-[#802626]">{statusCounts['MISSING'] || 0}</span>
        </div>
      </div>

      {/* 3. Search and Status Filtering Ribbon */}
      <div className="p-3.5 bg-white border border-[#CBD5E1] rounded-sm shadow-gov-card space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#1479C9] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dataset, parameter, or source agency..."
              className="w-full pl-8 pr-3 py-1.5 rounded-sm border border-[#CBD5E1] text-xs font-sans text-[#0B1F33] placeholder-[#94A3B8] focus:outline-none focus:border-[#1479C9]"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[#6E7F94] uppercase font-bold mr-1">Status:</span>
            {availableStatuses.map((st) => {
              const count = statusCounts[st] || 0;
              const isActive = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    'px-2 py-1 rounded-sm text-[11px] font-bold transition-all border flex items-center gap-1',
                    isActive
                      ? 'bg-[#0B1F33] text-white border-[#0B1F33] shadow-xs'
                      : 'bg-[#F5F7FA] text-[#4B5B6D] hover:bg-[#EAF0F6] border-[#CBD5E1]'
                  )}
                >
                  <span>{st}</span>
                  <span className={cn('text-[10px] px-1 py-0.2 rounded-xs', isActive ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#0B1F33]')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Transparency Data Table */}
      <div className="rounded-sm border border-[#CBD5E1] bg-white overflow-hidden shadow-gov-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1F33] text-white font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5 font-bold">Dataset Name</th>
                <th className="py-3 px-3 font-bold">Source Agency</th>
                <th className="py-3 px-3 font-bold">Temporal / Spatial Resolution</th>
                <th className="py-3 px-3 font-bold">Historical Period</th>
                <th className="py-3 px-3 font-bold">Records Ingested</th>
                <th className="py-3 px-3 font-bold">Data Status</th>
                <th className="py-3 px-3 font-bold">Last Synchronized</th>
                <th className="py-3 px-3 text-right font-bold">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-sans">
              {filteredSources.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  onClick={() => setSelectedSource(s)}
                >
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-[#0B1F33] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#1479C9] shrink-0" />
                      <span>{s.name}</span>
                    </div>
                    <div className="text-[11px] text-[#6E7F94] font-mono mt-0.5 truncate max-w-sm">
                      {s.description}
                    </div>
                  </td>

                  <td className="py-3 px-3 font-medium text-[#16202A]">
                    {s.source}
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-[#4B5B6D]">
                    <div>{s.temporalResolution}</div>
                    <div className="text-[10px] text-[#6E7F94]">{s.spatialResolution}</div>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-[#4B5B6D]">
                    {s.period}
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] font-semibold text-[#0B1F33]">
                    {s.recordsCount || 'Continuous'}
                  </td>

                  <td className="py-3 px-3">
                    <DataStatusBadge status={s.qualityStatus} size="xs" />
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-[#6E7F94]">
                    {s.retrievedAt}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSource(s);
                      }}
                      className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-xs bg-[#F5F7FA] hover:bg-[#EAF0F6] border border-[#CBD5E1] text-[#1479C9] transition-colors"
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
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-md border border-[#CBD5E1] shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-[#0B1F33] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <DataStatusBadge status={selectedSource.qualityStatus} size="xs" />
                  <span className="font-mono text-[10px] text-[#A4BCDA]">ID: {selectedSource.id}</span>
                </div>
                <h3 className="text-base font-bold mt-1 text-white uppercase tracking-tight">
                  {selectedSource.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSource(null)}
                className="text-[#A4BCDA] hover:text-white p-1 rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#6E7F94]">
                  Dataset Description
                </span>
                <p className="text-xs text-[#16202A] leading-relaxed">
                  {selectedSource.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-sm bg-[#F5F7FA] border border-[#E2E8F0] font-mono text-[11px]">
                <div>
                  <span className="text-[#6E7F94] block text-[10px]">Source Agency:</span>
                  <span className="font-bold text-[#0B1F33]">{selectedSource.source}</span>
                </div>
                <div>
                  <span className="text-[#6E7F94] block text-[10px]">Historical Coverage:</span>
                  <span className="font-bold text-[#0B1F33]">{selectedSource.period}</span>
                </div>
                <div>
                  <span className="text-[#6E7F94] block text-[10px]">Spatial Resolution:</span>
                  <span className="text-[#16202A]">{selectedSource.spatialResolution}</span>
                </div>
                <div>
                  <span className="text-[#6E7F94] block text-[10px]">Temporal Resolution:</span>
                  <span className="text-[#16202A]">{selectedSource.temporalResolution}</span>
                </div>
                <div>
                  <span className="text-[#6E7F94] block text-[10px]">Unit of Measure:</span>
                  <span className="text-[#1479C9] font-bold">{selectedSource.unit}</span>
                </div>
                <div>
                  <span className="text-[#6E7F94] block text-[10px]">Last Synchronized:</span>
                  <span className="text-[#16202A]">{selectedSource.retrievedAt}</span>
                </div>
              </div>

              {/* Data Ingestion Pipeline Path */}
              <div className="p-3 rounded-sm border border-[#ABD7C0] bg-[#EDF7F1] text-[11px] font-mono space-y-1 text-[#154D2F]">
                <div className="flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#247A4A]" />
                  <span>Architecture Pipeline Path</span>
                </div>
                <div className="text-[10px] text-[#154D2F]/90">
                  UI Component → Services Layer → DataProvider ({provider.type}) → {selectedSource.source}
                </div>
              </div>

              {/* Source Link */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F0F3F7]">
                <a
                  href={selectedSource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#1479C9] hover:underline font-semibold"
                >
                  <span>Official Repository / Documentation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedSource(null)}
                  className="px-3 py-1.5 rounded-sm bg-[#0B1F33] text-white text-xs font-mono font-bold hover:bg-[#1479C9] transition-colors"
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
