import React from 'react';
import type { RiskLayer } from '../../types/riskMap';
import { RISK_MAP_LAYERS } from '../../data/geo/layerConfigs';
import { Compass, ShieldAlert, CloudRain, Droplets, Layers } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RiskLayerSelectorProps {
  activeLayer: RiskLayer;
  onLayerChange: (layer: RiskLayer) => void;
  className?: string;
}

export function RiskLayerSelector({
  activeLayer,
  onLayerChange,
  className,
}: RiskLayerSelectorProps) {
  const layerIcons: Record<RiskLayer, React.ElementType> = {
    onset: Compass,
    break: ShieldAlert,
    heavyRain: CloudRain,
    rainfallAnomaly: Droplets,
  };

  const layersList: RiskLayer[] = ['onset', 'break', 'heavyRain', 'rainfallAnomaly'];

  const activeStyles: Record<RiskLayer, string> = {
    onset: 'bg-[#1479C9] text-white border-[#1479C9] shadow-xs',
    break: 'bg-[#D97706] text-white border-[#D97706] shadow-xs',
    heavyRain: 'bg-[#C43D3D] text-white border-[#C43D3D] shadow-xs',
    rainfallAnomaly: 'bg-[#0B1F33] text-white border-[#0B1F33] shadow-xs',
  };

  return (
    <div
      role="group"
      aria-label="Risk Layer Selector"
      className={cn(
        'rounded-sm border border-[#CBD5E1] bg-white p-1 shadow-gov-card flex flex-wrap items-center gap-1',
        className
      )}
    >
      <div className="hidden md:flex items-center gap-1.5 px-2 text-[#4B5B6D] font-mono text-[11px] font-bold uppercase border-r border-[#E2E8F0]">
        <Layers className="w-3.5 h-3.5 text-[#1479C9]" />
        <span>Risk Layer:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1 flex-1">
        {layersList.map((layerId) => {
          const config = RISK_MAP_LAYERS[layerId];
          const Icon = layerIcons[layerId];
          const isActive = activeLayer === layerId;

          return (
            <button
              key={layerId}
              type="button"
              onClick={() => onLayerChange(layerId)}
              aria-pressed={isActive}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-semibold transition-all border',
                isActive
                  ? activeStyles[layerId]
                  : 'bg-[#F5F7FA] text-[#4B5B6D] hover:text-[#0B1F33] hover:bg-[#EAF0F6] border-[#CBD5E1]'
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

export default RiskLayerSelector;
