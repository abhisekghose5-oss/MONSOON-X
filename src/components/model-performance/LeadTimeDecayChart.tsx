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
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#EAF0F6] text-[#1479C9]">
            <TrendingDown className="w-4 h-4 text-[#1479C9]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
              PREDICTIVE SKILL DEGRADATION ACROSS LEAD TIME (1 TO 30 DAYS)
            </h3>
            <span className="text-[11px] text-[#6E7F94] font-mono">
              ROC-AUC metric decline as forecast horizon extends
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded-xs bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#247A4A]" /> Skillful beyond 14d
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="leadDay"
              tickFormatter={(v) => `D+${v}`}
              tick={{ fontSize: 10, fill: '#4B5B6D', fontFamily: 'monospace' }}
              label={{
                value: 'Forecast Lead Time (Days Ahead)',
                position: 'insideBottom',
                offset: -5,
                fontSize: 11,
                fill: '#6E7F94',
                fontFamily: 'monospace',
              }}
            />
            <YAxis
              domain={[0.5, 1.0]}
              tick={{ fontSize: 10, fill: '#4B5B6D', fontFamily: 'monospace' }}
              label={{
                value: 'ROC-AUC Discrimination Skill',
                angle: -90,
                position: 'insideLeft',
                fontSize: 11,
                fill: '#6E7F94',
                fontFamily: 'monospace',
              }}
            />
            <Tooltip
              formatter={(value: any, name: any) => [`${value} ROC-AUC`, name]}
              labelFormatter={(l) => `Forecast Lead: Day +${l}`}
              contentStyle={{
                backgroundColor: '#0B1F33',
                color: '#fff',
                borderRadius: '4px',
                border: '1px solid #1E354D',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }}
            />

            {/* Climatological threshold reference line (0.50) */}
            <ReferenceLine
              y={0.5}
              stroke="#94A3B8"
              strokeDasharray="3 3"
              label={{
                value: 'Random Guess Baseline (0.50)',
                position: 'insideBottomRight',
                fill: '#64748B',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />

            {/* Operational Utility Line (0.70) */}
            <ReferenceLine
              y={0.7}
              stroke="#D99000"
              strokeDasharray="4 4"
              label={{
                value: 'Operational Utility Threshold (0.70)',
                position: 'insideBottomRight',
                fill: '#8C5D00',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />

            {/* Onset ROC-AUC */}
            <Line
              type="monotone"
              dataKey="onsetRocAuc"
              stroke="#1479C9"
              strokeWidth={2.5}
              dot={{ fill: '#1479C9', r: 3.5 }}
              name="Monsoon Onset Skill"
            />

            {/* Break Spell ROC-AUC */}
            <Line
              type="monotone"
              dataKey="breakRocAuc"
              stroke="#D99000"
              strokeWidth={2.5}
              dot={{ fill: '#D99000', r: 3.5 }}
              name="Break Spell Detection Skill"
            />

            {/* Heavy Rain ROC-AUC */}
            <Line
              type="monotone"
              dataKey="heavyRainRocAuc"
              stroke="#247A4A"
              strokeWidth={2.5}
              dot={{ fill: '#247A4A', r: 3.5 }}
              name="Heavy Rain Warning Skill"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Caption */}
      <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-mono text-[#4B5B6D] leading-relaxed">
        Onset and break spells maintain operational decision utility (ROC-AUC ≥ 0.70) out to Day 21 due to teleconnection memory in ENSO, IOD, and 850 hPa LLJ momentum. Localized heavy rainfall predictability decays more rapidly after Day 7 due to mesoscale convective stochasticity.
      </div>
    </div>
  );
}
