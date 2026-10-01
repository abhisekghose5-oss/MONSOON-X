import React from 'react';
import type { TaskPerformanceMetrics } from '../../types/modelPerformance';
import { Target, CheckCircle2, Gauge, Activity, Percent, Crosshair, Clock } from 'lucide-react';

interface PerformanceMetricsCardsProps {
  metrics: TaskPerformanceMetrics;
  className?: string;
}

export function PerformanceMetricsCards({ metrics, className = '' }: PerformanceMetricsCardsProps) {
  // Helper to render metric or "Awaiting model evaluation"
  const renderMetricValue = (
    val: number | null,
    format: 'decimal' | 'percent' | 'raw' = 'decimal',
    suffix = ''
  ) => {
    if (val === null || metrics.evaluationStatus === 'awaiting') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D99000] bg-[#FDF7EB] px-2 py-1 rounded border border-[#F4D79C]">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Awaiting model evaluation</span>
        </div>
      );
    }

    let displayStr = '';
    if (format === 'percent') {
      displayStr = `${(val * 100).toFixed(1)}%`;
    } else if (format === 'decimal') {
      displayStr = val.toFixed(2);
    } else {
      displayStr = String(val);
    }

    return (
      <div className="flex items-baseline gap-1">
        <span className="text-2xl sm:text-3xl font-black font-mono text-[#0B1F33] tracking-tight">
          {displayStr}
        </span>
        {suffix && <span className="text-xs font-mono text-[#6E7F94] font-medium">{suffix}</span>}
      </div>
    );
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* 6 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* 1. ROC-AUC */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-3.5 shadow-gov-card border-t-3 border-t-[#1479C9] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              ROC-AUC
            </span>
            <Target className="w-4 h-4 text-[#1479C9]" />
          </div>
          <div>
            {renderMetricValue(metrics.rocAuc, 'decimal', '/ 1.00')}
            <span className="text-[10px] font-mono text-[#4B5B6D] block mt-1">
              Discrimination Skill (Random = 0.50)
            </span>
          </div>
        </div>

        {/* 2. Precision */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-3.5 shadow-gov-card border-t-3 border-t-[#247A4A] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              PRECISION
            </span>
            <Crosshair className="w-4 h-4 text-[#247A4A]" />
          </div>
          <div>
            {renderMetricValue(metrics.precision, 'percent')}
            <span className="text-[10px] font-mono text-[#4B5B6D] block mt-1">
              Positive Predictive Reliability
            </span>
          </div>
        </div>

        {/* 3. Recall */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-3.5 shadow-gov-card border-t-3 border-t-[#247A4A] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              RECALL
            </span>
            <Percent className="w-4 h-4 text-[#247A4A]" />
          </div>
          <div>
            {renderMetricValue(metrics.recall, 'percent')}
            <span className="text-[10px] font-mono text-[#4B5B6D] block mt-1">
              True Event Capture / Hit Rate
            </span>
          </div>
        </div>

        {/* 4. F1 Score */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-3.5 shadow-gov-card border-t-3 border-t-[#1479C9] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              F1 SCORE
            </span>
            <Activity className="w-4 h-4 text-[#1479C9]" />
          </div>
          <div>
            {renderMetricValue(metrics.f1, 'decimal')}
            <span className="text-[10px] font-mono text-[#4B5B6D] block mt-1">
              Harmonic Balance (P & R)
            </span>
          </div>
        </div>

        {/* 5. Brier Score */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-3.5 shadow-gov-card border-t-3 border-t-[#0B1F33] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              BRIER SCORE
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#0B1F33]" />
          </div>
          <div>
            {renderMetricValue(metrics.brierScore, 'decimal')}
            <span className="text-[10px] font-mono text-[#4B5B6D] block mt-1">
              Mean Probability Error (0 = Perfect)
            </span>
          </div>
        </div>

        {/* 6. Calibration ECE */}
        <div className="bg-white rounded-md border border-[#E2E8F0] p-3.5 shadow-gov-card border-t-3 border-t-[#D99000] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              CALIBRATION (ECE)
            </span>
            <Gauge className="w-4 h-4 text-[#D99000]" />
          </div>
          <div>
            {renderMetricValue(metrics.calibrationError, 'decimal', ' ECE')}
            <span className="text-[10px] font-mono text-[#4B5B6D] block mt-1">
              Slope: {metrics.calibrationSlope !== null ? metrics.calibrationSlope.toFixed(2) : '--'} (1.00 = Unbiased)
            </span>
          </div>
        </div>
      </div>

      {/* Verification Benchmark Context Line */}
      <div className="p-2.5 rounded-xs bg-[#F5F7FA] border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#4B5B6D]">
        <span>
          Verification Sample Size: <strong className="text-[#0B1F33]">{metrics.sampleCount ? `${metrics.sampleCount} Historical Seasons / Events` : 'Pending Assimilation'}</strong>
        </span>
        <span>
          Window: <strong className="text-[#0B1F33]">{metrics.testWindow}</strong> · Baseline: <strong className="text-[#0B1F33]">{metrics.benchmarkBaseline}</strong>
        </span>
      </div>
    </div>
  );
}
