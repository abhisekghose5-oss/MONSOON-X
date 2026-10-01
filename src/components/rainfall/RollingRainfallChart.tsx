import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { ChartContainer } from '../design-system/ChartContainer';
import { DataSourceBadge } from '../design-system/DataSourceBadge';
import { DataTypeBadge } from './DataTypeBadge';
import type { DailyRainfallPoint } from '../../types/rainfall';

export interface RollingRainfallChartProps {
  data: DailyRainfallPoint[];
  isLoading?: boolean;
}

const CustomRollingTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const point: DailyRainfallPoint = payload[0]?.payload;
  if (!point) return null;

  const rollingMm = point.sevenDayRollingMm ?? 0;
  const rollingNorm = point.rollingNormalMm ?? 52.5;

  const rollingDeparture =
    rollingNorm > 0
      ? ((rollingMm - rollingNorm) / rollingNorm) * 100
      : 0;

  return (
    <div className="bg-[#0B1F33] text-white p-3 rounded-md shadow-xl border border-[#1E354D] text-xs max-w-xs space-y-1.5 font-mono">
      <div className="flex items-center justify-between gap-2 border-b border-[#1E354D] pb-1.5">
        <span className="font-bold text-white">{point.displayDate}</span>
        <DataTypeBadge
          type={point.dataType === 'OBSERVED' ? 'OBSERVED' : 'FORECAST'}
          size="xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
        <span className="text-[#A3B4C8]">7d Rolling Sum:</span>
        <span className="font-bold text-right text-[#1479C9]">
          {rollingMm.toFixed(1)} mm
        </span>

        <span className="text-[#A3B4C8]">7d Normal Sum:</span>
        <span className="text-right text-[#CBD5E1]">
          {rollingNorm.toFixed(1)} mm
        </span>

        <span className="text-[#A3B4C8]">Rolling Departure:</span>
        <span
          className={`text-right font-semibold ${
            rollingDeparture >= 0 ? 'text-[#79BF9B]' : 'text-[#E27673]'
          }`}
        >
          {rollingDeparture >= 0 ? '+' : ''}
          {rollingDeparture.toFixed(1)}%
        </span>

        <span className="text-[#A3B4C8]">Agro Moisture Status:</span>
        <span
          className={`text-right font-semibold ${
            rollingMm >= 50
              ? 'text-[#79BF9B]'
              : rollingMm < 15
              ? 'text-[#E27673]'
              : 'text-[#F4D79C]'
          }`}
        >
          {rollingMm >= 50
            ? 'Optimal Moisture'
            : rollingMm < 15
            ? 'Agricultural Dry Spell'
            : 'Moderate Maintenance'}
        </span>
      </div>
    </div>
  );
};

export function RollingRainfallChart({ data, isLoading = false }: RollingRainfallChartProps) {
  return (
    <ChartContainer
      title="B. 7-Day Rolling Precipitation & Dry Spell Tracking"
      subtitle="Moving 7-day cumulative sum tracking active monsoon surges vs agricultural soil moisture stress thresholds."
      unit="mm / 7 days"
      height={320}
      isLoading={isLoading}
      toolbar={
        <div className="flex items-center gap-2">
          <DataSourceBadge
            source="IMD Gridded Daily Rainfall (0.25° × 0.25°)"
            type="survey"
            size="sm"
          />
          <DataSourceBadge
            source="OUAT Agro-Meteorology Model"
            type="model"
            size="sm"
          />
        </div>
      }
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-[#1479C9]/30 border border-[#1479C9] rounded-xs" />
              <span className="text-[#0B1F33] font-semibold">7-Day Rolling Cumulative (mm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#4B5B6D]" />
              <span className="text-[#4B5B6D]">7-Day Normal Baseline</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#247A4A] border-t border-dashed" />
              <span className="text-[#247A4A]">Paddy Optimal (&gt; 50 mm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#C43D3D] border-t border-dashed" />
              <span className="text-[#C43D3D]">Dry Spell Warning (&lt; 15 mm)</span>
            </span>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1">
          <span>7-day rolling window calculation applied over past observed and 14-day NWP ensemble values.</span>
          <span>Dry spell trigger: &lt; 15 mm over 7 consecutive days</span>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={290}>
        <ComposedChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="rollingRainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1479C9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#1479C9" stopOpacity={0.02} />
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
            domain={[0, (dataMax: number) => Math.max(120, Math.ceil(dataMax / 20) * 20)]}
          />
          <Tooltip content={<CustomRollingTooltip />} />

          {/* Reference Lines */}
          <ReferenceLine
            y={50}
            stroke="#247A4A"
            strokeDasharray="4 4"
            label={{
              value: 'Optimal Paddy (50 mm)',
              position: 'insideTopRight',
              fill: '#247A4A',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          />
          <ReferenceLine
            y={15}
            stroke="#C43D3D"
            strokeDasharray="3 3"
            label={{
              value: 'Dry Spell Alert (15 mm)',
              position: 'insideBottomRight',
              fill: '#C43D3D',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          />

          <Area
            type="monotone"
            dataKey="sevenDayRollingMm"
            stroke="#1479C9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#rollingRainGrad)"
            name="7-Day Rolling Total"
          />

          <Line
            type="monotone"
            dataKey="rollingNormalMm"
            stroke="#4B5B6D"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="7-Day Normal Baseline"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
