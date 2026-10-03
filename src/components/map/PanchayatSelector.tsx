import React from 'react';
import type { PanchayatInfo } from '../../types/riskMap';
import { cn } from '../../utils/cn';

interface PanchayatSelectorProps {
  panchayats: PanchayatInfo[];
  selectedPanchayatId: string;
  onSelectPanchayat: (panchayat: PanchayatInfo | null) => void;
  disabled?: boolean;
  className?: string;
}

export function PanchayatSelector({
  panchayats,
  selectedPanchayatId,
  onSelectPanchayat,
  disabled = false,
  className,
}: PanchayatSelectorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 bg-[#071324] border border-[#1E354D] rounded-xs px-2.5 py-1 text-white',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold shrink-0">
        Panchayat:
      </span>
      <select
        value={selectedPanchayatId}
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) {
            onSelectPanchayat(null);
          } else {
            const found = panchayats.find((p) => p.id === val);
            onSelectPanchayat(found || null);
          }
        }}
        className="bg-transparent text-xs font-semibold text-white focus:outline-hidden cursor-pointer max-w-[170px] truncate"
      >
        <option value="" className="bg-[#0A192F] text-white">All Panchayats ({panchayats.length})</option>
        {panchayats.map((p) => (
          <option key={p.id} value={p.id} className="bg-[#0A192F] text-white">
            {p.name} ({p.elevationMeters}m)
          </option>
        ))}
      </select>
    </div>
  );
}

export default PanchayatSelector;
