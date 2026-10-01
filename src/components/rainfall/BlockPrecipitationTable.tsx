import React, { useState } from 'react';
import { MapPin, ArrowUpDown, AlertCircle } from 'lucide-react';
import { DataStatusBadge } from '../design-system/DataStatusBadge';
import type { BlockRainfallSummary } from '../../types/rainfall';

export interface BlockPrecipitationTableProps {
  blocks: BlockRainfallSummary[];
  onSelectBlock?: (blockId: string) => void;
}

type SortField = 'blockName' | 'elevationMeters' | 'seasonalRainfallMm';

export function BlockPrecipitationTable({
  blocks,
  onSelectBlock,
}: BlockPrecipitationTableProps) {
  const [sortField, setSortField] = useState<SortField>('blockName');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedBlocks = [...blocks].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'blockName') {
      comparison = a.blockName.localeCompare(b.blockName);
    } else if (sortField === 'elevationMeters') {
      comparison = a.elevationMeters - b.elevationMeters;
    } else if (sortField === 'seasonalRainfallMm') {
      const aVal = a.seasonalRainfallMm ?? -1;
      const bVal = b.seasonalRainfallMm ?? -1;
      comparison = aVal - bVal;
    }
    return sortAsc ? comparison : -comparison;
  });

  const allUnavailable = blocks.every((b) => !b.isDataAvailable);

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 space-y-3.5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2.5">
        <div>
          <h4 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33]">
            KORAPUT BLOCK COMPARISON
          </h4>
          <p className="text-xs text-[#64748B] mt-0.5">
            Microclimatic rainfall accumulation, normals, and dry spells across all 14 Koraput administrative blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#64748B]">14 Administrative Blocks</span>
        </div>
      </div>

      {/* Global Notice if block data is pending connection */}
      {allUnavailable && (
        <div className="p-3 rounded-xs bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#92400E] text-xs font-mono flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold">Block-level rainfall data unavailable:</strong>
            <p className="text-[11px] leading-relaxed">
              Ground automatic weather station (AWS) telemetry is aggregated at the district level (IMD 0.25° grid). In accordance with scientific integrity guidelines, district values are not substituted into blocks. Block AWS telemetry will automatically populate upon API activation.
            </p>
          </div>
        </div>
      )}

      {/* 1. Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
              <th
                onClick={() => handleSort('blockName')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-[#0B1F33]"
              >
                <div className="flex items-center gap-1">
                  <span>Block</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('elevationMeters')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-[#0B1F33] text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Elevation</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold text-right">Seasonal Rainfall</th>
              <th className="py-2.5 px-3 font-semibold text-right">Normal (LPA)</th>
              <th className="py-2.5 px-3 font-semibold text-right">Anomaly</th>
              <th className="py-2.5 px-3 font-semibold text-right">Dry Spell</th>
              <th className="py-2.5 px-3 font-semibold">Telemetry Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {sortedBlocks.map((b) => (
              <tr
                key={b.blockId}
                onClick={() => onSelectBlock && onSelectBlock(b.blockId)}
                className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <td className="py-2.5 px-3 font-bold text-[#0B1F33] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                  <span>{b.blockName}</span>
                </td>
                <td className="py-2.5 px-3 text-right text-[#64748B]">
                  {b.elevationMeters}m MSL
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-[#0B1F33]">
                  {b.isDataAvailable && b.seasonalRainfallMm !== null && b.seasonalRainfallMm !== undefined
                    ? `${b.seasonalRainfallMm.toFixed(1)} mm`
                    : '--'}
                </td>
                <td className="py-2.5 px-3 text-right text-[#64748B]">
                  {b.isDataAvailable && b.normalMm !== null && b.normalMm !== undefined
                    ? `${b.normalMm.toFixed(1)} mm`
                    : 'DATA_REQUIRED'}
                </td>
                <td className="py-2.5 px-3 text-right">
                  {b.isDataAvailable && b.departurePercent !== null && b.departurePercent !== undefined ? (
                    <span
                      className={`font-bold ${
                        b.departurePercent >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'
                      }`}
                    >
                      {b.departurePercent >= 0 ? '+' : ''}
                      {b.departurePercent.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-[#94A3B8]">--</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right text-[#475569]">
                  {b.isDataAvailable && b.currentDrySpellDays !== undefined ? `${b.currentDrySpellDays} days` : '--'}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <DataStatusBadge status={b.status || 'MISSING'} size="xs" />
                    <span className="text-[10px] text-[#94A3B8] truncate max-w-[180px]">
                      {b.statusNote}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Card List (visible on mobile, hidden on desktop) */}
      <div className="md:hidden space-y-2.5">
        {sortedBlocks.map((b) => (
          <div
            key={b.blockId}
            onClick={() => onSelectBlock && onSelectBlock(b.blockId)}
            className="p-3 rounded-xs border border-[#CBD5E1] bg-[#F8FAFC] space-y-2 text-xs font-mono"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[#0B1F33]">
                <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{b.blockName} Block</span>
              </div>
              <DataStatusBadge status={b.status || 'MISSING'} size="xs" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#E2E8F0]">
              <div>
                <span className="text-[#64748B] block">Elevation:</span>
                <span className="font-semibold text-[#0B1F33]">{b.elevationMeters}m MSL</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Rainfall:</span>
                <span className="font-semibold text-[#0B1F33]">
                  {b.isDataAvailable && b.seasonalRainfallMm !== null && b.seasonalRainfallMm !== undefined
                    ? `${b.seasonalRainfallMm.toFixed(1)} mm`
                    : 'Data unavailable'}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-[#94A3B8] pt-1 border-t border-[#E2E8F0]">
              {b.statusNote}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BlockPrecipitationTable;
