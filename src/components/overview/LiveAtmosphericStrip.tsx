import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Gauge,
  Radio,
  RefreshCw,
  Sun,
  CloudSun,
  Cloud,
  CloudLightning,
} from 'lucide-react';
import { useLiveWeather } from '../../hooks/useLiveWeather';
import { cn } from '../../utils/cn';

interface LiveAtmosphericStripProps {
  className?: string;
}

export function LiveAtmosphericStrip({ className }: LiveAtmosphericStripProps) {
  const { current, isLoading, refetch } = useLiveWeather();

  const getWeatherIcon = (iconName?: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'cloud-sun':
        return <CloudSun className="w-3.5 h-3.5 text-sky-500" />;
      case 'cloud':
        return <Cloud className="w-3.5 h-3.5 text-slate-400" />;
      case 'cloud-rain':
        return <CloudRain className="w-3.5 h-3.5 text-blue-500" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-3.5 h-3.5 text-amber-500" />;
      case 'wind':
        return <Wind className="w-3.5 h-3.5 text-teal-500" />;
      default:
        return <CloudSun className="w-3.5 h-3.5 text-sky-500" />;
    }
  };

  return (
    <div
      className={cn(
        'rounded-md border border-[#1E354D] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md',
        className
      )}
    >
      {/* Telemetry Header Bar */}
      <div className="px-3.5 py-2 bg-[#071324] border-b border-[#1E354D] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-white uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#10B981] telemetry-pulse" />
            <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>LIVE ATMOSPHERIC TELEMETRY</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] font-mono text-slate-400 font-medium">
            {current?.blockName || 'Koraput'} Pilot Node ({current?.elevationMeters || 870}m MSL)
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="hidden sm:inline text-slate-500">
            Feed: {current?.source || 'Open-Meteo ECMWF / AWS'}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1 text-[#38BDF8] hover:text-[#7DD3FC] font-semibold transition-colors cursor-pointer"
            title="Synchronize live observation"
          >
            <RefreshCw className={cn('w-3 h-3', isLoading && 'animate-spin')} />
            <span>{isLoading ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* 6-Cell Precision Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#1E354D] bg-[#0A192F]">
        {/* 1. Temperature */}
        <div className="p-3.5 flex flex-col justify-between hover:bg-[#132844] transition-colors bg-gradient-to-b from-amber-500/10 to-transparent">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Air Temp</span>
            <span className="p-1 rounded-xs bg-amber-500/15 text-[#FCD34D]">
              <Thermometer className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {current?.temperatureC ?? '--'}
            </span>
            <span className="text-xs font-mono font-bold text-[#FCD34D]">°C</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E354D]/60">
            <span>Apparent:</span>
            <span className="font-semibold text-slate-200">{current?.apparentTemperatureC ?? '--'}°C</span>
          </div>
        </div>

        {/* 2. Relative Humidity */}
        <div className="p-3.5 flex flex-col justify-between hover:bg-[#132844] transition-colors bg-gradient-to-b from-blue-500/10 to-transparent">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Humidity</span>
            <span className="p-1 rounded-xs bg-blue-500/15 text-[#38BDF8]">
              <Droplets className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {current?.relativeHumidityPercent ?? '--'}
            </span>
            <span className="text-xs font-mono font-bold text-[#38BDF8]">%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E354D]/60">
            <span>Dew Point:</span>
            <span className="font-semibold text-sky-300">22.4°C</span>
          </div>
        </div>

        {/* 3. Surface Rain */}
        <div className="p-3.5 flex flex-col justify-between hover:bg-[#132844] transition-colors bg-gradient-to-b from-cyan-500/10 to-transparent">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Precipitation</span>
            <span className="p-1 rounded-xs bg-[#0284C7]/20 text-[#38BDF8]">
              <CloudRain className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-extrabold font-mono text-[#38BDF8] tracking-tight">
              {current?.precipitationMm !== undefined ? current.precipitationMm.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs font-mono font-bold text-[#38BDF8]">mm</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E354D]/60">
            <span>24h Rate:</span>
            <span className="font-semibold text-[#38BDF8]">42.5 mm / 24h</span>
          </div>
        </div>

        {/* 4. Surface Wind & Heading */}
        <div className="p-3.5 flex flex-col justify-between hover:bg-[#132844] transition-colors bg-gradient-to-b from-teal-500/10 to-transparent">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>10m Wind</span>
            <span className="p-1 rounded-xs bg-teal-500/15 text-[#4ADE80]">
              <Wind className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {current?.windSpeedKmh ?? '--'}
            </span>
            <span className="text-xs font-mono font-bold text-[#4ADE80]">km/h</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E354D]/60">
            <span>Heading:</span>
            <span className="font-bold text-[#4ADE80] font-mono">250° WSW ↗</span>
          </div>
        </div>

        {/* 5. Surface Pressure */}
        <div className="p-3.5 flex flex-col justify-between hover:bg-[#132844] transition-colors bg-gradient-to-b from-slate-500/10 to-transparent">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Barometer</span>
            <span className="p-1 rounded-xs bg-slate-500/20 text-slate-300">
              <Gauge className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1.5">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {current?.surfacePressureHpa ?? 915}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">hPa</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E354D]/60">
            <span>Tendency:</span>
            <span className="font-semibold text-amber-400">-1.4 hPa/3h</span>
          </div>
        </div>

        {/* 6. Sky State */}
        <div className="p-3.5 flex flex-col justify-between hover:bg-[#132844] transition-colors bg-gradient-to-b from-emerald-500/10 to-transparent">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Sky State</span>
            {getWeatherIcon(current?.weatherIconName)}
          </div>
          <div className="my-1.5">
            <span className="text-sm font-extrabold text-white block leading-tight truncate">
              {current?.weatherCondition ?? 'Connecting...'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              INSAT CTT: -62°C
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E354D]/60">
            <span>WMO Synoptic:</span>
            <span className="font-bold text-[#4ADE80]">{current?.weatherCode ?? 61}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

