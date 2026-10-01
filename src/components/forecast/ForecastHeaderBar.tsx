import React from 'react';
import { Cpu, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import type { ForecastMetadata, ForecastConfidenceIndicator } from '../../types/forecast';

export interface ForecastHeaderBarProps {
  locationName: string;
  elevationMeters: number;
  metadata: ForecastMetadata;
  confidence: ForecastConfidenceIndicator;
}

export function ForecastHeaderBar({
  locationName,
  elevationMeters,
  metadata,
  confidence,
}: ForecastHeaderBarProps) {
  return (
    <div className="bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-3">
      {/* Title + Prominent Simulation Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F0F3F7] pb-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl lg:text-2xl font-bold font-sans tracking-tight text-[#0B1F33]">
              Hyperlocal Monsoon Forecast
            </h1>
            {metadata.isDemoModelOutput && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#FDF7EB] border border-[#F4D79C] text-[#8C5D00] font-mono text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D99000]" />
                <span>DEMO MODEL OUTPUT</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#4B5B6D] mt-1 font-sans">
            Downscaled multi-model ensemble predicting onset timing, break durations, and convective precipitation thresholds for{' '}
            <span className="font-semibold text-[#0B1F33]">{locationName}</span> ({elevationMeters}m MSL).
          </p>
        </div>

        {/* Confidence Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-[#F5F7FA] border border-[#CBD5E1] rounded-sm p-2 text-right font-mono">
            <div className="text-[10px] uppercase text-[#6E7F94] font-semibold">
              Ensemble Confidence
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-[#0B1F33]">
                {confidence.overallScore}%
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-xs uppercase ${
                  confidence.tier === 'High'
                    ? 'bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0]'
                    : confidence.tier === 'Moderate'
                    ? 'bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2]'
                    : 'bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C]'
                }`}
              >
                {confidence.tier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Version, Timestamp & Provenance Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono text-[#4B5B6D]">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Model Version */}
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#1479C9]" />
            <span className="text-[#6E7F94]">Model:</span>
            <span className="font-semibold text-[#0B1F33]">{metadata.modelVersion}</span>
          </div>

          {/* Generated Timestamp */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#247A4A]" />
            <span className="text-[#6E7F94]">Generated:</span>
            <span className="font-semibold text-[#0B1F33]">{metadata.cycleName}</span>
          </div>

          {/* Grid Resolution & Members */}
          <div className="hidden md:flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#7599C8]" />
            <span className="text-[#6E7F94]">Grid:</span>
            <span className="font-semibold text-[#0B1F33]">{metadata.gridResolutionKm} km²</span>
            <span className="text-[#6E7F94]">({metadata.ensembleMembers} Members)</span>
          </div>
        </div>

        {/* Satellite Verification Status */}
        <div className="flex items-center gap-1 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#247A4A]" />
          <span className="text-[#6E7F94]">Satellite Validation:</span>
          <span className="font-semibold text-[#247A4A]">{confidence.satelliteValidation}</span>
        </div>
      </div>
    </div>
  );
}
