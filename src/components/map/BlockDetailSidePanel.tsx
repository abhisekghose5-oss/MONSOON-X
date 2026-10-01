import React from 'react';
import type { BlockRiskGeoProperties, PanchayatInfo } from '../../types/riskMap';
import { RiskBadge } from '../design-system/RiskBadge';
import {
  X,
  MapPin,
  Mountain,
  Sprout,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface BlockDetailSidePanelProps {
  block: BlockRiskGeoProperties;
  panchayats: PanchayatInfo[];
  forecastHorizon: string;
  onClose: () => void;
  onSelectPanchayat?: (panchayat: PanchayatInfo) => void;
  selectedPanchayatId?: string | null;
  isPanchayatGeoAvailable?: boolean;
}

export function BlockDetailSidePanel({
  block,
  panchayats,
  forecastHorizon,
  onClose,
  onSelectPanchayat,
  selectedPanchayatId,
  isPanchayatGeoAvailable = false,
}: BlockDetailSidePanelProps) {
  return (
    <aside
      className="w-full lg:w-96 bg-white border-l border-[#CBD5E1] flex flex-col h-full shadow-gov-elevated z-[1000] select-none"
      aria-label="Block Geospatial Detail Panel"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#0B1F33] text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-[#1479C9] text-white">
                BLOCK PROFILE
              </span>
              <RiskBadge level={block.riskLevel} size="sm" />
            </div>

            <h2 className="text-lg font-bold tracking-tight text-white uppercase">
              {block.blockName} Block
            </h2>

            <div className="flex items-center gap-3 text-[11px] font-mono text-[#A4BCDA]">
              <span className="flex items-center gap-1">
                <Mountain className="w-3 h-3 text-[#247A4A]" /> {block.elevationMeters}m MSL
              </span>
              <span>•</span>
              <span>HQ: {block.headquarters}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-sm text-[#A4BCDA] hover:text-white hover:bg-[#1E354D] transition-colors"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Forecast Horizon & Model Ingestion Metadata */}
        <div className="p-2.5 rounded-sm bg-[#F5F7FA] border border-[#E2E8F0] space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between text-[#4B5B6D]">
            <span>Forecast Horizon:</span>
            <span className="font-bold text-[#0B1F33] uppercase">{forecastHorizon} WINDOW</span>
          </div>
          <div className="flex justify-between text-[#4B5B6D]">
            <span>Model Version:</span>
            <span className="font-medium text-[#1479C9]">{block.modelVersion}</span>
          </div>
          <div className="flex justify-between text-[#4B5B6D]">
            <span>Data Timestamp:</span>
            <span className="text-[#16202A]">{new Date(block.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} 06:00 IST</span>
          </div>
        </div>

        {/* 1. Onset, Break, and Heavy Rain Probabilities */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4B5B6D]">
            Predictive Probabilities ({forecastHorizon.toUpperCase()})
          </h4>

          <div className="grid grid-cols-3 gap-2">
            {/* Onset */}
            <div className="p-2.5 rounded-sm border border-[#ACD5F2] bg-[#EDF6FC] flex flex-col items-center justify-between text-center">
              <span className="text-[10px] font-mono uppercase text-[#0C4E83] font-bold">
                Onset Prob
              </span>
              <span className="text-xl font-bold font-mono text-[#0C4E83] my-1">
                {block.onsetProbability}%
              </span>
              <span className="text-[9px] text-[#0C4E83] leading-none">
                Bayesian Mean
              </span>
            </div>

            {/* Break */}
            <div className="p-2.5 rounded-sm border border-[#F4D79C] bg-[#FDF7EB] flex flex-col items-center justify-between text-center">
              <span className="text-[10px] font-mono uppercase text-[#8C5D00] font-bold">
                Dry Spell
              </span>
              <span className="text-xl font-bold font-mono text-[#8C5D00] my-1">
                {block.breakProbability}%
              </span>
              <span className="text-[9px] text-[#8C5D00] leading-none">
                Break Risk
              </span>
            </div>

            {/* Heavy Rain */}
            <div className="p-2.5 rounded-sm border border-[#EEA9A7] bg-[#FCEDEC] flex flex-col items-center justify-between text-center">
              <span className="text-[10px] font-mono uppercase text-[#802626] font-bold">
                Heavy Rain
              </span>
              <span className="text-xl font-bold font-mono text-[#802626] my-1">
                {block.heavyRainProbability}%
              </span>
              <span className="text-[9px] text-[#802626] leading-none">
                ≥ 64.5mm/24h
              </span>
            </div>
          </div>
        </div>

        {/* 2. Rainfall Anomaly & 7-Day Accumulation */}
        <div className="p-3 rounded-sm border border-[#E2E8F0] bg-white space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#6E7F94]">Rainfall Departure:</span>
            <span className="font-bold text-[#247A4A]">+{block.rainfallAnomalyPercent.toFixed(1)}% (Excess)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xs bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#6E7F94] block">Observed Rain</span>
              <span className="font-bold text-[#1479C9] text-sm">{block.observedRainfallMm.toFixed(1)} mm</span>
            </div>
            <div className="p-2 rounded-xs bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#6E7F94] block">Expected 7-Day QPF</span>
              <span className="font-bold text-[#0B1F33] text-sm">{block.expectedRainfall7dMm.toFixed(1)} mm</span>
            </div>
          </div>
        </div>

        {/* 3. Primary Agro-Meteorological Advisory */}
        <div className="rounded-sm border border-[#ABD7C0] bg-[#EDF7F1] p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#154D2F] font-mono text-[11px] font-bold uppercase">
            <Sprout className="w-4 h-4 text-[#247A4A]" />
            <span>Target Agricultural Advisory</span>
          </div>
          <p className="text-xs text-[#154D2F] leading-relaxed">
            {block.agriculturalAdvisory}
          </p>
          <div className="pt-1.5 border-t border-[#ABD7C0]/60 flex justify-between text-[10px] font-mono text-[#154D2F]">
            <span>Sowing State: <strong>{block.sowingStatus}</strong></span>
          </div>
        </div>

        {/* 4. Gram Panchayats Section with Graceful Missing GeoJSON Handling */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4B5B6D]">
              Gram Panchayats ({panchayats.length})
            </h4>
            <span className="text-[10px] text-[#6E7F94] font-mono">Census Units</span>
          </div>

          {/* Graceful Missing Panchayat GeoJSON Notice */}
          {!isPanchayatGeoAvailable && (
            <div className="p-2.5 rounded-sm bg-[#FDF7EB] border border-[#F4D79C] text-[11px] font-mono text-[#8C5D00] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-[#D99000] shrink-0" />
              <span>Panchayat-level boundary data unavailable</span>
            </div>
          )}

          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {panchayats.map((gp) => {
              const isSelected = selectedPanchayatId === gp.id;
              return (
                <div
                  key={gp.id}
                  onClick={() => onSelectPanchayat && onSelectPanchayat(gp)}
                  className={cn(
                    'p-2 rounded-xs border text-xs cursor-pointer transition-colors flex items-center justify-between',
                    isSelected
                      ? 'bg-[#1479C9] text-white border-[#1479C9]'
                      : 'bg-[#F5F7FA] hover:bg-white text-[#16202A] border-[#E2E8F0]'
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className={cn('w-3 h-3 shrink-0', isSelected ? 'text-white' : 'text-[#247A4A]')} />
                    <span className="font-semibold truncate">{gp.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] shrink-0">
                    <span className={isSelected ? 'text-white/80' : 'text-[#6E7F94]'}>{gp.elevationMeters}m</span>
                    <span className={isSelected ? 'text-white' : 'text-[#0C4E83]'}>
                      {gp.soilType.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agro-Ecological Profile */}
        <div className="p-2.5 rounded-sm bg-[#F5F7FA] border border-[#E2E8F0] space-y-1 text-[11px] font-mono text-[#4B5B6D]">
          <div className="flex justify-between">
            <span>Terrain Zone:</span>
            <span className="text-[#0B1F33] font-medium text-right max-w-[160px] truncate">{block.agroEcologicalZone}</span>
          </div>
          <div className="flex justify-between">
            <span>Block Area:</span>
            <span className="text-[#0B1F33] font-medium">{block.totalAreaSqKm} km²</span>
          </div>
          <div className="flex justify-between">
            <span>Surface AWS Telemetry:</span>
            <span className="text-[#247A4A] font-medium">{block.telemetryStationCount} Active Stations</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F5F7FA] flex items-center justify-between text-[10px] font-mono text-[#6E7F94]">
        <span>Boundary: Revenue Blocks</span>
        <span className="text-[#0B1F33] font-semibold">Koraput Mausam DSS</span>
      </div>
    </aside>
  );
}
