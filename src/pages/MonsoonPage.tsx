import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  SectionHeader,
  MetricCard,
  RiskBadge,
  DataSourceBadge,
} from '../components/design-system';
import { useBlockSelection } from '../hooks/useBlockSelection';
import { monsoonService } from '../services/monsoonService';
import { useFalseOnsetWatch } from '../hooks/useFalseOnsetWatch';
import { OnsetProbabilityChart } from '../components/monsoon/OnsetProbabilityChart';
import { MonsoonTroughTracker } from '../components/monsoon/MonsoonTroughTracker';
import { LowLevelJetCard } from '../components/monsoon/LowLevelJetCard';
import { FalseOnsetWatch } from '../components/common/FalseOnsetWatch';
import { BayOfBengalSystemsCard } from '../components/monsoon/BayOfBengalSystemsCard';
import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  Wind,
  Compass,
  AlertCircle,
  Waves,
} from 'lucide-react';

export function MonsoonPage() {
  const { selectedBlockId, selectedBlock, isDistrictWide } = useBlockSelection();

  // Fetch complete monsoon dashboard data
  const { data: monsoonData, isLoading } = useQuery({
    queryKey: ['monsoonDashboard', selectedBlockId],
    queryFn: () => monsoonService.getDashboardData(selectedBlockId),
    staleTime: 1000 * 60 * 3,
  });

  // Fetch False Onset Watch data
  const { falseOnset } = useFalseOnsetWatch(14);

  const blockDisplayName = isDistrictWide ? 'Koraput District (All Blocks)' : `${selectedBlock?.name} Block`;

  return (
    <div className="space-y-6">
      {/* 1. SECTION HEADER */}
      <SectionHeader
        title="Monsoon Dynamics & Synoptic Analysis Engine"
        subtitle={`Tracking South-West Monsoon dynamics, Bayesian onset probability density, synoptic trough migrations, 850 hPa Low-Level Jet flow, and Bay of Bengal systems for ${blockDisplayName}.`}
        accentColor="monsoon"
        badge={<RiskBadge level="watch" size="sm" />}
        action={
          <div className="flex items-center gap-2">
            <DataSourceBadge source="IMD Synoptic" type="radar" size="sm" />
            <DataSourceBadge source="ERA5 850hPa" type="model" size="sm" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#F59E0B]/15 text-[#FCD34D] border border-[#F59E0B]/30 font-semibold">
              OPERATIONAL TELEMETRY
            </span>
          </div>
        }
      />

      {/* 2. ACTIVE MONSOON PHASE BANNER */}
      <div className="rounded-md border border-[#0284C7]/40 bg-[#0A192F]/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-command-panel backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                CURRENT MONSOON PHASE:
              </span>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-sm bg-[#0284C7] text-white uppercase shadow-xs">
                {monsoonData?.currentPhase ? monsoonData.currentPhase.toUpperCase() : 'ACTIVE'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#071324] text-[#38BDF8] border border-[#1E354D] font-semibold">
                {monsoonData?.phaseLabel || 'Active Monsoon Phase (Post-Onset Transition)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Bayesian multi-model ensemble conditioned on Arabian Sea Low-Level Jet velocity and Head Bay of Bengal cyclogenesis.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-300 sm:text-right shrink-0">
          <span className="block text-[10px] text-slate-500 uppercase font-bold">Target Geography:</span>
          <span className="font-bold text-white">{blockDisplayName}</span>
        </div>
      </div>

      {/* 3. EXECUTIVE MONSOON METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Predicted Onset Date"
          value={isLoading ? 'Calculating...' : monsoonData?.onsetSummary.predictedDate || '12 Jun 2026'}
          status="monsoon"
          icon={Calendar}
          baselineText={`IMD LPA normal: ${monsoonData?.onsetSummary.normalDate || '11 June'}`}
        />
        <MetricCard
          title="Onset Anomaly"
          value={
            isLoading
              ? '-- Days'
              : `${monsoonData?.onsetSummary.anomalyDays && monsoonData.onsetSummary.anomalyDays > 0 ? '+' : ''}${
                  monsoonData?.onsetSummary.anomalyDays ?? 0
                } Days`
          }
          status="normal"
          icon={TrendingUp}
          baselineText="Lead / lag relative to 55-year LPA climatology"
        />
        <MetricCard
          title="Break Spell Hazard"
          value={isLoading ? '-- %' : `${monsoonData?.troughState.breakHazardRisk || 'LOW'}`}
          status={monsoonData?.troughState.breakHazardRisk === 'HIGH' ? 'risk' : 'normal'}
          icon={AlertTriangle}
          baselineText="Trough axis buffer: +4.1° south of foothills"
        />
        <MetricCard
          title="850 hPa Somali Jet"
          value={isLoading ? '-- kts' : `${monsoonData?.lljMetrics.coreWindSpeedKnots.toFixed(1) || '17.8'} kts`}
          status="agriculture"
          icon={Wind}
          baselineText="Threshold ≥ 15 kts (Westerly flow verified)"
        />
      </div>

      {/* 4. SECTION 1: MONSOON ONSET PROBABILITY */}
      {monsoonData && (
        <section aria-label="Monsoon Onset Probability">
          <OnsetProbabilityChart
            data={monsoonData.onsetDistribution}
            summary={monsoonData.onsetSummary}
          />
        </section>
      )}

      {/* 5. SECTION 2 & 3: MONSOON TROUGH & 850 hPa LOW LEVEL JET */}
      {monsoonData && (
        <section aria-label="Monsoon Trough and Low Level Jet" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonsoonTroughTracker troughState={monsoonData.troughState} />
          <LowLevelJetCard lljMetrics={monsoonData.lljMetrics} />
        </section>
      )}

      {/* 6. SECTION 4: BAY OF BENGAL SYSTEMS */}
      {monsoonData && (
        <section aria-label="Bay of Bengal Systems">
          <BayOfBengalSystemsCard troughState={monsoonData.troughState} />
        </section>
      )}

      {/* 6. DEDICATED FALSE ONSET WATCH */}
      {falseOnset && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
              INTEGRATED FALSE ONSET EARLY WARNING
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Model Horizon: 14 Days Lead
            </span>
          </div>
          <FalseOnsetWatch data={falseOnset} />
        </div>
      )}

      {/* 7. ACTIVE BREAK SPELL NOTIFICATIONS */}
      {monsoonData && monsoonData.breakAlerts.length > 0 && (
        <div className="bg-[#0A192F]/90 rounded-md border border-[#1E354D] shadow-command-panel overflow-hidden backdrop-blur-md">
          <div className="p-4 border-b border-[#1E354D] bg-[#071324] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              ACTIVE BLOCK-LEVEL BREAK SPELL BULLETINS ({monsoonData.breakAlerts.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Criteria: &gt; 5 consecutive days with block rain &lt; 2.5mm
            </span>
          </div>

          <div className="p-4 divide-y divide-[#1E354D]">
            {monsoonData.breakAlerts.map((alert) => (
              <div key={alert.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono uppercase">
                    {alert.blockId.toUpperCase()} BLOCK · START: {alert.predictedStartDate} ({alert.predictedDurationDays} DAYS DURATION)
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30">
                    DEFICIT: {alert.expectedRainfallDeficitPercent}%
                  </span>
                </div>
                <p className="text-slate-300">{alert.summary}</p>
                <div className="p-2.5 rounded-xs bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-amber-200 text-[11px] font-mono">
                  <strong className="text-amber-300">Agronomic Impact:</strong> {alert.agriculturalImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonsoonPage;
