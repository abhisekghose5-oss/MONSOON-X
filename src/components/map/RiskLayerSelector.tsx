import React from 'react';
import type { RiskLayer } from '../../types/riskMap';
import { RISK_MAP_LAYERS } from '../../data/geo/layerConfigs';
import { Compass, ShieldAlert, CloudRain, Droplets, Layers, Bug, AlertTriangle } from 'lucide-react';
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
    falseOnset: AlertTriangle,
    break: ShieldAlert,
    heavyRain: CloudRain,
    pestRisk: Bug,
    rainfallAnomaly: Droplets,
  };

  const layersList: RiskLayer[] = ['onset', 'falseOnset', 'break', 'heavyRain', 'pestRisk'];

  const activeStyles: Record<RiskLayer, string> = {
    onset: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]',
    falseOnset: 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    break: 'bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.3)]',
    heavyRain: 'bg-blue-500/20 text-blue-300 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    pestRisk: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    rainfallAnomaly: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]',
  };

  return (
    <div
      role="group"
      aria-label="Risk Layer Selector"
      className={cn(
        'rounded-xl border border-[#1E354D] bg-[#071324]/90 backdrop-blur-md p-1 shadow-2xl flex flex-wrap items-center gap-1',
        className
      )}
    >
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 text-slate-400 font-mono text-[10px] font-bold uppercase border-r border-[#1E354D]">
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span>Risk Layer:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
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
                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer',
                isActive
                  ? activeStyles[layerId]
                  : 'bg-[#0A192F]/60 text-slate-400 hover:text-slate-200 hover:bg-[#0E2845] border-[#1E354D]'
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{config?.shortName || layerId}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RiskLayerSelector;

