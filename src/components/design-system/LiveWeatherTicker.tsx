import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Activity,
  Mountain,
} from 'lucide-react';
import { useLiveWeather } from '../../hooks/useLiveWeather';
import { cn } from '../../utils/cn';

interface LiveWeatherTickerProps {
  className?: string;
}

export function LiveWeatherTicker({ className }: LiveWeatherTickerProps) {
  const { current, isLoading } = useLiveWeather();
  const [showDetail, setShowDetail] = useState(false);

  const renderIcon = () => {
    if (!current) return <CloudSun className="w-4 h-4 text-sky-500 animate-pulse" />;
    switch (current.weatherIconName) {
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-500 animate-[spin_12s_linear_infinite]" />;
      case 'cloud-sun':
        return <CloudSun className="w-4 h-4 text-sky-500" />;
      case 'cloud':
        return <Cloud className="w-4 h-4 text-slate-400" />;
      case 'cloud-rain':
        return <CloudRain className="w-4 h-4 text-blue-500 animate-bounce" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-4 h-4 text-amber-400" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-teal-500" />;
      default:
        return <CloudSun className="w-4 h-4 text-sky-500" />;
    }
  };

  if (isLoading && !current) {
    return (
      <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-mono animate-pulse', className)}>
        <Activity className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-500 text-[11px]">Syncing Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDetail(!showDetail)}
        className={cn(
          'group flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-200',
          'bg-gradient-to-r from-sky-50/80 via-white to-blue-50/50',
          'border border-sky-200/70 hover:border-sky-400/80',
          'shadow-xs hover:shadow-md cursor-pointer select-none',
          className
        )}
        title="Live atmospheric observation - click for details"
      >
        {/* Pulsing Live Beacon */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        {/* Weather Condition Icon */}
        <div className="shrink-0">
          {renderIcon()}
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="font-bold text-slate-800 text-[13px]">
            {current?.temperatureC ?? '--'}°C
          </span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">•</span>
          <span className="text-slate-600 font-medium text-[11px] hidden sm:inline">
            {current?.weatherCondition ?? 'Telemetry Active'}
          </span>
          {current?.precipitationMm !== undefined && current.precipitationMm > 0 && (
            <span className="px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700 text-[10px] font-semibold">
              {current.precipitationMm} mm
            </span>
          )}
        </div>

        <span className="text-[10px] font-mono text-sky-600 bg-sky-100/70 px-1.5 py-0.2 rounded-full hidden md:inline">
          LIVE
        </span>
      </button>

      {/* Expanded Microclimate Popover */}
      {showDetail && current && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetail(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-xl glass-panel bg-white/95 border border-sky-200 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Mountain className="w-4 h-4 text-sky-600" />
                <span>{current.blockName} Block Microclimate</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-semibold">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-slate-400 text-[10px]">Apparent Temp</span>
                <span className="font-bold text-slate-800 text-sm">{current.apparentTemperatureC}°C</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" /> Humidity
                </span>
                <span className="font-bold text-slate-800 text-sm">{current.relativeHumidityPercent}%</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Wind className="w-3 h-3 text-teal-500" /> Wind Speed
                </span>
                <span className="font-bold text-slate-800 text-sm">{current.windSpeedKmh} km/h</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-slate-400 text-[10px]">Elevation</span>
                <span className="font-bold text-slate-800 text-sm">{current.elevationMeters}m</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Source: {current.source}</span>
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
