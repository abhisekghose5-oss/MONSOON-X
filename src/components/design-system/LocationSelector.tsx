import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useBlockSelection } from '../../hooks/useBlockSelection';
import { cn } from '../../utils/cn';
import type { KoraputBlockId } from '../../types/geo';

export interface LocationSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

export function LocationSelector({
  compact = false,
  className,
  ...props
}: LocationSelectorProps) {
  const { selectedBlockId, selectBlock, selectedBlock, allBlocks } = useBlockSelection();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border border-[#CBD5E1] bg-white px-3 py-1.5 shadow-gov-card',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5 text-[#1479C9] shrink-0">
        <MapPin className="w-4 h-4" />
        {!compact && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E7F94] font-semibold">
            Region:
          </span>
        )}
      </div>

      <div className="relative">
        <select
          aria-label="Select geographical block or entire Koraput district"
          value={selectedBlockId}
          onChange={(e) => selectBlock(e.target.value as KoraputBlockId | 'all')}
          className="appearance-none bg-transparent pr-7 text-xs font-semibold text-[#0B1F33] focus:outline-none cursor-pointer tracking-wide"
        >
          <option value="all">
            Koraput District (All 14 Blocks)
          </option>
          {allBlocks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} Block ({b.elevationMeters}m MSL)
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#4B5B6D] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {!compact && selectedBlock && (
        <span className="hidden md:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2]">
          {selectedBlock.elevationMeters}m MSL
        </span>
      )}
    </div>
  );
}
