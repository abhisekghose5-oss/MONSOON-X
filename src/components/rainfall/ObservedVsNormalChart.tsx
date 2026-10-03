import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartContainer } from '../design-system/ChartContainer';
import type { CumulativeRainfallPoint } from '../../types/rainfall';

export interface ObservedVsNormalChartProps {
  data: CumulativeRainfallPoint[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CumulativeRainfallPoint; value: number }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  const observed = point.cumulativeObservedMm;
  const normal = point.cumulativeNormalMm;
  const delta = observed !== null ? Math.round((observed - normal) * 10) / 10 : null;
  const depPct = observed !== null && normal > 0 ? Math.round(((observed - normal) / normal) * 1000) / 10 : null;

  return (
    <div className="bg-[#0B1F33] text-white p-3 rounded-xs shadow-xl border border-[#1E354D] text-xs max-w-xs space-y-1.5 font-mono">
      <div className="flex items-center justify-between gap-2 border-b border-[#1E354D] pb-1.5">
        <span className="font-bold text-white">{point.date}</span>
        <span className="text-[10px] text-[#94A3B8]">Day {point.dayIndex}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
        <span className="text-[#94A3B8]">Cumulative Observed:</span>
        <span className="font-bold text-right text-[#38BDF8]">
          {observed !== null ? `${observed.toFixed(1)} mm` : 'N/A'}
        </span>

        <span className="text-[#94A3B8]">Cumulative Normal:</span>
        <span className="text-right text-[#CBD5E1]">
          {normal.toFixed(1)} mm
        </span>

        {delta !== null && depPct !== null && (
          <>
            <span className="text-[#94A3B8]">Cumulative Anomaly:</span>
            <span
              className={`text-right font-semibold ${
                delta >= 0 ? 'text-[#34D399]' : 'text-[#F87171]'
              }`}
            >
              {delta >= 0 ? '+' : ''}{delta.toFixed(1)} mm ({depPct >= 0 ? '+' : ''}{depPct.toFixed(1)}%)
            </span>
          </>
        )}
      </div>

      <div className="text-[10px] text-[#94A3B8] pt-1 border-t border-[#1E354D]/60">
        Baseline: IMD 1971–2020 Long Period Average Climatology
      </div>
    </div>
  );
};

export function ObservedVsNormalChart({ data, isLoading = false }: ObservedVsNormalChartProps) {
  // Determine final season status
  const latest = data[data.length - 1];
  const observedFinal = latest?.cumulativeObservedMm ?? 0;
  const normalFinal = latest?.cumulativeNormalMm ?? 1212.9;
  const depFinal = normalFinal > 0 ? ((observedFinal - normalFinal) / normalFinal) * 100 : 0;

  let statusText = 'Near Normal';
  let statusBadgeClass = 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-xs';

  if (depFinal >= 20) {
    statusText = 'Above Normal';
    statusBadgeClass = 'bg-sky-950/60 text-[#38BDF8] border-[#38BDF8]/40 shadow-xs';
  } else if (depFinal <= -20) {
    statusText = 'Below Normal';
    statusBadgeClass = 'bg-rose-950/60 text-rose-400 border-rose-500/40 shadow-xs';
  }

  return (
    <ChartContainer
      title="OBSERVED RAINFALL vs HISTORICAL NORMAL"
      subtitle="Cumulative seasonal accumulation progression compared to the official IMD 1971–2020 climatological normal curve."
      unit="mm (Cumulative)"
      height={320}
      isLoading={isLoading}
      toolbar={
        <div className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs border ${statusBadgeClass}`}>
          {statusText} ({depFinal >= 0 ? '+' : ''}{depFinal.toFixed(1)}%)
        </div>
      }
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#38BDF8] shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              <span className="text-slate-200 font-semibold">Observed Cumulative Rainfall</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#94A3B8] border-t border-dashed" />
              <span className="text-slate-400 font-semibold">Historical Cumulative Normal (1971–2020)</span>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Final Normal: {normalFinal.toFixed(1)} mm
          </span>
        </div>
      }
      footer={
        <div className="text-[11px] text-slate-400 font-mono">
          Normal trajectory dynamically generated from official IMD monthly normals (Jun: 221.8mm, Jul: 382.4mm, Aug: 366.1mm, Sep: 242.6mm).
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" vertical={false} />

          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1E354D' }}
            interval={Math.max(1, Math.floor(data.length / 12))}
          />

          <YAxis
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1E354D' }}
            domain={[0, (dataMax: number) => Math.ceil(dataMax / 100) * 100]}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Historical Normal Line */}
          <Line
            type="monotone"
            dataKey="cumulativeNormalMm"
            name="Historical Normal"
            stroke="#94A3B8"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />

          {/* Observed Cumulative Line */}
          <Line
            type="monotone"
            dataKey="cumulativeObservedMm"
            name="Observed Cumulative"
            stroke="#38BDF8"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
export default ObservedVsNormalChart;
