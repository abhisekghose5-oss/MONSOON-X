import React from 'react';
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
  Cell,
} from 'recharts';
import { ChartContainer } from '../design-system/ChartContainer';
import { DataStatusBadge } from '../design-system/DataStatusBadge';
import type { DailyRainfallPoint } from '../../types/rainfall';

export interface DailyRainfallChartProps {
  data: DailyRainfallPoint[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DailyRainfallPoint }>;
}

const CustomDailyTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  const isMissing = point.rainfallMm === null;

  return (
    <div className="bg-[#0B1F33] text-white p-3 rounded-xs shadow-xl border border-[#1E354D] text-xs max-w-xs space-y-1.5 font-mono">
      <div className="flex items-center justify-between gap-2 border-b border-[#1E354D] pb-1.5">
        <span className="font-bold text-white">
          {point.date} ({point.dayOfWeek})
        </span>
        <DataStatusBadge
          status={isMissing ? 'MISSING' : 'OFFICIAL'}
          size="xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
        <span className="text-[#94A3B8]">Observed Rainfall:</span>
        <span className={`font-bold text-right ${isMissing ? 'text-[#F87171]' : 'text-[#38BDF8]'}`}>
          {isMissing ? 'Missing (Gap)' : `${point.rainfallMm?.toFixed(1)} mm`}
        </span>

        <span className="text-[#94A3B8]">IMD Daily Normal:</span>
        <span className="text-right text-[#CBD5E1]">
          {point.normalMm.toFixed(1)} mm
        </span>

        {!isMissing && point.anomalyMm !== null && point.anomalyMm !== undefined && (
          <>
            <span className="text-[#94A3B8]">Daily Departure:</span>
            <span
              className={`text-right font-semibold ${
                point.anomalyMm >= 0 ? 'text-[#34D399]' : 'text-[#F87171]'
              }`}
            >
              {point.anomalyMm >= 0 ? '+' : ''}
              {point.anomalyMm.toFixed(1)} mm
            </span>
          </>
        )}

        <span className="text-[#94A3B8]">IMD Intensity:</span>
        <span className="text-right font-semibold text-white">
          {isMissing ? 'N/A' : point.imdCategory}
        </span>
      </div>

      <div className="text-[10px] text-[#94A3B8] pt-1 border-t border-[#1E354D]/60 flex items-center justify-between">
        <span className="truncate">Source: {point.source}</span>
        <span className="shrink-0 ml-1 font-semibold">{point.qualityFlag || 'verified'}</span>
      </div>
    </div>
  );
};

export function DailyRainfallChart({ data, isLoading = false }: DailyRainfallChartProps) {
  return (
    <ChartContainer
      title="DAILY RAINFALL"
      subtitle="Bar hyetograph of observed 24-hr precipitation with gaps indicating missing observations, compared against IMD normal."
      unit="mm / day"
      height={320}
      isLoading={isLoading}
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#38BDF8] rounded-xs shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
              <span className="text-slate-200 font-semibold">Observed Daily Rainfall (&lt;64.5 mm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#F59E0B] rounded-xs shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <span className="text-slate-200 font-semibold">Heavy Rainfall (≥64.5 mm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#94A3B8]" />
              <span className="text-slate-400">IMD Daily Normal Climatology</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#F43F5E] border-t border-dashed" />
              <span className="text-[#F43F5E]">IMD Heavy Rain Threshold (64.5 mm)</span>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            {data.length} Observation Days
          </span>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1 text-[11px] text-slate-400 font-mono">
          <span>Source: IMD 0.25° Gridded Daily Rainfall Dataset · Missing records rendered as visual gaps.</span>
          <span className="font-semibold text-slate-200">Koraput Station 42963</span>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" vertical={false} />

          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1E354D' }}
            interval={Math.max(1, Math.floor(data.length / 14))}
          />

          <YAxis
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1E354D' }}
            domain={[0, (dataMax: number) => Math.max(80, Math.ceil(dataMax / 10) * 10)]}
          />

          <Tooltip content={<CustomDailyTooltip />} />

          {/* Reference Line for IMD Heavy Rain (>64.5 mm) */}
          <ReferenceLine
            y={64.5}
            stroke="#F43F5E"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />

          {/* Daily Normal Line */}
          <Line
            type="monotone"
            dataKey="normalMm"
            name="IMD Daily Normal"
            stroke="#94A3B8"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />

          {/* Observed Daily Rainfall Bars */}
          <Bar
            dataKey="rainfallMm"
            name="Observed Rainfall"
            radius={[2, 2, 0, 0]}
            maxBarSize={16}
          >
            {data.map((entry, index) => {
              const isHeavy = (entry.rainfallMm ?? 0) >= 64.5;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isHeavy ? '#F59E0B' : '#38BDF8'}
                  fillOpacity={entry.rainfallMm === null ? 0 : 0.9}
                />
              );
            })}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
export default DailyRainfallChart;
