import React from 'react';
import type { RiskMapLayerId } from '../../types/riskMap';
import { RISK_MAP_LAYERS } from '../../data/geo/layerConfigs';
import { Layers, Compass, ShieldAlert, CloudRain, Droplets } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MapLayerSwitcherProps {
  activeLayer: RiskMapLayerId;
  onLayerChange: (layerId: RiskMapLayerId) => void;
}

export function MapLayerSwitcher({ activeLayer, onLayerChange }: MapLayerSwitcherProps) {
  const layerIcons = {
    onset: Compass,
    break: ShieldAlert,
    heavyRain: CloudRain,
    rainfallAnomaly: Droplets,
  };

  const layersList: RiskMapLayerId[] = ['onset', 'break', 'heavyRain', 'rainfallAnomaly'];

  return (
    <div className="rounded-sm border border-[#CBD5E1] bg-white p-1.5 shadow-gov-card flex flex-wrap items-center gap-1.5">
      <div className="hidden sm:flex items-center gap-1.5 px-2 text-[#4B5B6D] font-mono text-[11px] font-bold uppercase border-r border-[#E2E8F0]">
        <Layers className="w-3.5 h-3.5 text-[#1479C9]" />
        <span>Thematic Layer:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {layersList.map((layerId) => {
          const config = RISK_MAP_LAYERS[layerId];
          const Icon = layerIcons[layerId];
          const isActive = activeLayer === layerId;

          const activeColors = {
            onset: 'bg-[#1479C9] text-white',
            break: 'bg-[#D99000] text-white',
            heavyRain: 'bg-[#C43D3D] text-white',
            rainfallAnomaly: 'bg-[#0B1F33] text-white',
          };

          return (
            <button
              key={layerId}
              type="button"
              onClick={() => onLayerChange(layerId)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all shadow-xs',
                isActive
                  ? activeColors[layerId]
                  : 'bg-[#F5F7FA] text-[#4B5B6D] hover:text-[#0B1F33] hover:bg-[#EAF0F6] border border-[#CBD5E1]'
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{config.shortName}</span>
              <span className="text-[10px] font-mono opacity-80">({config.unit})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
