import React from 'react';
import type { TeleconnectionCascadeStage } from '../../types/climate';
import {
  Globe2,
  Wind,
  CloudRain,
  ShieldCheck,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface TeleconnectionCascadeProps {
  stages: TeleconnectionCascadeStage[];
}

export function TeleconnectionCascade({ stages }: TeleconnectionCascadeProps) {
  const stageIcons = {
    GLOBAL_CLIMATE: Globe2,
    REGIONAL_ATMOSPHERE: Wind,
    LOCAL_RAINFALL: CloudRain,
    AGRICULTURAL_RISK: ShieldCheck,
  };

  const stageAccents = {
    GLOBAL_CLIMATE: {
      border: 'border-t-[#38BDF8]',
      badge: 'bg-[#0284C7]/20 text-[#38BDF8] border-[#0284C7]/40',
      iconBg: 'bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8]',
    },
    REGIONAL_ATMOSPHERE: {
      border: 'border-t-[#0284C7]',
      badge: 'bg-[#0369A1]/20 text-sky-300 border-[#0369A1]/40',
      iconBg: 'bg-[#0369A1]/20 border border-[#0369A1]/40 text-sky-300',
    },
    LOCAL_RAINFALL: {
      border: 'border-t-[#10B981]',
      badge: 'bg-[#10B981]/20 text-[#4ADE80] border-[#10B981]/40',
      iconBg: 'bg-[#10B981]/20 border border-[#10B981]/40 text-[#4ADE80]',
    },
    AGRICULTURAL_RISK: {
      border: 'border-t-[#F59E0B]',
      badge: 'bg-[#F59E0B]/20 text-[#FCD34D] border-[#F59E0B]/40',
      iconBg: 'bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#FCD34D]',
    },
  };

  return (
    <div className="rounded-md border border-[#1E354D] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Multi-Scale Teleconnection Cascade
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            How planetary ocean-atmosphere coupled oscillations translate through synoptic dynamics and local topography into agricultural decisions.
          </p>
        </div>
        <DataSourceBadge source="IMD-NCMRWF Multi-Scale Coupling Framework" type="model" size="sm" />
      </div>

      <div className="p-4 sm:p-5">
        {/* Cascade Chain Sequence */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-3 relative">
          {stages.map((stage, idx) => {
            const Icon = stageIcons[stage.stageId] || Globe2;
            const accent = stageAccents[stage.stageId] || stageAccents.GLOBAL_CLIMATE;

            return (
              <React.Fragment key={stage.stageId}>
                {/* Stage Card */}
                <div
                  className={`flex-1 rounded-sm border border-[#1E354D] border-t-4 p-4 bg-[#071324] shadow-xs flex flex-col justify-between ${accent.border}`}
                >
                  <div className="space-y-3">
                    {/* Level Badge + Icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                        Stage {stage.order} of 4
                      </span>
                      <div className={`p-1.5 rounded-sm ${accent.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Level Title */}
                    <div>
                      <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                        {stage.levelName}
                      </h4>
                      <p className="text-xs font-bold text-[#38BDF8] font-sans mt-0.5">
                        {stage.headline}
                      </p>
                    </div>

                    {/* Active State */}
                    <div className="p-2.5 rounded-xs bg-[#0A192F] border border-[#1E354D] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                        Active Teleconnection State:
                      </span>
                      <span className="text-xs font-mono font-semibold text-white block">
                        {stage.activePhenomenon}
                      </span>
                    </div>

                    {/* Physical Mechanism */}
                    <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                        Physical Process:
                      </span>
                      <p>{stage.physicalProcess}</p>
                    </div>
                  </div>

                  {/* Non-Deterministic Link & Local Impact */}
                  <div className="pt-3 mt-3 border-t border-[#1E354D] space-y-2">
                    <div className="text-[11px] text-sky-200 bg-[#0284C7]/15 p-2 rounded-xs border border-[#0284C7]/30 font-mono leading-tight">
                      <span className="font-bold block mb-0.5 text-sky-300">Coupling Mode:</span>
                      {stage.statisticalLink}
                    </div>

                    <div className="text-[11px] font-mono text-emerald-200 bg-[#10B981]/15 p-2 rounded-xs border border-[#10B981]/30 leading-tight">
                      <span className="font-bold block mb-0.5 text-emerald-300">Koraput Response:</span>
                      {stage.koraputImpact}
                    </div>
                  </div>
                </div>

                {/* Arrow Connector: Down for mobile, Right for desktop */}
                {idx < stages.length - 1 && (
                  <>
                    <div className="flex lg:hidden items-center justify-center py-1 text-[#38BDF8]">
                      <ArrowDown className="w-5 h-5 text-[#38BDF8]" />
                    </div>
                    <div className="hidden lg:flex items-center justify-center text-[#38BDF8] px-1 shrink-0">
                      <div className="w-7 h-7 rounded-full bg-[#0A192F] border border-[#1E354D] flex items-center justify-center text-[#38BDF8] shadow-xs">
                        <span className="font-bold text-xs">→</span>
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
