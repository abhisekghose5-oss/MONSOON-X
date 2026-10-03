import React, { useState } from 'react';
import type { RiskMapRecord, PanchayatInfo } from '../../types/riskMap';
import { RiskMetricCard } from './RiskMetricCard';
import { MapDataStatus } from './MapDataStatus';
import { Link } from 'react-router-dom';
import {
  X,
  MapPin,
  Mountain,
  Sprout,
  Compass,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowLeft,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface RiskDetailPanelProps {
  record: RiskMapRecord;
  panchayats?: PanchayatInfo[];
  selectedPanchayat?: PanchayatInfo | null;
  onSelectPanchayat?: (panchayat: PanchayatInfo | null) => void;
  onClose?: () => void;
  isPanchayatGeoAvailable?: boolean;
  className?: string;
}

export function RiskDetailPanel({
  record,
  panchayats = [],
  selectedPanchayat,
  onSelectPanchayat,
  onClose,
  isPanchayatGeoAvailable = false,
  className,
}: RiskDetailPanelProps) {
  const [showPanchayatsList, setShowPanchayatsList] = useState(false);

  const horizonDays = record.forecastHorizon.replace('D', ' Days');

  return (
    <aside
      aria-label="Geospatial Risk Detail Panel"
      className={cn(
        'w-full lg:w-96 bg-[#0A192F] border-l border-[#1E354D] flex flex-col h-full shadow-command-panel z-[1000] select-none text-xs text-white',
        className
      )}
    >
      {/* 1. Header */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324] text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#0284C7] text-white">
                {record.type === 'district' ? 'DISTRICT PROFILE' : 'BLOCK PROFILE'}
              </span>
              <span className="font-mono text-[10px] font-semibold text-slate-400">
                {record.status}
              </span>
            </div>

            <h2 className="text-lg font-bold tracking-tight text-white uppercase font-sans">
              {record.locationName} {record.type === 'block' ? 'BLOCK' : ''}
            </h2>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Koraput, Odisha</span>
              {record.elevationMeters && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Mountain className="w-3 h-3 text-[#4ADE80]" />
                    {record.elevationMeters}m MSL
                  </span>
                </>
              )}
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active Panchayat Focus Banner if selected */}
        {selectedPanchayat && (
          <div className="p-2.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-emerald-300">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-xs truncate block text-white">GP: {selectedPanchayat.name}</span>
                <span className="text-[10px] font-mono text-emerald-400 block truncate">
                  {selectedPanchayat.vulnerabilityTag} ({selectedPanchayat.elevationMeters}m)
                </span>
              </div>
            </div>
            {onSelectPanchayat && (
              <button
                type="button"
                onClick={() => onSelectPanchayat(null)}
                className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs bg-[#071324] text-emerald-300 border border-emerald-500/40 hover:bg-[#0B1F33] shrink-0 flex items-center gap-1"
                title="Return to Block level"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Block View</span>
              </button>
            )}
          </div>
        )}

        {/* 2.1 Four Core Risk Metrics Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Probabilistic Assessment
            </h4>
            <span className="font-mono text-[10px] text-[#38BDF8] font-bold">
              HORIZON: {record.forecastHorizon}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* ONSET PROBABILITY */}
            <RiskMetricCard
              label="Onset Probability"
              value={record.onsetProbability}
              unit="%"
              statusLabel={record.onsetProbability >= 70 ? 'High' : 'Moderate'}
              colorScheme="blue"
              subtext="Monsoon Arrival"
            />

            {/* BREAK RISK */}
            <RiskMetricCard
              label="Break Risk"
              value={record.breakProbability}
              unit="%"
              statusLabel={record.breakProbability >= 40 ? 'Severe' : record.breakProbability >= 25 ? 'Advisory' : 'Low'}
              colorScheme={record.breakProbability >= 30 ? 'amber' : 'green'}
              subtext="Consecutive Dry Spell"
            />

            {/* HEAVY RAIN RISK */}
            <RiskMetricCard
              label="Heavy Rain Risk"
              value={record.heavyRainProbability}
              unit="%"
              statusLabel={record.heavyRainProbability >= 60 ? 'Alert' : 'Nominal'}
              colorScheme={record.heavyRainProbability >= 50 ? 'red' : 'neutral'}
              subtext="≥64.5mm in 24h"
            />

            {/* RAINFALL ANOMALY */}
            <RiskMetricCard
              label="Rainfall Anomaly"
              value={`${record.rainfallAnomaly > 0 ? '+' : ''}${record.rainfallAnomaly}`}
              unit="%"
              statusLabel={record.rainfallAnomaly >= 20 ? 'Excess' : record.rainfallAnomaly <= -20 ? 'Deficit' : 'Normal'}
              colorScheme={record.rainfallAnomaly < -20 ? 'amber' : record.rainfallAnomaly > 20 ? 'blue' : 'green'}
              subtext="Departure from LPA"
            />
          </div>

          {/* FORECAST HORIZON DISPLAY */}
          <div className="p-2 rounded-xs bg-[#071324] border border-[#1E354D] flex justify-between items-center font-mono text-[11px]">
            <span className="text-slate-400">Forecast Horizon:</span>
            <span className="font-bold text-white">{horizonDays}</span>
          </div>
        </div>

        {/* 2.2 MONSOON STATUS */}
        <div className="rounded-md border border-[#1E354D] bg-[#071324] p-3 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#38BDF8] font-mono text-[11px] font-bold uppercase">
            <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Monsoon Status</span>
          </div>
          <div className="text-sm font-bold text-white">
            {record.monsoonStatus}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            {record.type === 'block'
              ? `Operational status derived from regional low-level jet momentum and local orographic elevation (${record.elevationMeters ?? 700}m MSL).`
              : 'Aggregated district-wide monsoon progression status across all 14 administrative blocks.'}
          </p>
        </div>

        {/* 2.3 AGRICULTURAL SIGNAL */}
        <div className="rounded-md border border-emerald-500/40 bg-emerald-950/40 p-3 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#4ADE80] font-mono text-[11px] font-bold uppercase">
            <Sprout className="w-4 h-4 text-[#4ADE80]" />
            <span>Agricultural Signal</span>
          </div>
          <div className="text-xs font-semibold text-emerald-200 leading-snug">
            {record.agriculturalSignal}
          </div>
          <p className="text-[10px] text-emerald-300/80 leading-normal pt-1 border-t border-emerald-500/30">
            Guidance for field extension workers and farmers regarding sowing window and nursery bed protection.
          </p>
        </div>

        {/* 2.4 HYDROMETEOROLOGY & RAINFALL INTELLIGENCE (Step 6 - Section 17) */}
        <div className="rounded-md border border-[#1E354D] bg-[#071324] p-3 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase text-white">
              <Droplets className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Rainfall Intelligence</span>
            </div>
            <Link
              to="/rainfall"
              className="text-[10px] font-mono text-[#38BDF8] hover:underline font-bold flex items-center gap-0.5"
            >
              <span>Explore Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-2 rounded-xs bg-[#0A192F] border border-[#1E354D]">
              <span className="text-[10px] text-slate-400 block">Current Rainfall:</span>
              <span className="font-bold text-white">
                {record.observedRainfallMm !== undefined ? `${record.observedRainfallMm.toFixed(1)} mm` : '--'}
              </span>
            </div>

            <div className="p-2 rounded-xs bg-[#0A192F] border border-[#1E354D]">
              <span className="text-[10px] text-slate-400 block">Seasonal Total:</span>
              <span className="font-bold text-[#38BDF8]">
                {record.type === 'district' ? '1266.1 mm' : '1248.5 mm'}
              </span>
            </div>

            <div className="p-2 rounded-xs bg-[#0A192F] border border-[#1E354D]">
              <span className="text-[10px] text-slate-400 block">Normal (LPA):</span>
              <span className="font-bold text-slate-300">1212.9 mm</span>
            </div>

            <div className="p-2 rounded-xs bg-[#0A192F] border border-[#1E354D]">
              <span className="text-[10px] text-slate-400 block">Rainfall Anomaly:</span>
              <span
                className={`font-bold ${
                  record.rainfallAnomaly >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
                }`}
              >
                {record.rainfallAnomaly >= 0 ? '+' : ''}{record.rainfallAnomaly}%
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xs bg-amber-950/40 border border-amber-500/40 text-[11px] font-mono text-amber-200 flex items-center justify-between">
            <span>Current Dry Spell:</span>
            <strong className="font-bold">
              {record.breakProbability >= 40 ? '4 Days (Watch)' : '1 Day (Normal)'}
            </strong>
          </div>
        </div>

        {/* 2.4 PANCHAYAT DRILL-DOWN (Section 9) */}
        {record.type === 'block' && panchayats.length > 0 && (
          <div className="rounded-md border border-[#1E354D] bg-[#071324] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase text-white">
                <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Gram Panchayats ({panchayats.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPanchayatsList(!showPanchayatsList)}
                className="px-2 py-0.5 rounded-xs bg-[#0B1F33] hover:bg-[#0E2845] border border-[#1E354D] text-[10px] font-mono font-bold text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{showPanchayatsList ? 'Hide Panchayats' : 'View Panchayats'}</span>
                {showPanchayatsList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Graceful Missing Panchayat GeoJSON Notice */}
            {!isPanchayatGeoAvailable && (
              <div className="p-2 rounded-xs bg-amber-950/40 border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#FCD34D] shrink-0" />
                <span>Panchayat-level boundary data unavailable</span>
              </div>
            )}

            {/* List of Panchayats */}
            {showPanchayatsList && (
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1 pt-1 border-t border-[#1E354D]">
                {panchayats.map((gp) => {
                  const isSelected = selectedPanchayat?.id === gp.id;
                  return (
                    <div
                      key={gp.id}
                      onClick={() => onSelectPanchayat && onSelectPanchayat(gp)}
                      className={cn(
                        'p-2 rounded-xs border text-xs cursor-pointer transition-colors flex items-center justify-between',
                        isSelected
                          ? 'bg-[#0284C7] text-white border-[#0284C7]'
                          : 'bg-[#0A192F] hover:bg-[#0E2845] text-slate-200 border-[#1E354D]'
                      )}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin
                          className={cn('w-3 h-3 shrink-0', isSelected ? 'text-white' : 'text-[#4ADE80]')}
                        />
                        <span className="font-semibold truncate">{gp.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] shrink-0">
                        <span className={isSelected ? 'text-white/80' : 'text-slate-400'}>
                          {gp.elevationMeters}m
                        </span>
                        <span className={isSelected ? 'text-white' : 'text-[#38BDF8]'}>
                          {gp.soilType.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2.5 DATA STATUS (Section 8 & 16) */}
        <div className="p-2.5 rounded-sm bg-[#071324] border border-[#1E354D] flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span>DATA STATUS:</span>
          <MapDataStatus status={record.dataStatus} size="sm" />
        </div>
      </div>

      {/* 3. Panel Footer */}
      <div className="p-3 border-t border-[#1E354D] bg-[#071324] flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Model: {record.modelVersion.split(' ')[0]}</span>
        <span className="text-white font-semibold">MONSOON-X DSS</span>
      </div>
    </aside>
  );
}

export default RiskDetailPanel;
