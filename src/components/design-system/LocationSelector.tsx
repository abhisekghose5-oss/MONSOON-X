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
        'inline-flex items-center gap-2 rounded-sm border border-[#1E354D] bg-[#0B1F33] px-2.5 py-1 text-white shadow-xs',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5 text-[#38BDF8] shrink-0">
        <MapPin className="w-3.5 h-3.5" />
        {!compact && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold hidden sm:inline">
            Node:
          </span>
        )}
      </div>

      <div className="relative">
        <select
          aria-label="Select geographical block or entire Koraput district"
          value={selectedBlockId}
          onChange={(e) => selectBlock(e.target.value as KoraputBlockId | 'all')}
          className="appearance-none bg-transparent pr-6 text-xs font-semibold text-white focus:outline-none cursor-pointer tracking-tight"
        >
          <option value="all" className="bg-[#0B1F33] text-white">
            Koraput District (All 14 Blocks)
          </option>
          {allBlocks.map((b) => (
            <option key={b.id} value={b.id} className="bg-[#0B1F33] text-white">
              {b.name} Block ({b.elevationMeters}m MSL)
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {!compact && selectedBlock && (
        <span className="hidden md:inline-flex text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0284C7]/20 text-[#7DD3FC] border border-[#0284C7]/40">
          {selectedBlock.elevationMeters}m
        </span>
      )}
    </div>
  );
}
