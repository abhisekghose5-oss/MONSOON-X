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
        'inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-sm bg-[#071324] border border-[#1E354D] shadow-xs text-xs font-mono select-none text-white',
        className
      )}
    >
      {/* State */}
      <span className="flex items-center gap-1 text-slate-400">
        <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>{stateName}</span>
      </span>

      <ChevronRight className="w-3 h-3 text-slate-600" />

      {/* District */}
      <button
        type="button"
        onClick={onSelectDistrict}
        className={cn(
          'transition-colors hover:text-[#38BDF8] cursor-pointer',
          !blockName ? 'text-white font-bold' : 'text-slate-400 hover:underline'
        )}
      >
        {districtName} District
      </button>

      {/* Block (if selected) */}
      {blockName && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <button
            type="button"
            onClick={onSelectBlock}
            className={cn(
              'transition-colors hover:text-[#38BDF8] cursor-pointer',
              !panchayatName ? 'text-[#38BDF8] font-bold' : 'text-slate-400 hover:underline'
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
          <span className="text-[#4ADE80] font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>GP: {panchayatName}</span>
          </span>

          {/* Quick Back to Block Action */}
          {onSelectBlock && (
            <button
              type="button"
              onClick={onSelectBlock}
              className="ml-2 px-2 py-0.5 rounded-xs bg-[#0B1F33] hover:bg-[#1E354D] border border-[#1E354D] text-slate-300 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
              title="Return to Block level"
            >
              <ArrowLeft className="w-3 h-3 text-[#38BDF8]" />
              <span>Back to Block</span>
            </button>
          )}
        </>
      )}
    </nav>
  );
}

export default LocationBreadcrumb;
