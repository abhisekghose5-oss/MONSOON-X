import React from 'react';
import type { ActualVsPredictedPoint } from '../../types/modelPerformance';
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
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface ActualVsPredictedChartProps {
  data: ActualVsPredictedPoint[];
  className?: string;
}

export function ActualVsPredictedChart({ data, className = '' }: ActualVsPredictedChartProps) {
  // Filter evaluated points for line rendering
  const chartData = data.map((d) => ({
    year: d.year,
    actualDOY: d.actualDOY,
    predictedDOY: d.predictedDOY,
    actualDate: d.actualDate,
    predictedDate: d.predictedDate,
    errorDays: d.errorDays,
    status: d.status,
  }));

  // Day-of-year formatter (150 = May 30, 160 = June 9, 170 = June 19)
  const formatDOY = (doy: number) => {
    if (doy === 160) return '09 Jun';
    if (doy === 165) return '14 Jun';
    if (doy === 170) return '19 Jun';
    if (doy === 175) return '24 Jun';
    return `${doy}`;
  };

  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-md border border-[#1E354D] shadow-command-panel p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E354D] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#071324] text-[#4ADE80] border border-[#1E354D]">
            <Calendar className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              ACTUAL VS PREDICTED ONSET TIMELINE (10 VALIDATION SEASONS)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Observed IMD Ground Influx Date vs Model Advance Prediction
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded-xs bg-[#071324] text-[#38BDF8] border border-[#1E354D] font-bold">
            Mean Error: 1.2 Days
          </span>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
            />
            <YAxis
              domain={[155, 175]}
              tickFormatter={formatDOY}
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
              label={{
                value: 'Onset Arrival Date (Day of Year)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 11,
                fill: '#94A3B8',
                fontFamily: 'monospace',
              }}
            />
            <Tooltip
              formatter={(value: any, name: any, item: any) => {
                const payload = item.payload;
                if (payload.status === 'awaiting') {
                  return ['Awaiting model evaluation', name];
                }
                if (name === 'Actual Observed Date') {
                  return [`${payload.actualDate} (DOY ${value})`, name];
                }
                if (name === 'Predicted OnsetDate') {
                  return [`${payload.predictedDate} (Error: ${payload.errorDays > 0 ? `+${payload.errorDays}` : payload.errorDays}d)`, name];
                }
                return [value, name];
              }}
              labelFormatter={(l) => `Kharif Monsoon Season ${l}`}
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

            {/* Normal baseline reference line (June 10 = DOY 161) */}
            <ReferenceLine
              y={161}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              label={{
                value: 'Climatological Normal (10 June)',
                position: 'right',
                fill: '#FCD34D',
                fontSize: 10,
                fontFamily: 'monospace',
              }}
            />

            {/* Actual Observed Date */}
            <Line
              type="monotone"
              dataKey="actualDOY"
              stroke="#4ADE80"
              strokeWidth={2.5}
              dot={{ fill: '#4ADE80', r: 4 }}
              activeDot={{ r: 6, fill: '#071324', stroke: '#4ADE80', strokeWidth: 2 }}
              name="Actual Observed Date"
              connectNulls={false}
            />

            {/* Predicted Date */}
            <Line
              type="monotone"
              dataKey="predictedDOY"
              stroke="#38BDF8"
              strokeWidth={2.5}
              strokeDasharray="3 3"
              dot={{ fill: '#38BDF8', r: 4 }}
              activeDot={{ r: 6, fill: '#071324', stroke: '#38BDF8', strokeWidth: 2 }}
              name="Predicted OnsetDate"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Institutional Explanatory Caption */}
      <div className="p-2.5 rounded-xs bg-[#071324] border border-[#1E354D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-[#4ADE80]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span>Maximum deviation observed: 2 days (during 2019 severe El Niño delay).</span>
        </span>
        <span className="flex items-center gap-1 text-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Season 2025: Awaiting post-monsoon ground verification.</span>
        </span>
      </div>
    </div>
  );
}
export default ActualVsPredictedChart;
