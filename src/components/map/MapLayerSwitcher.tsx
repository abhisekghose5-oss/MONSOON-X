import React from 'react';
import type { RiskMapLayerId } from '../../types/riskMap';
import { RISK_MAP_LAYERS } from '../../data/geo/layerConfigs';
import { Layers, Compass, ShieldAlert, CloudRain, Droplets, AlertTriangle, Bug } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MapLayerSwitcherProps {
  activeLayer: RiskMapLayerId;
  onLayerChange: (layerId: RiskMapLayerId) => void;
}

export function MapLayerSwitcher({ activeLayer, onLayerChange }: MapLayerSwitcherProps) {
  const layerIcons: Record<RiskMapLayerId, React.ComponentType<{ className?: string }>> = {
    onset: Compass,
    falseOnset: AlertTriangle,
    break: ShieldAlert,
    heavyRain: CloudRain,
    rainfallAnomaly: Droplets,
    pestRisk: Bug,
  };

  const layersList: RiskMapLayerId[] = ['onset', 'falseOnset', 'break', 'heavyRain', 'rainfallAnomaly', 'pestRisk'];

  return (
    <div className="rounded-lg border border-[#1E354D] bg-[#071324]/90 p-1.5 shadow-command-panel flex flex-wrap items-center gap-1.5">
      <div className="hidden sm:flex items-center gap-1.5 px-2 text-slate-400 font-mono text-[10px] font-bold uppercase border-r border-[#1E354D]">
        <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>Thematic Layer:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {layersList.map((layerId) => {
          const config = RISK_MAP_LAYERS[layerId];
          const Icon = layerIcons[layerId];
          const isActive = activeLayer === layerId;

          const activeColors: Record<RiskMapLayerId, string> = {
            onset: 'bg-[#0284C7] text-white border-[#38BDF8]/40 shadow-xs',
            falseOnset: 'bg-[#D97706] text-white border-amber-400/40 shadow-xs',
            break: 'bg-[#B45309] text-white border-amber-500/40 shadow-xs',
            heavyRain: 'bg-rose-600 text-white border-rose-400/40 shadow-xs',
            rainfallAnomaly: 'bg-[#0B1F33] text-white border-[#38BDF8]/40 shadow-xs',
            pestRisk: 'bg-[#15803D] text-white border-emerald-400/40 shadow-xs',
          };

          return (
            <button
              key={layerId}
              type="button"
              onClick={() => onLayerChange(layerId)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all border cursor-pointer',
                isActive
                  ? activeColors[layerId]
                  : 'bg-[#0A192F] text-slate-300 hover:text-white hover:bg-[#1E354D] border-[#1E354D]'
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
