import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import type {
  OnsetProbabilityDensityPoint,
  OnsetBayesianSummary,
} from '../../types/monsoon';
import { tokens } from '../../styles/tokens';
import { Calendar, HelpCircle, ShieldCheck } from 'lucide-react';

interface OnsetProbabilityChartProps {
  data: OnsetProbabilityDensityPoint[];
  summary: OnsetBayesianSummary;
  className?: string;
}

// Custom institutional tooltip declared outside render
function OnsetTooltipContent({ active, payload }: any) {
  if (active && payload && payload.length) {
    const point = payload[0].payload as OnsetProbabilityDensityPoint;
    return (
      <div className="rounded-sm border border-[#1E354D] bg-[#071324] p-3 shadow-command-elevated text-xs font-mono space-y-1.5 z-50 min-w-[210px]">
        <div className="flex items-center justify-between border-b border-[#1E354D] pb-1">
          <span className="font-bold text-white">{point.dayLabel} 2026</span>
          {point.isModelPeakDate && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 font-bold">
              MODEL PEAK
            </span>
          )}
          {point.isNormalDate && !point.isModelPeakDate && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1E354D] text-slate-300 border border-[#334E68] font-semibold">
              IMD NORMAL
            </span>
          )}
        </div>

        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">Daily Onset PDF:</span>
          <span className="font-bold text-[#38BDF8]">{point.pdfProbability.toFixed(1)}%</span>
        </div>

        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">Cumulative CDF:</span>
          <span className="font-bold text-[#4ADE80]">{point.cdfProbability.toFixed(1)}%</span>
        </div>

        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">IMD Climatology PDF:</span>
          <span className="text-slate-400 font-mono">{point.historicalNormalPdf.toFixed(1)}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export function OnsetProbabilityChart({
  data,
  summary,
  className = '',
}: OnsetProbabilityChartProps) {
  return (
    <div className={`bg-[#0A192F]/90 rounded-md border border-[#1E354D] shadow-command-panel overflow-hidden backdrop-blur-md ${className}`}>
      {/* Header with Credible Interval Badges */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              BAYESIAN ONSET PROBABILITY DISTRIBUTION (PDF / CDF)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 font-semibold">
              CALIBRATED ONSET WINDOW
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Probability density function (PDF) and cumulative distribution (CDF) combining 850 hPa LLJ zonal shear and INSAT convective depth.
          </p>
        </div>

        {/* Bayesian Credible Interval Display */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-sm bg-[#0A192F] border border-[#1E354D] shadow-xs flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">50% Credible:</span>
            <span className="font-bold text-[#38BDF8]">
              {summary.confidenceInterval50[0]} – {summary.confidenceInterval50[1]}
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-sm bg-[#0A192F] border border-[#1E354D] shadow-xs flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">90% Credible:</span>
            <span className="font-bold text-white">
              {summary.confidenceInterval90[0]} – {summary.confidenceInterval90[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Probability Distribution Chart */}
      <div className="p-4">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E354D" />
              
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#1E354D' }}
              />
              
              {/* Left Y-Axis: Daily PDF (%) */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#38BDF8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[0, 20]}
              />

              {/* Right Y-Axis: Cumulative CDF (%) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#4ADE80', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[0, 100]}
              />

              <Tooltip content={<OnsetTooltipContent />} />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
              />

              {/* Reference Line for IMD Climatological Normal (11 June) */}
              <ReferenceLine
                x="11 Jun"
                yAxisId="left"
                stroke="#64748B"
                strokeDasharray="4 4"
                label={{
                  value: 'IMD Normal (11 Jun)',
                  position: 'insideTopLeft',
                  fill: '#94A3B8',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              {/* Reference Line for Model Predicted Onset Mode */}
              <ReferenceLine
                x="12 Jun"
                yAxisId="left"
                stroke="#38BDF8"
                strokeWidth={1.5}
                label={{
                  value: 'Model Mode (12 Jun)',
                  position: 'insideTopRight',
                  fill: '#38BDF8',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              {/* Historical Climatological Normal PDF Curve */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="historicalNormalPdf"
                name="IMD Climatology Normal PDF (%)"
                stroke="#64748B"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
              />

              {/* Bayesian Model Daily Onset PDF Area */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="pdfProbability"
                name="Model Bayesian PDF (%/day)"
                fill="#0284C7"
                fillOpacity={0.25}
                stroke="#38BDF8"
                strokeWidth={2}
                dot={{ r: 2, fill: '#38BDF8' }}
                activeDot={{ r: 5 }}
              />

              {/* Cumulative Onset Distribution CDF Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cdfProbability"
                name="Cumulative Onset CDF (%)"
                stroke="#4ADE80"
                strokeWidth={2}
                dot={{ r: 2, fill: '#4ADE80' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Diagnostic Metadata Footer */}
        <div className="mt-3 pt-3 border-t border-[#1E354D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#4ADE80]">
            <ShieldCheck className="w-4 h-4 text-[#4ADE80] shrink-0" />
            <span className="font-semibold">
              Peak Posterior Mode: {summary.predictedDate} (Daily density: {summary.peakProbability}%, Confidence: {summary.confidenceScore}%)
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Standard Deviation (\(\sigma\)): &plusmn;2.4 days vs IMD climatology &plusmn;4.2 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
