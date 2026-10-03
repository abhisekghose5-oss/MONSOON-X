import React from 'react';
import type { LeadTimeDecayPoint } from '../../types/modelPerformance';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { TrendingDown, ShieldCheck } from 'lucide-react';

interface LeadTimeDecayChartProps {
  data: LeadTimeDecayPoint[];
  className?: string;
}

export function LeadTimeDecayChart({ data, className = '' }: LeadTimeDecayChartProps) {
  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-md border border-[#1E354D] shadow-command-panel p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E354D] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#071324] text-[#38BDF8] border border-[#1E354D]">
            <TrendingDown className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              PREDICTIVE SKILL DEGRADATION ACROSS LEAD TIME (1 TO 30 DAYS)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              ROC-AUC metric decline as forecast horizon extends
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded-xs bg-emerald-950/60 text-[#4ADE80] border border-emerald-500/40 font-bold flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" /> Skillful beyond 14d
          </span>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" />
            <XAxis
              dataKey="leadDay"
              tickFormatter={(v) => `D+${v}`}
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
              label={{
                value: 'Forecast Lead Time (Days Ahead)',
                position: 'insideBottom',
                offset: -5,
                fontSize: 11,
                fill: '#94A3B8',
                fontFamily: 'monospace',
              }}
            />
            <YAxis
              domain={[0.5, 1.0]}
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
              label={{
                value: 'ROC-AUC Discrimination Skill',
                angle: -90,
                position: 'insideLeft',
                fontSize: 11,
                fill: '#94A3B8',
                fontFamily: 'monospace',
              }}
            />
            <Tooltip
              formatter={(value: any, name: any) => [`${value} ROC-AUC`, name]}
              labelFormatter={(l) => `Forecast Lead: Day +${l}`}
              contentStyle={{
                backgroundColor: '#071324',
                color: '#fff',
                borderRadius: '4px',
                border: '1px solid #1E354D',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }}
              formatter={(value: string) => <span className="text-slate-300">{value}</span>}
            />

            {/* Climatological threshold reference line (0.50) */}
            <ReferenceLine
              y={0.5}
              stroke="#64748B"
              strokeDasharray="3 3"
              label={{
                value: 'Random Guess Baseline (0.50)',
                position: 'insideBottomRight',
                fill: '#94A3B8',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />

            {/* Operational Utility Line (0.70) */}
            <ReferenceLine
              y={0.7}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              label={{
                value: 'Operational Utility Threshold (0.70)',
                position: 'insideBottomRight',
                fill: '#FCD34D',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />

            {/* Onset ROC-AUC */}
            <Line
              type="monotone"
              dataKey="onsetRocAuc"
              stroke="#38BDF8"
              strokeWidth={2.5}
              dot={{ fill: '#38BDF8', r: 3.5 }}
              name="Monsoon Onset Skill"
            />

            {/* Break Spell ROC-AUC */}
            <Line
              type="monotone"
              dataKey="breakRocAuc"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={{ fill: '#F59E0B', r: 3.5 }}
              name="Break Spell Detection Skill"
            />

            {/* Heavy Rain ROC-AUC */}
            <Line
              type="monotone"
              dataKey="heavyRainRocAuc"
              stroke="#4ADE80"
              strokeWidth={2.5}
              dot={{ fill: '#4ADE80', r: 3.5 }}
              name="Heavy Rain Warning Skill"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Caption */}
      <div className="p-2.5 rounded-xs bg-[#071324] border border-[#1E354D] text-[11px] font-mono text-slate-300 leading-relaxed">
        Onset and break spells maintain operational decision utility (ROC-AUC ≥ 0.70) out to Day 21 due to teleconnection memory in ENSO, IOD, and 850 hPa LLJ momentum. Localized heavy rainfall predictability decays more rapidly after Day 7 due to mesoscale convective stochasticity.
      </div>
    </div>
  );
}
export default LeadTimeDecayChart;
