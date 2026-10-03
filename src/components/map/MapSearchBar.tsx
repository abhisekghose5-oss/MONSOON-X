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
        <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search Block or Panchayat..."
          className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-[#1E354D] bg-[#071324]/90 text-xs text-slate-100 placeholder-slate-500 shadow-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 font-sans transition-all backdrop-blur-md"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && trimmed && (
        <div className="absolute top-full mt-1.5 left-0 right-0 rounded-xl border border-cyan-500/30 bg-[#0A192F]/95 shadow-2xl backdrop-blur-md max-h-64 overflow-y-auto text-xs py-1.5 z-50">
          {!hasMatches ? (
            <div className="px-3 py-2 text-xs text-slate-400 font-mono">
              No matching block or panchayat found
            </div>
          ) : (
            <>
              {matchedBlocks.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-[#071324] border-b border-[#1E354D]">
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
                      className="w-full text-left px-3.5 py-2 hover:bg-cyan-950/40 flex items-center justify-between transition-colors border-b border-[#1E354D]/40 last:border-b-0"
                    >
                      <span className="font-semibold text-white">{b.name} Block</span>
                      <span className="font-mono text-[10px] text-cyan-400 font-bold">{b.elevationMeters}m</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedPanchayats.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-[#071324] border-b border-[#1E354D]">
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
                      className="w-full text-left px-3.5 py-2 hover:bg-emerald-950/30 flex items-center justify-between transition-colors border-b border-[#1E354D]/40 last:border-b-0"
                    >
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-medium">{p.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
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
