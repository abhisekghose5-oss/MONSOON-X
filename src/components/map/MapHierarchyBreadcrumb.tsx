import React from 'react';
import { ChevronRight, MapPin, Globe } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MapHierarchyBreadcrumbProps {
  blockName?: string | null;
  panchayatName?: string | null;
  onSelectDistrict: () => void;
  onSelectBlock?: () => void;
}

export function MapHierarchyBreadcrumb({
  blockName,
  panchayatName,
  onSelectDistrict,
  onSelectBlock,
}: MapHierarchyBreadcrumbProps) {
  return (
    <nav
      aria-label="Administrative Hierarchy"
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#071324]/90 border border-[#1E354D] shadow-xl text-xs font-mono select-none backdrop-blur-md"
    >
      {/* State */}
      <span className="flex items-center gap-1 text-slate-400">
        <Globe className="w-3 h-3 text-cyan-400" />
        <span>Odisha</span>
      </span>

      <ChevronRight className="w-3 h-3 text-slate-600" />

      {/* District */}
      <button
        type="button"
        onClick={onSelectDistrict}
        className={cn(
          'font-semibold transition-colors hover:text-cyan-300 cursor-pointer',
          !blockName ? 'text-white font-bold' : 'text-slate-400'
        )}
      >
        Koraput District
      </button>

      {/* Block (if selected) */}
      {blockName && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <button
            type="button"
            onClick={onSelectBlock}
            className={cn(
              'font-semibold transition-colors hover:text-cyan-300 cursor-pointer',
              !panchayatName ? 'text-cyan-400 font-bold underline' : 'text-slate-400'
            )}
          >
            {blockName} Block
          </button>
        </>
      )}

      {/* Panchayat (if selected) */}
      {panchayatName && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>GP: {panchayatName}</span>
          </span>
        </>
      )}
    </nav>
  );
}
