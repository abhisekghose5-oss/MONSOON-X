import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { ChartContainer } from '../design-system/ChartContainer';
import { DataSourceBadge } from '../design-system/DataSourceBadge';
import type { ForecastTimelinePoint } from '../../types/forecast';

export interface ForecastProbabilityChartProps {
  timeline: ForecastTimelinePoint[];
  horizonDays: number;
  isLoading?: boolean;
}

const CustomProbabilityTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const point: ForecastTimelinePoint = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="bg-[#0B1F33] text-white p-3 rounded-md shadow-xl border border-[#1E354D] text-xs max-w-xs space-y-2 font-mono">
      <div className="flex items-center justify-between border-b border-[#1E354D] pb-1.5">
        <span className="font-bold text-white">
          Lead Day +{point.day} · {point.displayDate} ({point.dayOfWeek})
        </span>
        <span className="text-[10px] text-[#A3B4C8]">
          Skill: {point.confidenceScore}%
        </span>
      </div>

      <div className="space-y-1.5 text-[11px]">
        {/* Onset Probability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1479C9]" />
            <span className="text-[#CBD5E1]">Onset Probability:</span>
          </div>
          <span className="font-bold text-[#439EE0]">{point.onsetProbability}%</span>
        </div>

        {/* Break Probability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D99000]" />
            <span className="text-[#CBD5E1]">Break / Dry Spell:</span>
          </div>
          <span className="font-bold text-[#F4D79C]">{point.breakProbability}%</span>
        </div>

        {/* Heavy Rain Probability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C43D3D]" />
            <span className="text-[#CBD5E1]">Heavy Rain (&gt; 50mm):</span>
          </div>
          <span className="font-bold text-[#EEA9A7]">{point.heavyRainProbability}%</span>
        </div>
      </div>

      <div className="pt-1.5 border-t border-[#1E354D]/60 grid grid-cols-2 gap-x-2 text-[10px] text-[#A3B4C8]">
        <div>
          <span>Uncertainty Spread:</span>
          <span className="block font-semibold text-white">
            {point.uncertaintyBand.lowerBound}% – {point.uncertaintyBand.upperBound}%
          </span>
        </div>
        <div className="text-right">
          <span>Expected Precip:</span>
          <span className="block font-semibold text-[#79BF9B]">
            ~{point.expectedRainfallMm.toFixed(1)} mm
          </span>
        </div>
      </div>
    </div>
  );
};

export function ForecastProbabilityChart({
  timeline,
  horizonDays,
  isLoading = false,
}: ForecastProbabilityChartProps) {
  const [showUncertainty, setShowUncertainty] = useState(true);

  // Compute processed data points with upper/lower uncertainty bounds for Area chart
  const processedData = timeline.map((p) => ({
    ...p,
    uncertaintySpread: [p.uncertaintyBand.lowerBound, p.uncertaintyBand.upperBound],
    uncertaintyRange: p.uncertaintyBand.upperBound - p.uncertaintyBand.lowerBound,
  }));

  return (
    <ChartContainer
      title="Hyperlocal Monsoon Probability Timeline"
      subtitle={`Ensemble probability trajectories over the next ${horizonDays} days for onset surges, synoptic breaks, and convective heavy rainfall.`}
      unit="Probability %"
      height={360}
      isLoading={isLoading}
      toolbar={
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-mono text-[#4B5B6D] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showUncertainty}
              onChange={(e) => setShowUncertainty(e.target.checked)}
              className="rounded-xs text-[#1479C9] focus:ring-0"
            />
            <span>Show Uncertainty Band (10th–90th %ile)</span>
          </label>
          <DataSourceBadge
            source="ECMWF IFS + GFS-T1534 Ensemble"
            type="model"
            size="sm"
          />
        </div>
      }
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-5 flex-wrap">
            {/* Series 1: Onset */}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#1479C9] rounded-xs" />
              <span className="text-[#0B1F33] font-bold">Onset Probability</span>
            </span>

            {/* Series 2: Break */}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#D99000] rounded-xs" />
              <span className="text-[#0B1F33] font-bold">Break / Dry Spell</span>
            </span>

            {/* Series 3: Heavy Rain */}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#C43D3D] rounded-xs" />
              <span className="text-[#0B1F33] font-bold">Heavy Rain (&gt; 50mm)</span>
            </span>

            {/* Shaded Uncertainty */}
            {showUncertainty && (
              <span className="flex items-center gap-1.5 text-[#6E7F94]">
                <span className="w-3 h-2 bg-[#1479C9]/15 border border-[#1479C9]/30 rounded-xs" />
                <span>Ensemble Dispersion Envelope</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[#6E7F94] text-[11px]">
            <span>Thresholds: 50% Advisory · 75% High Risk</span>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1">
          <span>
            Bayesian probability integration over 51-member ECMWF ensemble calibrated with SRTM 30m orography.
          </span>
          <span className="text-[#0B1F33] font-medium">
            Lead Horizon: +{horizonDays} Days ({timeline[0]?.displayDate} – {timeline[timeline.length - 1]?.displayDate})
          </span>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={processedData}
          margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="uncertaintyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1479C9" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#1479C9" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 10, fill: '#6E7F94', fontFamily: 'monospace' }}
            stroke="#CBD5E1"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6E7F94', fontFamily: 'monospace' }}
            stroke="#CBD5E1"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip content={<CustomProbabilityTooltip />} />

          {/* Reference Lines for Operational Thresholds */}
          <ReferenceLine
            y={75}
            stroke="#C43D3D"
            strokeDasharray="4 4"
            label={{
              value: '75% High Hazard Threshold',
              position: 'insideTopRight',
              fill: '#C43D3D',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          />
          <ReferenceLine
            y={50}
            stroke="#D99000"
            strokeDasharray="3 3"
            label={{
              value: '50% Advisory Threshold',
              position: 'insideTopLeft',
              fill: '#D99000',
              fontSize: 9,
              fontFamily: 'monospace',
            }}
          />

          {/* Uncertainty Band (Shaded Area between upper and lower bounds) */}
          {showUncertainty && (
            <Area
              type="monotone"
              dataKey="uncertaintyRange"
              baseValue="dataMin"
              stroke="transparent"
              fill="url(#uncertaintyGrad)"
              name="Ensemble Uncertainty"
            />
          )}

          {/* Prediction Series 1: Onset Probability */}
          <Line
            type="monotone"
            dataKey="onsetProbability"
            stroke="#1479C9"
            strokeWidth={2.5}
            dot={{ r: 2.5, fill: '#1479C9' }}
            activeDot={{ r: 5, fill: '#0B1F33' }}
            name="Onset Probability"
          />

          {/* Prediction Series 2: Break Probability */}
          <Line
            type="monotone"
            dataKey="breakProbability"
            stroke="#D99000"
            strokeWidth={2.5}
            dot={{ r: 2.5, fill: '#D99000' }}
            activeDot={{ r: 5, fill: '#8C5D00' }}
            name="Break Probability"
          />

          {/* Prediction Series 3: Heavy Rain Probability */}
          <Line
            type="monotone"
            dataKey="heavyRainProbability"
            stroke="#C43D3D"
            strokeWidth={2.5}
            dot={{ r: 2.5, fill: '#C43D3D' }}
            activeDot={{ r: 5, fill: '#802626' }}
            name="Heavy Rain Probability"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
