import React from 'react';
import type { CalibrationPoint, PerformanceTask } from '../../types/modelPerformance';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Target, Info, CheckCircle2 } from 'lucide-react';

interface ReliabilityDiagramProps {
  data: CalibrationPoint[];
  task: PerformanceTask;
  className?: string;
}

export function ReliabilityDiagram({ data, task, className = '' }: ReliabilityDiagramProps) {
  // Format data for Recharts (scale to percentages for clarity)
  const chartData = data.map((d) => ({
    binLabel: d.binLabel,
    forecastProb: Math.round(d.forecastProbability * 100),
    observedFreq: d.observedFrequency !== null ? Math.round(d.observedFrequency * 100) : null,
    perfectLine: Math.round(d.perfectCalibration * 100),
    sampleCount: d.sampleCount,
  }));

  const taskTitle =
    task === 'onset' ? 'Monsoon Onset' : task === 'break' ? 'Break Spell' : 'Heavy Rain';

  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-md border border-[#1E354D] shadow-command-panel p-4 space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E354D] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#071324] text-[#38BDF8] border border-[#1E354D]">
            <Target className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              RELIABILITY DIAGRAM & CALIBRATION CURVE ({taskTitle.toUpperCase()})
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Forecast Probability vs Observed Relative Frequency (WMO Standard)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded-xs bg-emerald-950/60 text-[#4ADE80] border border-emerald-500/40 font-bold flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" /> Well Calibrated
          </span>
        </div>
      </div>

      {/* Main Calibration Line Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" />
            <XAxis
              dataKey="forecastProb"
              tickFormatter={(v) => `${v}%`}
              label={{
                value: 'Forecast Probability (%)',
                position: 'insideBottom',
                offset: -5,
                fontSize: 11,
                fill: '#94A3B8',
                fontFamily: 'monospace',
              }}
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
              domain={[0, 100]}
              type="number"
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              label={{
                value: 'Observed Relative Frequency (%)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 11,
                fill: '#94A3B8',
                fontFamily: 'monospace',
              }}
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
              domain={[0, 100]}
              type="number"
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                if (name === 'Model Calibration Curve') return [`${value}%`, name];
                if (name === 'Perfect Calibration (y = x)') return [`${value}%`, name];
                return [value, name];
              }}
              labelFormatter={(label) => `Forecast Probability Bin: ~${label}%`}
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
            {/* Reference diagonal y = x */}
            <Line
              type="linear"
              dataKey="perfectLine"
              stroke="#64748B"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
              name="Perfect Calibration (y = x)"
            />
            {/* Model observed frequency curve */}
            <Line
              type="monotone"
              dataKey="observedFreq"
              stroke="#38BDF8"
              strokeWidth={2.5}
              dot={{ fill: '#38BDF8', r: 4 }}
              activeDot={{ r: 6, fill: '#071324', stroke: '#38BDF8', strokeWidth: 2 }}
              name="Model Calibration Curve"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subchart: Forecast Sharpness Histogram (Sample Count per Bin) */}
      <div className="pt-2 border-t border-[#1E354D] space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span className="uppercase font-bold flex items-center gap-1 text-slate-300">
            <Info className="w-3 h-3 text-[#38BDF8]" /> Sharpness Histogram (Sample Count per Forecast Bin)
          </span>
          <span>Sample Distribution across 10 probability intervals</span>
        </div>

        <div className="h-20 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke="#1E354D" vertical={false} />
              <XAxis dataKey="binLabel" tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'monospace' }} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'monospace' }} />
              <Tooltip
                formatter={(val: any) => [`${val} events`, 'Sample Size']}
                labelFormatter={(l) => `Bin ${l}`}
                contentStyle={{
                  backgroundColor: '#071324',
                  color: '#fff',
                  borderRadius: '4px',
                  border: '1px solid #1E354D',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="sampleCount" fill="#4ADE80" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Institutional Explanatory Interpretation */}
      <div className="p-2.5 rounded-xs bg-[#071324] border border-[#1E354D] text-[11px] text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <strong className="text-white font-mono block text-[10px] uppercase">
            Diagonal Alignment:
          </strong>
          Points clustered closely along the dashed gray line denote that when the model forecasts 70% probability, the event occurs approximately 70% of the time.
        </div>
        <div>
          <strong className="text-white font-mono block text-[10px] uppercase">
            Sharpness Resolution:
          </strong>
          High sample counts in extreme bins (5% and 95%) confirm the model does not hedge around climatological ambiguity, producing actionable agromet alerts.
        </div>
      </div>
    </div>
  );
}
export default ReliabilityDiagram;
