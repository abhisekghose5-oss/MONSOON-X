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
    <div className="bg-[#0A192F]/90 rounded-md border border-[#1E354D] shadow-command-panel p-4 space-y-3 backdrop-blur-md">
      {/* Title + Prominent Simulation Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E354D] pb-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl lg:text-2xl font-bold font-sans tracking-tight text-white">
              Hyperlocal Monsoon Forecast
            </h1>
            {metadata.isDemoModelOutput && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#FCD34D] font-mono text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>DEMO MODEL OUTPUT</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Downscaled multi-model ensemble predicting onset timing, break durations, and convective precipitation thresholds for{' '}
            <span className="font-semibold text-white">{locationName}</span> ({elevationMeters}m MSL).
          </p>
        </div>

        {/* Confidence Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-[#071324] border border-[#1E354D] rounded-sm p-2 text-right font-mono">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">
              Ensemble Confidence
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-white">
                {confidence.overallScore}%
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-xs uppercase ${
                  confidence.tier === 'High'
                    ? 'bg-[#10B981]/20 text-[#4ADE80] border border-[#10B981]/40'
                    : confidence.tier === 'Moderate'
                    ? 'bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40'
                    : 'bg-[#F59E0B]/20 text-[#FCD34D] border border-[#F59E0B]/40'
                }`}
              >
                {confidence.tier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Version, Timestamp & Provenance Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Model Version */}
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-slate-400">Model:</span>
            <span className="font-semibold text-white">{metadata.modelVersion}</span>
          </div>

          {/* Generated Timestamp */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="text-slate-400">Generated:</span>
            <span className="font-semibold text-white">{metadata.cycleName}</span>
          </div>

          {/* Grid Resolution & Members */}
          <div className="hidden md:flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Grid:</span>
            <span className="font-semibold text-white">{metadata.gridResolutionKm} km²</span>
            <span className="text-slate-400">({metadata.ensembleMembers} Members)</span>
          </div>
        </div>

        {/* Satellite Verification Status */}
        <div className="flex items-center gap-1 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span className="text-slate-400">Satellite Validation:</span>
          <span className="font-semibold text-[#4ADE80]">{confidence.satelliteValidation}</span>
        </div>
      </div>
    </div>
  );
}
