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
      <div className="rounded-xl border border-amber-500/30 bg-[#0A192F]/95 p-3.5 shadow-2xl backdrop-blur-md text-xs font-mono space-y-2 z-50 min-w-[220px]">
        <div className="flex items-center justify-between border-b border-[#1E354D] pb-1.5 font-bold">
          <span className="text-white text-sm">{point.durationBin} DURATION</span>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30">
            {point.frequency} EVENTS
          </span>
        </div>

        <div className="flex justify-between gap-3 text-slate-300">
          <span className="text-slate-400">Share of All Breaks:</span>
          <span className="font-bold text-cyan-400">{point.percentageOfBreaks}%</span>
        </div>

        <div className="flex justify-between gap-3 text-slate-300">
          <span className="text-slate-400">Soil Moisture Deficit:</span>
          <span className="font-bold text-rose-400">{point.averageSoilMoistureDeficitPct}%</span>
        </div>

        <div className="pt-2 border-t border-[#1E354D] text-[10px] text-slate-300 leading-tight font-sans">
          <strong className="text-amber-300 font-mono">Impact:</strong> {point.typicalCropImpact}
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
    <div className={`bg-[#0A192F]/85 rounded-xl border border-[#1E354D] shadow-2xl backdrop-blur-md overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              BREAK SPELL DURATION & MOISTURE DEFICIT DISTRIBUTION
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30 font-bold">
              55-YEAR EMPIRICAL
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Statistical frequency distribution of historical dry spell durations (&gt; 5 consecutive days with block rain &lt; 2.5mm) across Koraput rainfed agriculture.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#0A192F] px-3 py-1.5 rounded-lg border border-[#1E354D]">
          <span className="text-slate-400">Average Frequency:</span>
          <strong className="text-amber-300">1.8 Events / Monsoon</strong>
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              
              <XAxis
                dataKey="durationBin"
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#1E354D' }}
              />
              
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
                unit=" events"
              />

              <Tooltip content={<BreakDurationTooltipContent />} />

              <Bar
                dataKey="frequency"
                name="Historical Occurrences (1970–2025)"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agronomic Deficit Impact Breakdown Table */}
        <div className="overflow-x-auto rounded-xl border border-[#1E354D]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#071324] border-b border-[#1E354D] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-bold">Duration Bin</th>
                <th className="py-2.5 px-3 font-bold text-center">Occurrences</th>
                <th className="py-2.5 px-3 font-bold text-center">Share (%)</th>
                <th className="py-2.5 px-3 font-bold text-center">Soil Moisture Deficit</th>
                <th className="py-2.5 px-3 font-bold">Agronomic Soil & Crop Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E354D]/60 font-sans">
              {distribution.map((d) => (
                <tr key={d.durationBin} className="hover:bg-amber-950/10 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    {d.durationBin}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-400">
                    {d.frequency}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-300">
                    {d.percentageOfBreaks}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-400">
                    {d.averageSoilMoistureDeficitPct}%
                  </td>
                  <td className="py-2.5 px-3 text-xs text-slate-300">
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
