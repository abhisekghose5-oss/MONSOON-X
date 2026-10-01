import React from 'react';
import type { MjoSignalData } from '../../types/climate';
import { Wind, Navigation, Calendar, Database } from 'lucide-react';

export interface MjoPanelProps {
  mjo: MjoSignalData;
}

export function MjoPanel({ mjo }: MjoPanelProps) {
  const isActive = mjo.amplitude >= 1.0;

  return (
    <div className="rounded-md border border-[#E2E8F0] border-t-4 border-t-[#247A4A] bg-white shadow-gov-card overflow-hidden flex flex-col justify-between">
      <div>
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-[#F0F3F7] bg-[#F5F7FA]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-sm bg-[#247A4A] text-white">
              <Wind className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Madden–Julian Oscillation (MJO)
              </h3>
              <span className="text-[10px] text-[#6E7F94] font-mono">
                Intra-Seasonal Tropical Wave (30–60d)
              </span>
            </div>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-sm border ${
              isActive
                ? 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]'
                : 'bg-[#F0F3F7] text-[#4B5B6D] border-[#CBD5E1]'
            }`}
          >
            {mjo.convectiveState}
          </span>
        </div>

        {/* Core Value & Phase Display */}
        <div className="p-4 space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#F0F3F7] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                Active Phase Location
              </span>
              <div className="mt-0.5">
                <span className="text-xl lg:text-2xl font-bold font-mono text-[#0B1F33]">
                  {mjo.phase}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                RMM Amplitude
              </span>
              <div className="flex items-baseline justify-end gap-1 mt-0.5">
                <span className="text-2xl font-bold font-mono text-[#247A4A]">
                  {mjo.amplitude.toFixed(2)}
                </span>
                <span className="text-[11px] font-mono text-[#6E7F94]">
                  ({isActive ? '> 1.0 Active' : '< 1.0 Weak'})
                </span>
              </div>
            </div>
          </div>

          {/* Movement Vector & Details */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 rounded-xs bg-[#F5F7FA] border border-[#E2E8F0] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase text-[#6E7F94] font-semibold">
                <Navigation className="w-3 h-3 text-[#1479C9]" />
                <span>Wave Movement Vector:</span>
              </div>
              <p className="text-xs font-medium text-[#16202A]">
                {mjo.movement}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#6E7F94]">Convective Coupling:</span>
              <span className="text-right text-[#154D2F] font-semibold">
                Coupled with Bay of Bengal cyclogenesis
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#6E7F94] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#1479C9]" />
                <span>Observation Date:</span>
              </span>
              <span className="font-semibold text-[#0B1F33]">
                {mjo.observationDate}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#6E7F94] flex items-center gap-1">
                <Database className="w-3 h-3 text-[#1479C9]" />
                <span>Source:</span>
              </span>
              <span className="text-[#0B1F33] text-right font-semibold text-[11px]">
                {mjo.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Input & Statistical Relationship Callouts */}
      <div className="p-3 bg-[#F8FAFC] border-t border-[#F0F3F7] space-y-2 text-[11px] font-mono">
        <div className="text-[#0C4E83] bg-[#EDF6FC] p-2 rounded-xs border border-[#ACD5F2] leading-tight">
          <span className="font-bold block mb-0.5">Model Input:</span>
          {mjo.modelInputRole}
        </div>
        <div className="text-[#154D2F] bg-[#EDF7F1] p-2 rounded-xs border border-[#ABD7C0] leading-tight">
          <span className="font-bold block mb-0.5">Statistical Relationship:</span>
          {mjo.potentialInfluenceKoraput}
        </div>
      </div>
    </div>
  );
}
