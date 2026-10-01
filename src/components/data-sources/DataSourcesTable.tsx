import React, { useState, useMemo } from 'react';
import type {
  DataSourceItem,
  DataSourceCategory,
  DataSourceStatus,
  EpistemicClassification,
} from '../../types/dataSources';
import { DataSourceStatusBadge } from './DataSourceStatusBadge';
import { EpistemicBadge } from './EpistemicBadge';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Database,
  Layers,
} from 'lucide-react';

interface DataSourcesTableProps {
  sources: DataSourceItem[];
  className?: string;
}

export function DataSourcesTable({ sources, className = '' }: DataSourcesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DataSourceCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<DataSourceStatus | 'all'>('all');
  const [selectedClassification, setSelectedClassification] = useState<EpistemicClassification | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: { key: DataSourceCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Categories' },
    { key: 'meteorological', label: 'Meteorological' },
    { key: 'climate', label: 'Climate' },
    { key: 'satellite', label: 'Satellite' },
    { key: 'reanalysis', label: 'Reanalysis' },
    { key: 'geospatial', label: 'Geospatial' },
    { key: 'agricultural', label: 'Agricultural' },
  ];

  const statuses: (DataSourceStatus | 'all')[] = ['all', 'LIVE', 'UPDATED', 'DELAYED', 'CACHED', 'DEMO'];

  const classifications: { key: EpistemicClassification | 'all'; label: string }[] = [
    { key: 'all', label: 'All Tiers' },
    { key: 'observed', label: 'Observed' },
    { key: 'official_forecast', label: 'Official Forecast' },
    { key: 'model_prediction', label: 'Model Prediction' },
    { key: 'simulation', label: 'Simulation' },
  ];

  // Filter sources
  const filteredSources = useMemo(() => {
    return sources.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSource = item.source.toLowerCase().includes(query);
        const matchesVariable = item.variable.toLowerCase().includes(query);
        const matchesAgency = item.agency.toLowerCase().includes(query);
        if (!matchesName && !matchesSource && !matchesVariable && !matchesAgency) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Classification
      if (selectedClassification !== 'all' && item.classification !== selectedClassification) {
        return false;
      }

      return true;
    });
  }, [sources, searchQuery, selectedCategory, selectedStatus, selectedClassification]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden space-y-0 ${className}`}>
      {/* Search & Comprehensive Multi-Filter Bar */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#1479C9]" />
              MASTER DATA FEED REGISTER
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white">
              {filteredSources.length} of {sources.length} SOURCES
            </span>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-[#6E7F94] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Search source, sensor, or variable"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source, sensor, or variable..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xs border border-[#CBD5E1] bg-white text-xs font-mono text-[#0B1F33] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#1479C9] focus:ring-1 focus:ring-[#1479C9]"
            />
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E2E8F0] text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5" role="group" aria-label="Category filters">
            <span className="text-[10px] font-mono font-bold text-[#6E7F94] uppercase flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-[#1479C9]" /> Category:
            </span>
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={selectedCategory === c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden ${
                  selectedCategory === c.key
                    ? 'bg-[#0B1F33] text-white shadow-xs'
                    : 'bg-white text-[#4B5B6D] border border-[#CBD5E1] hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Status & Classification Selectors */}
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            {/* Status Selectors */}
            <div className="flex items-center gap-1" role="group" aria-label="Status filters">
              <span className="text-[10px] font-mono font-bold text-[#6E7F94] uppercase mr-1">
                Status:
              </span>
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={selectedStatus === s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-xs transition-all focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden ${
                    selectedStatus === s
                      ? 'bg-[#1479C9] text-white shadow-xs'
                      : 'bg-white text-[#4B5B6D] border border-[#CBD5E1] hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Epistemic Tier Selectors */}
            <div className="flex items-center gap-1" role="group" aria-label="Classification filters">
              <span className="text-[10px] font-mono font-bold text-[#6E7F94] uppercase flex items-center gap-1 mr-1">
                <Layers className="w-3 h-3 text-[#1479C9]" /> Tier:
              </span>
              {classifications.map((cl) => (
                <button
                  key={cl.key}
                  type="button"
                  aria-pressed={selectedClassification === cl.key}
                  onClick={() => setSelectedClassification(cl.key)}
                  className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-xs transition-all focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden ${
                    selectedClassification === cl.key
                      ? 'bg-[#0B1F33] text-white shadow-xs'
                      : 'bg-white text-[#4B5B6D] border border-[#CBD5E1] hover:bg-slate-50'
                  }`}
                >
                  {cl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Information-Dense Master Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F0F4F8] border-b border-[#CBD5E1] text-[#0B1F33] font-mono text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 font-bold">Source & Agency</th>
              <th className="py-2.5 px-3 font-bold">Variable Measured / Modeled</th>
              <th className="py-2.5 px-3 font-bold">Category</th>
              <th className="py-2.5 px-3 font-bold">Resolution</th>
              <th className="py-2.5 px-3 font-bold">Update Frequency</th>
              <th className="py-2.5 px-3 font-bold">Historical Coverage</th>
              <th className="py-2.5 px-3 font-bold text-center">Status</th>
              <th className="py-2.5 px-3 font-bold text-center">Classification</th>
              <th className="py-2.5 px-3 font-bold text-center">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] font-sans">
            {filteredSources.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <React.Fragment key={item.id}>
                  <tr
                    onClick={() => toggleExpand(item.id)}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    {/* Source & Agency */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#0B1F33] leading-snug">
                        {item.name}
                      </div>
                      <span className="text-[10px] font-mono text-[#6E7F94] block mt-0.5">
                        {item.agency}
                      </span>
                    </td>

                    {/* Variable */}
                    <td className="py-2.5 px-3 max-w-[200px]">
                      <div className="text-[11px] text-[#0B1F33] font-medium leading-tight truncate" title={item.variable}>
                        {item.variable}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#4B5B6D] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {item.category}
                      </span>
                    </td>

                    {/* Resolution */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#4B5B6D]">
                      {item.resolution}
                    </td>

                    {/* Update Frequency */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#0B1F33] font-semibold">
                      {item.updateFrequency}
                    </td>

                    {/* Historical Coverage */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#4B5B6D]">
                      {item.historicalCoverage}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <DataSourceStatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Epistemic Classification Badge */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <EpistemicBadge classification={item.classification} size="sm" />
                    </td>

                    {/* Expand Toggle */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-label={`Toggle details for ${item.name}`}
                        className="p-1 rounded text-[#6E7F94] hover:text-[#0B1F33] focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Metadata Details Row */}
                  {isExpanded && (
                    <tr className="bg-[#F8FAFC]">
                      <td colSpan={9} className="p-4 border-b border-[#CBD5E1]">
                        <div className="p-3.5 rounded-sm bg-white border border-[#CBD5E1] space-y-3 text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                            <div>
                              <span className="text-[#6E7F94] uppercase font-bold block text-[10px]">
                                Ingestion Latency:
                              </span>
                              <span className="text-[#1479C9] font-bold mt-0.5 block">
                                {item.latency}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#6E7F94] uppercase font-bold block text-[10px]">
                                Data Protocol / Format:
                              </span>
                              <span className="text-[#0B1F33] mt-0.5 block truncate">
                                {item.protocol}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#6E7F94] uppercase font-bold block text-[10px]">
                                Scientific Citation:
                              </span>
                              <span className="text-[#4B5B6D] mt-0.5 block truncate" title={item.citation}>
                                {item.citation}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#F0F3F7]">
                            <strong className="text-[11px] font-mono uppercase text-[#0B1F33] block mb-1">
                              Scientific Description:
                            </strong>
                            <p className="text-xs text-[#334155] leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xs bg-[#EAF5FC] border border-[#B9DCF4] text-[#0E63A8] text-[11px] font-mono leading-relaxed">
                            <strong>Platform Integration:</strong> {item.usageInPlatform}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 bg-[#F5F7FA] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#6E7F94]">
        <span>
          Showing {filteredSources.length} of {sources.length} Cataloged Feeds · Click row to view latency & scientific citations
        </span>
        <span className="text-[#0B1F33] font-bold">
          Zero Fabricated Telemetry · SIH26086 MONSOON-X
        </span>
      </div>
    </div>
  );
}
