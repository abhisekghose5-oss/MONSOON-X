import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
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
import { DataTypeBadge } from './DataTypeBadge';
import type { MonthlyAnomalyPoint } from '../../types/rainfall';

export interface MonthlyAnomalyChartProps {
  data: MonthlyAnomalyPoint[];
  isLoading?: boolean;
}

const CustomMonthlyTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const point: MonthlyAnomalyPoint = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="bg-[#0B1F33] text-white p-3 rounded-md shadow-xl border border-[#1E354D] text-xs max-w-xs space-y-1.5 font-mono">
      <div className="flex items-center justify-between gap-2 border-b border-[#1E354D] pb-1.5">
        <span className="font-bold text-white">{point.monthFull}</span>
        <DataTypeBadge
          type={point.dataType === 'OBSERVED' ? 'OBSERVED' : 'MODEL_OUTPUT'}
          size="xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
        <span className="text-[#A3B4C8]">Observed / Model:</span>
        <span className="font-bold text-right text-[#439EE0]">
          {point.observedMm !== null ? `${point.observedMm.toFixed(1)} mm` : '--'}
        </span>

        <span className="text-[#A3B4C8]">LPA Normal:</span>
        <span className="text-right text-[#CBD5E1]">
          {point.normalMm.toFixed(1)} mm
        </span>

        <span className="text-[#A3B4C8]">LPA Departure:</span>
        <span
          className={`text-right font-bold ${
            point.departurePercent !== null && point.departurePercent >= 20
              ? 'text-[#7BBAE9]'
              : point.departurePercent !== null && point.departurePercent >= -19
              ? 'text-[#79BF9B]'
              : 'text-[#E27673]'
          }`}
        >
          {point.departurePercent !== null
            ? `${point.departurePercent >= 0 ? '+' : ''}${point.departurePercent.toFixed(1)}%`
            : '--'}
        </span>

        <span className="text-[#A3B4C8]">IMD Category:</span>
        <span className="text-right font-semibold text-white">
          {point.category}
        </span>
      </div>

      {point.notes && (
        <div className="text-[10px] text-[#F4D79C] pt-1 border-t border-[#1E354D]/60">
          Note: {point.notes}
        </div>
      )}
    </div>
  );
};

export function MonthlyAnomalyChart({ data, isLoading = false }: MonthlyAnomalyChartProps) {
  const getBarColor = (category: string) => {
    switch (category) {
      case 'Large Excess':
        return '#08385E'; // Deepest Navy
      case 'Excess':
        return '#1479C9'; // Monsoon Blue
      case 'Normal':
        return '#247A4A'; // Agriculture Green
      case 'Deficient':
        return '#D99000'; // Warning Amber
      case 'Large Deficient':
        return '#C43D3D'; // Risk Red
      default:
        return '#1479C9';
    }
  };

  return (
    <ChartContainer
      title="D. Monthly Precipitation Anomaly (LPA Departure %)"
      subtitle="Percentage deviation from IMD Long Period Average across the Southwest Monsoon (Kharif) season."
      unit="% departure"
      height={320}
      isLoading={isLoading}
      toolbar={
        <div className="flex items-center gap-2">
          <DataSourceBadge
            source="IMD Hydromet Division Monthly Summary Reports"
            type="survey"
            size="sm"
          />
        </div>
      }
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-3.5 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#08385E] rounded-xs" />
              <span>Large Excess (≥ +60%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#1479C9] rounded-xs" />
              <span>Excess (+20% to +59%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#247A4A] rounded-xs" />
              <span>Normal (-19% to +19%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#D99000] rounded-xs" />
              <span>Deficient (-20% to -59%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#C43D3D] rounded-xs" />
              <span>Large Deficient (&lt; -60%)</span>
            </span>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1">
          <span>Official IMD Standard Departure Criteria applied.</span>
          <span>Dashed grey lines denote normal boundary [-19%, +19%].</span>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#0B1F33', fontWeight: 600, fontFamily: 'monospace' }}
            stroke="#CBD5E1"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6E7F94', fontFamily: 'monospace' }}
            stroke="#CBD5E1"
            domain={[-40, 40]}
          />
          <Tooltip content={<CustomMonthlyTooltip />} />

          {/* Zero Departure Line */}
          <ReferenceLine y={0} stroke="#4B5B6D" strokeWidth={1.5} />

          {/* IMD Normal Band Boundaries (+19% and -19%) */}
          <ReferenceLine
            y={19}
            stroke="#247A4A"
            strokeDasharray="3 3"
            label={{
              value: '+19% (Normal Upper)',
              position: 'insideTopLeft',
              fill: '#247A4A',
              fontSize: 9,
              fontFamily: 'monospace',
            }}
          />
          <ReferenceLine
            y={-19}
            stroke="#D99000"
            strokeDasharray="3 3"
            label={{
              value: '-19% (Normal Lower)',
              position: 'insideBottomLeft',
              fill: '#D99000',
              fontSize: 9,
              fontFamily: 'monospace',
            }}
          />

          <Bar dataKey="departurePercent" radius={[3, 3, 0, 0]} maxBarSize={38}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-mo-${index}`}
                fill={getBarColor(entry.category)}
                stroke={entry.dataType === 'MODEL_OUTPUT' ? '#D99000' : undefined}
                strokeDasharray={entry.dataType === 'MODEL_OUTPUT' ? '2 2' : undefined}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
