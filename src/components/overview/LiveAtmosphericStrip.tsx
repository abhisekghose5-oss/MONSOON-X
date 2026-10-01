import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Mountain,
  Gauge,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { useLiveWeather } from '../../hooks/useLiveWeather';
import { cn } from '../../utils/cn';

interface LiveAtmosphericStripProps {
  className?: string;
}

export function LiveAtmosphericStrip({ className }: LiveAtmosphericStripProps) {
  const { current, isLoading, isError, refetch } = useLiveWeather();

  return (
    <div
      className={cn(
        'rounded-xl glass-panel p-4.5 border border-sky-100 shadow-xs transition-all duration-200',
        'bg-gradient-to-r from-sky-50/50 via-white to-blue-50/30',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-display flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-sky-600" />
              Live Downscaled Weather Telemetry
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold">
              {current?.blockName || 'Koraput'} Pilot Node
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <span className="text-[11px] truncate hidden sm:inline">
            Feed: {current?.source || 'Open-Meteo High-Resolution (ECMWF)'}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold transition-colors cursor-pointer"
            title="Refresh atmospheric observation"
          >
            <RefreshCw className={cn('w-3 h-3', isLoading && 'animate-spin')} />
            <span className="text-[11px]">{isLoading ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Temperature */}
        <div className="p-2.5 rounded-lg bg-white/80 border border-slate-100 shadow-2xs flex flex-col hover:border-sky-200 transition-colors">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-amber-500" /> Temperature
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-slate-900">
              {current?.temperatureC ?? '--'}
            </span>
            <span className="text-xs font-mono text-slate-500">°C</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 truncate">
            Feels like {current?.apparentTemperatureC ?? '--'}°C
          </span>
        </div>

        {/* 2. Weather Condition */}
        <div className="p-2.5 rounded-lg bg-white/80 border border-slate-100 shadow-2xs flex flex-col hover:border-sky-200 transition-colors">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Sky State
          </span>
          <div className="mt-1">
            <span className="text-sm font-bold text-slate-800 line-clamp-1">
              {current?.weatherCondition ?? 'Connecting...'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 mt-0.5">
            WMO Code: {current?.weatherCode ?? '--'}
          </span>
        </div>

        {/* 3. Relative Humidity */}
        <div className="p-2.5 rounded-lg bg-white/80 border border-slate-100 shadow-2xs flex flex-col hover:border-sky-200 transition-colors">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-500" /> Humidity
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-slate-900">
              {current?.relativeHumidityPercent ?? '--'}
            </span>
            <span className="text-xs font-mono text-slate-500">%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {current && current.relativeHumidityPercent > 70 ? 'Moist boundary layer' : 'Moderate ambient'}
          </span>
        </div>

        {/* 4. Surface Wind */}
        <div className="p-2.5 rounded-lg bg-white/80 border border-slate-100 shadow-2xs flex flex-col hover:border-sky-200 transition-colors">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <Wind className="w-3 h-3 text-teal-500" /> 10m Wind
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-slate-900">
              {current?.windSpeedKmh ?? '--'}
            </span>
            <span className="text-xs font-mono text-slate-500">km/h</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {current && current.windSpeedKmh > 15 ? 'Active Low-Level Jet' : 'Normal troposphere'}
          </span>
        </div>

        {/* 5. Precipitation */}
        <div className="p-2.5 rounded-lg bg-white/80 border border-slate-100 shadow-2xs flex flex-col hover:border-sky-200 transition-colors">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <CloudRain className="w-3 h-3 text-sky-500" /> Surface Rain
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-slate-900">
              {current?.precipitationMm ?? '0.0'}
            </span>
            <span className="text-xs font-mono text-slate-500">mm</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {current && current.precipitationMm > 0 ? 'Convective showers' : 'No active rain'}
          </span>
        </div>

        {/* 6. Elevation & Pressure */}
        <div className="p-2.5 rounded-lg bg-white/80 border border-slate-100 shadow-2xs flex flex-col hover:border-sky-200 transition-colors">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <Mountain className="w-3 h-3 text-slate-500" /> Terrain
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-slate-900">
              {current?.elevationMeters ?? '870'}
            </span>
            <span className="text-xs font-mono text-slate-500">m</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
            {current?.surfacePressureHpa ?? 915} hPa
          </span>
        </div>
      </div>
    </div>
  );
}
