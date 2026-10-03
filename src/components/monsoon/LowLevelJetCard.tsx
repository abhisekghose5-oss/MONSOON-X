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
      <div className="rounded-sm border border-[#1E354D] bg-[#071324] p-3 shadow-command-elevated text-xs font-mono space-y-1 z-50 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-[#1E354D] pb-1 font-bold">
          <span className="text-white">{point.date} 2026</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
              isAboveThreshold
                ? 'bg-[#10B981]/20 text-[#4ADE80] border-[#10B981]/40'
                : 'bg-[#F59E0B]/20 text-[#FCD34D] border-[#F59E0B]/40'
            }`}
          >
            {isAboveThreshold ? '≥ 15 KTS THRESHOLD' : 'SUB-CRITICAL'}
          </span>
        </div>
        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">850 hPa Wind Speed:</span>
          <span className="font-bold text-[#38BDF8]">{point.windSpeedKnots.toFixed(1)} kts</span>
        </div>
        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">Zonal Westerly:</span>
          <span className="text-slate-300">{point.zonalComponentKnots.toFixed(1)} kts</span>
        </div>
        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">Onset Threshold:</span>
          <span className="text-[#FCD34D] font-bold">15.0 kts</span>
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
    <div className={`bg-[#0A192F]/90 rounded-md border border-[#1E354D] shadow-command-panel overflow-hidden backdrop-blur-md ${className}`}>
      {/* Header Bar */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#38BDF8]" />
              850 hPa LOW-LEVEL JET (LLJ) & MOISTURE CONVERGENCE
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 font-semibold">
              FINDLATER SOMALI JET
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            ECMWF ERA5 / NCMRWF reanalysis of 850 hPa cross-equatorial Somali jet velocity and tropospheric moisture advection.
          </p>
        </div>

        {/* Verification Status */}
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-bold px-2.5 py-1 rounded-sm border uppercase flex items-center gap-1.5 ${
              crossEquatorialSurgeVerified
                ? 'bg-[#10B981]/20 text-[#4ADE80] border-[#10B981]/40'
                : 'bg-[#F59E0B]/20 text-[#FCD34D] border-[#F59E0B]/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>CROSS-EQUATORIAL FLOW: VERIFIED</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Core LLJ Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          {/* Core Velocity */}
          <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Core Jet Velocity
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{coreWindSpeedKnots.toFixed(1)}</span>
              <span className="text-xs text-slate-400">kts</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Normal: {normalWindSpeedKnots.toFixed(1)} kts
            </span>
          </div>

          {/* Zonal Westerly Component */}
          <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Zonal Component (U-Wind)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#38BDF8]">
                {zonalWesterlyComponentKnots.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">kts</span>
            </div>
            <span className="text-[10px] text-[#4ADE80] block font-semibold">
              {isSatisfied ? '≥ 15 kts Onset Criterion Met' : '< 15 kts Weak Shear'}
            </span>
          </div>

          {/* Wind Direction & Bearing */}
          <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Bearing & Direction
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{windDirectionDeg}°</span>
              <span className="text-xs font-bold text-[#38BDF8]">WSW</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              South-Westerly Flow
            </span>
          </div>

          {/* Moisture Flux Convergence */}
          <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Moisture Flux Advection
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#4ADE80]">
                {moistureFluxConvergence.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">g/kg·m/s</span>
            </div>
            <span className="text-[10px] text-[#4ADE80] block font-semibold">
              Tropospheric Depth High
            </span>
          </div>
        </div>

        {/* 14-Day LLJ Velocity Timeline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] uppercase text-slate-400 font-semibold">
              850 hPa Wind Speed Evolution vs 15-Knot Criterion:
            </span>
            <span className="text-[11px] text-[#38BDF8] font-bold">
              Status: {statusLabel}
            </span>
          </div>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeline}
                margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E354D" />
                
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={{ stroke: '#1E354D' }}
                />
                
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={false}
                  unit=" kts"
                  domain={[5, 35]}
                />

                <Tooltip content={<LLJTooltipContent />} />

                {/* 15-Knot Critical Threshold Line */}
                <ReferenceLine
                  y={15.0}
                  stroke="#FCD34D"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Critical Threshold (15 kts)',
                    position: 'insideBottomRight',
                    fill: '#FCD34D',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />

                {/* Total Wind Speed Line */}
                <Line
                  type="monotone"
                  dataKey="windSpeedKnots"
                  name="850 hPa Wind Speed (kts)"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#38BDF8' }}
                  activeDot={{ r: 5 }}
                />

                {/* Zonal Component Line */}
                <Line
                  type="monotone"
                  dataKey="zonalComponentKnots"
                  name="Zonal U-Wind (kts)"
                  stroke="#4ADE80"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={{ r: 2, fill: '#4ADE80' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scientific Analysis Note */}
        <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] text-xs font-mono text-slate-300 leading-relaxed">
          <strong className="text-white uppercase block mb-0.5">
            Atmospheric Dynamics Note:
          </strong>
          {scientificAnalysis}
        </div>
      </div>
    </div>
  );
}
