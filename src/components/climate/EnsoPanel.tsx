import React from 'react';
import type { EnsoSignalData } from '../../types/climate';
import { Waves, TrendingDown, TrendingUp, Calendar, Database } from 'lucide-react';

export interface EnsoPanelProps {
  enso: EnsoSignalData;
}

export function EnsoPanel({ enso }: EnsoPanelProps) {
  const isNegative = enso.nino34 < 0;

  return (
    <div className="rounded-md border border-[#1E354D] border-t-4 border-t-[#38BDF8] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md flex flex-col justify-between">
      <div>
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8]">
              <Waves className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                ENSO Teleconnection
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                El Niño–Southern Oscillation
              </span>
            </div>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-sm border ${
              enso.phase === 'La Niña'
                ? 'bg-[#0284C7]/20 text-[#38BDF8] border-[#0284C7]/40'
                : enso.phase === 'El Niño'
                ? 'bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/40'
                : 'bg-[#1E354D] text-slate-300 border-[#334E68]'
            }`}
          >
            {enso.phase}
          </span>
        </div>

        {/* Core Value & Trend Display */}
        <div className="p-4 space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#1E354D] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Niño 3.4 SST Anomaly
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-bold font-mono text-white">
                  {enso.nino34 > 0 ? `+${enso.nino34.toFixed(2)}` : enso.nino34.toFixed(2)}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  °C
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                SST Anomaly Trend
              </span>
              <div className="flex items-center justify-end gap-1 mt-1 text-xs font-mono font-semibold text-[#38BDF8]">
                {isNegative ? (
                  <TrendingDown className="w-3.5 h-3.5 text-[#38BDF8]" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-[#F87171]" />
                )}
                <span>{enso.nino34 <= -0.5 ? 'La Niña' : enso.nino34 >= 0.5 ? 'El Niño' : 'Neutral / Cooling'}</span>
              </div>
            </div>
          </div>

          {/* Trend & Observation Details */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-400 shrink-0">Trend Diagnosis:</span>
              <span className="text-right font-medium text-slate-200">
                {enso.trend}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Thresholds:</span>
              <span className="text-right text-slate-300">
                El Niño ≥ +{enso.thresholds.elNinoThreshold}°C · La Niña ≤ {enso.thresholds.laNinaThreshold}°C
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#38BDF8]" />
                <span>Observation Date:</span>
              </span>
              <span className="font-semibold text-white">
                {enso.observationDate}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-[#38BDF8]" />
                <span>Source:</span>
              </span>
              <span className="text-slate-200 text-right font-semibold text-[11px]">
                {enso.source}
              </span>
            </div>
          </div>

          {/* Historical Analogs */}
          {enso.analogYears && enso.analogYears.length > 0 && (
            <div className="p-2.5 bg-[#071324] rounded-xs border border-[#1E354D] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[11px]">Historical Analog Years:</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                {enso.analogYears.map((yr) => (
                  <span key={yr} className="px-1.5 py-0.5 bg-[#0A192F] rounded-xs border border-[#1E354D] text-[#38BDF8]">
                    {yr}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model Input & Statistical Relationship Callouts */}
      <div className="p-3 bg-[#071324] border-t border-[#1E354D] space-y-2 text-[11px] font-mono">
        <div className="text-sky-200 bg-[#0284C7]/15 p-2 rounded-xs border border-[#0284C7]/30 leading-tight">
          <span className="font-bold block mb-0.5 text-sky-300">Model Input:</span>
          {enso.modelInputRole}
        </div>
        <div className="text-emerald-200 bg-[#10B981]/15 p-2 rounded-xs border border-[#10B981]/30 leading-tight">
          <span className="font-bold block mb-0.5 text-emerald-300">Statistical Relationship:</span>
          {enso.potentialInfluenceKoraput}
        </div>
      </div>
    </div>
  );
}
