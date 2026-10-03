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
    let classes = 'bg-[#10B981]/15 text-[#4ADE80] border-[#10B981]/30';

    if (level === 'Moderate') {
      classes = 'bg-[#0284C7]/15 text-[#38BDF8] border-[#0284C7]/30';
    } else if (level === 'High') {
      classes = 'bg-[#F59E0B]/15 text-[#FCD34D] border-[#F59E0B]/30';
    } else if (level === 'Severe' || level === 'Critical') {
      classes = 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30';
    }

    return (
      <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-sm border ${classes}`}>
        <span>{level}</span>
        {prob !== undefined && <span className="opacity-80">({prob}%)</span>}
      </span>
    );
  };

  return (
    <div className="rounded-md border border-[#1E354D] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#38BDF8]" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Crop Risk Matrix
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Cross-commodity meteorological risk comparison across all major Koraput Kharif crops.
            </p>
          </div>
        </div>
        <DataSourceBadge source="ICAR-CRIDA Multi-Crop Vulnerability Framework" type="survey" size="sm" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#071324] text-slate-300 uppercase text-[10px] tracking-wider font-mono border-b border-[#1E354D]">
            <tr>
              <th className="px-4 py-2.5 font-bold text-white">Crop</th>
              <th className="px-3 py-2.5 font-bold text-white">Onset Risk</th>
              <th className="px-3 py-2.5 font-bold text-white">Dry Spell Risk</th>
              <th className="px-3 py-2.5 font-bold text-white">Heavy Rain Risk</th>
              <th className="px-4 py-2.5 font-bold text-white">Recommendation</th>
              <th className="px-3 py-2.5 text-center font-bold text-white">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E354D]/60">
            {matrix.map((row) => {
              const isSelected = selectedCropId === row.cropId;

              return (
                <tr
                  key={row.cropId}
                  className={`transition-colors hover:bg-[#132844] ${
                    isSelected ? 'bg-[#10B981]/10 border-l-4 border-l-[#10B981]' : ''
                  }`}
                >
                  {/* Column 1: Crop */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">
                        {row.cropName}
                      </span>
                      <span className="text-[11px] font-mono text-[#4ADE80] bg-[#10B981]/15 px-1.5 py-0.5 rounded-xs border border-[#10B981]/30">
                        {row.localName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {row.category}
                    </span>
                  </td>

                  {/* Column 2: Onset Risk */}
                  <td className="px-3 py-3">
                    {getRiskBadge(row.onsetRisk.level)}
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
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
                  <td className="px-4 py-3 text-xs text-slate-200 leading-relaxed max-w-md">
                    {row.recommendation}
                  </td>

                  {/* Action Column */}
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => onSelectCrop(row.cropId)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-sm border transition-all inline-flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#10B981] text-[#062419] border-[#10B981] font-bold shadow-xs'
                          : 'bg-[#0A192F] text-slate-300 border-[#1E354D] hover:bg-[#10B981]/20 hover:text-[#4ADE80] hover:border-[#10B981]/40'
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
