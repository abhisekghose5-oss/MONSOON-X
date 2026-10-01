import React from 'react';
import type { ForecastHorizon } from '../../types/riskMap';
import { DEMO_DATA_STATUS } from '../../data/mock/riskMap';

export interface MapTooltipData {
  locationName: string;
  metricName: string;
  value: number;
  unit: string;
  forecastHorizon: ForecastHorizon;
  status: string;
  elevationMeters?: number;
  isDemo?: boolean;
}

interface MapTooltipProps {
  data: MapTooltipData;
}

export function MapTooltip({ data }: MapTooltipProps) {
  return (
    <div className="font-mono text-xs p-2 bg-[#0B1F33] text-white rounded-xs border border-[#1E354D] space-y-1 select-none">
      <div className="flex justify-between items-center border-b border-white/20 pb-1">
        <span className="font-bold uppercase tracking-wide">{data.locationName}</span>
        {data.elevationMeters && (
          <span className="text-[10px] text-[#A4BCDA]">{data.elevationMeters}m MSL</span>
        )}
      </div>

      <div className="text-[10px] text-[#94A3B8] uppercase">{data.metricName}</div>
      <div className="text-base font-bold text-[#1479C9]">{data.value}{data.unit}</div>

      <div className="flex justify-between text-[10px] text-[#A4BCDA]">
        <span>Forecast:</span>
        <span className="font-semibold text-white">{data.forecastHorizon}</span>
      </div>

      <div className="flex justify-between text-[10px]">
        <span className="text-[#A4BCDA]">Status:</span>
        <span className="font-bold text-[#D99000]">{data.status}</span>
      </div>

      <div className="pt-1 text-[9px] text-[#F4D79C] uppercase font-bold text-center border-t border-white/10">
        {DEMO_DATA_STATUS}
      </div>
    </div>
  );
}

export default MapTooltip;
