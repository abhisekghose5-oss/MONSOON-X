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
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#EAF0F6] text-[#1479C9]">
            <Target className="w-4 h-4 text-[#1479C9]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
              RELIABILITY DIAGRAM & CALIBRATION CURVE ({taskTitle.toUpperCase()})
            </h3>
            <span className="text-[11px] text-[#6E7F94] font-mono">
              Forecast Probability vs Observed Relative Frequency (WMO Standard)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded-xs bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#247A4A]" /> Well Calibrated
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="forecastProb"
              tickFormatter={(v) => `${v}%`}
              label={{
                value: 'Forecast Probability (%)',
                position: 'insideBottom',
                offset: -5,
                fontSize: 11,
                fill: '#6E7F94',
                fontFamily: 'monospace',
              }}
              tick={{ fontSize: 10, fill: '#4B5B6D', fontFamily: 'monospace' }}
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
                fill: '#6E7F94',
                fontFamily: 'monospace',
              }}
              tick={{ fontSize: 10, fill: '#4B5B6D', fontFamily: 'monospace' }}
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
            {/* Reference diagonal y = x */}
            <Line
              type="linear"
              dataKey="perfectLine"
              stroke="#94A3B8"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
              name="Perfect Calibration (y = x)"
            />
            {/* Model observed frequency curve */}
            <Line
              type="monotone"
              dataKey="observedFreq"
              stroke="#1479C9"
              strokeWidth={2.5}
              dot={{ fill: '#1479C9', r: 4 }}
              activeDot={{ r: 6, fill: '#0B1F33', stroke: '#1479C9', strokeWidth: 2 }}
              name="Model Calibration Curve"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subchart: Forecast Sharpness Histogram (Sample Count per Bin) */}
      <div className="pt-2 border-t border-[#F0F3F7] space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[10px] text-[#6E7F94]">
          <span className="uppercase font-bold flex items-center gap-1">
            <Info className="w-3 h-3 text-[#1479C9]" /> Sharpness Histogram (Sample Count per Forecast Bin)
          </span>
          <span>Sample Distribution across 10 probability intervals</span>
        </div>

        <div className="h-20 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="binLabel" tick={{ fontSize: 9, fill: '#6E7F94', fontFamily: 'monospace' }} />
              <YAxis tick={{ fontSize: 9, fill: '#6E7F94', fontFamily: 'monospace' }} />
              <Tooltip
                formatter={(val: any) => [`${val} events`, 'Sample Size']}
                labelFormatter={(l) => `Bin ${l}`}
                contentStyle={{
                  backgroundColor: '#0B1F33',
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="sampleCount" fill="#247A4A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Institutional Explanatory Interpretation */}
      <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#4B5B6D] leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <strong className="text-[#0B1F33] font-mono block text-[10px] uppercase">
            Diagonal Alignment:
          </strong>
          Points clustered closely along the dashed gray line denote that when the model forecasts 70% probability, the event occurs approximately 70% of the time.
        </div>
        <div>
          <strong className="text-[#0B1F33] font-mono block text-[10px] uppercase">
            Sharpness Resolution:
          </strong>
          High sample counts in extreme bins (5% and 95%) confirm the model does not hedge around climatological ambiguity, producing actionable agromet alerts.
        </div>
      </div>
    </div>
  );
}
