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
import type { DailyRainfallPoint } from '../../types/rainfall';
import { getImdDepartureCategory } from '../../utils/rainfallAnomaly';

export interface RainfallAnomalyTimelineProps {
  data: DailyRainfallPoint[];
  isLoading?: boolean;
}

interface AnomalyDataPoint {
  date: string;
  displayDate: string;
  anomalyPercent: number | null;
  rainfallMm: number | null;
  normalMm: number;
  category: string;
}

export function RainfallAnomalyTimeline({
  data,
  isLoading = false,
}: RainfallAnomalyTimelineProps) {
  // Map daily points to anomaly percentages
  const chartData: AnomalyDataPoint[] = data.map((d) => {
    if (d.rainfallMm === null || d.normalMm <= 0) {
      return {
        date: d.date,
        displayDate: d.displayDate,
        anomalyPercent: null,
        rainfallMm: d.rainfallMm,
        normalMm: d.normalMm,
        category: 'Missing',
      };
    }
    const pct = Math.round(((d.rainfallMm - d.normalMm) / d.normalMm) * 1000) / 10;
    return {
      date: d.date,
      displayDate: d.displayDate,
      anomalyPercent: pct,
      rainfallMm: d.rainfallMm,
      normalMm: d.normalMm,
      category: getImdDepartureCategory(pct),
    };
  });

  return (
    <ChartContainer
      title="RAINFALL ANOMALY ANALYSIS"
      subtitle="Timeline hyetograph of percentage departure from daily normal baseline with zero baseline segregation."
      unit="Anomaly %"
      height={320}
      isLoading={isLoading}
      legend={
        <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#059669] rounded-xs" />
              <span className="text-[#059669] font-semibold">Above Normal / Excess (&gt; +20%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#0284C7] rounded-xs" />
              <span className="text-[#0284C7] font-semibold">Near Normal (-19% to +19%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#F59E0B] rounded-xs" />
              <span className="text-[#D97706] font-semibold">Deficit (-20% to -59%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#EF4444] rounded-xs" />
              <span className="text-[#DC2626] font-semibold">Strong Deficit (≤ -60%)</span>
            </span>
          </div>
          <span className="text-[#64748B] text-[11px]">
            Formula: ((Observed - Normal) / Normal) × 100
          </span>
        </div>
      }
      footer={
        <div className="text-[11px] text-[#64748B] font-mono">
          Thresholds calibrated to IMD Operational Climatology standards. Zero baseline indicates exact match with 50-year LPA.
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" vertical={false} />

          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1E354D' }}
            interval={Math.max(1, Math.floor(chartData.length / 14))}
          />

          <YAxis
            tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1E354D' }}
            domain={[-100, (dataMax: number) => Math.max(100, Math.ceil(dataMax / 50) * 50)]}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const p = payload[0]?.payload as AnomalyDataPoint;
              if (!p) return null;

              return (
                <div className="bg-[#0B1F33] text-white p-2.5 rounded-xs shadow-xl border border-[#1E354D] text-xs font-mono space-y-1">
                  <div className="font-bold border-b border-[#1E354D] pb-1">
                    {p.date}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 text-[11px]">
                    <span className="text-slate-400">Observed:</span>
                    <span className="text-right text-[#38BDF8]">
                      {p.rainfallMm !== null ? `${p.rainfallMm.toFixed(1)} mm` : 'Missing'}
                    </span>
                    <span className="text-slate-400">Normal:</span>
                    <span className="text-right text-slate-300">{p.normalMm.toFixed(1)} mm</span>
                    <span className="text-slate-400">Departure:</span>
                    <span
                      className={`text-right font-bold ${
                        (p.anomalyPercent ?? 0) >= 0 ? 'text-[#34D399]' : 'text-[#F87171]'
                      }`}
                    >
                      {p.anomalyPercent !== null
                        ? `${p.anomalyPercent >= 0 ? '+' : ''}${p.anomalyPercent.toFixed(1)}%`
                        : 'N/A'}
                    </span>
                    <span className="text-slate-400">IMD Category:</span>
                    <span className="text-right text-white font-semibold">{p.category}</span>
                  </div>
                </div>
              );
            }}
          />

          {/* Zero baseline */}
          <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1.5} />
          {/* IMD Departure bands */}
          <ReferenceLine y={20} stroke="#10B981" strokeDasharray="3 3" />
          <ReferenceLine y={-20} stroke="#F59E0B" strokeDasharray="3 3" />
          <ReferenceLine y={-60} stroke="#F43F5E" strokeDasharray="3 3" />

          <Bar
            dataKey="anomalyPercent"
            name="Rainfall Anomaly %"
            radius={[2, 2, 0, 0]}
            maxBarSize={14}
          >
            {chartData.map((entry, index) => {
              const val = entry.anomalyPercent;
              let fill = '#0284C7'; // Near normal
              if (val === null) fill = 'transparent';
              else if (val >= 20) fill = '#059669'; // Excess
              else if (val <= -60) fill = '#EF4444'; // Strong Deficit
              else if (val <= -20) fill = '#F59E0B'; // Deficit

              return <Cell key={`cell-anom-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
export default RainfallAnomalyTimeline;
