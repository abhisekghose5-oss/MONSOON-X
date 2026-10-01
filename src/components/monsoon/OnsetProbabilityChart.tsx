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
      <div className="rounded-sm border border-[#CBD5E1] bg-white p-3 shadow-gov-elevated text-xs font-mono space-y-1.5 z-50 min-w-[210px]">
        <div className="flex items-center justify-between border-b border-[#F0F3F7] pb-1">
          <span className="font-bold text-[#0B1F33]">{point.dayLabel} 2026</span>
          {point.isModelPeakDate && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2] font-bold">
              MODEL PEAK
            </span>
          )}
          {point.isNormalDate && !point.isModelPeakDate && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] font-semibold">
              IMD NORMAL
            </span>
          )}
        </div>

        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Daily Onset PDF:</span>
          <span className="font-bold text-[#1479C9]">{point.pdfProbability.toFixed(1)}%</span>
        </div>

        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Cumulative CDF:</span>
          <span className="font-bold text-[#247A4A]">{point.cdfProbability.toFixed(1)}%</span>
        </div>

        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">IMD Climatology PDF:</span>
          <span className="text-[#64748B] font-mono">{point.historicalNormalPdf.toFixed(1)}%</span>
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
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden ${className}`}>
      {/* Header with Credible Interval Badges */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1479C9]" />
              BAYESIAN ONSET PROBABILITY DISTRIBUTION (PDF / CDF)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2] font-semibold">
              CALIBRATED ONSET WINDOW
            </span>
          </div>
          <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
            Probability density function (PDF) and cumulative distribution (CDF) combining 850 hPa LLJ zonal shear and INSAT convective depth.
          </p>
        </div>

        {/* Bayesian Credible Interval Display */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-sm bg-white border border-[#CBD5E1] shadow-xs flex items-center gap-1.5">
            <span className="text-[10px] text-[#6E7F94] uppercase font-bold">50% Credible:</span>
            <span className="font-bold text-[#1479C9]">
              {summary.confidenceInterval50[0]} – {summary.confidenceInterval50[1]}
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-sm bg-white border border-[#CBD5E1] shadow-xs flex items-center gap-1.5">
            <span className="text-[10px] text-[#6E7F94] uppercase font-bold">90% Credible:</span>
            <span className="font-bold text-[#0B1F33]">
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.chartColors.gridLines} />
              
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 11, fill: '#6E7F94', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              
              {/* Left Y-Axis: Daily PDF (%) */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#1479C9', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[0, 20]}
              />

              {/* Right Y-Axis: Cumulative CDF (%) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#247A4A', fontFamily: 'JetBrains Mono' }}
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
                  fill: '#64748B',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              {/* Reference Line for Model Predicted Onset Mode */}
              <ReferenceLine
                x="12 Jun"
                yAxisId="left"
                stroke="#1479C9"
                strokeWidth={1.5}
                label={{
                  value: 'Model Mode (12 Jun)',
                  position: 'insideTopRight',
                  fill: '#1479C9',
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
                stroke="#94A3B8"
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
                fill="#1479C9"
                fillOpacity={0.2}
                stroke="#1479C9"
                strokeWidth={2}
                dot={{ r: 2, fill: '#1479C9' }}
                activeDot={{ r: 5 }}
              />

              {/* Cumulative Onset Distribution CDF Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cdfProbability"
                name="Cumulative Onset CDF (%)"
                stroke="#247A4A"
                strokeWidth={2}
                dot={{ r: 2, fill: '#247A4A' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Diagnostic Metadata Footer */}
        <div className="mt-3 pt-3 border-t border-[#F0F3F7] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#247A4A]">
            <ShieldCheck className="w-4 h-4 text-[#247A4A] shrink-0" />
            <span className="font-semibold">
              Peak Posterior Mode: {summary.predictedDate} (Daily density: {summary.peakProbability}%, Confidence: {summary.confidenceScore}%)
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#6E7F94]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Standard Deviation (\(\sigma\)): &plusmn;2.4 days vs IMD climatology &plusmn;4.2 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
