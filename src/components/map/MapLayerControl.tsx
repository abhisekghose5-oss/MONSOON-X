import React from 'react';
import type { BasemapType } from '../../types/riskMap';
import { LocateFixed, RotateCcw, Maximize, Minimize, Map } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MapLayerControlProps {
  basemap: BasemapType;
  onChangeBasemap: (basemap: BasemapType) => void;
  onLocateKoraput: () => void;
  onResetExtent: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export function MapLayerControl({
  basemap,
  onChangeBasemap,
  onLocateKoraput,
  onResetExtent,
  isFullscreen,
  onToggleFullscreen,
  className,
}: MapLayerControlProps) {
  const basemaps: { id: BasemapType; label: string }[] = [
    { id: 'positron', label: 'Carto' },
    { id: 'terrain', label: 'Topo' },
    { id: 'satellite', label: 'Imagery' },
    { id: 'osm', label: 'Street' },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Geographic Map Controls"
      className={cn(
        'flex flex-col gap-1.5 p-1.5 rounded-lg bg-[#0A192F]/90 backdrop-blur-md border border-[#1E354D] shadow-command-panel text-xs font-mono select-none z-[1000] text-white',
        className
      )}
    >
      {/* Quick Location Action Buttons */}
      <div className="flex flex-col gap-1 border-b border-[#1E354D] pb-1.5">
        <button
          type="button"
          onClick={onLocateKoraput}
          className="p-1.5 rounded-sm hover:bg-[#0284C7]/20 text-slate-300 hover:text-[#38BDF8] flex items-center justify-center transition-all cursor-pointer"
          title="Locate Koraput District Center"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onResetExtent}
          className="p-1.5 rounded-sm hover:bg-[#0284C7]/20 text-slate-300 hover:text-[#38BDF8] flex items-center justify-center transition-all cursor-pointer"
          title="Reset Map to District Extent"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-sm hover:bg-[#0284C7]/20 text-slate-300 hover:text-[#38BDF8] flex items-center justify-center transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Basemap Tile Switcher */}
      <div className="flex flex-col gap-0.5 pt-0.5">
        <span className="text-[9px] uppercase font-bold text-slate-400 px-1 flex items-center gap-1">
          <Map className="w-2.5 h-2.5 text-[#38BDF8]" />
          <span>Base</span>
        </span>
        {basemaps.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onChangeBasemap(b.id)}
            className={cn(
              'px-2 py-1 text-[10px] font-mono rounded-xs text-left transition-all cursor-pointer',
              basemap === b.id
                ? 'bg-[#0284C7] text-white font-bold shadow-xs border border-[#38BDF8]/40'
                : 'text-slate-400 hover:bg-[#1E354D] hover:text-white'
            )}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MapLayerControl;
