import React from 'react';
import { ChevronRight, MapPin, Globe, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LocationBreadcrumbProps {
  stateName?: string;
  districtName?: string;
  blockName?: string | null;
  panchayatName?: string | null;
  onSelectDistrict: () => void;
  onSelectBlock?: () => void;
  className?: string;
}

export function LocationBreadcrumb({
  stateName = 'Odisha',
  districtName = 'Koraput',
  blockName,
  panchayatName,
  onSelectDistrict,
  onSelectBlock,
  className,
}: LocationBreadcrumbProps) {
  return (
    <nav
      aria-label="Administrative Hierarchy Breadcrumb"
      className={cn(
        'inline-flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white border border-[#CBD5E1] shadow-gov-card text-xs font-mono select-none',
        className
      )}
    >
      {/* State */}
      <span className="flex items-center gap-1 text-[#4B5B6D]">
        <Globe className="w-3.5 h-3.5 text-[#1479C9]" />
        <span>{stateName}</span>
      </span>

      <ChevronRight className="w-3 h-3 text-[#94A3B8]" />

      {/* District */}
      <button
        type="button"
        onClick={onSelectDistrict}
        className={cn(
          'transition-colors hover:text-[#1479C9]',
          !blockName ? 'text-[#0B1F33] font-bold' : 'text-[#4B5B6D] hover:underline'
        )}
      >
        {districtName} District
      </button>

      {/* Block (if selected) */}
      {blockName && (
        <>
          <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
          <button
            type="button"
            onClick={onSelectBlock}
            className={cn(
              'transition-colors hover:text-[#1479C9]',
              !panchayatName ? 'text-[#1479C9] font-bold underline' : 'text-[#4B5B6D] hover:underline'
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

          {/* Quick Back to Block Action */}
          {onSelectBlock && (
            <button
              type="button"
              onClick={onSelectBlock}
              className="ml-2 px-2 py-0.5 rounded-xs bg-[#F5F7FA] hover:bg-[#EAF0F6] border border-[#CBD5E1] text-[#0B1F33] text-[10px] font-mono flex items-center gap-1 transition-colors"
              title="Return to Block level"
            >
              <ArrowLeft className="w-3 h-3 text-[#1479C9]" />
              <span>Back to Block</span>
            </button>
          )}
        </>
      )}
    </nav>
  );
}

export default LocationBreadcrumb;
