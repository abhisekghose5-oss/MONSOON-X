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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white border border-[#CBD5E1] shadow-gov-card text-xs font-mono select-none"
    >
      {/* State */}
      <span className="flex items-center gap-1 text-[#4B5B6D]">
        <Globe className="w-3 h-3 text-[#1479C9]" />
        <span>Odisha</span>
      </span>

      <ChevronRight className="w-3 h-3 text-[#94A3B8]" />

      {/* District */}
      <button
        type="button"
        onClick={onSelectDistrict}
        className={cn(
          'font-semibold transition-colors hover:text-[#1479C9]',
          !blockName ? 'text-[#0B1F33] font-bold' : 'text-[#4B5B6D]'
        )}
      >
        Koraput District
      </button>

      {/* Block (if selected) */}
      {blockName && (
        <>
          <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
          <button
            type="button"
            onClick={onSelectBlock}
            className={cn(
              'font-semibold transition-colors hover:text-[#1479C9]',
              !panchayatName ? 'text-[#1479C9] font-bold underline' : 'text-[#4B5B6D]'
            )}
          >
            {blockName} Block
          </button>
        </>
      )}

      {/* Panchayat (if selected) */}
      {panchayatName && (
        <>
          <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
          <span className="text-[#247A4A] font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>GP: {panchayatName}</span>
          </span>
        </>
      )}
    </nav>
  );
}
