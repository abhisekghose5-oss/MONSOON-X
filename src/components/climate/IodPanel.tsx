import React from 'react';
import type { IodSignalData } from '../../types/climate';
import { Globe2, TrendingUp, TrendingDown, Calendar, Database } from 'lucide-react';

export interface IodPanelProps {
  iod: IodSignalData;
}

export function IodPanel({ iod }: IodPanelProps) {
  const isPositive = iod.dmi > 0;

  return (
    <div className="rounded-md border border-[#1E354D] border-t-4 border-t-[#0284C7] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md flex flex-col justify-between">
      <div>
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8]">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Indian Ocean Dipole (IOD)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Equatorial SST Zonal Gradient
              </span>
            </div>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-sm border ${
              iod.phase === 'Positive IOD'
                ? 'bg-[#10B981]/20 text-[#4ADE80] border-[#10B981]/40'
                : iod.phase === 'Negative IOD'
                ? 'bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/40'
                : 'bg-[#1E354D] text-slate-300 border-[#334E68]'
            }`}
          >
            {iod.phase}
          </span>
        </div>

        {/* Core Value & Gradient Display */}
        <div className="p-4 space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#1E354D] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Dipole Mode Index (DMI)
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-bold font-mono text-white">
                  {iod.dmi > 0 ? `+${iod.dmi.toFixed(2)}` : iod.dmi.toFixed(2)}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  °C
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Pole Gradient Status
              </span>
              <div className="flex items-center justify-end gap-1 mt-1 text-xs font-mono font-semibold text-[#4ADE80]">
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-[#4ADE80]" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-[#F87171]" />
                )}
                <span>{isPositive ? 'Western Pole Warm' : 'Eastern Pole Warm'}</span>
              </div>
            </div>
          </div>

          {/* Western vs Eastern Pole Indicators */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xs bg-[#071324] border border-[#1E354D]">
              <span className="text-[10px] text-slate-400 block uppercase">Western Pole (Arabian Sea):</span>
              <span className="font-bold text-white">
                {iod.westernPoleSst > 0 ? `+${iod.westernPoleSst.toFixed(2)}` : iod.westernPoleSst.toFixed(2)} °C
              </span>
            </div>
            <div className="p-2.5 rounded-xs bg-[#071324] border border-[#1E354D]">
              <span className="text-[10px] text-slate-400 block uppercase">Eastern Pole (Sumatra):</span>
              <span className="font-bold text-white">
                {iod.easternPoleSst > 0 ? `+${iod.easternPoleSst.toFixed(2)}` : iod.easternPoleSst.toFixed(2)} °C
              </span>
            </div>
          </div>

          {/* Trend & Observation Details */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-400 shrink-0">Trend Diagnosis:</span>
              <span className="text-right font-medium text-slate-200">
                {iod.trend}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#38BDF8]" />
                <span>Observation Date:</span>
              </span>
              <span className="font-semibold text-white">
                {iod.observationDate}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-[#38BDF8]" />
                <span>Source:</span>
              </span>
              <span className="text-slate-200 text-right font-semibold text-[11px]">
                {iod.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Input & Statistical Relationship Callouts */}
      <div className="p-3 bg-[#071324] border-t border-[#1E354D] space-y-2 text-[11px] font-mono">
        <div className="text-sky-200 bg-[#0284C7]/15 p-2 rounded-xs border border-[#0284C7]/30 leading-tight">
          <span className="font-bold block mb-0.5 text-sky-300">Model Input:</span>
          {iod.modelInputRole}
        </div>
        <div className="text-emerald-200 bg-[#10B981]/15 p-2 rounded-xs border border-[#10B981]/30 leading-tight">
          <span className="font-bold block mb-0.5 text-emerald-300">Statistical Relationship:</span>
          {iod.potentialInfluenceKoraput}
        </div>
      </div>
    </div>
  );
}
