import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { BreakDurationDistributionPoint } from '../../types/historical';
import { tokens } from '../../styles/tokens';
import { TrendingDown } from 'lucide-react';

interface BreakSpellFrequencyChartProps {
  distribution: BreakDurationDistributionPoint[];
  className?: string;
}

function BreakDurationTooltipContent({ active, payload }: any) {
  if (active && payload && payload.length) {
    const point = payload[0].payload as BreakDurationDistributionPoint;
    return (
      <div className="rounded-sm border border-[#CBD5E1] bg-white p-3 shadow-gov-elevated text-xs font-mono space-y-1.5 z-50 min-w-[220px]">
        <div className="flex items-center justify-between border-b border-[#F0F3F7] pb-1 font-bold">
          <span className="text-[#0B1F33]">{point.durationBin} DURATION</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C]">
            {point.frequency} EVENTS
          </span>
        </div>

        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Share of All Breaks:</span>
          <span className="font-bold text-[#1479C9]">{point.percentageOfBreaks}%</span>
        </div>

        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Soil Moisture Deficit:</span>
          <span className="font-bold text-[#C43D3D]">{point.averageSoilMoistureDeficitPct}%</span>
        </div>

        <div className="pt-1.5 border-t border-[#F0F3F7] text-[10px] text-[#4B5B6D] leading-tight font-sans">
          <strong>Impact:</strong> {point.typicalCropImpact}
        </div>
      </div>
    );
  }
  return null;
}

export function BreakSpellFrequencyChart({
  distribution,
  className = '',
}: BreakSpellFrequencyChartProps) {
  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-[#D99000]" />
              BREAK SPELL DURATION & MOISTURE DEFICIT DISTRIBUTION
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] font-semibold">
              55-YEAR EMPIRICAL
            </span>
          </div>
          <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
            Statistical frequency distribution of historical dry spell durations (&gt; 5 consecutive days with block rain &lt; 2.5mm) across Koraput rainfed agriculture.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#6E7F94]">Average Frequency:</span>
          <strong className="text-[#0B1F33]">1.8 Events / Monsoon</strong>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Frequency Histogram Chart */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={distribution}
              margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.chartColors.gridLines} />
              
              <XAxis
                dataKey="durationBin"
                tick={{ fontSize: 11, fill: '#6E7F94', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              
              <YAxis
                tick={{ fontSize: 11, fill: '#6E7F94', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
                unit=" events"
              />

              <Tooltip content={<BreakDurationTooltipContent />} />

              <Bar
                dataKey="frequency"
                name="Historical Occurrences (1970–2025)"
                fill="#D99000"
                radius={[2, 2, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agronomic Deficit Impact Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F0F4F8] border-b border-[#CBD5E1] text-[#0B1F33] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2 px-3 font-bold">Duration Bin</th>
                <th className="py-2 px-3 font-bold text-center">Occurrences</th>
                <th className="py-2 px-3 font-bold text-center">Share (%)</th>
                <th className="py-2 px-3 font-bold text-center">Soil Moisture Deficit</th>
                <th className="py-2 px-3 font-bold">Agronomic Soil & Crop Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-sans">
              {distribution.map((d) => (
                <tr key={d.durationBin} className="hover:bg-[#F8FAFC]">
                  <td className="py-2 px-3 font-mono font-bold text-[#0B1F33]">
                    {d.durationBin}
                  </td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-[#1479C9]">
                    {d.frequency}
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-[#4B5B6D]">
                    {d.percentageOfBreaks}%
                  </td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-[#C43D3D]">
                    {d.averageSoilMoistureDeficitPct}%
                  </td>
                  <td className="py-2 px-3 text-xs text-[#334155]">
                    {d.typicalCropImpact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
