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
      border: 'border-t-[#0B1F33]',
      badge: 'bg-[#EAF0F6] text-[#0B1F33] border-[#CBD5E1]',
      iconBg: 'bg-[#0B1F33] text-white',
    },
    REGIONAL_ATMOSPHERE: {
      border: 'border-t-[#1479C9]',
      badge: 'bg-[#EDF6FC] text-[#0C4E83] border-[#ACD5F2]',
      iconBg: 'bg-[#1479C9] text-white',
    },
    LOCAL_RAINFALL: {
      border: 'border-t-[#247A4A]',
      badge: 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]',
      iconBg: 'bg-[#247A4A] text-white',
    },
    AGRICULTURAL_RISK: {
      border: 'border-t-[#D99000]',
      badge: 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]',
      iconBg: 'bg-[#D99000] text-white',
    },
  };

  return (
    <div className="rounded-md border border-[#E2E8F0] bg-white shadow-gov-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F5F7FA]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1479C9]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Multi-Scale Teleconnection Cascade
            </h3>
          </div>
          <p className="text-[11px] text-[#4B5B6D] mt-0.5">
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
                  className={`flex-1 rounded-sm border border-[#CBD5E1] border-t-4 p-4 bg-white shadow-xs flex flex-col justify-between ${accent.border}`}
                >
                  <div className="space-y-3">
                    {/* Level Badge + Icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#6E7F94]">
                        Stage {stage.order} of 4
                      </span>
                      <div className={`p-1.5 rounded-sm ${accent.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Level Title */}
                    <div>
                      <h4 className="text-xs font-mono font-bold tracking-wider text-[#0B1F33] uppercase">
                        {stage.levelName}
                      </h4>
                      <p className="text-xs font-bold text-[#1479C9] font-sans mt-0.5">
                        {stage.headline}
                      </p>
                    </div>

                    {/* Active State */}
                    <div className="p-2 rounded-xs bg-[#F5F7FA] border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                        Active Teleconnection State:
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#0B1F33] block">
                        {stage.activePhenomenon}
                      </span>
                    </div>

                    {/* Physical Mechanism */}
                    <div className="space-y-1 text-xs text-[#4B5B6D] leading-relaxed">
                      <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                        Physical Process:
                      </span>
                      <p>{stage.physicalProcess}</p>
                    </div>
                  </div>

                  {/* Non-Deterministic Link & Local Impact */}
                  <div className="pt-3 mt-3 border-t border-[#F0F3F7] space-y-2">
                    <div className="text-[11px] text-[#0C4E83] bg-[#EDF6FC] p-2 rounded-xs border border-[#ACD5F2] font-mono leading-tight">
                      <span className="font-bold block mb-0.5">Coupling Mode:</span>
                      {stage.statisticalLink}
                    </div>

                    <div className="text-[11px] font-mono text-[#154D2F] bg-[#EDF7F1] p-2 rounded-xs border border-[#ABD7C0] leading-tight">
                      <span className="font-bold block mb-0.5">Koraput Response:</span>
                      {stage.koraputImpact}
                    </div>
                  </div>
                </div>

                {/* Arrow Connector (Down for mobile/tablet, Right for wide screen) */}
                {idx < stages.length - 1 && (
                  <div className="flex lg:hidden items-center justify-center py-1 text-[#1479C9]">
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
