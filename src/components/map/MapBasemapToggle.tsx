import React from 'react';
import type { BasemapType } from '../../types/riskMap';
import { Map, Satellite, Mountain } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MapBasemapToggleProps {
  basemap: BasemapType;
  onChangeBasemap: (basemap: BasemapType) => void;
  className?: string;
}

export function MapBasemapToggle({
  basemap,
  onChangeBasemap,
  className,
}: MapBasemapToggleProps) {
  const options: Array<{ id: BasemapType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'positron', label: 'Carto Light', icon: Map },
    { id: 'terrain', label: 'Topography', icon: Mountain },
    { id: 'satellite', label: 'Satellite', icon: Satellite },
    { id: 'osm', label: 'OSM Standard', icon: Map },
  ];

  return (
    <div
      className={cn(
        'rounded-sm border border-[#CBD5E1] bg-white/95 backdrop-blur-sm p-1 shadow-gov-card flex items-center gap-1 text-xs select-none',
        className
      )}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = basemap === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChangeBasemap(opt.id)}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-xs font-mono text-[11px] transition-colors',
              isActive
                ? 'bg-[#0B1F33] text-white font-bold shadow-xs'
                : 'text-[#4B5B6D] hover:bg-[#F5F7FA] hover:text-[#0B1F33]'
            )}
          >
            <Icon className="w-3 h-3" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
