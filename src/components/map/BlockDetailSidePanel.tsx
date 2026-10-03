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
      className="w-full lg:w-96 bg-[#0A192F] border-l border-[#1E354D] flex flex-col h-full shadow-2xl z-[1000] select-none text-xs text-slate-200"
      aria-label="Block Geospatial Detail Panel"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324] text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                BLOCK PROFILE
              </span>
              <RiskBadge level={block.riskLevel} size="sm" />
            </div>

            <h2 className="text-lg font-black tracking-tight text-white uppercase font-sans">
              {block.blockName} Block
            </h2>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Mountain className="w-3 h-3 text-emerald-400" /> {block.elevationMeters}m MSL
              </span>
              <span>•</span>
              <span>HQ: {block.headquarters}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Forecast Horizon & Model Ingestion Metadata */}
        <div className="p-3 rounded-xl bg-[#071324] border border-[#1E354D] space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>Forecast Horizon:</span>
            <span className="font-bold text-cyan-400 uppercase">{forecastHorizon} WINDOW</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Model Version:</span>
            <span className="font-medium text-slate-200">{block.modelVersion}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Data Timestamp:</span>
            <span className="text-slate-200">{new Date(block.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} 06:00 IST</span>
          </div>
        </div>

        {/* 1. Onset, Break, and Heavy Rain Probabilities */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Predictive Probabilities ({forecastHorizon.toUpperCase()})
          </h4>

          <div className="grid grid-cols-3 gap-2">
            {/* Onset */}
            <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex flex-col items-center justify-between text-center">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Onset Prob
              </span>
              <span className="text-xl font-black font-mono text-cyan-400 my-1">
                {block.onsetProbability}%
              </span>
              <span className="text-[9px] text-cyan-300/80 leading-none">
                Bayesian Mean
              </span>
            </div>

            {/* Break */}
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col items-center justify-between text-center">
              <span className="text-[10px] font-mono uppercase text-amber-300 font-bold">
                Dry Spell
              </span>
              <span className="text-xl font-black font-mono text-amber-400 my-1">
                {block.breakProbability}%
              </span>
              <span className="text-[9px] text-amber-300/80 leading-none">
                Break Risk
              </span>
            </div>

            {/* Heavy Rain */}
            <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-950/20 flex flex-col items-center justify-between text-center">
              <span className="text-[10px] font-mono uppercase text-rose-300 font-bold">
                Heavy Rain
              </span>
              <span className="text-xl font-black font-mono text-rose-400 my-1">
                {block.heavyRainProbability}%
              </span>
              <span className="text-[9px] text-rose-300/80 leading-none">
                ≥ 64.5mm/24h
              </span>
            </div>
          </div>
        </div>

        {/* 2. Rainfall Anomaly & 7-Day Accumulation */}
        <div className="p-3.5 rounded-xl border border-[#1E354D] bg-[#071324] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Rainfall Departure:</span>
            <span className="font-bold text-emerald-400">+{block.rainfallAnomalyPercent.toFixed(1)}% (Excess)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#0A192F] border border-[#1E354D]">
              <span className="text-[10px] text-slate-400 block">Observed Rain</span>
              <span className="font-bold text-cyan-400 text-sm">{block.observedRainfallMm.toFixed(1)} mm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0A192F] border border-[#1E354D]">
              <span className="text-[10px] text-slate-400 block">Expected 7-Day QPF</span>
              <span className="font-bold text-white text-sm">{block.expectedRainfall7dMm.toFixed(1)} mm</span>
            </div>
          </div>
        </div>

        {/* 3. Primary Agro-Meteorological Advisory */}
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold uppercase">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Target Agricultural Advisory</span>
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed font-sans">
            {block.agriculturalAdvisory}
          </p>
          <div className="pt-2 border-t border-emerald-500/30 flex justify-between text-[10px] font-mono text-emerald-300">
            <span>Sowing State: <strong className="text-white">{block.sowingStatus}</strong></span>
          </div>
        </div>

        {/* 4. Gram Panchayats Section with Graceful Missing GeoJSON Handling */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Gram Panchayats ({panchayats.length})
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Census Units</span>
          </div>

          {/* Graceful Missing Panchayat GeoJSON Notice */}
          {!isPanchayatGeoAvailable && (
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Panchayat-level boundary data unavailable</span>
            </div>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {panchayats.map((gp) => {
              const isSelected = selectedPanchayatId === gp.id;
              return (
                <div
                  key={gp.id}
                  onClick={() => onSelectPanchayat && onSelectPanchayat(gp)}
                  className={cn(
                    'p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between',
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'bg-[#071324] hover:bg-cyan-950/20 text-slate-200 border-[#1E354D] hover:border-slate-600'
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className={cn('w-3 h-3 shrink-0', isSelected ? 'text-cyan-400' : 'text-emerald-400')} />
                    <span className="font-semibold truncate">{gp.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] shrink-0">
                    <span className={isSelected ? 'text-cyan-300' : 'text-slate-400'}>{gp.elevationMeters}m</span>
                    <span className={isSelected ? 'text-white' : 'text-cyan-400'}>
                      {gp.soilType.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agro-Ecological Profile */}
        <div className="p-3 rounded-xl bg-[#071324] border border-[#1E354D] space-y-1.5 text-[11px] font-mono text-slate-400">
          <div className="flex justify-between">
            <span>Terrain Zone:</span>
            <span className="text-slate-200 font-medium text-right max-w-[160px] truncate">{block.agroEcologicalZone}</span>
          </div>
          <div className="flex justify-between">
            <span>Block Area:</span>
            <span className="text-slate-200 font-medium">{block.totalAreaSqKm} km²</span>
          </div>
          <div className="flex justify-between">
            <span>Surface AWS Telemetry:</span>
            <span className="text-emerald-400 font-medium">{block.telemetryStationCount} Active Stations</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3.5 border-t border-[#1E354D] bg-[#071324] flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Boundary: Revenue Blocks</span>
        <span className="text-cyan-400 font-bold">MONSOON-X DSS</span>
      </div>
    </aside>
  );
}
