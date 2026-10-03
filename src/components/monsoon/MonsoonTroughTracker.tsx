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
import type { MonsoonTroughState, TroughLatitudePoint } from '../../types/monsoon';
import { tokens } from '../../styles/tokens';
import { Navigation, AlertTriangle, CloudRain, ShieldCheck } from 'lucide-react';

interface MonsoonTroughTrackerProps {
  troughState: MonsoonTroughState;
  className?: string;
}

function TroughTooltipContent({ active, payload }: any) {
  if (active && payload && payload.length) {
    const point = payload[0].payload as TroughLatitudePoint;
    const isBreakRisk = point.observedLat >= 25.5;
    return (
      <div className="rounded-sm border border-[#1E354D] bg-[#071324] p-3 shadow-command-elevated text-xs font-mono space-y-1 z-50 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-[#1E354D] pb-1 font-bold">
          <span className="text-white">{point.date} 2026</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
              isBreakRisk
                ? 'bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/40'
                : 'bg-[#10B981]/20 text-[#4ADE80] border-[#10B981]/40'
            }`}
          >
            {isBreakRisk ? 'FOOTHILLS SHIFT' : 'ACTIVE AXIS'}
          </span>
        </div>
        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">Observed Trough Axis:</span>
          <span className="font-bold text-[#38BDF8]">{point.observedLat.toFixed(1)}° N</span>
        </div>
        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">Climatological Normal:</span>
          <span className="text-slate-300">{point.normalLat.toFixed(1)}° N</span>
        </div>
        <div className="flex justify-between gap-3 text-slate-200">
          <span className="text-slate-400">Himalayan Foothills Break:</span>
          <span className="text-[#F87171] font-bold">{point.foothillsLat.toFixed(1)}° N</span>
        </div>
      </div>
    );
  }
  return null;
}

export function MonsoonTroughTracker({
  troughState,
  className = '',
}: MonsoonTroughTrackerProps) {
  const {
    currentAxisLat,
    normalAxisLat,
    foothillsBreakLat,
    breakHazardRisk,
    activeLowPressureAreas,
    synopticSystemName,
    synopticSummary,
    latitudeTimeline,
  } = troughState;

  const isNearFoothills = currentAxisLat >= 25.5;

  return (
    <div className={`bg-[#0A192F]/90 rounded-md border border-[#1E354D] shadow-command-panel overflow-hidden backdrop-blur-md ${className}`}>
      {/* Header Bar */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#38BDF8]" />
              SYNOPTIC MONSOON TROUGH LATITUDINAL TRACKER
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 font-semibold">
              IMD SYNOPTIC SCAN
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Real-time monitoring of monsoon trough mean latitude. Northward displacement to Himalayan foothills triggers agricultural break monsoon.
          </p>
        </div>

        {/* Hazard Risk Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-bold px-2.5 py-1 rounded-sm border uppercase flex items-center gap-1.5 ${
              breakHazardRisk === 'HIGH'
                ? 'bg-[#EF4444]/20 text-[#F87171] border-[#EF4444]/40'
                : breakHazardRisk === 'MODERATE'
                ? 'bg-[#F59E0B]/20 text-[#FCD34D] border-[#F59E0B]/40'
                : 'bg-[#10B981]/20 text-[#4ADE80] border-[#10B981]/40'
            }`}
          >
            {breakHazardRisk === 'LOW' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-[#FCD34D]" />
            )}
            <span>BREAK MONSOON HAZARD: {breakHazardRisk}</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Synoptic State Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          {/* Axis Latitude Position */}
          <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Current Mean Trough Axis
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white">{currentAxisLat.toFixed(1)}° N</span>
              <span className="text-[11px] text-slate-400">
                (Normal: {normalAxisLat.toFixed(1)}° N)
              </span>
            </div>
            <span className="text-[10px] text-[#4ADE80] block font-semibold">
              {isNearFoothills ? 'Northward Migration' : 'Peninsular Rain Active'}
            </span>
          </div>

          {/* Active Bay of Bengal Depressions */}
          <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Bay of Bengal Synoptic Lows
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#38BDF8]">{activeLowPressureAreas} Active</span>
              <CloudRain className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <span className="text-[10px] text-sky-300 block truncate font-medium" title={synopticSystemName}>
              {synopticSystemName}
            </span>
          </div>

          {/* Foothills Break Margin */}
          <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Foothills Break Margin
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white">
                +{(foothillsBreakLat - currentAxisLat).toFixed(1)}°
              </span>
              <span className="text-[11px] text-slate-400">Buffer to 27.0°N</span>
            </div>
            <span className="text-[10px] text-[#4ADE80] block font-semibold">
              Adequate buffer against peninsular dry spell
            </span>
          </div>
        </div>

        {/* Latitudinal Migration Timeline Chart */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
            14-Day Trough Latitudinal Oscillation (° North):
          </span>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={latitudeTimeline}
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
                  unit="°"
                  domain={[19, 28]}
                />

                <Tooltip content={<TroughTooltipContent />} />

                {/* Climatological Normal Axis Line (22.5° N) */}
                <ReferenceLine
                  y={normalAxisLat}
                  stroke="#64748B"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Normal Axis (22.5° N)',
                    position: 'insideBottomRight',
                    fill: '#94A3B8',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />

                {/* Himalayan Foothills Break Danger Threshold (27.0° N) */}
                <ReferenceLine
                  y={foothillsBreakLat}
                  stroke="#F87171"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Foothills Break Line (27.0° N)',
                    position: 'insideTopRight',
                    fill: '#F87171',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />

                {/* Observed Trough Latitude Curve */}
                <Line
                  type="monotone"
                  dataKey="observedLat"
                  name="Trough Axis Latitude (°N)"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#38BDF8' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Synoptic Meteorological Synthesis */}
        <div className="p-3 rounded-sm bg-[#071324] border border-[#1E354D] text-xs font-mono text-slate-300 leading-relaxed">
          <strong className="text-white uppercase block mb-0.5">
            IMD Synoptic Synthesis:
          </strong>
          {synopticSummary}
        </div>
      </div>
    </div>
  );
}
