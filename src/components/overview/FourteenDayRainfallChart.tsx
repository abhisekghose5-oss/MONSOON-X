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
} from 'recharts';
import type { DailyRainfallPoint } from '../../types/overview';
import { tokens } from '../../styles/tokens';

interface FourteenDayRainfallChartProps {
  data: DailyRainfallPoint[];
}

// Custom institutional tooltip
const CustomRainfallTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload as DailyRainfallPoint;
    return (
      <div className="rounded-sm border border-[#CBD5E1] bg-white p-2.5 shadow-gov-elevated text-xs font-mono space-y-1 z-50">
        <div className="flex items-center justify-between gap-4 border-b border-[#F0F3F7] pb-1">
          <span className="font-bold text-[#0B1F33]">{point.displayDate} (2026)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2] font-semibold">
            {point.probabilityPercent}% PROB
          </span>
        </div>
        <div className="flex justify-between gap-3 text-[#16202A]">
          <span className="text-[#6E7F94]">Forecast Rain:</span>
          <span className="font-bold text-[#1479C9]">{point.forecastRainfallMm.toFixed(1)} mm</span>
        </div>
        <div className="flex justify-between gap-3 text-[#16202A]">
          <span className="text-[#6E7F94]">IMD Normal Baseline:</span>
          <span className="font-medium text-[#7599C8]">{point.normalBaselineMm.toFixed(1)} mm</span>
        </div>
        <div className="flex justify-between gap-3 text-[#16202A]">
          <span className="text-[#6E7F94]">Ensemble Spread:</span>
          <span className="text-[#4B5B6D]">{point.lowerConfidenceMm.toFixed(1)} - {point.upperConfidenceMm.toFixed(1)} mm</span>
        </div>
        <div className="pt-1 border-t border-[#F0F3F7] text-[10px] text-[#247A4A] font-semibold">
          Status: {point.weatherCondition}
        </div>
      </div>
    );
  }
  return null;
};

export function FourteenDayRainfallChart({ data }: FourteenDayRainfallChartProps) {

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.chartColors.gridLines} />
          
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11, fill: '#6E7F94', fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          
          <YAxis
            tick={{ fontSize: 11, fill: '#6E7F94', fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            unit=" mm"
          />

          <Tooltip content={<CustomRainfallTooltip />} />

          {/* Reference line for 2.5mm IMD Rainy Day Threshold */}
          <ReferenceLine
            y={2.5}
            stroke="#D99000"
            strokeDasharray="4 4"
            label={{
              value: 'Rainy Day (≥2.5mm)',
              position: 'insideTopRight',
              fill: '#D99000',
              fontSize: 10,
              fontFamily: 'JetBrains Mono',
            }}
          />

          {/* Forecasted Daily Rainfall Bars */}
          <Bar
            dataKey="forecastRainfallMm"
            name="Forecast Rainfall (mm)"
            fill="#1479C9"
            radius={[2, 2, 0, 0]}
            maxBarSize={32}
          />

          {/* Normal Climatology Line */}
          <Line
            type="monotone"
            dataKey="normalBaselineMm"
            name="IMD Normal Baseline"
            stroke="#0B1F33"
            strokeWidth={2}
            dot={{ r: 2.5, fill: '#0B1F33' }}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
