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

export interface CumulativeRainfallChartProps {
  data: CumulativeRainfallPoint[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CumulativeRainfallPoint }>;
}

const CustomCumulativeTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="bg-[#0B1F33] text-white p-3 rounded-xs shadow-xl border border-[#1E354D] text-xs max-w-xs space-y-1.5 font-mono">
      <div className="flex items-center justify-between gap-2 border-b border-[#1E354D] pb-1.5">
        <span className="font-bold text-white">{point.date}</span>
        <span className="text-[10px] text-[#94A3B8]">Day {point.dayIndex}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
        <span className="text-[#94A3B8]">Current Season (2025):</span>
        <span className="font-bold text-right text-[#38BDF8]">
          {point.cumulativeObservedMm !== null ? `${point.cumulativeObservedMm.toFixed(1)} mm` : 'N/A'}
        </span>

        <span className="text-[#94A3B8]">Historical Normal (LPA):</span>
        <span className="text-right text-[#CBD5E1]">
          {point.cumulativeNormalMm.toFixed(1)} mm
        </span>

        <span className="text-[#94A3B8]">Previous Season (2024):</span>
        <span className="text-right text-[#A78BFA]">
          {point.cumulativePreviousSeasonMm !== null && point.cumulativePreviousSeasonMm !== undefined
            ? `${point.cumulativePreviousSeasonMm.toFixed(1)} mm`
            : 'Previous season unavailable'}
        </span>
      </div>
    </div>
  );
};

export function CumulativeRainfallChart({ data, isLoading = false }: CumulativeRainfallChartProps) {
  const hasPreviousSeason = data.some(
    (d) => d.cumulativePreviousSeasonMm !== null && d.cumulativePreviousSeasonMm !== undefined
  );

  return (
    <ChartContainer
      title="CUMULATIVE SEASONAL RAINFALL"
      subtitle="Total monsoon accumulation progression comparing current season, 50-year LPA normal, and previous year."
      unit="mm (Cumulative)"
      height={340}
      isLoading={isLoading}
      toolbar={
        !hasPreviousSeason && (
          <span className="px-2 py-0.5 text-[11px] font-mono rounded-xs bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            Previous season unavailable
          </span>
        )
      }
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#0284C7]" />
              <span className="text-[#0B1F33] font-semibold">Current Season (2025)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#475569] border-t border-dashed" />
              <span className="text-[#475569] font-semibold">Historical Normal (1971–2020 LPA)</span>
            </span>
            {hasPreviousSeason ? (
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#8B5CF6]" />
                <span className="text-[#6D28D9] font-semibold">Previous Season (2024)</span>
              </span>
            ) : (
              <span className="text-[#94A3B8] italic">Previous season unavailable</span>
            )}
          </div>
          <span className="text-[#64748B] text-[11px]">
            LPA JJAS Benchmark: 1212.9 mm
          </span>
        </div>
      }
      footer={
        <div className="text-[11px] text-[#64748B] font-mono">
          Dataset: IMD High-Resolution Gridded Observations & Climatological Tables.
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />

          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
            interval={Math.max(1, Math.floor(data.length / 14))}
          />

          <YAxis
            tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
            domain={[0, (dataMax: number) => Math.ceil(dataMax / 100) * 100]}
          />

          <Tooltip content={<CustomCumulativeTooltip />} />

          {/* Historical Normal Line */}
          <Line
            type="monotone"
            dataKey="cumulativeNormalMm"
            name="Historical Normal"
            stroke="#475569"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />

          {/* Previous Season Line (if available) */}
          {hasPreviousSeason && (
            <Line
              type="monotone"
              dataKey="cumulativePreviousSeasonMm"
              name="Previous Season (2024)"
              stroke="#8B5CF6"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          )}

          {/* Current Season Line */}
          <Line
            type="monotone"
            dataKey="cumulativeObservedMm"
            name="Current Season (2025)"
            stroke="#0284C7"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
export default CumulativeRainfallChart;
