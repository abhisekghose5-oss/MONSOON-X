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
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#FCEDEC] text-[#802626] border border-[#EEA9A7] uppercase inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C43D3D] animate-ping" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#FCEDEC] text-[#802626] border border-[#EEA9A7] uppercase">
            HIGH RISK
          </span>
        );
      case 'moderate':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] uppercase">
            MODERATE
          </span>
        );
      case 'low':
      default:
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] uppercase">
            LOW RISK
          </span>
        );
    }
  };

  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden space-y-0 ${className}`}>
      {/* Table Header & Interactive Operational Controls */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#1479C9]" />
              BLOCK × RISK CROSS-TABULATION MATRIX
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white">
              {sortedBlocks.length} / 14 BLOCKS
            </span>
          </div>
          <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
            Inter-block vulnerability synthesis combining false onset signals, dry spell probability, and moisture deficits.
          </p>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-bold flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#1479C9]" /> Filter:
          </span>

          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all ${
              filter === 'all'
                ? 'bg-[#0B1F33] text-white shadow-xs'
                : 'bg-white text-[#4B5B6D] border border-[#CBD5E1] hover:bg-slate-50'
            }`}
          >
            All (14)
          </button>

          <button
            type="button"
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all ${
              filter === 'critical'
                ? 'bg-[#C43D3D] text-white shadow-xs'
                : 'bg-white text-[#802626] border border-[#EEA9A7] hover:bg-[#FCEDEC]'
            }`}
          >
            Critical / High (5)
          </button>

          <button
            type="button"
            onClick={() => setFilter('falseOnset')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all ${
              filter === 'falseOnset'
                ? 'bg-[#D99000] text-white shadow-xs'
                : 'bg-white text-[#8C5D00] border border-[#F4D79C] hover:bg-[#FDF7EB]'
            }`}
          >
            False Onset (5)
          </button>

          <button
            type="button"
            onClick={() => setFilter('highland')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all ${
              filter === 'highland'
                ? 'bg-[#1479C9] text-white shadow-xs'
                : 'bg-white text-[#1479C9] border border-[#CBD5E1] hover:bg-slate-50'
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
            <tr className="bg-[#F0F4F8] border-b border-[#CBD5E1] text-[#0B1F33] font-mono text-[11px] uppercase tracking-wider select-none">
              <th
                onClick={() => handleSort('name')}
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-[#E2E8F0] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Block & HQ</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E7F94]" />
                </div>
              </th>

              <th
                onClick={() => handleSort('elevation')}
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-[#E2E8F0] transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Elev (m)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E7F94]" />
                </div>
              </th>

              <th
                onClick={() => handleSort('acreage')}
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-[#E2E8F0] transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Kharif (ha)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E7F94]" />
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
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-[#E2E8F0] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Dry Spell Prob</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E7F94]" />
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
                className="py-2.5 px-3 font-bold cursor-pointer hover:bg-[#E2E8F0] transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Risk Level</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E7F94]" />
                </div>
              </th>

              <th className="py-2.5 px-3 font-bold text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] font-sans">
            {sortedBlocks.map((b) => {
              const isAlert = b.isFalseOnsetAlert;
              return (
                <tr
                  key={b.blockId}
                  className={`hover:bg-[#F8FAFC] transition-colors ${
                    b.overallRiskLevel === 'critical' ? 'bg-[#FFFBFB]' : ''
                  }`}
                >
                  {/* Block & HQ */}
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-[#0B1F33] flex items-center gap-1.5">
                      <span>{b.blockName}</span>
                    </div>
                    <span className="text-[10px] text-[#6E7F94] block font-mono">
                      HQ: {b.headquarters}
                    </span>
                  </td>

                  {/* Elevation */}
                  <td className="py-2.5 px-3 text-right font-mono text-[#4B5B6D]">
                    {b.elevationMeters}m
                  </td>

                  {/* Kharif Acreage */}
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#0B1F33]">
                    {b.kharifAcreageHa.toLocaleString()}
                  </td>

                  {/* Onset Anomaly */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded-xs font-bold ${
                        b.onsetAnomalyDays > 2
                          ? 'bg-[#FCEDEC] text-[#802626]'
                          : 'bg-[#EDF7F1] text-[#154D2F]'
                      }`}
                    >
                      +{b.onsetAnomalyDays}d
                    </span>
                  </td>

                  {/* False Onset Status */}
                  <td className="py-2.5 px-3 text-center">
                    {isAlert ? (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#FCEDEC] text-[#802626] border border-[#EEA9A7] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[#C43D3D]" />
                        ALERT
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-[#6E7F94] px-1.5 py-0.5 rounded-xs bg-[#F5F7FA] border border-[#E2E8F0] inline-flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#247A4A]" /> Clear
                      </span>
                    )}
                  </td>

                  {/* Dry Spell Probability & Severity */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-xs ${
                          b.drySpellProbability >= 62
                            ? 'text-[#C43D3D]'
                            : b.drySpellProbability >= 50
                            ? 'text-[#D99000]'
                            : 'text-[#247A4A]'
                        }`}
                      >
                        {b.drySpellProbability}%
                      </span>
                      <div className="w-16 h-2 bg-[#E2E8F0] rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            b.drySpellProbability >= 62
                              ? 'bg-[#C43D3D]'
                              : b.drySpellProbability >= 50
                              ? 'bg-[#D99000]'
                              : 'bg-[#247A4A]'
                          }`}
                          style={{ width: `${b.drySpellProbability}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#6E7F94] uppercase">
                        {b.drySpellSeverity}
                      </span>
                    </div>
                  </td>

                  {/* Heavy Rain Probability */}
                  <td className="py-2.5 px-3 text-right font-mono text-[#4B5B6D]">
                    {b.heavyRainProbability}%
                  </td>

                  {/* Soil Moisture Deficit */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-[#8C5D00]">
                        -{b.soilMoistureDeficitPercent}%
                      </span>
                      <span className="text-[10px] text-[#6E7F94] truncate max-w-[120px]" title={b.primaryCropVulnerable}>
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
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onViewBlock(b)}
                        className="px-2 py-1 rounded-xs bg-[#EAF0F6] hover:bg-[#D2DEEB] text-[#0B1F33] text-[11px] font-bold font-mono transition-all flex items-center gap-1 border border-[#CBD5E1]"
                        title="View detailed block profile"
                      >
                        <Eye className="w-3 h-3 text-[#1479C9]" />
                        <span>Block</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewPanchayat(b)}
                        className="px-2 py-1 rounded-xs bg-white hover:bg-slate-100 text-[#4B5B6D] hover:text-[#0B1F33] text-[11px] font-bold font-mono transition-all flex items-center gap-1 border border-[#CBD5E1]"
                        title="View Gram Panchayat administrative breakdown"
                      >
                        <Layers className="w-3 h-3 text-[#247A4A]" />
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
      <div className="p-3 bg-[#F5F7FA] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#6E7F94]">
        <span>
          Showing {sortedBlocks.length} of 14 Koraput Blocks · Sorted by: {sortField.toUpperCase()} ({sortAsc ? 'ASC' : 'DESC'})
        </span>
        <span className="text-[#0B1F33]">
          Official IMD/OUAT Decision Support Classification · SIH26086
        </span>
      </div>
    </div>
  );
}
