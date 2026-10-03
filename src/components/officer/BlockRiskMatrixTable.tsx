import React, { useState, useMemo } from 'react';
import type { BlockRiskEntry, RiskGrade } from '../../types/officer';
import {
  ShieldAlert,
  ArrowUpDown,
  Eye,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface BlockRiskMatrixTableProps {
  blocks: BlockRiskEntry[];
  onViewBlock: (block: BlockRiskEntry) => void;
  onViewPanchayat: (block: BlockRiskEntry) => void;
  className?: string;
}

type SortField = 'risk' | 'drySpell' | 'acreage' | 'elevation' | 'name';
type FilterFilter = 'all' | 'critical' | 'falseOnset' | 'highland';

export function BlockRiskMatrixTable({
  blocks,
  onViewBlock,
  onViewPanchayat,
  className = '',
}: BlockRiskMatrixTableProps) {
  const [filter, setFilter] = useState<FilterFilter>('all');
  const [sortField, setSortField] = useState<SortField>('risk');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter logic
  const filteredBlocks = useMemo(() => {
    return blocks.filter((b) => {
      if (filter === 'critical') return b.overallRiskLevel === 'critical' || b.overallRiskLevel === 'high';
      if (filter === 'falseOnset') return b.isFalseOnsetAlert;
      if (filter === 'highland') return b.elevationMeters >= 850;
      return true;
    });
  }, [blocks, filter]);

  // Sort logic
  const sortedBlocks = useMemo(() => {
    return [...filteredBlocks].sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortField === 'name') return a.blockName.localeCompare(b.blockName) * dir;
      if (sortField === 'drySpell') return (a.drySpellProbability - b.drySpellProbability) * dir;
      if (sortField === 'acreage') return (a.kharifAcreageHa - b.kharifAcreageHa) * dir;
      if (sortField === 'elevation') return (a.elevationMeters - b.elevationMeters) * dir;
      // Default: risk
      const weight: Record<RiskGrade, number> = { critical: 4, high: 3, moderate: 2, low: 1 };
      return (weight[a.overallRiskLevel] - weight[b.overallRiskLevel]) * dir;
    });
  }, [filteredBlocks, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getRiskBadge = (level: RiskGrade) => {
    switch (level) {
      case 'critical':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-rose-950/70 text-rose-300 border border-rose-500/50 uppercase inline-flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-rose-950/50 text-rose-300 border border-rose-500/40 uppercase">
            HIGH RISK
          </span>
        );
      case 'moderate':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-amber-950/50 text-amber-300 border border-amber-500/40 uppercase">
            MODERATE
          </span>
        );
      case 'low':
      default:
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 uppercase">
            LOW RISK
          </span>
        );
    }
  };

  return (
    <div className={`bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] shadow-command-panel overflow-hidden space-y-0 text-white ${className}`}>
      {/* Table Header & Interactive Operational Controls */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324]/90 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#38BDF8]" />
              BLOCK × RISK CROSS-TABULATION MATRIX
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40">
              {sortedBlocks.length} / 14 BLOCKS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Inter-block vulnerability synthesis combining false onset signals, dry spell probability, and moisture deficits.
          </p>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#38BDF8]" /> Filter:
          </span>

          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'bg-[#0B1F33] text-slate-300 border border-[#1E354D] hover:bg-[#142B44] hover:text-white'
            }`}
          >
            All (14)
          </button>

          <button
            type="button"
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all cursor-pointer ${
              filter === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-[#0B1F33] text-rose-300 border border-rose-500/30 hover:bg-rose-950/40'
            }`}
          >
            Critical / High (5)
          </button>

          <button
            type="button"
            onClick={() => setFilter('falseOnset')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all cursor-pointer ${
              filter === 'falseOnset'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-[#0B1F33] text-amber-300 border border-amber-500/30 hover:bg-amber-950/40'
            }`}
          >
            False Onset (5)
          </button>

          <button
            type="button"
            onClick={() => setFilter('highland')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all cursor-pointer ${
              filter === 'highland'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'bg-[#0B1F33] text-[#38BDF8] border border-[#1E354D] hover:bg-[#142B44]'
            }`}
          >
            Highland &gt;850m
          </button>
        </div>
      </div>

      {/* Information-Dense Government Operational Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#071324] border-b border-[#1E354D] text-slate-300 font-mono text-[11px] uppercase tracking-wider select-none">
              <th
                onClick={() => handleSort('name')}
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Block & HQ</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('elevation')}
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-white/5 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Elev (m)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('acreage')}
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-white/5 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Kharif (ha)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-2.5 px-3 font-bold text-center">
                Onset Lag
              </th>

              <th className="py-2.5 px-3 font-bold text-center">
                False Onset
              </th>

              <th
                onClick={() => handleSort('drySpell')}
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Dry Spell Prob</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-2.5 px-3 font-bold text-right">
                Heavy Rain
              </th>

              <th className="py-2.5 px-3 font-bold">
                Moisture Deficit
              </th>

              <th
                onClick={() => handleSort('risk')}
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-white/5 transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Risk Level</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-2.5 px-3 font-bold text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1E354D] font-sans">
            {sortedBlocks.map((b) => {
              const isAlert = b.isFalseOnsetAlert;
              return (
                <tr
                  key={b.blockId}
                  className={`hover:bg-[#0284C7]/10 transition-colors ${
                    b.overallRiskLevel === 'critical' ? 'bg-rose-950/20' : ''
                  }`}
                >
                  {/* Block & HQ */}
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{b.blockName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      HQ: {b.headquarters}
                    </span>
                  </td>

                  {/* Elevation */}
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {b.elevationMeters}m
                  </td>

                  {/* Kharif Acreage */}
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">
                    {b.kharifAcreageHa.toLocaleString()}
                  </td>

                  {/* Onset Anomaly */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded-xs font-bold text-[11px] ${
                        b.onsetAnomalyDays > 2
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      +{b.onsetAnomalyDays}d
                    </span>
                  </td>

                  {/* False Onset Status */}
                  <td className="py-2.5 px-3 text-center">
                    {isAlert ? (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-rose-950/70 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        ALERT
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded-xs bg-[#071324] border border-[#1E354D] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#4ADE80]" /> Clear
                      </span>
                    )}
                  </td>

                  {/* Dry Spell Probability & Severity */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-xs ${
                          b.drySpellProbability >= 62
                            ? 'text-rose-400'
                            : b.drySpellProbability >= 50
                            ? 'text-amber-400'
                            : 'text-[#4ADE80]'
                        }`}
                      >
                        {b.drySpellProbability}%
                      </span>
                      <div className="w-16 h-2 bg-[#071324] border border-[#1E354D] rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            b.drySpellProbability >= 62
                              ? 'bg-rose-500'
                              : b.drySpellProbability >= 50
                              ? 'bg-amber-500'
                              : 'bg-[#4ADE80]'
                          }`}
                          style={{ width: `${b.drySpellProbability}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {b.drySpellSeverity}
                      </span>
                    </div>
                  </td>

                  {/* Heavy Rain Probability */}
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {b.heavyRainProbability}%
                  </td>

                  {/* Soil Moisture Deficit */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-amber-400">
                        -{b.soilMoistureDeficitPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={b.primaryCropVulnerable}>
                        {b.primaryCropVulnerable}
                      </span>
                    </div>
                  </td>

                  {/* Overall Risk Level */}
                  <td className="py-2.5 px-3 text-center">
                    {getRiskBadge(b.overallRiskLevel)}
                  </td>

                  {/* Interactive Administrative Actions */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewBlock(b)}
                        className="px-2 py-1 rounded-xs bg-[#0B1F33] hover:bg-[#0284C7] text-white text-[11px] font-bold font-mono transition-all flex items-center gap-1 border border-[#1E354D] cursor-pointer"
                        title="View detailed block profile"
                      >
                        <Eye className="w-3 h-3 text-[#38BDF8]" />
                        <span>Block</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewPanchayat(b)}
                        className="px-2 py-1 rounded-xs bg-[#0B1F33] hover:bg-[#15803D] text-slate-300 hover:text-white text-[11px] font-bold font-mono transition-all flex items-center gap-1 border border-[#1E354D] cursor-pointer"
                        title="View Gram Panchayat administrative breakdown"
                      >
                        <Layers className="w-3 h-3 text-[#4ADE80]" />
                        <span>Panchayat</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 bg-[#071324] border-t border-[#1E354D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <span>
          Showing {sortedBlocks.length} of 14 Koraput Blocks · Sorted by: {sortField.toUpperCase()} ({sortAsc ? 'ASC' : 'DESC'})
        </span>
        <span className="text-[#38BDF8]">
          Official IMD/OUAT Decision Support Classification · SIH26086
        </span>
      </div>
    </div>
  );
}
