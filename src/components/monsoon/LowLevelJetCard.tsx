import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import type { LowLevelJetMetrics, LowLevelJetPoint } from '../../types/monsoon';
import { tokens } from '../../styles/tokens';
import { Wind, CheckCircle2 } from 'lucide-react';

interface LowLevelJetCardProps {
  lljMetrics: LowLevelJetMetrics;
  className?: string;
}

function LLJTooltipContent({ active, payload }: any) {
  if (active && payload && payload.length) {
    const point = payload[0].payload as LowLevelJetPoint;
    const isAboveThreshold = point.windSpeedKnots >= point.thresholdKnots;
    return (
      <div className="rounded-sm border border-[#CBD5E1] bg-white p-3 shadow-gov-elevated text-xs font-mono space-y-1 z-50 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-[#F0F3F7] pb-1 font-bold">
          <span className="text-[#0B1F33]">{point.date} 2026</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
              isAboveThreshold
                ? 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]'
                : 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]'
            }`}
          >
            {isAboveThreshold ? '≥ 15 KTS THRESHOLD' : 'SUB-CRITICAL'}
          </span>
        </div>
        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">850 hPa Wind Speed:</span>
          <span className="font-bold text-[#1479C9]">{point.windSpeedKnots.toFixed(1)} kts</span>
        </div>
        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Zonal Westerly:</span>
          <span className="text-[#4B5B6D]">{point.zonalComponentKnots.toFixed(1)} kts</span>
        </div>
        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Onset Threshold:</span>
          <span className="text-[#D99000] font-bold">15.0 kts</span>
        </div>
      </div>
    );
  }
  return null;
}

export function LowLevelJetCard({
  lljMetrics,
  className = '',
}: LowLevelJetCardProps) {
  const {
    coreWindSpeedKnots,
    normalWindSpeedKnots,
    zonalWesterlyComponentKnots,
    moistureFluxConvergence,
    windDirectionDeg,
    statusLabel,
    crossEquatorialSurgeVerified,
    timeline,
    scientificAnalysis,
  } = lljMetrics;

  const isSatisfied = coreWindSpeedKnots >= 15.0;

  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#1479C9]" />
              850 hPa LOW-LEVEL JET (LLJ) & MOISTURE CONVERGENCE
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2] font-semibold">
              FINDLATER SOMALI JET
            </span>
          </div>
          <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
            ECMWF ERA5 / NCMRWF reanalysis of 850 hPa cross-equatorial Somali jet velocity and tropospheric moisture advection.
          </p>
        </div>

        {/* Verification Status */}
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-bold px-2.5 py-1 rounded-sm border uppercase flex items-center gap-1.5 ${
              crossEquatorialSurgeVerified
                ? 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]'
                : 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#247A4A]" />
            <span>CROSS-EQUATORIAL FLOW: VERIFIED</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Core LLJ Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          {/* Core Velocity */}
          <div className="p-3 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6E7F94] block">
              Core Jet Velocity
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#0B1F33]">{coreWindSpeedKnots.toFixed(1)}</span>
              <span className="text-xs text-[#6E7F94]">kts</span>
            </div>
            <span className="text-[10px] text-[#4B5B6D] block">
              Normal: {normalWindSpeedKnots.toFixed(1)} kts
            </span>
          </div>

          {/* Zonal Westerly Component */}
          <div className="p-3 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6E7F94] block">
              Zonal Component (U-Wind)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#1479C9]">
                {zonalWesterlyComponentKnots.toFixed(1)}
              </span>
              <span className="text-xs text-[#6E7F94]">kts</span>
            </div>
            <span className="text-[10px] text-[#247A4A] block font-semibold">
              {isSatisfied ? '≥ 15 kts Onset Criterion Met' : '< 15 kts Weak Shear'}
            </span>
          </div>

          {/* Wind Direction & Bearing */}
          <div className="p-3 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6E7F94] block">
              Bearing & Direction
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#0B1F33]">{windDirectionDeg}°</span>
              <span className="text-xs font-bold text-[#1479C9]">WSW</span>
            </div>
            <span className="text-[10px] text-[#6E7F94] block">
              South-Westerly Monsoon Flow
            </span>
          </div>

          {/* Moisture Flux Convergence */}
          <div className="p-3 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6E7F94] block">
              Moisture Flux Advection
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#247A4A]">
                {moistureFluxConvergence.toFixed(1)}
              </span>
              <span className="text-xs text-[#6E7F94]">g/kg·m/s</span>
            </div>
            <span className="text-[10px] text-[#247A4A] block font-semibold">
              Elevated Tropospheric Depth
            </span>
          </div>
        </div>

        {/* 14-Day LLJ Velocity Timeline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] uppercase text-[#6E7F94] font-semibold">
              850 hPa Wind Speed Evolution vs 15-Knot Criterion:
            </span>
            <span className="text-[11px] text-[#1479C9] font-bold">
              Status: {statusLabel}
            </span>
          </div>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeline}
                margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.chartColors.gridLines} />
                
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#6E7F94', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                
                <YAxis
                  tick={{ fontSize: 11, fill: '#6E7F94', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={false}
                  unit=" kts"
                  domain={[5, 35]}
                />

                <Tooltip content={<LLJTooltipContent />} />

                {/* 15-Knot Critical Threshold Line */}
                <ReferenceLine
                  y={15.0}
                  stroke="#D99000"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Critical Threshold (15 kts)',
                    position: 'insideBottomRight',
                    fill: '#D99000',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />

                {/* Total Wind Speed Line */}
                <Line
                  type="monotone"
                  dataKey="windSpeedKnots"
                  name="850 hPa Wind Speed (kts)"
                  stroke="#1479C9"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#1479C9' }}
                  activeDot={{ r: 5 }}
                />

                {/* Zonal Component Line */}
                <Line
                  type="monotone"
                  dataKey="zonalComponentKnots"
                  name="Zonal U-Wind (kts)"
                  stroke="#247A4A"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={{ r: 2, fill: '#247A4A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scientific Analysis Note */}
        <div className="p-3 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] text-xs font-mono text-[#334155] leading-relaxed">
          <strong className="text-[#0B1F33] uppercase block mb-0.5">
            Atmospheric Dynamics Note:
          </strong>
          {scientificAnalysis}
        </div>
      </div>
    </div>
  );
}
