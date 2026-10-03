import React, { useState } from 'react';
import type { FalseOnsetResult } from '../../types/falseOnset';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  MapPin,
  Gauge,
  CheckCircle2,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface FalseOnsetWatchProps {
  data: FalseOnsetResult;
  className?: string;
}

export function FalseOnsetWatch({
  data,
  className = '',
}: FalseOnsetWatchProps) {
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);

  const {
    isFalseOnsetDetected,
    riskLevel,
    inputs,
    thresholdsUsed,
    explanation,
    expectedWindow,
    affectedBlocks,
    confidence,
    recommendedAction,
    diagnosticCriteria,
    metadata,
  } = data;

  // Output level styling - restrained dark amber/orange warning palette
  const outputStyles = {
    LOW: {
      bg: 'bg-[#081C1B]',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40',
      borderTop: 'border-t-[#10B981]',
      icon: ShieldCheck,
      bannerBg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
    },
    MODERATE: {
      bg: 'bg-[#1C1608]',
      text: 'text-amber-300',
      border: 'border-amber-500/30',
      badgeBg: 'bg-amber-950/80 text-amber-400 border border-amber-500/40',
      borderTop: 'border-t-[#F59E0B]',
      icon: AlertTriangle,
      bannerBg: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
    },
    HIGH: {
      bg: 'bg-[#200D0D]',
      text: 'text-rose-300',
      border: 'border-rose-500/30',
      badgeBg: 'bg-rose-950/80 text-rose-400 border border-rose-500/40',
      borderTop: 'border-t-[#EF4444]',
      icon: AlertOctagon,
      bannerBg: 'bg-rose-950/40 border-rose-500/30 text-rose-300',
    },
  };

  const style = outputStyles[riskLevel];
  const OutputIcon = style.icon;

  return (
    <div
      className={`rounded-lg border border-[#1E354D] border-t-4 ${style.borderTop} bg-[#0A192F] shadow-command-panel overflow-hidden space-y-0 text-white ${className}`}
    >
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-xs ${style.badgeBg} shrink-0`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                FALSE ONSET WATCH
              </h2>
              {/* Output Level Badge */}
              <span
                className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-xs uppercase shadow-2xs flex items-center gap-1.5 ${style.badgeBg}`}
              >
                <OutputIcon className="w-3 h-3" />
                <span>RISK LEVEL: {riskLevel}</span>
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold border ${
                  isFalseOnsetDetected
                    ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isFalseOnsetDetected ? 'FALSE ONSET DETECTED' : 'PERSISTENT ONSET SURGE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5">
              Hydrometeorological diagnosis identifying transient onset-like rainfall followed by elevated dry-spell hazard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <DataSourceBadge source="IMD-CRIDA Diagnostic Suite" type="model" size="sm" />
          <button
            onClick={() => setShowThresholdConfig(!showThresholdConfig)}
            className="p-1.5 rounded-xs border border-[#1E354D] bg-[#071324] hover:bg-[#0B1F33] text-slate-300 transition-colors"
            title="Inspect / Configure Service Thresholds"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#38BDF8]" />
          </button>
        </div>
      </div>


      <div className="p-4 sm:p-5 space-y-4">
        {/* Core Inputs Row */}
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1.5">
            Diagnostic Meteorological Inputs (Evaluated by FalseOnsetService):
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Input 1: Onset Probability */}
            <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Onset Probability
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {inputs.onsetProbability}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  (Trigger ≥ {thresholdsUsed.minOnsetProbabilityForTrigger}%)
                </span>
              </div>
            </div>

            {/* Input 2: Rainfall Persistence */}
            <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Rainfall Persistence
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {inputs.rainfallPersistenceDays}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  Days &ge; 2.5mm
                </span>
              </div>
            </div>

            {/* Input 3: Dry-Spell Probability */}
            <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Dry-Spell Probability
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-bold font-mono ${
                    inputs.drySpellProbability >= thresholdsUsed.highDrySpellProbabilityThreshold
                      ? 'text-[#F87171]'
                      : inputs.drySpellProbability >= thresholdsUsed.moderateDrySpellProbabilityThreshold
                      ? 'text-[#FCD34D]'
                      : 'text-[#4ADE80]'
                  }`}
                >
                  {inputs.drySpellProbability}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  (Subsequent 7d)
                </span>
              </div>
            </div>

            {/* Input 4: Forecast Horizon */}
            <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                Forecast Horizon
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {inputs.forecastHorizonDays}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  Days Lead Time
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Required Official Explanation Banner */}
        <div
          className={`rounded-md border p-3.5 flex items-start gap-2.5 ${style.bannerBg}`}
        >
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider block">
              Diagnostic Meteorological Synthesis:
            </span>
            <p className="text-xs font-sans font-semibold leading-relaxed">
              "{explanation}"
            </p>
          </div>
        </div>

        {/* 4 Required Information Displays */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* Expected Window */}
          <div className="p-3.5 rounded-md bg-[#071324] border border-[#1E354D] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200 uppercase">
              <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Expected Window</span>
            </div>
            <div className="text-sm font-bold font-mono text-[#38BDF8]">
              {expectedWindow.windowLabel}
            </div>
            <span className="text-[11px] text-slate-400 font-mono block">
              Estimated dry spell pulse duration: {expectedWindow.durationDays} consecutive days.
            </span>
          </div>

          {/* Affected Blocks */}
          <div className="p-3.5 rounded-md bg-[#071324] border border-[#1E354D] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200 uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#F87171]" />
              <span>Affected Blocks ({affectedBlocks.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {affectedBlocks.map((b) => (
                <span
                  key={b}
                  className="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-[#0B1F33] border border-[#1E354D] text-slate-200 font-medium"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div className="p-3.5 rounded-md bg-[#071324] border border-[#1E354D] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200 uppercase">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Diagnostic Confidence</span>
              </div>
              <span className="text-[#4ADE80] bg-emerald-950/60 px-2 py-0.5 rounded-xs border border-emerald-500/40">
                {confidence.score}% [{confidence.tier}]
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {confidence.basis}
            </p>
          </div>
        </div>

        {/* Recommended Action Directive */}
        <div className="p-3.5 rounded-md bg-amber-950/50 border border-amber-500/40 space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-[#FCD34D] block">
            Recommended Agronomic Action Directive:
          </span>
          <p className="text-xs text-amber-200 font-semibold leading-relaxed font-sans">
            {recommendedAction}
          </p>
        </div>

        {/* Diagnostic Criteria Breakdown */}
        <div className="space-y-2 pt-1 border-t border-[#1E354D]">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
            4 IMD/CRIDA Diagnostic Verification Criteria:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {diagnosticCriteria.map((crit) => (
              <div
                key={crit.id}
                className={`p-2.5 rounded-xs border flex items-start gap-2.5 text-xs font-mono ${
                  crit.isTriggered
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {crit.isTriggered ? (
                  <AlertTriangle className="w-4 h-4 text-[#FCD34D] shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[11px] text-white">{crit.name}</span>
                    <span className="text-[10px] opacity-80">
                      [{crit.currentValueLabel}]
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    {crit.scientificBasis} (Threshold: {crit.thresholdLabel})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configurable Thresholds Inspector Panel */}
        {showThresholdConfig && (
          <div className="p-4 rounded-md bg-[#071324] text-white space-y-3 font-mono text-xs border border-[#1E354D]">
            <div className="flex items-center justify-between border-b border-[#1E354D] pb-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#38BDF8]" />
                <span className="font-bold uppercase tracking-wider text-white">
                  Active Service Thresholds (Configurable via FalseOnsetService)
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                src/services/falseOnsetService.ts
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block">Min Onset Trigger:</span>
                <span className="font-bold text-[#38BDF8]">
                  ≥ {thresholdsUsed.minOnsetProbabilityForTrigger}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">High Dry Spell Threshold:</span>
                <span className="font-bold text-[#F87171]">
                  ≥ {thresholdsUsed.highDrySpellProbabilityThreshold}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Moderate Dry Spell Threshold:</span>
                <span className="font-bold text-[#FCD34D]">
                  ≥ {thresholdsUsed.moderateDrySpellProbabilityThreshold}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Max Rain Persistence:</span>
                <span className="font-bold text-white">
                  ≤ {thresholdsUsed.maxRainfallPersistenceForFalseOnset} Days
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Tropospheric Moisture (PWV):</span>
                <span className="font-bold text-[#4ADE80]">
                  ≥ {thresholdsUsed.troposphericMoistureThresholdMm} mm
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">850 hPa LLJ Reversal:</span>
                <span className="font-bold text-[#4ADE80]">
                  ≥ {thresholdsUsed.zonalWindReversalKnots} Knots
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#1E354D] bg-[#071324] text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>Evaluated by: {metadata.serviceName}</span>
        <span>Version: {metadata.modelVersion}</span>
      </div>
    </div>
  );
}
