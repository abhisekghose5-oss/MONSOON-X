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

  // Output level styling
  const outputStyles = {
    LOW: {
      bg: 'bg-[#EDF7F1]',
      text: 'text-[#154D2F]',
      border: 'border-[#ABD7C0]',
      badgeBg: 'bg-[#247A4A] text-white',
      borderTop: 'border-t-[#247A4A]',
      icon: ShieldCheck,
      bannerBg: 'bg-[#EDF7F1] border-[#ABD7C0] text-[#154D2F]',
    },
    MODERATE: {
      bg: 'bg-[#FDF7EB]',
      text: 'text-[#8C5D00]',
      border: 'border-[#F4D79C]',
      badgeBg: 'bg-[#D99000] text-white',
      borderTop: 'border-t-[#D99000]',
      icon: AlertTriangle,
      bannerBg: 'bg-[#FDF7EB] border-[#F4D79C] text-[#8C5D00]',
    },
    HIGH: {
      bg: 'bg-[#FCEDEC]',
      text: 'text-[#802626]',
      border: 'border-[#EEA9A7]',
      badgeBg: 'bg-[#C43D3D] text-white',
      borderTop: 'border-t-[#C43D3D]',
      icon: AlertOctagon,
      bannerBg: 'bg-[#FCEDEC] border-[#EEA9A7] text-[#802626]',
    },
  };

  const style = outputStyles[riskLevel];
  const OutputIcon = style.icon;

  return (
    <div
      className={`rounded-md border border-[#E2E8F0] border-t-4 ${style.borderTop} bg-white shadow-gov-card overflow-hidden space-y-0 ${className}`}
    >
      {/* Header Bar */}
      <div className="px-4 py-3.5 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-sm ${style.badgeBg} shrink-0`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-sm lg:text-base font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
                FALSE ONSET WATCH
              </h2>
              {/* Output Level Badge (LOW / MODERATE / HIGH) */}
              <span
                className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-sm border uppercase shadow-xs flex items-center gap-1.5 ${style.badgeBg}`}
              >
                <OutputIcon className="w-3.5 h-3.5" />
                <span>RISK LEVEL: {riskLevel}</span>
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.2 rounded-xs font-bold border ${
                  isFalseOnsetDetected
                    ? 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]'
                    : 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]'
                }`}
              >
                {isFalseOnsetDetected ? 'FALSE ONSET DETECTED' : 'PERSISTENT ONSET SURGE'}
              </span>
              {metadata.isDemoModelOutput && (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-xs bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] font-semibold">
                  DEMO MODEL OUTPUT
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
              Hydrometeorological diagnosis identifying transient onset-like rainfall followed by elevated dry-spell hazard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <DataSourceBadge source="IMD-CRIDA Diagnostic Suite" type="model" size="sm" />
          <button
            onClick={() => setShowThresholdConfig(!showThresholdConfig)}
            className="p-1.5 rounded-sm border border-[#CBD5E1] bg-white hover:bg-[#F5F7FA] text-[#4B5B6D] transition-colors"
            title="Inspect / Configure Service Thresholds"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1479C9]" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Core Inputs Row */}
        <div>
          <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block mb-1.5">
            Diagnostic Meteorological Inputs (Evaluated by FalseOnsetService):
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Input 1: Onset Probability */}
            <div className="p-3 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                Onset Probability
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#0B1F33]">
                  {inputs.onsetProbability}%
                </span>
                <span className="text-[10px] font-mono text-[#6E7F94]">
                  (Threshold ≥ {thresholdsUsed.minOnsetProbabilityForTrigger}%)
                </span>
              </div>
            </div>

            {/* Input 2: Rainfall Persistence */}
            <div className="p-3 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                Rainfall Persistence
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#0B1F33]">
                  {inputs.rainfallPersistenceDays}
                </span>
                <span className="text-xs font-mono font-medium text-[#6E7F94]">
                  Days &ge; 2.5mm
                </span>
              </div>
            </div>

            {/* Input 3: Dry-Spell Probability */}
            <div className="p-3 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                Dry-Spell Probability
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-bold font-mono ${
                    inputs.drySpellProbability >= thresholdsUsed.highDrySpellProbabilityThreshold
                      ? 'text-[#C43D3D]'
                      : inputs.drySpellProbability >= thresholdsUsed.moderateDrySpellProbabilityThreshold
                      ? 'text-[#D99000]'
                      : 'text-[#247A4A]'
                  }`}
                >
                  {inputs.drySpellProbability}%
                </span>
                <span className="text-[10px] font-mono text-[#6E7F94]">
                  (Subsequent 7d)
                </span>
              </div>
            </div>

            {/* Input 4: Forecast Horizon */}
            <div className="p-3 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
                Forecast Horizon
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#0B1F33]">
                  {inputs.forecastHorizonDays}
                </span>
                <span className="text-xs font-mono font-medium text-[#6E7F94]">
                  Days Lead Time
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Required Official Explanation Banner */}
        <div
          className={`rounded-sm border p-3.5 flex items-start gap-2.5 ${style.bannerBg}`}
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
          <div className="p-3.5 rounded-sm bg-white border border-[#CBD5E1] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0B1F33] uppercase">
              <Calendar className="w-3.5 h-3.5 text-[#1479C9]" />
              <span>Expected Window</span>
            </div>
            <div className="text-sm font-bold font-mono text-[#0B1F33]">
              {expectedWindow.windowLabel}
            </div>
            <span className="text-[11px] text-[#6E7F94] font-mono block">
              Estimated dry spell pulse duration: {expectedWindow.durationDays} consecutive days.
            </span>
          </div>

          {/* Affected Blocks */}
          <div className="p-3.5 rounded-sm bg-white border border-[#CBD5E1] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0B1F33] uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#C43D3D]" />
              <span>Affected Blocks ({affectedBlocks.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {affectedBlocks.map((b) => (
                <span
                  key={b}
                  className="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-[#EAF0F6] border border-[#CBD5E1] text-[#0B1F33] font-medium"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div className="p-3.5 rounded-sm bg-white border border-[#CBD5E1] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0B1F33] uppercase">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#247A4A]" />
                <span>Diagnostic Confidence</span>
              </div>
              <span className="text-[#247A4A] bg-[#EDF7F1] px-1.5 py-0.2 rounded-xs border border-[#ABD7C0]">
                {confidence.score}% [{confidence.tier}]
              </span>
            </div>
            <p className="text-xs text-[#4B5B6D] leading-relaxed">
              {confidence.basis}
            </p>
          </div>
        </div>

        {/* Recommended Action Directive */}
        <div className="p-3.5 rounded-sm bg-[#FDF7EB] border border-[#F4D79C] space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-[#8C5D00] block">
            Recommended Agronomic Action Directive:
          </span>
          <p className="text-xs text-[#8C5D00] font-semibold leading-relaxed font-sans">
            {recommendedAction}
          </p>
        </div>

        {/* Diagnostic Criteria Breakdown */}
        <div className="space-y-2 pt-1 border-t border-[#F0F3F7]">
          <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
            4 IMD/CRIDA Diagnostic Verification Criteria:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {diagnosticCriteria.map((crit) => (
              <div
                key={crit.id}
                className={`p-2.5 rounded-xs border flex items-start gap-2.5 text-xs font-mono ${
                  crit.isTriggered
                    ? 'bg-[#FCEDEC]/50 border-[#EEA9A7] text-[#802626]'
                    : 'bg-[#EDF7F1]/60 border-[#ABD7C0] text-[#154D2F]'
                }`}
              >
                {crit.isTriggered ? (
                  <AlertTriangle className="w-4 h-4 text-[#D99000] shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#247A4A] shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[11px]">{crit.name}</span>
                    <span className="text-[10px] opacity-80">
                      [{crit.currentValueLabel}]
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6E7F94] block leading-tight">
                    {crit.scientificBasis} (Threshold: {crit.thresholdLabel})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configurable Thresholds Inspector Panel */}
        {showThresholdConfig && (
          <div className="p-4 rounded-sm bg-[#0B1F33] text-white space-y-3 font-mono text-xs border border-[#1E354D]">
            <div className="flex items-center justify-between border-b border-[#1E354D] pb-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1479C9]" />
                <span className="font-bold uppercase tracking-wider text-white">
                  Active Service Thresholds (Configurable via FalseOnsetService)
                </span>
              </div>
              <span className="text-[10px] text-[#A3B4C8]">
                Thresholds isolated in src/services/falseOnsetService.ts
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
              <div>
                <span className="text-[#A3B4C8] block">Min Onset Trigger:</span>
                <span className="font-bold text-[#439EE0]">
                  ≥ {thresholdsUsed.minOnsetProbabilityForTrigger}%
                </span>
              </div>
              <div>
                <span className="text-[#A3B4C8] block">High Dry Spell Threshold:</span>
                <span className="font-bold text-[#E27673]">
                  ≥ {thresholdsUsed.highDrySpellProbabilityThreshold}%
                </span>
              </div>
              <div>
                <span className="text-[#A3B4C8] block">Moderate Dry Spell Threshold:</span>
                <span className="font-bold text-[#F4D79C]">
                  ≥ {thresholdsUsed.moderateDrySpellProbabilityThreshold}%
                </span>
              </div>
              <div>
                <span className="text-[#A3B4C8] block">Max Rain Persistence:</span>
                <span className="font-bold text-white">
                  ≤ {thresholdsUsed.maxRainfallPersistenceForFalseOnset} Days
                </span>
              </div>
              <div>
                <span className="text-[#A3B4C8] block">Tropospheric Moisture (PWV):</span>
                <span className="font-bold text-[#79BF9B]">
                  ≥ {thresholdsUsed.troposphericMoistureThresholdMm} mm
                </span>
              </div>
              <div>
                <span className="text-[#A3B4C8] block">850 hPa LLJ Reversal:</span>
                <span className="font-bold text-[#79BF9B]">
                  ≥ {thresholdsUsed.zonalWindReversalKnots} Knots
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#F0F3F7] bg-[#F5F7FA]/50 text-[11px] font-mono text-[#6E7F94] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>Evaluated by: {metadata.serviceName}</span>
        <span>Version: {metadata.modelVersion}</span>
      </div>
    </div>
  );
}
