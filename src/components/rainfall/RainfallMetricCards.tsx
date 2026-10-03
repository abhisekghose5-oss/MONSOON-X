import React from 'react';
import {
  CloudRain,
  Calendar,
  Layers,
  Droplets,
  Gauge,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { DataStatusBadge } from '../design-system/DataStatusBadge';
import type { RainfallSummaryMetrics } from '../../types/rainfall';

export interface RainfallMetricCardsProps {
  metrics: RainfallSummaryMetrics;
  isDataAvailable?: boolean;
}

export function RainfallMetricCards({ metrics, isDataAvailable = true }: RainfallMetricCardsProps) {
  const cards = [
    {
      id: 'current',
      title: 'CURRENT RAINFALL',
      value: isDataAvailable && metrics.currentRainfallMm !== null ? metrics.currentRainfallMm.toFixed(1) : '--',
      unit: 'mm',
      period: 'Today (08:30 IST)',
      status: metrics.currentStatus,
      source: metrics.currentSource,
      icon: Droplets,
      subtext: isDataAvailable ? metrics.currentStationName : 'Data unavailable',
      departure: null,
    },
    {
      id: '7day',
      title: '7-DAY ACCUMULATION',
      value: isDataAvailable && metrics.sevenDayAccumulationMm !== null ? metrics.sevenDayAccumulationMm.toFixed(1) : '--',
      unit: 'mm',
      period: 'Past 7 Days',
      status: metrics.sevenDayDataStatus,
      source: metrics.sevenDaySource,
      icon: CloudRain,
      subtext: isDataAvailable && metrics.sevenDayNormalMm !== null ? `Normal: ${metrics.sevenDayNormalMm.toFixed(1)} mm` : 'Data unavailable',
      departure: isDataAvailable ? metrics.sevenDayDeparturePercent : null,
    },
    {
      id: '30day',
      title: '30-DAY ACCUMULATION',
      value: isDataAvailable && metrics.thirtyDayAccumulationMm !== null ? metrics.thirtyDayAccumulationMm.toFixed(1) : '--',
      unit: 'mm',
      period: 'Past 30 Days',
      status: metrics.thirtyDayDataStatus,
      source: metrics.thirtyDaySource,
      icon: Calendar,
      subtext: isDataAvailable && metrics.thirtyDayNormalMm !== null ? `Normal: ${metrics.thirtyDayNormalMm.toFixed(1)} mm` : 'Data unavailable',
      departure: isDataAvailable ? metrics.thirtyDayDeparturePercent : null,
    },
    {
      id: 'seasonal',
      title: 'SEASONAL ACCUMULATION',
      value: isDataAvailable && metrics.seasonalRainfallMm !== null ? metrics.seasonalRainfallMm.toFixed(1) : '--',
      unit: 'mm',
      period: 'June 1 – Sept 30',
      status: metrics.seasonalDataStatus,
      source: metrics.seasonalSource,
      icon: Layers,
      subtext: isDataAvailable && metrics.seasonalNormalMm !== null ? `LPA Normal: ${metrics.seasonalNormalMm.toFixed(1)} mm` : 'Data unavailable',
      departure: isDataAvailable ? metrics.seasonalDeparturePercent : null,
    },
    {
      id: 'normal',
      title: 'RAINFALL NORMAL',
      value: isDataAvailable && metrics.historicalNormalMm !== null ? metrics.historicalNormalMm.toFixed(1) : (metrics.historicalNormalMm !== null ? metrics.historicalNormalMm.toFixed(1) : '--'),
      unit: 'mm',
      period: '1971–2020 Climatology',
      status: metrics.normalDataStatus,
      source: metrics.normalSource,
      icon: Gauge,
      subtext: isDataAvailable && metrics.annualHistoricalNormalMm ? `Annual: ${metrics.annualHistoricalNormalMm.toFixed(1)} mm` : 'Data unavailable',
      departure: null,
    },
    {
      id: 'anomaly',
      title: 'RAINFALL ANOMALY',
      value: isDataAvailable && metrics.rainfallAnomalyPercent !== null
        ? `${metrics.rainfallAnomalyPercent > 0 ? '+' : ''}${metrics.rainfallAnomalyPercent.toFixed(1)}%`
        : '--',
      unit: '',
      period: 'June–September',
      status: metrics.anomalyDataStatus,
      source: metrics.anomalySource,
      icon: metrics.rainfallAnomalyPercent !== null && metrics.rainfallAnomalyPercent >= 0 ? TrendingUp : TrendingDown,
      subtext: isDataAvailable ? `${metrics.rainfallAnomalyCategory} Departure` : 'Data unavailable',
      departure: isDataAvailable ? metrics.rainfallAnomalyPercent : null,
      isAnomalyCard: true,
    },
  ];

  return (
    <div className="w-full">
      {/* Horizontally scrollable container on mobile, responsive grid on desktop */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-2 scrollbar-thin">
        {cards.map((c) => {
          const Icon = c.icon;
          const isPositive = c.departure !== null && c.departure >= 0;
          const isNegative = c.departure !== null && c.departure < 0;

          return (
            <div
              key={c.id}
              className="min-w-[220px] md:min-w-0 flex-1 bg-[#0A192F]/85 backdrop-blur-md border border-[#1E354D] rounded-lg p-3.5 flex flex-col justify-between shadow-command-panel hover:border-[#0284C7]/50 hover:shadow-[0_0_15px_rgba(2,132,199,0.15)] transition-all text-white"
            >
              <div>
                {/* Header: Title and DataStatusBadge */}
                <div className="flex items-start justify-between gap-1.5 mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    {c.title}
                  </span>
                  <DataStatusBadge status={c.status || 'OFFICIAL'} size="xs" />
                </div>

                {/* Primary Metric Value */}
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-bold font-mono tracking-tight text-white">
                    {c.value}
                  </span>
                  {c.unit && (
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {c.unit}
                    </span>
                  )}
                </div>

                {/* Departure Indicator (if applicable) */}
                {c.departure !== null && !c.isAnomalyCard && (
                  <div className="flex items-center gap-1 text-[11px] font-mono mt-0.5">
                    {isPositive ? (
                      <span className="text-[#4ADE80] font-semibold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        +{c.departure.toFixed(1)}%
                      </span>
                    ) : isNegative ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" />
                        {c.departure.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-slate-400">0.0%</span>
                    )}
                    <span className="text-slate-500 text-[10px]">vs Normal</span>
                  </div>
                )}

                {/* Subtext */}
                <p className="text-[11px] text-slate-400 font-mono mt-1 truncate" title={c.subtext}>
                  {c.subtext}
                </p>
              </div>

              {/* Card Footer: Period & Source */}
              <div className="pt-2.5 mt-2 border-t border-[#1E354D] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 truncate" title={c.period}>
                  <Icon className="w-3 h-3 text-[#38BDF8] shrink-0" />
                  <span className="truncate text-slate-300">{c.period}</span>
                </span>
                <span className="text-slate-400 shrink-0 ml-1 font-semibold">{c.source}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default RainfallMetricCards;
