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
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 text-white ${className}`}>
      {/* 1. HISTORICAL CLIMATOLOGICAL COMPARISON */}
      <div className="bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] shadow-command-panel p-4 space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#1E354D] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-sm bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40">
              <History className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                HISTORICAL CLIMATOLOGICAL COMPARISON
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                IMD 55-Year Gridded Climatological Baseline (1970–2025)
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#071324] text-[#38BDF8] border border-[#1E354D]">
            IMD 0.25° GRID
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Onset Normal vs Predicted */}
          <div className="p-3 rounded-lg bg-[#071324]/90 border border-[#1E354D] grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                IMD Baseline Normal Onset
              </span>
              <span className="font-bold text-sm text-white font-mono block mt-0.5">
                {historical.climatologicalNormalOnsetDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Current Predicted Onset
              </span>
              <span className="font-bold text-sm text-amber-400 font-mono block mt-0.5">
                {historical.predictedOnsetDate} ({historical.onsetAnomalyDays > 0 ? `+${historical.onsetAnomalyDays}d Lag` : `${historical.onsetAnomalyDays}d Lead`})
              </span>
            </div>
          </div>

          {/* Decadal Shift Trend */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#071324]/60 border border-[#1E354D]">
            <span className="text-slate-300 flex items-center gap-1.5 font-mono text-[11px]">
              <TrendingUp className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Decadal Trend Onset Drift:</span>
            </span>
            <span className="font-mono font-bold text-rose-400">
              {historical.decadalTrendOnsetShift}
            </span>
          </div>

          {/* Historical Dry Spell Frequency */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#071324]/60 border border-[#1E354D]">
            <span className="text-slate-300 flex items-center gap-1.5 font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>July Dry Spell Climatology:</span>
            </span>
            <span className="font-mono font-bold text-white">
              {historical.historicalDrySpellFreqJuly}
            </span>
          </div>

          {/* Analogous Clim Years */}
          <div className="p-2.5 rounded-lg bg-[#071324]/60 border border-[#1E354D] space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
              Analogous Climatological Seasons (Similar Synoptic Setup):
            </span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {historical.analogousClimYears.map((yr, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[10px] px-2 py-0.5 rounded-xs bg-[#0B1F33] border border-[#1E354D] text-[#38BDF8] font-bold"
                >
                  {yr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORECAST CONFIDENCE & ENSEMBLE METRICS */}
      <div className="bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] shadow-command-panel p-4 space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#1E354D] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-sm bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
              <Gauge className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                FORECAST CONFIDENCE & ENSEMBLE METRICS
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Operational verification against WMO & IMD standards
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
            {confidence.leadTimeReliabilityTier}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {/* 3 Metric Mini Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg bg-[#071324]/90 border border-[#1E354D] text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Model Confidence
              </span>
              <span className="text-xl font-black font-mono text-[#38BDF8] block mt-1">
                {confidence.modelConfidenceScore}%
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071324]/90 border border-[#1E354D] text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Ensemble Spread
              </span>
              <span className="text-xl font-black font-mono text-white block mt-1">
                ±{confidence.uncertaintySpreadDays}d
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071324]/90 border border-[#1E354D] text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Brier Skill Score
              </span>
              <span className="text-xl font-black font-mono text-[#4ADE80] block mt-1">
                {confidence.brierSkillScore}
              </span>
            </div>
          </div>

          {/* Ensemble Agreement Bar */}
          <div className="p-3 rounded-lg bg-[#071324]/90 border border-[#1E354D] space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-slate-300">Coupled Ensemble Agreement:</span>
              <span className="font-bold text-[#38BDF8]">{confidence.ensembleAgreementPercent}% (NCUM + ECMWF + GFS)</span>
            </div>
            <div className="w-full h-2.5 bg-[#0A192F] border border-[#1E354D] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-full"
                style={{ width: `${confidence.ensembleAgreementPercent}%` }}
              />
            </div>
          </div>

          {/* Telemetry Ingestion Latency */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#071324]/60 border border-[#1E354D]">
            <span className="text-slate-300 flex items-center gap-1.5 font-mono text-[11px]">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Assimilation Latency:</span>
            </span>
            <span className="font-mono font-bold text-[#4ADE80] flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>{confidence.dataFeedLatency}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
