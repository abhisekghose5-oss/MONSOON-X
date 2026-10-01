import React from 'react';
import type { HistoricalClimComparison, ForecastConfidenceMetrics } from '../../types/officer';
import { History, Gauge, TrendingUp, Calendar, ShieldCheck, Database } from 'lucide-react';

interface HistoricalAndConfidencePanelProps {
  historical: HistoricalClimComparison;
  confidence: ForecastConfidenceMetrics;
  className?: string;
}

export function HistoricalAndConfidencePanel({
  historical,
  confidence,
  className = '',
}: HistoricalAndConfidencePanelProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
      {/* 1. HISTORICAL CLIMATOLOGICAL COMPARISON */}
      <div className="bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xs bg-[#EAF0F6] text-[#1479C9]">
              <History className="w-4 h-4 text-[#1479C9]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
                HISTORICAL CLIMATOLOGICAL COMPARISON
              </h3>
              <span className="text-[11px] text-[#6E7F94] font-mono">
                IMD 55-Year Gridded Climatological Baseline (1970–2025)
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#F5F7FA] text-[#0B1F33] border border-[#CBD5E1]">
            IMD 0.25° GRID
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Onset Normal vs Predicted */}
          <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">
                IMD Baseline Normal Onset
              </span>
              <span className="font-bold text-sm text-[#0B1F33] font-mono block mt-0.5">
                {historical.climatologicalNormalOnsetDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">
                Current Predicted Onset
              </span>
              <span className="font-bold text-sm text-[#D99000] font-mono block mt-0.5">
                {historical.predictedOnsetDate} ({historical.onsetAnomalyDays > 0 ? `+${historical.onsetAnomalyDays}d Lag` : `${historical.onsetAnomalyDays}d Lead`})
              </span>
            </div>
          </div>

          {/* Decadal Shift Trend */}
          <div className="flex items-center justify-between p-2.5 rounded-xs bg-white border border-[#E2E8F0]">
            <span className="text-[#4B5B6D] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#1479C9]" />
              <span>Decadal Trend Onset Drift:</span>
            </span>
            <span className="font-mono font-bold text-[#802626]">
              {historical.decadalTrendOnsetShift}
            </span>
          </div>

          {/* Historical Dry Spell Frequency */}
          <div className="flex items-center justify-between p-2.5 rounded-xs bg-white border border-[#E2E8F0]">
            <span className="text-[#4B5B6D] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D99000]" />
              <span>July Dry Spell Climatology:</span>
            </span>
            <span className="font-mono font-bold text-[#0B1F33]">
              {historical.historicalDrySpellFreqJuly}
            </span>
          </div>

          {/* Analogous Clim Years */}
          <div className="p-2.5 rounded-xs bg-[#F5F7FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-[#6E7F94] block">
              Analogous Climatological Seasons (Similar Synoptic Setup):
            </span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {historical.analogousClimYears.map((yr, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[10px] px-2 py-0.5 rounded-xs bg-white border border-[#CBD5E1] text-[#0B1F33]"
                >
                  {yr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORECAST CONFIDENCE & ENSEMBLE METRICS */}
      <div className="bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xs bg-[#EDF7F1] text-[#154D2F]">
              <Gauge className="w-4 h-4 text-[#247A4A]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
                FORECAST CONFIDENCE & ENSEMBLE METRICS
              </h3>
              <span className="text-[11px] text-[#6E7F94] font-mono">
                Operational verification against WMO & IMD standards
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#247A4A] text-white">
            {confidence.leadTimeReliabilityTier}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {/* 3 Metric Mini Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] text-center">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">
                Model Confidence
              </span>
              <span className="text-xl font-black font-mono text-[#1479C9] block mt-1">
                {confidence.modelConfidenceScore}%
              </span>
            </div>

            <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] text-center">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">
                Ensemble Spread
              </span>
              <span className="text-xl font-black font-mono text-[#0B1F33] block mt-1">
                ±{confidence.uncertaintySpreadDays}d
              </span>
            </div>

            <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] text-center">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] block">
                Brier Skill Score
              </span>
              <span className="text-xl font-black font-mono text-[#247A4A] block mt-1">
                {confidence.brierSkillScore}
              </span>
            </div>
          </div>

          {/* Ensemble Agreement Bar */}
          <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-[#4B5B6D]">Coupled Ensemble Agreement:</span>
              <span className="font-bold text-[#0B1F33]">{confidence.ensembleAgreementPercent}% (NCUM + ECMWF + GFS)</span>
            </div>
            <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1479C9] rounded-full"
                style={{ width: `${confidence.ensembleAgreementPercent}%` }}
              />
            </div>
          </div>

          {/* Telemetry Ingestion Latency */}
          <div className="flex items-center justify-between p-2.5 rounded-xs bg-white border border-[#E2E8F0]">
            <span className="text-[#4B5B6D] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#6E7F94]" />
              <span>Assimilation Latency:</span>
            </span>
            <span className="font-mono font-bold text-[#154D2F] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#247A4A]" />
              <span>{confidence.dataFeedLatency}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
