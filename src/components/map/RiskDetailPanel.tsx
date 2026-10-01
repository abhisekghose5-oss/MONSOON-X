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
        'w-full lg:w-96 bg-white border-l border-[#CBD5E1] flex flex-col h-full shadow-gov-elevated z-[1000] select-none text-xs',
        className
      )}
    >
      {/* 1. Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#0B1F33] text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-[#1479C9] text-white">
                {record.type === 'district' ? 'DISTRICT PROFILE' : 'BLOCK PROFILE'}
              </span>
              <span className="font-mono text-[10px] font-semibold text-[#A4BCDA]">
                {record.status}
              </span>
            </div>

            <h2 className="text-lg font-bold tracking-tight text-white uppercase">
              {record.locationName} {record.type === 'block' ? 'BLOCK' : ''}
            </h2>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#A4BCDA]">
              <span>Koraput, Odisha</span>
              {record.elevationMeters && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Mountain className="w-3 h-3 text-[#247A4A]" />
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
              className="p-1 rounded-sm text-[#A4BCDA] hover:text-white hover:bg-[#1E354D] transition-colors"
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
          <div className="p-2.5 rounded-sm bg-[#EDF7F1] border border-[#ABD7C0] flex items-center justify-between text-[#154D2F]">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#247A4A] shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-xs truncate block">GP: {selectedPanchayat.name}</span>
                <span className="text-[10px] font-mono opacity-80 block truncate">
                  {selectedPanchayat.vulnerabilityTag} ({selectedPanchayat.elevationMeters}m)
                </span>
              </div>
            </div>
            {onSelectPanchayat && (
              <button
                type="button"
                onClick={() => onSelectPanchayat(null)}
                className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs bg-white text-[#154D2F] border border-[#ABD7C0] hover:bg-[#F5F7FA] shrink-0 flex items-center gap-1"
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
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4B5B6D]">
              Probabilistic Assessment
            </h4>
            <span className="font-mono text-[10px] text-[#1479C9] font-bold">
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
          <div className="p-2 rounded-xs bg-[#F5F7FA] border border-[#CBD5E1] flex justify-between items-center font-mono text-[11px]">
            <span className="text-[#6E7F94]">Forecast Horizon:</span>
            <span className="font-bold text-[#0B1F33]">{horizonDays}</span>
          </div>
        </div>

        {/* 2.2 MONSOON STATUS */}
        <div className="rounded-sm border border-[#CBD5E1] bg-white p-3 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#0B1F33] font-mono text-[11px] font-bold uppercase">
            <Compass className="w-3.5 h-3.5 text-[#1479C9]" />
            <span>Monsoon Status</span>
          </div>
          <div className="text-sm font-bold text-[#0B1F33]">
            {record.monsoonStatus}
          </div>
          <p className="text-[11px] text-[#6E7F94] leading-relaxed">
            {record.type === 'block'
              ? `Operational status derived from regional low-level jet momentum and local orographic elevation (${record.elevationMeters ?? 700}m MSL).`
              : 'Aggregated district-wide monsoon progression status across all 14 administrative blocks.'}
          </p>
        </div>

        {/* 2.3 AGRICULTURAL SIGNAL */}
        <div className="rounded-sm border border-[#ABD7C0] bg-[#EDF7F1] p-3 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#154D2F] font-mono text-[11px] font-bold uppercase">
            <Sprout className="w-4 h-4 text-[#247A4A]" />
            <span>Agricultural Signal</span>
          </div>
          <div className="text-xs font-semibold text-[#154D2F] leading-snug">
            {record.agriculturalSignal}
          </div>
          <p className="text-[10px] text-[#154D2F]/80 leading-normal pt-1 border-t border-[#ABD7C0]/50">
            Guidance for field extension workers and farmers regarding sowing window and nursery bed protection.
          </p>
        </div>

        {/* 2.4 HYDROMETEOROLOGY & RAINFALL INTELLIGENCE (Step 6 - Section 17) */}
        <div className="rounded-sm border border-[#CBD5E1] bg-white p-3 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase text-[#0B1F33]">
              <Droplets className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Rainfall Intelligence</span>
            </div>
            <Link
              to="/rainfall"
              className="text-[10px] font-mono text-[#0284C7] hover:underline font-bold flex items-center gap-0.5"
            >
              <span>Explore Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-2 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] block">Current Rainfall:</span>
              <span className="font-bold text-[#0B1F33]">
                {record.observedRainfallMm !== undefined ? `${record.observedRainfallMm.toFixed(1)} mm` : '--'}
              </span>
            </div>

            <div className="p-2 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] block">Seasonal Total:</span>
              <span className="font-bold text-[#0284C7]">
                {record.type === 'district' ? '1266.1 mm' : '1248.5 mm'}
              </span>
            </div>

            <div className="p-2 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] block">Normal (LPA):</span>
              <span className="font-bold text-[#64748B]">1212.9 mm</span>
            </div>

            <div className="p-2 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] text-[#64748B] block">Rainfall Anomaly:</span>
              <span
                className={`font-bold ${
                  record.rainfallAnomaly >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'
                }`}
              >
                {record.rainfallAnomaly >= 0 ? '+' : ''}{record.rainfallAnomaly}%
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xs bg-[#FFFBEB] border border-[#FDE68A] text-[11px] font-mono text-[#92400E] flex items-center justify-between">
            <span>Current Dry Spell:</span>
            <strong className="font-bold">
              {record.breakProbability >= 40 ? '4 Days (Watch)' : '1 Day (Normal)'}
            </strong>
          </div>
        </div>

        {/* 2.4 PANCHAYAT DRILL-DOWN (Section 9) */}
        {record.type === 'block' && panchayats.length > 0 && (
          <div className="rounded-sm border border-[#CBD5E1] bg-white p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase text-[#0B1F33]">
                <Layers className="w-3.5 h-3.5 text-[#1479C9]" />
                <span>Gram Panchayats ({panchayats.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPanchayatsList(!showPanchayatsList)}
                className="px-2 py-0.5 rounded-xs bg-[#F5F7FA] hover:bg-[#EAF0F6] border border-[#CBD5E1] text-[10px] font-mono font-bold text-[#0B1F33] flex items-center gap-1 transition-colors"
              >
                <span>{showPanchayatsList ? 'Hide Panchayats' : 'View Panchayats'}</span>
                {showPanchayatsList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Graceful Missing Panchayat GeoJSON Notice */}
            {!isPanchayatGeoAvailable && (
              <div className="p-2 rounded-xs bg-[#FDF7EB] border border-[#F4D79C] text-[10px] font-mono text-[#8C5D00] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#D99000] shrink-0" />
                <span>Panchayat-level boundary data unavailable</span>
              </div>
            )}

            {/* List of Panchayats */}
            {showPanchayatsList && (
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1 pt-1 border-t border-[#F0F3F7]">
                {panchayats.map((gp) => {
                  const isSelected = selectedPanchayat?.id === gp.id;
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
                        <MapPin
                          className={cn('w-3 h-3 shrink-0', isSelected ? 'text-white' : 'text-[#247A4A]')}
                        />
                        <span className="font-semibold truncate">{gp.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] shrink-0">
                        <span className={isSelected ? 'text-white/80' : 'text-[#6E7F94]'}>
                          {gp.elevationMeters}m
                        </span>
                        <span className={isSelected ? 'text-white' : 'text-[#0C4E83]'}>
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
        <div className="p-2.5 rounded-sm bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between font-mono text-[11px]">
          <span className="text-[#6E7F94]">DATA STATUS:</span>
          <MapDataStatus status={record.dataStatus} size="sm" />
        </div>
      </div>

      {/* 3. Panel Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F5F7FA] flex items-center justify-between text-[10px] font-mono text-[#6E7F94]">
        <span>Model: {record.modelVersion.split(' ')[0]}</span>
        <span className="text-[#0B1F33] font-semibold">MONSOON-X DSS</span>
      </div>
    </aside>
  );
}

export default RiskDetailPanel;
