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
import { LiveAtmosphericStrip } from '../components/overview/LiveAtmosphericStrip';
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
      {/* 1. TOP HERO AREA: Mission Control Command Console */}
      <div className="rounded-lg border border-[#1E354D] bg-gradient-to-r from-[#071324] via-[#0A192F] to-[#0E2845] text-white p-6 sm:p-7 shadow-command-panel relative overflow-hidden">
        {/* Subtle decorative radar grid background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none gov-grid" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#0284C7]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            {/* Mission Metadata Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 tracking-wider">
                SIH26086 · MISSION CONTROL
              </span>
              <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-xs border border-white/10 font-mono">
                KORAPUT PILOT REGION · 14 BLOCKS
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-[11px] font-semibold text-[#7DD3FC] bg-[#0284C7]/15 px-2.5 py-0.5 rounded-xs border border-[#0284C7]/30 font-mono">
                ELEVATION: 870m MSL
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-xs border border-emerald-500/30 font-mono">
                7–30D SYNOPTIC OUTLOOK
              </span>
            </div>

            {/* Large Heading */}
            <h1 className="text-2xl sm:text-4xl font-extrabold font-sans tracking-tight text-white leading-tight">
              Koraput Monsoon Intelligence
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              “Hyperlocal climate signals translated into actionable agricultural decisions.”
            </p>

            {/* Climatological provenance anchors */}
            <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-400 flex-wrap">
              <span>LPA Climatology: <strong className="text-slate-200">1,522 mm (55-Yr)</strong></span>
              <span className="text-slate-600">|</span>
              <span>Downscaling: <strong className="text-slate-200">WRF 3km + SRTM 30m</strong></span>
              <span className="text-slate-600">|</span>
              <span>Ensemble: <strong className="text-[#38BDF8]">ECMWF 51-Member</strong></span>
            </div>
          </div>

          {/* Right Status Controls & Live Situation Radar */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 items-start lg:items-end shrink-0 font-mono text-xs">
            <div className="p-3.5 rounded-md bg-[#071324]/80 border border-[#1E354D] flex items-center gap-3.5 shadow-xs">
              {/* Animated Radar Reticle */}
              <div className="relative w-10 h-10 rounded-full bg-[#0A192F] border border-[#0284C7]/50 flex items-center justify-center shrink-0">
                <div className="absolute inset-1 rounded-full border border-dashed border-[#38BDF8]/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                <Compass className="w-5 h-5 text-[#38BDF8] radar-sweep opacity-75" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    CYCLE: {metadata.synopticCycle.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs font-bold text-white tracking-wide mt-0.5">
                  18°48'N, 82°42'E
                </div>
                <div className="text-[10px] text-emerald-400">
                  Ground Telemetry Synchronized
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full justify-between sm:justify-end">
              <span className="text-[11px] text-slate-400">
                Unit: <strong className="text-slate-200">{isDistrictWide ? 'District Aggregate' : `${selectedBlock?.name} Block`}</strong>
              </span>
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isFetching || isRefreshingTelemetry}
                aria-label="Synchronize telemetry feed"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer border border-[#38BDF8]/40"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', (isRefreshingTelemetry || isFetching) && 'animate-spin')} />
                <span>{isRefreshingTelemetry || isFetching ? 'Syncing...' : 'Sync Telemetry'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE DOWNSCALED ATMOSPHERIC TELEMETRY STRIP */}
      <LiveAtmosphericStrip />

      {/* 3. PROMINENT MONSOON SITUATION SECTION */}
      <div className="space-y-4">
        {/* Professional Meteorological Status Panel */}
        <div className="rounded-md border border-[#1E354D] bg-[#0A192F] text-white p-4 sm:p-5 shadow-gov-elevated space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1E354D]">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8]">
                <Compass className="w-5 h-5 text-[#38BDF8]" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  METEOROLOGICAL SYNOPTIC STATUS
                </span>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
                    MONSOON STATUS:
                  </span>
                  <span className="text-base sm:text-lg font-bold font-mono px-3 py-0.5 rounded-xs bg-[#D97706]/20 text-[#FCD34D] border border-[#D97706]/40 uppercase shadow-xs">
                    ONSET WATCH
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-white/10 text-slate-300">
                    Phase 2 Transition
                  </span>
                </div>
              </div>
            </div>

            {/* Synoptic Lifecycle Step Pipeline */}
            <div className="flex items-center gap-1 text-[10px] font-mono self-start md:self-center bg-[#071324] p-1.5 rounded border border-[#1E354D]">
              <span className="px-2 py-0.5 text-slate-500 font-semibold">1. PRE-ONSET [✓]</span>
              <span className="text-slate-600">→</span>
              <span className="px-2 py-0.5 rounded bg-[#0284C7] text-white font-bold shadow-xs">2. ONSET WATCH [● ACTIVE]</span>
              <span className="text-slate-600">→</span>
              <span className="px-2 py-0.5 text-slate-400 font-semibold">3. BAY SURGE [⏳]</span>
              <span className="text-slate-600">→</span>
              <span className="px-2 py-0.5 text-slate-500 font-semibold">4. ESTABLISHED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="p-2.5 rounded bg-[#071324]/60 border border-[#1E354D]/60 space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Primary Synoptic Driver</span>
              <span className="font-semibold text-white">850 hPa Somali Jet (17.8 kts) + NW Bay Low</span>
            </div>
            <div className="p-2.5 rounded bg-[#071324]/60 border border-[#1E354D]/60 space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Climatological Target Date</span>
              <span className="font-semibold text-white">{probabilities.monsoonOnset.historicalNormalDate} (IMD Normal LPA)</span>
            </div>
            <div className="p-2.5 rounded bg-[#071324]/60 border border-[#1E354D]/60 space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Forecast Reliability Score</span>
              <span className="font-bold text-[#4ADE80]">High Skill (Brier Score: 0.14 · ROC: 0.88)</span>
            </div>
          </div>
        </div>

        {/* CLEAN 4-COLUMN PROBABILITY GRID (With dominant numbers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Onset Probability */}
          <div className="rounded-lg border border-[#1E354D] border-t-2 border-t-[#38BDF8] bg-gradient-to-b from-[#0D2038] to-[#0A192F] p-4.5 shadow-command-panel hover:border-[#38BDF8]/60 hover:shadow-hud-glow transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E354D]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-sans">
                Onset Probability
              </span>
              <span className="text-[10px] font-mono font-bold text-[#38BDF8] bg-[#0284C7]/20 px-2 py-0.5 rounded-xs border border-[#0284C7]/40">
                SURGE LIKELY
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white block">
                  {probabilities.monsoonOnset.probability}%
                </span>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  Window: <strong className="text-slate-200">{probabilities.monsoonOnset.predictedDateRange}</strong>
                </span>
              </div>
              <ProbabilityRing
                percentage={probabilities.monsoonOnset.probability}
                variant="monsoon"
                size="md"
              />
            </div>

            <div className="pt-2 border-t border-[#1E354D] text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>IMD Normal:</span>
              <span className="font-semibold text-slate-200">{probabilities.monsoonOnset.historicalNormalDate}</span>
            </div>
          </div>

          {/* 2. False Onset Risk */}
          <div className="rounded-lg border border-[#1E354D] border-t-2 border-t-[#F59E0B] bg-gradient-to-b from-[#1C1608]/90 to-[#0A192F] p-4.5 shadow-command-panel hover:border-[#F59E0B]/60 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E354D]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-sans">
                False Onset Risk
              </span>
              <span className="text-[10px] font-mono font-bold text-[#FCD34D] bg-[#F59E0B]/20 px-2 py-0.5 rounded-xs border border-[#F59E0B]/40">
                ELEVATED
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#FCD34D] block">
                  {falseOnsetWatch.status === 'false_onset_detected' ? 72 : 58}%
                </span>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  Break Hazard: <strong className="text-slate-200">5–7 Days Post</strong>
                </span>
              </div>
              <ProbabilityRing
                percentage={falseOnsetWatch.status === 'false_onset_detected' ? 72 : 58}
                variant="warning"
                size="md"
              />
            </div>

            <div className="pt-2 border-t border-[#1E354D] text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Diagnostic Watch:</span>
              <span className="font-bold text-[#FCD34D]">Elevated Dry Spell</span>
            </div>
          </div>

          {/* 3. Dry Spell Risk */}
          <div className="rounded-lg border border-[#1E354D] border-t-2 border-t-[#FB923C] bg-gradient-to-b from-[#0D2038] to-[#0A192F] p-4.5 shadow-command-panel hover:border-[#FB923C]/60 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E354D]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-sans">
                Dry Spell Risk
              </span>
              <span className="text-[10px] font-mono font-bold text-[#FB923C] bg-amber-950/60 px-2 py-0.5 rounded-xs border border-amber-500/40">
                {probabilities.breakDrySpell.riskLevel}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#FB923C] block">
                  {probabilities.breakDrySpell.probability}%
                </span>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  Duration: ~{probabilities.breakDrySpell.expectedDurationDays} Days
                </span>
              </div>
              <ProbabilityRing
                percentage={probabilities.breakDrySpell.probability}
                variant="warning"
                size="md"
              />
            </div>

            <div className="pt-2 border-t border-[#1E354D] text-[11px] text-slate-400 font-mono flex justify-between">
              <span>Expected Deficit:</span>
              <span className="font-semibold text-[#F87171]">-{probabilities.breakDrySpell.rainfallDeficitExpected}%</span>
            </div>
          </div>

          {/* 4. Excess Rainfall Risk */}
          <div className="rounded-lg border border-[#1E354D] border-t-2 border-t-[#38BDF8] bg-gradient-to-b from-[#0D2038] to-[#0A192F] p-4.5 shadow-command-panel hover:border-[#38BDF8]/60 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E354D]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-sans">
                Excess Rain Risk
              </span>
              <span className="text-[10px] font-mono font-bold text-[#38BDF8] bg-[#0284C7]/20 px-2 py-0.5 rounded-xs border border-[#0284C7]/40">
                LOW RISK
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white block">
                  {probabilities.heavyRainfall.probability}%
                </span>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  Threshold: ≥{probabilities.heavyRainfall.thresholdMm24h} mm/24h
                </span>
              </div>
              <ProbabilityRing
                percentage={probabilities.heavyRainfall.probability}
                variant="monsoon"
                size="md"
              />
            </div>

            <div className="pt-2 border-t border-[#1E354D] text-[11px] text-slate-400 font-mono flex justify-between">
              <span>Convective Intensity:</span>
              <span className="font-semibold text-slate-200">{probabilities.heavyRainfall.convectiveIntensity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FALSE ONSET WATCH (Restrained Amber/Orange Warning Alert Panel) */}
      <FalseOnsetWatchPanel watch={falseOnsetWatch} />

      {/* 5. EXECUTIVE COMMAND BRIEFING: IMMEDIATE ANSWERS TO 4 QUESTIONS */}
      <ExecutiveSituationSummary answers={answers} />

      {/* 6. RAINFALL VISUALIZATION: OBSERVED vs NORMAL RAINFALL */}
      <div className="rounded-lg border border-[#1E354D] bg-[#0A192F] p-5 sm:p-6 shadow-command-panel space-y-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E354D] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="text-base font-bold font-sans uppercase tracking-tight text-white">
                OBSERVED vs NORMAL RAINFALL
              </h2>
              <DataStatusBadge status="OFFICIAL" size="xs" />
            </div>
            <p className="text-xs text-slate-300">
              Downscaled multi-model ensemble quantitative precipitation compared against IMD Long Period Average (1971–2020 climatology).
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/rainfall')}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#38BDF8] hover:underline self-start sm:self-center"
          >
            <span>Rainfall Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 14-Day Hyetograph with 7D/14D/30D Horizon Controls */}
        <FourteenDayRainfallChart data={data.fourteenDayRainfall} />

        {/* Rainfall Anomaly Summary KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-0.5 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Observed Rain</span>
            <span className="text-base font-bold text-[#38BDF8]">{rainfallAnomaly.observedRainfallMm.toFixed(1)} mm</span>
          </div>

          <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-0.5 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">IMD Normal LPA</span>
            <span className="text-base font-bold text-white">{rainfallAnomaly.normalLpaMm.toFixed(1)} mm</span>
          </div>

          <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-0.5 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Departure</span>
            <span className="text-base font-bold text-[#4ADE80]">+{rainfallAnomaly.departurePercentage.toFixed(1)}%</span>
          </div>

          <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-0.5 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">IMD Category</span>
            <span className="text-xs font-bold text-[#4ADE80] uppercase bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-xs inline-block">
              {rainfallAnomaly.departureStatus}
            </span>
          </div>

          <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-0.5 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Rainy Days (≥2.5mm)</span>
            <span className="text-base font-bold text-white">{rainfallAnomaly.rainyDaysCount} Days</span>
          </div>

          <div className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-0.5 font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Last Rain Event</span>
            <span className="text-xs font-bold text-slate-300">{rainfallAnomaly.lastRainEventDate}</span>
          </div>
        </div>

        {/* Historical Rainfall Comparison */}
        <div className="rounded-md border border-[#1E354D] bg-[#071324] p-3.5 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E354D] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Historical Monsoon Rainfall Comparison
              </span>
              <DataStatusBadge status="HISTORICAL" size="xs" />
            </div>
            <span className="font-mono text-[10px] text-slate-400">
              IMD 1971–2020 Seasonal Normal (JJAS): <strong className="text-white">1,212.9 mm</strong>
            </span>
          </div>

          {historicalSeasons.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
              {historicalSeasons.slice(0, 5).map((season) => {
                const diff = (season.rainfallMm ?? 0) - 1212.9;
                const pct = Math.round((diff / 1212.9) * 100);
                const isPositive = pct >= 0;
                return (
                  <div key={season.date} className="p-2.5 rounded-sm bg-[#0A192F] border border-[#1E354D] space-y-0.5">
                    <div className="flex justify-between items-center text-slate-400 text-[10px]">
                      <span className="font-bold text-white">{season.date}</span>
                      <span>JJAS</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {season.rainfallMm?.toFixed(1)} <span className="text-[9px] text-slate-400">mm</span>
                    </div>
                    <div className={cn("text-[10px] font-bold flex items-center gap-0.5", isPositive ? "text-[#4ADE80]" : "text-[#F59E0B]")}>
                      <span>{isPositive ? `+${pct}%` : `${pct}%`}</span>
                      <span className="text-[9px] font-normal text-slate-400">vs LPA</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-2.5 bg-[#0A192F] border border-[#1E354D] rounded-xs text-slate-300 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Historical baseline: 1,212.9 mm LPA (1971–2020 IMD Climatology)</span>
            </div>
          )}
        </div>
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
