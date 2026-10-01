import React from 'react';
import type { ForecastTimelinePoint } from '../../types/forecast';
import { MetricCard } from '../design-system/MetricCard';
import { CloudRain, AlertTriangle, Droplets, Gauge } from 'lucide-react';

export interface ForecastHorizonMetricsProps {
  timeline: ForecastTimelinePoint[];
  horizonDays: number;
}

export function ForecastHorizonMetrics({
  timeline,
  horizonDays,
}: ForecastHorizonMetricsProps) {
  // Compute key highlights from timeline
  const peakHeavyRain = timeline.reduce(
    (max, p) => (p.heavyRainProbability > max.heavyRainProbability ? p : max),
    timeline[0] || { heavyRainProbability: 0, displayDate: '--', day: 0 }
  );

  const peakBreak = timeline.reduce(
    (max, p) => (p.breakProbability > max.breakProbability ? p : max),
    timeline[0] || { breakProbability: 0, displayDate: '--', day: 0 }
  );

  const totalExpectedRain = timeline.reduce((sum, p) => sum + p.expectedRainfallMm, 0);

  const avgConfidence = Math.round(
    timeline.reduce((sum, p) => sum + p.confidenceScore, 0) / (timeline.length || 1)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Peak Heavy Rain Probability */}
      <MetricCard
        title="Peak Heavy Rain Risk"
        value={`${peakHeavyRain.heavyRainProbability}%`}
        status={peakHeavyRain.heavyRainProbability >= 65 ? 'risk' : 'monsoon'}
        icon={CloudRain}
        baselineText={`Max probability on ${peakHeavyRain.displayDate} (Day +${peakHeavyRain.day})`}
        caption="Ensemble threshold: > 50 mm / 24h"
      />

      {/* 2. Peak Break Probability */}
      <MetricCard
        title="Max Dry Spell Hazard"
        value={`${peakBreak.breakProbability}%`}
        status={peakBreak.breakProbability >= 60 ? 'warning' : 'normal'}
        icon={AlertTriangle}
        baselineText={`Highest dry spell risk on ${peakBreak.displayDate} (Day +${peakBreak.day})`}
        caption="Synoptic monsoon break signal"
      />

      {/* 3. Expected Horizon Accumulation */}
      <MetricCard
        title={`${horizonDays}-Day Expected Rain`}
        value={totalExpectedRain.toFixed(1)}
        unit="mm"
        status="monsoon"
        icon={Droplets}
        baselineText={`Downscaled QPF mean over ${horizonDays} days`}
        caption="Bias-corrected ensemble total"
      />

      {/* 4. Mean Ensemble Skill */}
      <MetricCard
        title="Mean Ensemble Skill"
        value={`${avgConfidence}%`}
        status={avgConfidence >= 75 ? 'agriculture' : avgConfidence >= 60 ? 'normal' : 'warning'}
        icon={Gauge}
        baselineText={`Reliability score over ${horizonDays}-day horizon`}
        caption="Laplace error distribution"
      />
    </div>
  );
}
