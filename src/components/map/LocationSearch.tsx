import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Mountain } from 'lucide-react';
import { KORAPUT_BLOCKS } from '../../data/koraputBlocks';
import { KORAPUT_PANCHAYATS } from '../../data/geo/panchayats';
import type { PanchayatInfo } from '../../types/riskMap';
import type { KoraputBlockInfo } from '../../types/geo';
import { cn } from '../../utils/cn';

interface LocationSearchProps {
  onSelectBlock: (blockId: string) => void;
  onSelectPanchayat: (panchayat: PanchayatInfo) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearch({
  onSelectBlock,
  onSelectPanchayat,
  placeholder = 'Search Block or Panchayat...',
  className,
}: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  // Driven dynamically by geographic data
  const matchedBlocks: KoraputBlockInfo[] = trimmed
    ? KORAPUT_BLOCKS.filter(
        (b) =>
          b.name.toLowerCase().includes(trimmed) ||
          b.headquarters.toLowerCase().includes(trimmed) ||
          b.agroEcologicalZone.toLowerCase().includes(trimmed)
      ).slice(0, 6)
    : [];

  const matchedPanchayats: PanchayatInfo[] = trimmed
    ? KORAPUT_PANCHAYATS.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.blockName.toLowerCase().includes(trimmed)
      ).slice(0, 8)
    : [];

  const hasMatches = matchedBlocks.length > 0 || matchedPanchayats.length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectBlock = (bId: string) => {
    onSelectBlock(bId);
    setQuery('');
    setIsOpen(false);
  };

  const handleSelectPanchayat = (p: PanchayatInfo) => {
    onSelectPanchayat(p);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-xs z-[1000]', className)}>
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-[#38BDF8] absolute left-2.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-8 pr-7 py-1.5 rounded-sm border border-[#1E354D] bg-[#071324] text-xs text-white placeholder-slate-400 shadow-command-panel focus:outline-hidden focus:border-[#0284C7] font-sans"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2 text-slate-400 hover:text-white"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && trimmed && (
        <div className="absolute top-full mt-1 left-0 right-0 rounded-lg border border-[#1E354D] bg-[#0A192F] shadow-[0_10px_25px_rgba(0,0,0,0.6)] max-h-72 overflow-y-auto text-xs py-1 z-[1001] text-white">
          {!hasMatches ? (
            <div className="px-3 py-2.5 text-xs text-slate-400 font-mono text-center">
              No matching block or panchayat found
            </div>
          ) : (
            <>
              {matchedBlocks.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-[#071324] border-b border-[#1E354D]">
                    Administrative Blocks ({matchedBlocks.length})
                  </div>
                  {matchedBlocks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBlock(b.id)}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#0284C7]/20 flex items-center justify-between transition-colors border-b border-[#1E354D]/50 last:border-b-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <Mountain className="w-3 h-3 text-[#38BDF8] shrink-0" />
                        <span className="font-semibold text-white">{b.name} Block</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{b.elevationMeters}m MSL</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedPanchayats.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-[#071324] border-b border-[#1E354D]">
                    Gram Panchayats ({matchedPanchayats.length})
                  </div>
                  {matchedPanchayats.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPanchayat(p)}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#10B981]/20 flex items-center justify-between transition-colors border-b border-[#1E354D]/50 last:border-b-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#4ADE80] shrink-0" />
                        <span className="text-white">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.blockName} Block ({p.elevationMeters}m)
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationSearch;
