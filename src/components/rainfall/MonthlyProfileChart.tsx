import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { ChartContainer } from '../design-system/ChartContainer';
import type { MonthlyAnomalyPoint } from '../../types/rainfall';

export interface MonthlyProfileChartProps {
  data: MonthlyAnomalyPoint[];
  isLoading?: boolean;
  selectedYear?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: MonthlyAnomalyPoint }>;
}

const CustomMonthlyTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="bg-[#0B1F33] text-white p-3 rounded-xs shadow-xl border border-[#1E354D] text-xs max-w-xs space-y-1.5 font-mono">
      <div className="flex items-center justify-between gap-2 border-b border-[#1E354D] pb-1.5">
        <span className="font-bold text-white">{point.monthFull} {point.year}</span>
        {point.isMonsoonMonth && (
          <span className="px-1.5 py-0.5 rounded-xs bg-[#0284C7] text-white text-[10px] font-bold">
            SW MONSOON
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
        <span className="text-[#94A3B8]">Observed:</span>
        <span className="font-bold text-right text-[#38BDF8]">
          {point.observedMm !== null ? `${point.observedMm.toFixed(1)} mm` : 'Data Pending / Dry Season'}
        </span>

        <span className="text-[#94A3B8]">Historical Normal:</span>
        <span className="text-right text-[#CBD5E1]">
          {point.normalMm.toFixed(1)} mm
        </span>

        {point.departurePercent !== null && (
          <>
            <span className="text-[#94A3B8]">IMD Departure:</span>
            <span
              className={`text-right font-semibold ${
                point.departurePercent >= 0 ? 'text-[#34D399]' : 'text-[#F87171]'
              }`}
            >
              {point.departurePercent >= 0 ? '+' : ''}{point.departurePercent.toFixed(1)}% ({point.category})
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export function MonthlyProfileChart({
  data,
  isLoading = false,
  selectedYear = 2025,
}: MonthlyProfileChartProps) {
  return (
    <ChartContainer
      title="KORAPUT MONTHLY RAINFALL PROFILE"
      subtitle="Annual 12-month precipitation climatology comparing historical normal against observed period, highlighting JJAS monsoon."
      unit="mm"
      height={320}
      isLoading={isLoading}
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-600 rounded-xs" />
              <span className="text-slate-200 font-semibold">Historical Normal (1971–2020)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#38BDF8] rounded-xs shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
              <span className="text-slate-200 font-semibold">Observed ({selectedYear})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-[#F59E0B] rounded-xs" />
              <span className="text-[#F59E0B] font-bold">SW Monsoon Window (JJAS)</span>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Annual LPA: 1538.8 mm
          </span>
        </div>
      }
      footer={
        <div className="text-[11px] text-slate-400 font-mono">
          June to September accounts for approximately 78.8% of Koraput&apos;s total annual precipitation.
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" vertical={false} />

          <XAxis
            dataKey="month"
            tick={({ x, y, payload }) => {
              const item = data[payload.index];
              const isMonsoon = item?.isMonsoonMonth;
              return (
                <text
                  x={x}
                  y={Number(y) + 12}
                  textAnchor="middle"
                  fill={isMonsoon ? '#38BDF8' : '#94A3B8'}
                  fontWeight={isMonsoon ? 'bold' : 'normal'}
                  fontSize={10}
                  fontFamily="monospace"
                >
                  {payload.value}
                </text>
              );
            }}
            tickLine={false}
            axisLine={{ stroke: '#1E354D' }}
          />

          <YAxis
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1E354D' }}
            domain={[0, (dataMax: number) => Math.ceil(dataMax / 50) * 50]}
          />

          <Tooltip content={<CustomMonthlyTooltip />} />

          {/* Historical Normal Bar */}
          <Bar
            dataKey="normalMm"
            name="Historical Normal"
            fill="#475569"
            radius={[2, 2, 0, 0]}
            maxBarSize={18}
          />

          {/* Observed Bar */}
          <Bar
            dataKey="observedMm"
            name={`Observed (${selectedYear})`}
            radius={[2, 2, 0, 0]}
            maxBarSize={18}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-obs-${index}`}
                fill={entry.isMonsoonMonth ? '#0284C7' : '#38BDF8'}
                fillOpacity={entry.observedMm !== null ? 1 : 0.2}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
export default MonthlyProfileChart;
