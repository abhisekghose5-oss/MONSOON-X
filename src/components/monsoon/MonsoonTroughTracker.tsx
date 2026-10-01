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
      <div className="rounded-sm border border-[#CBD5E1] bg-white p-3 shadow-gov-elevated text-xs font-mono space-y-1 z-50 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-[#F0F3F7] pb-1 font-bold">
          <span className="text-[#0B1F33]">{point.date} 2026</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
              isBreakRisk
                ? 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]'
                : 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]'
            }`}
          >
            {isBreakRisk ? 'FOOTHILLS SHIFT' : 'ACTIVE AXIS'}
          </span>
        </div>
        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Observed Trough Axis:</span>
          <span className="font-bold text-[#1479C9]">{point.observedLat.toFixed(1)}° N</span>
        </div>
        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Climatological Normal:</span>
          <span className="text-[#4B5B6D]">{point.normalLat.toFixed(1)}° N</span>
        </div>
        <div className="flex justify-between gap-3 text-[#0B1F33]">
          <span className="text-[#6E7F94]">Himalayan Foothills Break:</span>
          <span className="text-[#C43D3D] font-bold">{point.foothillsLat.toFixed(1)}° N</span>
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
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#1479C9]" />
              SYNOPTIC MONSOON TROUGH LATITUDINAL TRACKER
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white">
              IMD SYNOPTIC SCAN
            </span>
          </div>
          <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
            Real-time monitoring of monsoon trough mean latitude. Northward displacement to Himalayan foothills triggers agricultural break monsoon.
          </p>
        </div>

        {/* Hazard Risk Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-bold px-2.5 py-1 rounded-sm border uppercase flex items-center gap-1.5 ${
              breakHazardRisk === 'HIGH'
                ? 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]'
                : breakHazardRisk === 'MODERATE'
                ? 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]'
                : 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]'
            }`}
          >
            {breakHazardRisk === 'LOW' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#247A4A]" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-[#D99000]" />
            )}
            <span>BREAK MONSOON HAZARD: {breakHazardRisk}</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Synoptic State Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          {/* Axis Latitude Position */}
          <div className="p-3 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6E7F94] block">
              Current Mean Trough Axis
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0B1F33]">{currentAxisLat.toFixed(1)}° N</span>
              <span className="text-[11px] text-[#4B5B6D]">
                (Normal: {normalAxisLat.toFixed(1)}° N)
              </span>
            </div>
            <span className="text-[10px] text-[#247A4A] block font-semibold">
              {isNearFoothills ? 'Northward Migration' : 'Peninsular Rain Active'}
            </span>
          </div>

          {/* Active Bay of Bengal Depressions */}
          <div className="p-3 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6E7F94] block">
              Bay of Bengal Synoptic Lows
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#1479C9]">{activeLowPressureAreas} Active</span>
              <CloudRain className="w-4 h-4 text-[#1479C9]" />
            </div>
            <span className="text-[10px] text-[#0C4E83] block truncate font-medium" title={synopticSystemName}>
              {synopticSystemName}
            </span>
          </div>

          {/* Foothills Break Margin */}
          <div className="p-3 rounded-sm bg-[#F8FAFC] border border-[#CBD5E1] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#6E7F94] block">
              Foothills Break Margin
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0B1F33]">
                +{(foothillsBreakLat - currentAxisLat).toFixed(1)}°
              </span>
              <span className="text-[11px] text-[#6E7F94]">Buffer to 27.0°N</span>
            </div>
            <span className="text-[10px] text-[#247A4A] block font-semibold">
              Adequate buffer against peninsular dry spell
            </span>
          </div>
        </div>

        {/* Latitudinal Migration Timeline Chart */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-semibold block">
            14-Day Trough Latitudinal Oscillation (° North):
          </span>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={latitudeTimeline}
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
                    fill: '#64748B',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />

                {/* Himalayan Foothills Break Danger Threshold (27.0° N) */}
                <ReferenceLine
                  y={foothillsBreakLat}
                  stroke="#C43D3D"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Foothills Break Line (27.0° N)',
                    position: 'insideTopRight',
                    fill: '#C43D3D',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                  }}
                />

                {/* Observed Trough Latitude Curve */}
                <Line
                  type="monotone"
                  dataKey="observedLat"
                  name="Trough Axis Latitude (°N)"
                  stroke="#1479C9"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#1479C9' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Synoptic Meteorological Synthesis */}
        <div className="p-3 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] text-xs font-mono text-[#334155] leading-relaxed">
          <strong className="text-[#0B1F33] uppercase block mb-0.5">
            IMD Synoptic Synthesis:
          </strong>
          {synopticSummary}
        </div>
      </div>
    </div>
  );
}
