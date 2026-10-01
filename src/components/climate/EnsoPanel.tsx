import React from 'react';
import type { EnsoSignalData } from '../../types/climate';
import { Waves, TrendingDown, TrendingUp, Calendar, Database } from 'lucide-react';

export interface EnsoPanelProps {
  enso: EnsoSignalData;
}

export function EnsoPanel({ enso }: EnsoPanelProps) {
  const isNegative = enso.nino34 < 0;

  return (
    <div className="rounded-md border border-[#E2E8F0] border-t-4 border-t-[#0B1F33] bg-white shadow-gov-card overflow-hidden flex flex-col justify-between">
      <div>
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-[#F0F3F7] bg-[#F5F7FA]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-sm bg-[#0B1F33] text-white">
              <Waves className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                ENSO Teleconnection
              </h3>
              <span className="text-[10px] text-[#6E7F94] font-mono">
                El Niño–Southern Oscillation
              </span>
            </div>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-sm border ${
              enso.phase === 'La Niña'
                ? 'bg-[#EDF6FC] text-[#0C4E83] border-[#ACD5F2]'
                : enso.phase === 'El Niño'
                ? 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]'
                : 'bg-[#F0F3F7] text-[#4B5B6D] border-[#CBD5E1]'
            }`}
          >
            {enso.phase}
          </span>
        </div>

        {/* Core Value & Trend Display */}
        <div className="p-4 space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#F0F3F7] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                Niño 3.4 SST Anomaly
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-bold font-mono text-[#0B1F33]">
                  {enso.nino34 > 0 ? `+${enso.nino34.toFixed(2)}` : enso.nino34.toFixed(2)}
                </span>
                <span className="text-xs font-mono font-medium text-[#6E7F94]">
                  °C
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                SST Anomaly Trend
              </span>
              <div className="flex items-center justify-end gap-1 mt-1 text-xs font-mono font-semibold text-[#1479C9]">
                {isNegative ? (
                  <TrendingDown className="w-3.5 h-3.5 text-[#1479C9]" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-[#C43D3D]" />
                )}
                <span>{enso.nino34 <= -0.5 ? 'La Niña' : enso.nino34 >= 0.5 ? 'El Niño' : 'Neutral / Cooling'}</span>
              </div>
            </div>
          </div>

          {/* Trend & Observation Details */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[#6E7F94] shrink-0">Trend Diagnosis:</span>
              <span className="text-right font-medium text-[#16202A]">
                {enso.trend}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#6E7F94]">Thresholds:</span>
              <span className="text-right text-[#4B5B6D]">
                El Niño ≥ +{enso.thresholds.elNinoThreshold}°C · La Niña ≤ {enso.thresholds.laNinaThreshold}°C
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#6E7F94] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#1479C9]" />
                <span>Observation Date:</span>
              </span>
              <span className="font-semibold text-[#0B1F33]">
                {enso.observationDate}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#6E7F94] flex items-center gap-1">
                <Database className="w-3 h-3 text-[#1479C9]" />
                <span>Source:</span>
              </span>
              <span className="text-[#0B1F33] text-right font-semibold text-[11px]">
                {enso.source}
              </span>
            </div>
          </div>

          {/* Historical Analogs */}
          {enso.analogYears && enso.analogYears.length > 0 && (
            <div className="p-2 bg-[#F5F7FA] rounded-xs border border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
              <span className="text-[#6E7F94] text-[11px]">Historical Analog Years:</span>
              <div className="flex items-center gap-1.5 font-bold text-[#0B1F33]">
                {enso.analogYears.map((yr) => (
                  <span key={yr} className="px-1.5 py-0.2 bg-white rounded-xs border border-[#CBD5E1]">
                    {yr}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model Input & Statistical Relationship Callouts */}
      <div className="p-3 bg-[#F8FAFC] border-t border-[#F0F3F7] space-y-2 text-[11px] font-mono">
        <div className="text-[#0C4E83] bg-[#EDF6FC] p-2 rounded-xs border border-[#ACD5F2] leading-tight">
          <span className="font-bold block mb-0.5">Model Input:</span>
          {enso.modelInputRole}
        </div>
        <div className="text-[#154D2F] bg-[#EDF7F1] p-2 rounded-xs border border-[#ABD7C0] leading-tight">
          <span className="font-bold block mb-0.5">Statistical Relationship:</span>
          {enso.potentialInfluenceKoraput}
        </div>
      </div>
    </div>
  );
}
