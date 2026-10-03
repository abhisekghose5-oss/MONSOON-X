import React from 'react';
import type { MjoSignalData } from '../../types/climate';
import { Wind, Navigation, Calendar, Database } from 'lucide-react';

export interface MjoPanelProps {
  mjo: MjoSignalData;
}

export function MjoPanel({ mjo }: MjoPanelProps) {
  const isActive = mjo.amplitude >= 1.0;

  return (
    <div className="rounded-md border border-[#1E354D] border-t-4 border-t-[#10B981] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md flex flex-col justify-between">
      <div>
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-[#10B981]/20 border border-[#10B981]/40 text-[#4ADE80]">
              <Wind className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Madden–Julian Oscillation (MJO)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Intra-Seasonal Tropical Wave (30–60d)
              </span>
            </div>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-sm border ${
              isActive
                ? 'bg-[#10B981]/20 text-[#4ADE80] border-[#10B981]/40'
                : 'bg-[#1E354D] text-slate-300 border-[#334E68]'
            }`}
          >
            {mjo.convectiveState}
          </span>
        </div>

        {/* Core Value & Phase Display */}
        <div className="p-4 space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#1E354D] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Active Phase Location
              </span>
              <div className="mt-0.5">
                <span className="text-xl lg:text-2xl font-bold font-mono text-white">
                  {mjo.phase}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                RMM Amplitude
              </span>
              <div className="flex items-baseline justify-end gap-1 mt-0.5">
                <span className="text-2xl font-bold font-mono text-[#4ADE80]">
                  {mjo.amplitude.toFixed(2)}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ({isActive ? '> 1.0 Active' : '< 1.0 Weak'})
                </span>
              </div>
            </div>
          </div>

          {/* Movement Vector & Details */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xs bg-[#071324] border border-[#1E354D] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase text-slate-400 font-semibold">
                <Navigation className="w-3 h-3 text-[#38BDF8]" />
                <span>Wave Movement Vector:</span>
              </div>
              <p className="text-xs font-medium text-slate-200">
                {mjo.movement}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Convective Coupling:</span>
              <span className="text-right text-[#4ADE80] font-semibold">
                Coupled with Bay of Bengal cyclogenesis
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#38BDF8]" />
                <span>Observation Date:</span>
              </span>
              <span className="font-semibold text-white">
                {mjo.observationDate}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-[#38BDF8]" />
                <span>Source:</span>
              </span>
              <span className="text-slate-200 text-right font-semibold text-[11px]">
                {mjo.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Input & Statistical Relationship Callouts */}
      <div className="p-3 bg-[#071324] border-t border-[#1E354D] space-y-2 text-[11px] font-mono">
        <div className="text-sky-200 bg-[#0284C7]/15 p-2 rounded-xs border border-[#0284C7]/30 leading-tight">
          <span className="font-bold block mb-0.5 text-sky-300">Model Input:</span>
          {mjo.modelInputRole}
        </div>
        <div className="text-emerald-200 bg-[#10B981]/15 p-2 rounded-xs border border-[#10B981]/30 leading-tight">
          <span className="font-bold block mb-0.5 text-emerald-300">Statistical Relationship:</span>
          {mjo.potentialInfluenceKoraput}
        </div>
      </div>
    </div>
  );
}
