import React from 'react';
import { Waves, CloudLightning, Wind, Compass, AlertCircle, ArrowUpRight, ShieldCheck, MapPin } from 'lucide-react';
import type { MonsoonTroughState } from '../../types/monsoon';

interface BayOfBengalSystemsCardProps {
  troughState: MonsoonTroughState;
  className?: string;
}

export function BayOfBengalSystemsCard({ troughState, className = '' }: BayOfBengalSystemsCardProps) {
  const { activeLowPressureAreas, synopticSystemName, synopticSummary } = troughState;

  // Realistic synoptic timeline stages for Bay of Bengal low-pressure lifecycle
  const trackingStages = [
    {
      time: '-24h OBSERVED',
      stage: 'Cyclonic Circulation',
      location: 'East-Central Bay of Bengal (16.5°N, 88.2°E)',
      intensity: '1004 hPa · 15 kts',
      status: 'past',
    },
    {
      time: 'CURRENT POSITION',
      stage: 'Well-Marked Low (WML)',
      location: 'North-West Bay off South Odisha Coast (19.1°N, 86.4°E)',
      intensity: '998 hPa · 24 kts',
      status: 'active',
    },
    {
      time: '+24h FORECAST',
      stage: 'Inland Crossing / Depression',
      location: 'South Odisha Coast (Gopalpur–Kalingapatnam)',
      intensity: '996 hPa · 28 kts',
      status: 'forecast',
    },
    {
      time: '+48h FORECAST',
      stage: 'Escarpment Passage',
      location: 'Eastern Ghats / Koraput Highlands (18.8°N, 82.7°E)',
      intensity: '1002 hPa · 18 kts',
      status: 'forecast',
    },
  ];

  return (
    <div className={`bg-[#0A192F]/90 rounded-md border border-[#1E354D] shadow-command-panel overflow-hidden backdrop-blur-md ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-[#38BDF8]" />
              BAY OF BENGAL SYNOPTIC SYSTEMS & DEPRESSION TRACKER
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 font-semibold">
              IMD RSMC BULLETIN
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Real-time diagnostic of cyclonic disturbances, depressions, and low-pressure pulses in the North & Central Bay of Bengal modulating precipitation in Koraput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-sm border uppercase flex items-center gap-1.5 bg-[#10B981]/20 text-[#4ADE80] border-[#10B981]/40">
            <CloudLightning className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>ACTIVE SYSTEMS: {activeLowPressureAreas}</span>
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Active System Identity Box */}
        <div className="p-3.5 rounded-sm bg-[#071324] border border-[#1E354D] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0284C7] text-white uppercase shadow-xs">
                PRIMARY DRIVER
              </span>
              <span className="text-xs font-bold text-white font-mono">
                {synopticSystemName || 'Well-Marked Low Pressure System over NW Bay'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {synopticSummary ||
                'Monsoon trough extends southeastwards into North-West Bay of Bengal through coastal Odisha. Low-level cyclonic vorticity maintains continuous convective cloud bands across Koraput highlands.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#0A192F] border border-[#1E354D] text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Central Pressure</span>
              <span className="text-sm font-bold text-white">998 hPa</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A192F] border border-[#1E354D] text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Max Gale Wind</span>
              <span className="text-sm font-bold text-[#38BDF8]">24 kts</span>
            </div>
            <div className="p-2.5 rounded bg-[#0A192F] border border-[#1E354D] text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Dist to Koraput</span>
              <span className="text-sm font-bold text-[#4ADE80]">~240 km ESE</span>
            </div>
          </div>
        </div>

        {/* Synoptic Trajectory / Timeline Progression */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
            ESTIMATED SYSTEM TRACK & EVOLUTION TIMELINE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
            {trackingStages.map((stage, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-sm border text-xs font-mono space-y-1.5 transition-colors ${stage.status === 'active'
                    ? 'bg-[#0284C7]/15 border-[#38BDF8] ring-1 ring-[#38BDF8]/40 shadow-glow-cyan'
                    : stage.status === 'past'
                      ? 'bg-[#071324]/60 border-[#1E354D]/60 opacity-60'
                      : 'bg-[#071324] border-[#1E354D]'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">{stage.time}</span>
                  {stage.status === 'active' && (
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
                  )}
                </div>
                <div className="font-bold text-white text-[13px]">{stage.stage}</div>
                <div className="text-[11px] text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#38BDF8] shrink-0" />
                  <span className="truncate">{stage.location}</span>
                </div>
                <div className="text-[10px] font-semibold text-[#38BDF8] bg-[#0A192F] px-1.5 py-0.5 rounded border border-[#1E354D]">
                  {stage.intensity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono border-t border-[#1E354D]">
          <div className="flex items-center gap-2 text-slate-300">
            <Wind className="w-4 h-4 text-[#38BDF8]" />
            <span><strong className="text-white">Orographic Forcing:</strong> Active on Eastern Ghats windward slopes</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Compass className="w-4 h-4 text-[#4ADE80]" />
            <span><strong className="text-white">Moisture Influx Vector:</strong> 250° WSW at 32 m/s flux</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
            <span><strong className="text-white">Squall Hazard:</strong> Isolated 45 km/h gusts in Pottangi & Nandapur</span>
          </div>
        </div>
      </div>
    </div>
  );
}
