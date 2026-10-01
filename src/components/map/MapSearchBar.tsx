import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { KORAPUT_BLOCKS } from '../../data/koraputBlocks';
import { KORAPUT_PANCHAYATS } from '../../data/geo/panchayats';
import type { PanchayatInfo } from '../../types/riskMap';
import type { KoraputBlockInfo } from '../../types/geo';

interface MapSearchBarProps {
  onSelectBlock: (blockId: string) => void;
  onSelectPanchayat: (panchayat: PanchayatInfo) => void;
}

export function MapSearchBar({ onSelectBlock, onSelectPanchayat }: MapSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter blocks and panchayats matching query
  const trimmed = query.trim().toLowerCase();

  const matchedBlocks: KoraputBlockInfo[] = trimmed
    ? KORAPUT_BLOCKS.filter(
        (b) =>
          b.name.toLowerCase().includes(trimmed) ||
          b.headquarters.toLowerCase().includes(trimmed)
      ).slice(0, 5)
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

  return (
    <div ref={containerRef} className="relative w-full max-w-xs z-[1000]">
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-[#1479C9] absolute left-2.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search Block or Panchayat..."
          className="w-full pl-8 pr-7 py-1.5 rounded-sm border border-[#CBD5E1] bg-white text-xs text-[#0B1F33] placeholder-[#94A3B8] shadow-gov-card focus:outline-none focus:border-[#1479C9] font-sans"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2 text-[#94A3B8] hover:text-[#0B1F33]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && trimmed && (
        <div className="absolute top-full mt-1 left-0 right-0 rounded-sm border border-[#CBD5E1] bg-white shadow-gov-elevated max-h-64 overflow-y-auto text-xs py-1">
          {!hasMatches ? (
            <div className="px-3 py-2 text-xs text-[#6E7F94] font-mono">
              No matching block or panchayat found
            </div>
          ) : (
            <>
              {matchedBlocks.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E7F94] bg-[#F5F7FA]">
                    Administrative Blocks ({matchedBlocks.length})
                  </div>
                  {matchedBlocks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        onSelectBlock(b.id);
                        setQuery('');
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#EDF6FC] flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold text-[#0B1F33]">{b.name} Block</span>
                      <span className="font-mono text-[10px] text-[#6E7F94]">{b.elevationMeters}m</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedPanchayats.length > 0 && (
                <div>
                  <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E7F94] bg-[#F5F7FA]">
                    Gram Panchayats ({matchedPanchayats.length})
                  </div>
                  {matchedPanchayats.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSelectPanchayat(p);
                        setQuery('');
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#EDF7F1] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#247A4A] shrink-0" />
                        <span className="text-[#16202A]">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-[#6E7F94] font-mono">
                        {p.blockName} Block
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
