import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import type { DailyRainfallPoint } from '../../types/overview';
import { cn } from '../../utils/cn';

interface FourteenDayRainfallChartProps {
  data: DailyRainfallPoint[];
}

// Custom institutional tooltip
const CustomRainfallTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload as DailyRainfallPoint;
    const diff = point.forecastRainfallMm - point.normalBaselineMm;
    return (
      <div className="rounded-lg border border-[#1E354D] bg-[#071324]/95 backdrop-blur-md p-3 shadow-command-panel text-xs font-mono space-y-1.5 z-50 text-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#1E354D] pb-1.5">
          <span className="font-bold text-white">{point.displayDate} (2026)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 font-semibold">
            {point.probabilityPercent}% PROB
          </span>
        </div>
        <div className="space-y-1 text-slate-200">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Observed/Forecast:</span>
            <span className="font-bold text-[#38BDF8]">{point.forecastRainfallMm.toFixed(1)} mm</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">IMD Normal Baseline:</span>
            <span className="font-semibold text-[#FCD34D]">{point.normalBaselineMm.toFixed(1)} mm</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Departure:</span>
            <span className={cn('font-bold', diff >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]')}>
              {diff >= 0 ? `+${diff.toFixed(1)} mm` : `${diff.toFixed(1)} mm`}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-[11px] text-slate-400">
            <span>Ensemble Spread:</span>
            <span>{point.lowerConfidenceMm.toFixed(1)} - {point.upperConfidenceMm.toFixed(1)} mm</span>
          </div>
        </div>
        <div className="pt-1 border-t border-[#1E354D] text-[10px] text-[#4ADE80] font-semibold">
          Weather Condition: {point.weatherCondition}
        </div>
      </div>
    );
  }
  return null;
};

export function FourteenDayRainfallChart({ data }: FourteenDayRainfallChartProps) {
  const [horizon, setHorizon] = useState<'7D' | '14D' | '30D'>('14D');

  // Filter or project data points based on selected horizon
  const displayData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (horizon === '7D') {
      return data.slice(0, 7);
    }
    if (horizon === '14D') {
      return data.slice(0, 14);
    }
    // For 30D, extrapolate or repeat baseline if 30 points aren't fully populated
    if (data.length >= 30) return data.slice(0, 30);
    const extended = [...data];
    while (extended.length < 30) {
      const idx = extended.length;
      const base = data[idx % data.length];
      extended.push({
        ...base,
        date: `2026-06-${String(idx + 1).padStart(2, '0')}`,
        displayDate: `D+${idx + 1}`,
      });
    }
    return extended;

  }, [data, horizon]);

  // Cumulative totals for the active horizon
  const totalForecast = useMemo(() => {
    return displayData.reduce((acc, p) => acc + p.forecastRainfallMm, 0);
  }, [displayData]);

  const totalNormal = useMemo(() => {
    return displayData.reduce((acc, p) => acc + p.normalBaselineMm, 0);
  }, [displayData]);

  const anomalyPct = totalNormal > 0 ? ((totalForecast - totalNormal) / totalNormal) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Horizon Controls & Anomaly Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#1E354D] text-xs">
        <div className="flex items-center gap-3 font-mono">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            {horizon} Horizon Total:
          </span>
          <span className="font-bold text-[#38BDF8] text-sm">
            {totalForecast.toFixed(1)} mm
          </span>
          <span className="text-slate-500">vs</span>
          <span className="text-slate-300 font-medium">
            {totalNormal.toFixed(1)} mm (LPA)
          </span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-xs font-bold text-[10px]',
              anomalyPct >= 0
                ? 'bg-emerald-950/60 text-[#4ADE80] border border-emerald-500/40'
                : 'bg-rose-950/60 text-[#F87171] border border-rose-500/40'
            )}
          >
            {anomalyPct >= 0 ? `+${anomalyPct.toFixed(1)}%` : `${anomalyPct.toFixed(1)}%`}
          </span>
        </div>

        {/* 7 DAY | 14 DAY | 30 DAY Controls */}
        <div className="flex items-center gap-1 bg-[#071324] p-0.5 rounded-xs border border-[#1E354D]">
          {(['7D', '14D', '30D'] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHorizon(h)}
              className={cn(
                'px-2.5 py-1 rounded-xs font-mono text-[11px] font-bold transition-all',
                horizon === h
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              )}
            >
              {h === '7D' ? '7 DAY' : h === '14D' ? '14 DAY' : '30 DAY'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={displayData}
            margin={{ top: 10, right: 12, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E354D" />
            
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#1E354D' }}
            />
            
            <YAxis
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              unit=" mm"
            />

            <Tooltip content={<CustomRainfallTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: '#94A3B8', paddingBottom: '8px' }}
            />

            {/* Reference line for 2.5mm IMD Rainy Day Threshold */}
            <ReferenceLine
              y={2.5}
              stroke="#EF4444"
              strokeDasharray="4 4"
              label={{
                value: 'Rainy Day (≥2.5mm)',
                position: 'insideTopRight',
                fill: '#F87171',
                fontSize: 10,
                fontFamily: 'JetBrains Mono',
              }}
            />

            {/* Forecasted Daily Rainfall Bars */}
            <Bar
              dataKey="forecastRainfallMm"
              name="Observed / Forecast Rain (mm)"
              fill="#38BDF8"
              radius={[3, 3, 0, 0]}
              maxBarSize={horizon === '30D' ? 14 : 26}
            />

            {/* Normal Climatology Line */}
            <Line
              type="monotone"
              dataKey="normalBaselineMm"
              name="IMD Normal Baseline (LPA)"
              stroke="#FCD34D"
              strokeWidth={2}
              dot={{ r: horizon === '30D' ? 1.5 : 2.5, fill: '#FCD34D' }}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

