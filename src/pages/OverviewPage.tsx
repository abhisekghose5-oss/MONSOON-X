import React, { useState, useEffect } from 'react';
import {
  SectionHeader,
  ProbabilityRing,
  ChartContainer,
  DataSourceBadge,
  DataStatusBadge,
} from '../components/design-system';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { useOverviewData } from '../hooks/useOverviewData';
import { useBlockSelection } from '../hooks/useBlockSelection';
import { ExecutiveSituationSummary } from '../components/overview/ExecutiveSituationSummary';
import { FalseOnsetWatchPanel } from '../components/overview/FalseOnsetWatchPanel';
import { FourteenDayRainfallChart } from '../components/overview/FourteenDayRainfallChart';
import { KoraputRiskMapPreview } from '../components/overview/KoraputRiskMapPreview';
import { ClimateSignalSummaryCard } from '../components/overview/ClimateSignalSummaryCard';
import { AgroAdvisoryPreviewList } from '../components/overview/AgroAdvisoryPreviewList';
import { DataHealthPanel } from '../components/overview/DataHealthPanel';
import { historicalRainfallService } from '../services/historicalRainfallService';
import type { RainfallRecord } from '../types/dataArchitecture';
import { useNavigate } from 'react-router-dom';
import { useRainfallData } from '../hooks/useRainfallData';
import {
  Compass,
  CloudRain,
  ShieldAlert,
  RefreshCw,
  Info,
  AlertCircle,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../utils/cn';

export function OverviewPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = useOverviewData();
  const { selectedBlock, isDistrictWide } = useBlockSelection();
  const { rainfallData } = useRainfallData('all');
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);
  const [historicalSeasons, setHistoricalSeasons] = useState<RainfallRecord[]>([]);

  useEffect(() => {
    historicalRainfallService
      .getHistoricalRainfall('all', '2021', '2025', 'seasonal')
      .then((records) => setHistoricalSeasons(records))
      .catch(() => setHistoricalSeasons([]));
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshingTelemetry(true);
    await refetch();
    setTimeout(() => setIsRefreshingTelemetry(false), 500);
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <Loading
          label="INGESTING KORAPUT SYNOPTIC TELEMETRY..."
          subtext="Synthesizing multi-model NWP ensembles and in-situ AWS station records"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-8">
        <ErrorState
          title="Overview Telemetry Failure"
          message="Could not load the meteorological synthesis from the prediction node. Please verify service connectivity."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { probabilities, falseOnsetWatch, rainfallAnomaly, answers, metadata } = data;

  return (
    <div className="space-y-6">
      {/* 1. OFFICIAL INSTITUTIONAL HEADER & LOCATION PATH */}
      <div className="rounded-md border border-[#CBD5E1] bg-white p-5 shadow-gov-card border-l-4 border-l-[#0B1F33]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white tracking-wider">
                SIH26086
              </span>
              <span className="font-mono text-[11px] text-[#4B5B6D] font-medium">
                Hyperlocal Monsoon Decision Support
              </span>
              <span className="text-[#CBD5E1]">•</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2] font-semibold">
                LOCATION: Odisha → Koraput → {isDistrictWide ? 'All Blocks' : `${selectedBlock?.name} Block`}
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-[#0B1F33] uppercase">
              KORAPUT MAUSAM INTELLIGENCE
            </h1>

            <p className="text-xs text-[#4B5B6D] max-w-3xl leading-relaxed">
              Operational agro-meteorological command centre for Koraput District.
              Translating downscaled atmospheric signals into risk mitigation and crop scheduling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 items-start lg:items-end shrink-0 font-mono text-xs">
            {/* PROVENANCE BADGES */}
            <div className="flex flex-wrap items-center gap-1.5">
              <DataStatusBadge status="DEMO" labelOverride="DEMO MODEL OUTPUT" size="xs" />
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#F5F7FA] text-[#6E7F94] border border-[#CBD5E1] font-semibold">
                Forecast model: Not connected
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#6E7F94] text-[11px]">
              <span>Cycle: {metadata.synopticCycle.split(' ')[0]}</span>
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isFetching || isRefreshingTelemetry}
                aria-label="Synchronize telemetry feed"
                className="flex items-center gap-1 text-[#1479C9] hover:underline font-semibold focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingTelemetry || isFetching ? 'animate-spin' : ''}`} />
                <span>{isRefreshingTelemetry || isFetching ? 'Syncing...' : 'Sync Feed'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-3.5 pt-2.5 border-t border-[#F0F3F7] flex items-center justify-between text-[11px] text-[#6E7F94]">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#1479C9] shrink-0" />
            <span className="truncate">{metadata.disclaimer}</span>
          </span>
          <span className="font-mono text-[#0B1F33] font-semibold shrink-0 hidden md:inline">
            14 Administrative Blocks
          </span>
        </div>
      </div>

      {/* 2. EXECUTIVE COMMAND BRIEFING: IMMEDIATE ANSWERS TO THE 4 CORE QUESTIONS */}
      <ExecutiveSituationSummary answers={answers} />

      {/* RAINFALL STATUS (Step 6 - Section 26) */}
      <div
        onClick={() => navigate('/rainfall')}
        className="rounded-sm border border-[#CBD5E1] bg-white p-4 shadow-xs hover:border-[#0284C7] hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#0284C7]" />
            <h3 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33] group-hover:text-[#0284C7] transition-colors">
              RAINFALL STATUS · KORAPUT DISTRICT
            </h3>
            <DataStatusBadge status="OFFICIAL" size="xs" />
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#0284C7] group-hover:underline">
            <span>Explore Rainfall Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
          {/* Seasonal Rainfall */}
          <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-mono text-[#64748B] block">Seasonal Rainfall</span>
            <span className="text-xl font-bold font-mono text-[#0B1F33]">
              {rainfallData?.metrics.seasonalRainfallMm ? `${rainfallData.metrics.seasonalRainfallMm.toFixed(1)} mm` : '1266.1 mm'}
            </span>
            <span className="text-[10px] font-mono text-[#64748B] block">June 1 – Sept 30</span>
          </div>

          {/* Normal */}
          <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-mono text-[#64748B] block">Normal (LPA)</span>
            <span className="text-xl font-bold font-mono text-[#475569]">
              1212.9 mm
            </span>
            <span className="text-[10px] font-mono text-[#64748B] block">1971–2020 Climatology</span>
          </div>

          {/* Anomaly */}
          <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-mono text-[#64748B] block">Seasonal Anomaly</span>
            <span className="text-xl font-bold font-mono text-[#059669]">
              +4.4%
            </span>
            <span className="text-[10px] font-mono text-[#059669] font-semibold block">Near Normal (+53.2 mm)</span>
          </div>

          {/* Current Dry Spell */}
          <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] font-mono text-[#64748B] block">Current Dry Spell</span>
            <span className="text-xl font-bold font-mono text-[#D97706]">
              {rainfallData?.drySpellStats.currentConsecutiveDryDays ?? 0} Days
            </span>
            <span className="text-[10px] font-mono text-[#64748B] block">
              {rainfallData?.drySpellStats.activeDrySpell ? 'Active break spell' : 'Favorable moisture'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION: KORAPUT MONSOON OUTLOOK (14 DAYS) */}
      <div className="space-y-4">
        <SectionHeader
          title="KORAPUT MONSOON OUTLOOK"
          subtitle="Probabilistic seasonal onset, break spell duration, and high-impact precipitation predictions for the 14-day window."
          accentColor="monsoon"
          badge={
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white">
              FORECAST HORIZON: 14 DAYS
            </span>
          }
          action={
            <div className="flex items-center gap-2">
              <DataSourceBadge source="NCMRWF Ensemble" type="model" latency="00Z Run" size="sm" />
              <DataSourceBadge source="IMD Synoptic" type="radar" latency="Live" size="sm" />
            </div>
          }
        />

        {/* THREE PRIMARY PROBABILITY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: MONSOON ONSET */}
          <div className="rounded-md border border-[#CBD5E1] border-t-4 border-t-[#1479C9] bg-white p-4 shadow-gov-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F3F7]">
                <div className="flex items-center gap-1.5 text-[#1479C9]">
                  <Compass className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                    Monsoon Onset
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-sm bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2] font-semibold">
                  DEMO MODEL OUTPUT
                </span>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <ProbabilityRing
                  percentage={probabilities.monsoonOnset.probability}
                  variant="monsoon"
                  size="md"
                  label="Onset Probability"
                />
                <div className="text-right space-y-1 font-mono">
                  <span className="text-[11px] text-[#6E7F94] block uppercase">Predicted Window</span>
                  <span className="text-sm font-bold text-[#0B1F33] block">
                    {probabilities.monsoonOnset.predictedDateRange}
                  </span>
                  <span className="text-[10px] text-[#247A4A] font-semibold block">
                    Confidence: {probabilities.monsoonOnset.confidenceLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F3F7] text-[11px] space-y-1">
              <div className="flex justify-between text-[#4B5B6D]">
                <span>Historical IMD Normal:</span>
                <span className="font-mono font-medium text-[#0B1F33]">{probabilities.monsoonOnset.historicalNormalDate}</span>
              </div>
              <div className="flex justify-between text-[#4B5B6D]">
                <span>Onset Anomaly:</span>
                <span className="font-mono font-bold text-[#1479C9]">
                  {probabilities.monsoonOnset.daysAnomaly > 0 ? `+${probabilities.monsoonOnset.daysAnomaly} Days Late` : 'On Time'}
                </span>
              </div>
              <p className="text-[10px] text-[#6E7F94] pt-1 leading-snug">
                Driver: {probabilities.monsoonOnset.primaryDriver}
              </p>
            </div>
          </div>

          {/* Card 2: BREAK / DRY SPELL */}
          <div className="rounded-md border border-[#CBD5E1] border-t-4 border-t-[#D99000] bg-white p-4 shadow-gov-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F3F7]">
                <div className="flex items-center gap-1.5 text-[#D99000]">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                    Break / Dry Spell
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-sm bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] font-semibold">
                  DEMO MODEL OUTPUT
                </span>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <ProbabilityRing
                  percentage={probabilities.breakDrySpell.probability}
                  variant="warning"
                  size="md"
                  label="Break Probability"
                />
                <div className="text-right space-y-1 font-mono">
                  <span className="text-[11px] text-[#6E7F94] block uppercase">Dry Spell Hazard</span>
                  <span className="text-sm font-bold text-[#D99000] block">
                    {probabilities.breakDrySpell.riskLevel} Risk
                  </span>
                  <span className="text-[10px] text-[#4B5B6D] block">
                    Duration: ~{probabilities.breakDrySpell.expectedDurationDays} Days
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F3F7] text-[11px] space-y-1">
              <div className="flex justify-between text-[#4B5B6D]">
                <span>Anticipated Window:</span>
                <span className="font-mono font-medium text-[#0B1F33]">{probabilities.breakDrySpell.windowStart}</span>
              </div>
              <div className="flex justify-between text-[#4B5B6D]">
                <span>Rainfall Deficit:</span>
                <span className="font-mono font-bold text-[#C43D3D]">{probabilities.breakDrySpell.rainfallDeficitExpected}% Deficit</span>
              </div>
              <p className="text-[10px] text-[#6E7F94] pt-1 leading-snug">
                {probabilities.breakDrySpell.warningSummary}
              </p>
            </div>
          </div>

          {/* Card 3: HEAVY RAINFALL */}
          <div className="rounded-md border border-[#CBD5E1] border-t-4 border-t-[#C43D3D] bg-white p-4 shadow-gov-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F3F7]">
                <div className="flex items-center gap-1.5 text-[#C43D3D]">
                  <CloudRain className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                    Heavy Rainfall
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-sm bg-[#FCEDEC] text-[#802626] border border-[#EEA9A7] font-semibold">
                  DEMO MODEL OUTPUT
                </span>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <ProbabilityRing
                  percentage={probabilities.heavyRainfall.probability}
                  variant="risk"
                  size="md"
                  label="Heavy Rain Prob"
                />
                <div className="text-right space-y-1 font-mono">
                  <span className="text-[11px] text-[#6E7F94] block uppercase">Threshold Exceedance</span>
                  <span className="text-sm font-bold text-[#C43D3D] block">
                    ≥ {probabilities.heavyRainfall.thresholdMm24h} mm/24h
                  </span>
                  <span className="text-[10px] text-[#802626] font-semibold block">
                    Intensity: {probabilities.heavyRainfall.convectiveIntensity}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F3F7] text-[11px] space-y-1">
              <div className="flex justify-between text-[#4B5B6D]">
                <span>Peak Convective Window:</span>
                <span className="font-mono font-bold text-[#0B1F33]">{probabilities.heavyRainfall.peakWindow}</span>
              </div>
              <p className="text-[10px] text-[#6E7F94] pt-1 leading-snug">
                Vulnerable Zones: {probabilities.heavyRainfall.vulnerableTerrain}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FALSE ONSET WATCH */}
      <FalseOnsetWatchPanel watch={falseOnsetWatch} />

      {/* 5. RAINFALL ANOMALY SUMMARY & 14-DAY HYETOGRAPH */}
      <div className="space-y-4">
        <SectionHeader
          title="Precipitation Dynamics & 14-Day Hyetograph"
          subtitle="Cumulative seasonal departure against IMD Long Period Average (LPA) and downscaled ensemble rain curve."
          accentColor="monsoon"
        />

        {/* Rainfall Anomaly Summary KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="p-3 rounded-sm bg-white border border-[#CBD5E1] space-y-0.5 font-mono shadow-gov-card">
            <span className="text-[10px] text-[#6E7F94] uppercase block">Observed Rain</span>
            <span className="text-base font-bold text-[#1479C9]">{rainfallAnomaly.observedRainfallMm.toFixed(1)} mm</span>
          </div>

          <div className="p-3 rounded-sm bg-white border border-[#CBD5E1] space-y-0.5 font-mono shadow-gov-card">
            <span className="text-[10px] text-[#6E7F94] uppercase block">IMD Normal LPA</span>
            <span className="text-base font-bold text-[#0B1F33]">{rainfallAnomaly.normalLpaMm.toFixed(1)} mm</span>
          </div>

          <div className="p-3 rounded-sm bg-white border border-[#CBD5E1] space-y-0.5 font-mono shadow-gov-card">
            <span className="text-[10px] text-[#6E7F94] uppercase block">Departure</span>
            <span className="text-base font-bold text-[#247A4A]">+{rainfallAnomaly.departurePercentage.toFixed(1)}%</span>
          </div>

          <div className="p-3 rounded-sm bg-white border border-[#CBD5E1] space-y-0.5 font-mono shadow-gov-card">
            <span className="text-[10px] text-[#6E7F94] uppercase block">IMD Category</span>
            <span className="text-xs font-bold text-[#247A4A] uppercase bg-[#EDF7F1] px-1.5 py-0.5 rounded-xs inline-block">
              {rainfallAnomaly.departureStatus}
            </span>
          </div>

          <div className="p-3 rounded-sm bg-white border border-[#CBD5E1] space-y-0.5 font-mono shadow-gov-card">
            <span className="text-[10px] text-[#6E7F94] uppercase block">Rainy Days (≥2.5mm)</span>
            <span className="text-base font-bold text-[#0B1F33]">{rainfallAnomaly.rainyDaysCount} Days</span>
          </div>

          <div className="p-3 rounded-sm bg-white border border-[#CBD5E1] space-y-0.5 font-mono shadow-gov-card">
            <span className="text-[10px] text-[#6E7F94] uppercase block">Last Rain Event</span>
            <span className="text-xs font-bold text-[#4B5B6D]">{rainfallAnomaly.lastRainEventDate}</span>
          </div>
        </div>

        {/* Historical Rainfall Comparison (Step 5 - Section 14) */}
        <div className="rounded-sm border border-[#CBD5E1] bg-white p-4 shadow-gov-card space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F3F7] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
                Historical Monsoon Rainfall Comparison
              </span>
              <DataStatusBadge status="HISTORICAL" size="xs" />
            </div>
            <span className="font-mono text-[10px] text-[#6E7F94]">
              IMD 1971–2020 Seasonal Normal (JJAS): <strong className="text-[#0B1F33]">1,212.9 mm</strong>
            </span>
          </div>

          {/* Historical Seasons Row or Missing Fallback */}
          {historicalSeasons.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono text-xs">
              {historicalSeasons.slice(0, 5).map((season) => {
                const diff = (season.rainfallMm ?? 0) - 1212.9;
                const pct = Math.round((diff / 1212.9) * 100);
                const isPositive = pct >= 0;
                return (
                  <div key={season.date} className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <div className="flex justify-between items-center text-[#6E7F94] text-[10px]">
                      <span className="font-bold text-[#0B1F33]">{season.date} Monsoon</span>
                      <span>JJAS</span>
                    </div>
                    <div className="text-base font-bold text-[#0B1F33]">
                      {season.rainfallMm?.toFixed(1)} <span className="text-[10px] text-[#6E7F94]">mm</span>
                    </div>
                    <div className={cn("text-[10px] font-bold flex items-center gap-0.5", isPositive ? "text-[#247A4A]" : "text-[#D99000]")}>
                      <span>{isPositive ? `+${pct}%` : `${pct}%`}</span>
                      <span className="text-[9px] font-normal text-[#6E7F94]">vs LPA</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 bg-[#FCEDEC] border border-[#EEA9A7] rounded-sm text-[#802626] font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C43D3D] shrink-0" />
              <span>Historical rainfall dataset not connected</span>
            </div>
          )}
        </div>

        {/* 14-Day Recharts Hyetograph */}
        <ChartContainer
          title="14-Day Hyperlocal Precipitation Forecast Ensemble"
          subtitle="Daily quantitative precipitation forecast (mm/day) compared to 30-year IMD climatological baseline"
          unit="mm / day"
          height={320}
          legend={
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#1479C9] rounded-xs" />
                <span>Forecast Precipitation (mm)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#0B1F33]" />
                <span>IMD Normal Baseline</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#D99000] border-t border-dashed" />
                <span>Rainy Day Threshold (2.5mm)</span>
              </span>
            </div>
          }
          footer={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1">
              <span>Model Ingestion: NCMRWF Unified Model + High-Res SRTM DEM Orographic Downscaling</span>
              <span className="font-mono text-[#1479C9]">DEMO SIMULATION RUN</span>
            </div>
          }
        >
          <FourteenDayRainfallChart data={data.fourteenDayRainfall} />
        </ChartContainer>
      </div>

      {/* 6. KORAPUT RISK MAP PREVIEW */}
      <div className="space-y-4">
        <SectionHeader
          title="Koraput Spatial Risk & Terrain Preview"
          subtitle="Geospatial distribution of agro-climatic hazard across all 14 administrative blocks of Koraput."
          accentColor="navy"
          action={
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#EAF0F6] text-[#0B1F33] border border-[#CBD5E1]">
              EASTERN GHATS: 380m – 1672m MSL
            </span>
          }
        />
        <KoraputRiskMapPreview blockRisks={data.blockRisks} />
      </div>

      {/* 7. CLIMATE SIGNAL SUMMARY */}
      <div className="space-y-4">
        <SectionHeader
          title="Planetary Climate Signals (Teleconnections)"
          subtitle="Global oscillatory drivers governing Indian Monsoon moisture transport into Southern Odisha."
          accentColor="monsoon"
          action={
            <span className="font-mono text-[10px] text-[#6E7F94]">
              Data Assimilation: NOAA / BOM / INCOIS
            </span>
          }
        />
        <ClimateSignalSummaryCard signals={data.climateSignals} />
      </div>

      {/* 8. AGRICULTURAL ADVISORY PREVIEW */}
      <div className="space-y-4">
        <SectionHeader
          title="Agro-Meteorological Decision Support Bulletins"
          subtitle="Field-level agricultural actions for Kharif Mandia, Upland Paddy, Maize, and Water Harvesting."
          accentColor="agri"
          action={
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] font-semibold">
              KORAPUT KHARIF SEASON 2026
            </span>
          }
        />
        <AgroAdvisoryPreviewList advisories={data.advisories} />
      </div>

      {/* 9. DATA HEALTH / STATUS PANEL */}
      <DataHealthPanel
        feeds={data.dataHealth}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshingTelemetry || isFetching}
      />
    </div>
  );
}

export default OverviewPage;
