import React from 'react';
import type { IodSignalData } from '../../types/climate';
import { Globe2, TrendingUp, TrendingDown, Calendar, Database } from 'lucide-react';

export interface IodPanelProps {
  iod: IodSignalData;
}

export function IodPanel({ iod }: IodPanelProps) {
  const isPositive = iod.dmi > 0;

  return (
    <div className="rounded-md border border-[#E2E8F0] border-t-4 border-t-[#1479C9] bg-white shadow-gov-card overflow-hidden flex flex-col justify-between">
      <div>
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-[#F0F3F7] bg-[#F5F7FA]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-sm bg-[#1479C9] text-white">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Indian Ocean Dipole (IOD)
              </h3>
              <span className="text-[10px] text-[#6E7F94] font-mono">
                Equatorial SST Zonal Gradient
              </span>
            </div>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-sm border ${
              iod.phase === 'Positive IOD'
                ? 'bg-[#EDF6FC] text-[#0C4E83] border-[#ACD5F2]'
                : iod.phase === 'Negative IOD'
                ? 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]'
                : 'bg-[#F0F3F7] text-[#4B5B6D] border-[#CBD5E1]'
            }`}
          >
            {iod.phase}
          </span>
        </div>

        {/* Core Value & Gradient Display */}
        <div className="p-4 space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#F0F3F7] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                Dipole Mode Index (DMI)
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-bold font-mono text-[#0B1F33]">
                  {iod.dmi > 0 ? `+${iod.dmi.toFixed(2)}` : iod.dmi.toFixed(2)}
                </span>
                <span className="text-xs font-mono font-medium text-[#6E7F94]">
                  °C
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                Pole Gradient Status
              </span>
              <div className="flex items-center justify-end gap-1 mt-1 text-xs font-mono font-semibold text-[#247A4A]">
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-[#247A4A]" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-[#C43D3D]" />
                )}
                <span>{isPositive ? 'Western Pole Warm' : 'Eastern Pole Warm'}</span>
              </div>
            </div>
          </div>

          {/* Western vs Eastern Pole Indicators */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xs bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#6E7F94] block uppercase">Western Pole (Arabian Sea):</span>
              <span className="font-bold text-[#0B1F33]">
                {iod.westernPoleSst > 0 ? `+${iod.westernPoleSst.toFixed(2)}` : iod.westernPoleSst.toFixed(2)} °C
              </span>
            </div>
            <div className="p-2 rounded-xs bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#6E7F94] block uppercase">Eastern Pole (Sumatra):</span>
              <span className="font-bold text-[#0B1F33]">
                {iod.easternPoleSst > 0 ? `+${iod.easternPoleSst.toFixed(2)}` : iod.easternPoleSst.toFixed(2)} °C
              </span>
            </div>
          </div>

          {/* Trend & Observation Details */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[#6E7F94] shrink-0">Trend Diagnosis:</span>
              <span className="text-right font-medium text-[#16202A]">
                {iod.trend}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#6E7F94] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#1479C9]" />
                <span>Observation Date:</span>
              </span>
              <span className="font-semibold text-[#0B1F33]">
                {iod.observationDate}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#6E7F94] flex items-center gap-1">
                <Database className="w-3 h-3 text-[#1479C9]" />
                <span>Source:</span>
              </span>
              <span className="text-[#0B1F33] text-right font-semibold text-[11px]">
                {iod.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Input & Statistical Relationship Callouts */}
      <div className="p-3 bg-[#F8FAFC] border-t border-[#F0F3F7] space-y-2 text-[11px] font-mono">
        <div className="text-[#0C4E83] bg-[#EDF6FC] p-2 rounded-xs border border-[#ACD5F2] leading-tight">
          <span className="font-bold block mb-0.5">Model Input:</span>
          {iod.modelInputRole}
        </div>
        <div className="text-[#154D2F] bg-[#EDF7F1] p-2 rounded-xs border border-[#ABD7C0] leading-tight">
          <span className="font-bold block mb-0.5">Statistical Relationship:</span>
          {iod.potentialInfluenceKoraput}
        </div>
      </div>
    </div>
  );
}
