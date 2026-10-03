import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { ChartContainer } from '../design-system/ChartContainer';
import { DataSourceBadge } from '../design-system/DataSourceBadge';
import type { ClimateTimelinePoint } from '../../types/climate';

export interface ClimateTimelineChartProps {
  timeline: ClimateTimelinePoint[];
  isLoading?: boolean;
}

const CustomClimateTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const point: ClimateTimelinePoint = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="bg-[#0B1F33] text-white p-3 rounded-md shadow-xl border border-[#1E354D] text-xs max-w-xs space-y-1.5 font-mono">
      <div className="flex items-center justify-between border-b border-[#1E354D] pb-1.5">
        <span className="font-bold text-white">
          {point.month}
        </span>
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-xs uppercase ${
            point.isForecastProjection
              ? 'bg-[#FDF7EB] text-[#8C5D00]'
              : 'bg-[#EDF6FC] text-[#0C4E83]'
          }`}
        >
          {point.isForecastProjection ? 'Model Projection' : 'Observed'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
        <span className="text-[#A3B4C8]">Niño 3.4 Anomaly:</span>
        <span className="font-bold text-right text-[#439EE0]">
          {point.nino34Anomaly > 0 ? `+${point.nino34Anomaly.toFixed(2)}` : point.nino34Anomaly.toFixed(2)} °C
        </span>

        <span className="text-[#A3B4C8]">IOD DMI Anomaly:</span>
        <span className="font-bold text-right text-[#79BF9B]">
          {point.iodDmiAnomaly > 0 ? `+${point.iodDmiAnomaly.toFixed(2)}` : point.iodDmiAnomaly.toFixed(2)} °C
        </span>

        <span className="text-[#A3B4C8]">MJO Dominant:</span>
        <span className="text-right text-[#F4D79C]">
          {point.mjoPhase}
        </span>

        {point.koraputRainfallDeparturePercent !== undefined && (
          <>
            <span className="text-[#A3B4C8]">Koraput Rainfall Departure:</span>
            <span
              className={`text-right font-bold ${
                point.koraputRainfallDeparturePercent >= 0 ? 'text-[#79BF9B]' : 'text-[#E27673]'
              }`}
            >
              {point.koraputRainfallDeparturePercent > 0 ? '+' : ''}
              {point.koraputRainfallDeparturePercent.toFixed(1)}%
            </span>
          </>
        )}
      </div>

      <div className="pt-1.5 border-t border-[#1E354D]/60 text-[10px] text-[#CBD5E1]">
        <span className="text-[#A3B4C8]">Influence:</span> {point.dominantInfluence}
      </div>
    </div>
  );
};

export function ClimateTimelineChart({
  timeline,
  isLoading = false,
}: ClimateTimelineChartProps) {
  return (
    <ChartContainer
      title="Climate Signal Timeline & Sub-Seasonal Projection"
      subtitle="Multi-month trajectory of equatorial SST anomalies (Niño 3.4 & IOD DMI) mapped against Koraput rainfall departures."
      unit="SST Anomaly °C / % Departure"
      height={320}
      isLoading={isLoading}
      toolbar={
        <div className="flex items-center gap-2">
          <DataSourceBadge
            source="NOAA CPC & BoM ACCESS-S2 S2S Ensemble"
            type="model"
            size="sm"
          />
        </div>
      }
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#38BDF8] rounded-xs" />
              <span className="text-white font-bold">Niño 3.4 (°C)</span>
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#4ADE80] rounded-xs" />
              <span className="text-white font-bold">IOD DMI (°C)</span>
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#0284C7] rounded-xs" />
              <span className="text-slate-300">Koraput Rainfall Departure (%)</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Dashed boundary separates observations from model projections
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1">
          <span>Teleconnection evolution: May 2026 to Dec 2026.</span>
          <span className="text-slate-300 font-medium">
            Oct–Dec curves represent multi-model seasonal coupled forecasts (NOAA NMME / ECMWF SEAS5)
          </span>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={timeline}
          margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" vertical={false} />
          
          <XAxis
            dataKey="displayMonth"
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            stroke="#1E354D"
          />
          
          <YAxis
            yAxisId="sst"
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            stroke="#1E354D"
            domain={[-1.0, 1.0]}
            ticks={[-0.8, -0.4, 0, 0.4, 0.8]}
          />

          <YAxis
            yAxisId="departure"
            orientation="right"
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            stroke="#1E354D"
            domain={[-20, 20]}
            ticks={[-15, -10, -5, 0, 5, 10, 15]}
          />

          <Tooltip content={<CustomClimateTooltip />} />

          {/* Zero Line */}
          <ReferenceLine yAxisId="sst" y={0} stroke="#1E354D" />

          {/* Reference Line separating observed from forecast projection (between Sep and Oct) */}
          <ReferenceLine
            yAxisId="sst"
            x="Sep"
            stroke="#F59E0B"
            strokeDasharray="4 4"
            label={{
              value: 'Projection Horizon →',
              position: 'insideTopRight',
              fill: '#FCD34D',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          />

          {/* Koraput Departure Bar */}
          <Bar
            yAxisId="departure"
            dataKey="koraputRainfallDeparturePercent"
            fill="#1E354D"
            radius={[2, 2, 0, 0]}
            maxBarSize={22}
            name="Koraput Rainfall Departure"
          >
            {timeline.map((entry, index) => (
              <Cell
                key={`cell-time-${index}`}
                fill={
                  entry.isForecastProjection
                    ? '#0284C7'
                    : (entry.koraputRainfallDeparturePercent || 0) >= 0
                    ? '#38BDF8'
                    : '#F59E0B'
                }
                opacity={entry.isForecastProjection ? 0.5 : 0.85}
              />
            ))}
          </Bar>

          {/* Niño 3.4 Line */}
          <Line
            yAxisId="sst"
            type="monotone"
            dataKey="nino34Anomaly"
            stroke="#38BDF8"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#38BDF8' }}
            name="Niño 3.4 SST"
          />

          {/* IOD DMI Line */}
          <Line
            yAxisId="sst"
            type="monotone"
            dataKey="iodDmiAnomaly"
            stroke="#4ADE80"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#4ADE80' }}
            name="IOD DMI"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
