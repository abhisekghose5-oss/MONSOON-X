import React from 'react';
import type { CropRiskMatrixRow } from '../../types/agriculture';
import { Layers, ArrowRight } from 'lucide-react';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface CropRiskMatrixTableProps {
  matrix: CropRiskMatrixRow[];
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
}

export function CropRiskMatrixTable({
  matrix,
  selectedCropId,
  onSelectCrop,
}: CropRiskMatrixTableProps) {
  const getRiskBadge = (level: string, prob?: number) => {
    let classes = 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]';

    if (level === 'Moderate') {
      classes = 'bg-[#EDF6FC] text-[#0C4E83] border-[#ACD5F2]';
    } else if (level === 'High') {
      classes = 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]';
    } else if (level === 'Severe' || level === 'Critical') {
      classes = 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]';
    }

    return (
      <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-sm border ${classes}`}>
        <span>{level}</span>
        {prob !== undefined && <span className="opacity-80">({prob}%)</span>}
      </span>
    );
  };

  return (
    <div className="rounded-md border border-[#E2E8F0] bg-white shadow-gov-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F5F7FA]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1479C9]" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Crop Risk Matrix
            </h3>
            <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
              Cross-commodity meteorological risk comparison across all major Koraput Kharif crops.
            </p>
          </div>
        </div>
        <DataSourceBadge source="ICAR-CRIDA Multi-Crop Vulnerability Framework" type="survey" size="sm" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#F0F3F7] text-[#4B5B6D] uppercase text-[10px] tracking-wider font-mono border-b border-[#E2E8F0]">
            <tr>
              <th className="px-4 py-2.5 font-bold text-[#0B1F33]">Crop</th>
              <th className="px-3 py-2.5 font-bold text-[#0B1F33]">Onset Risk</th>
              <th className="px-3 py-2.5 font-bold text-[#0B1F33]">Dry Spell Risk</th>
              <th className="px-3 py-2.5 font-bold text-[#0B1F33]">Heavy Rain Risk</th>
              <th className="px-4 py-2.5 font-bold text-[#0B1F33]">Recommendation</th>
              <th className="px-3 py-2.5 text-center font-bold text-[#0B1F33]">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3F7]">
            {matrix.map((row) => {
              const isSelected = selectedCropId === row.cropId;

              return (
                <tr
                  key={row.cropId}
                  className={`transition-colors hover:bg-[#F5F7FA] ${
                    isSelected ? 'bg-[#EDF7F1]/70 border-l-4 border-l-[#247A4A]' : ''
                  }`}
                >
                  {/* Column 1: Crop */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#0B1F33] text-sm">
                        {row.cropName}
                      </span>
                      <span className="text-[11px] font-mono text-[#247A4A] bg-[#EDF7F1] px-1.5 py-0.2 rounded-xs border border-[#ABD7C0]">
                        {row.localName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-[#6E7F94]">
                      {row.category}
                    </span>
                  </td>

                  {/* Column 2: Onset Risk */}
                  <td className="px-3 py-3">
                    {getRiskBadge(row.onsetRisk.level)}
                    <span className="block text-[10px] text-[#6E7F94] font-mono mt-0.5">
                      {row.onsetRisk.detail}
                    </span>
                  </td>

                  {/* Column 3: Dry Spell Risk */}
                  <td className="px-3 py-3">
                    {getRiskBadge(row.drySpellRisk.level, row.drySpellRisk.probability)}
                  </td>

                  {/* Column 4: Heavy Rain Risk */}
                  <td className="px-3 py-3">
                    {getRiskBadge(row.heavyRainRisk.level, row.heavyRainRisk.probability)}
                  </td>

                  {/* Column 5: Recommendation */}
                  <td className="px-4 py-3 text-xs text-[#16202A] leading-relaxed max-w-md">
                    {row.recommendation}
                  </td>

                  {/* Action Column */}
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => onSelectCrop(row.cropId)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-sm border transition-all inline-flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#247A4A] text-white border-[#247A4A] font-bold'
                          : 'bg-white text-[#4B5B6D] border-[#CBD5E1] hover:bg-[#EDF7F1] hover:text-[#154D2F]'
                      }`}
                    >
                      <span>{isSelected ? 'Active' : 'Select'}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Provenance Footer */}
      <div className="px-4 py-2.5 border-t border-[#F0F3F7] bg-[#F5F7FA]/40 text-[11px] font-mono text-[#6E7F94] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>Click any crop row to inspect detailed phenology and 5-part structured advisory.</span>
        <span>Calibrated with ICAR-CRIDA Agromet contingency guidelines for Koraput.</span>
      </div>
    </div>
  );
}
