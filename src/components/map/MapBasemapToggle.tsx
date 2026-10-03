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
        'rounded-lg border border-[#1E354D] bg-[#0A192F]/90 backdrop-blur-md p-1 shadow-command-panel flex items-center gap-1 text-xs select-none text-white',
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
              'flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-[11px] transition-all cursor-pointer',
              isActive
                ? 'bg-[#0284C7] text-white font-bold shadow-xs border border-[#38BDF8]/40'
                : 'text-slate-300 hover:bg-[#1E354D] hover:text-white'
            )}
          >
            <Icon className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
