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
        'flex flex-col gap-1.5 p-1 rounded-sm bg-white/95 backdrop-blur-sm border border-[#CBD5E1] shadow-gov-card text-xs font-mono select-none z-[1000]',
        className
      )}
    >
      {/* Quick Location Action Buttons */}
      <div className="flex flex-col gap-1 border-b border-[#F0F3F7] pb-1">
        <button
          type="button"
          onClick={onLocateKoraput}
          className="p-1.5 rounded-xs hover:bg-[#EDF6FC] text-[#0B1F33] hover:text-[#1479C9] flex items-center justify-center transition-colors"
          title="Locate Koraput District Center"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onResetExtent}
          className="p-1.5 rounded-xs hover:bg-[#EDF6FC] text-[#0B1F33] hover:text-[#1479C9] flex items-center justify-center transition-colors"
          title="Reset Map to District Extent"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-xs hover:bg-[#EDF6FC] text-[#0B1F33] hover:text-[#1479C9] flex items-center justify-center transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Basemap Tile Switcher */}
      <div className="flex flex-col gap-0.5 pt-0.5">
        <span className="text-[9px] uppercase font-bold text-[#6E7F94] px-1 flex items-center gap-1">
          <Map className="w-2.5 h-2.5" />
          <span>Base</span>
        </span>
        {basemaps.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onChangeBasemap(b.id)}
            className={cn(
              'px-2 py-0.5 text-[10px] font-mono rounded-xs text-left transition-colors',
              basemap === b.id
                ? 'bg-[#0B1F33] text-white font-bold'
                : 'text-[#4B5B6D] hover:bg-[#F5F7FA] hover:text-[#0B1F33]'
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
