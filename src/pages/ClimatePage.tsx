import React from 'react';
import {
  SectionHeader,
  DataSourceBadge,
  LoadingSkeleton,
  AlertBanner,
} from '../components/design-system';
import {
  TeleconnectionCascade,
  EnsoPanel,
  IodPanel,
  MjoPanel,
  ClimateTimelineChart,
  ClimateExplanationPanel,
} from '../components/climate';
import { useClimateData } from '../hooks/useClimateData';
import { RefreshCw } from 'lucide-react';

export function ClimatePage() {
  const { climateData, isLoading, isError, error, refetch, isFetching } =
    useClimateData();

  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <AlertBanner
          level="critical"
          title="Failed to Load Climate Signal Intelligence"
          message={error instanceof Error ? error.message : 'Unknown network failure'}
          action={
            <button
              onClick={() => refetch()}
              className="text-xs font-mono font-semibold bg-[#C43D3D] text-white px-3 py-1 rounded-sm"
            >
              Retry Teleconnection Query
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <SectionHeader
        title="Climate Signal Intelligence"
        subtitle="Planetary ocean-atmosphere oscillatory indices regulating large-scale moisture transport and providing probabilistic boundary inputs for Koraput numerical models."
        accentColor="navy"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <DataSourceBadge source="NOAA CPC" type="station" size="sm" />
            <DataSourceBadge source="BoM Australia" type="station" size="sm" />
            <DataSourceBadge source="IMD Pune S2S Desk" type="model" size="sm" />
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1.5 rounded-sm border border-[#CBD5E1] bg-white hover:bg-[#F5F7FA] text-[#4B5B6D] transition-colors focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden"
              title="Refresh Climate Signals"
              aria-label="Refresh Climate Signals"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      {/* 2. Simulation & Governance Alert Banner */}
      <AlertBanner
        level="info"
        title="PLANETARY TELECONNECTION DIAGNOSTICS · PROBABILISTIC BOUNDARY FORCING"
        message="All planetary teleconnection signals (ENSO, IOD, MJO) serve as low-frequency boundary conditions and probabilistic priors for the downscaled Koraput numerical weather prediction engine. They represent statistical risk modulators and potential influences, rather than direct deterministic rain forecasts."
      />

      {/* 3. MULTI-SCALE TELECONNECTION CASCADE */}
      {/* GLOBAL CLIMATE ↓ REGIONAL ATMOSPHERE ↓ LOCAL RAINFALL ↓ AGRICULTURAL RISK */}
      {isLoading || !climateData ? (
        <LoadingSkeleton variant="card" className="h-64" />
      ) : (
        <TeleconnectionCascade stages={climateData.cascadeStages} />
      )}

      {/* 4. THREE PRIMARY PANELS: ENSO, IOD, MJO */}
      {isLoading || !climateData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <LoadingSkeleton variant="card" className="h-80" />
          <LoadingSkeleton variant="card" className="h-80" />
          <LoadingSkeleton variant="card" className="h-80" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Panel 1: ENSO */}
          <EnsoPanel enso={climateData.enso} />

          {/* Panel 2: IOD */}
          <IodPanel iod={climateData.iod} />

          {/* Panel 3: MJO */}
          <MjoPanel mjo={climateData.mjo} />
        </div>
      )}

      {/* 5. CLIMATE SIGNAL TIMELINE */}
      {isLoading || !climateData ? (
        <LoadingSkeleton variant="chart" className="h-80" />
      ) : (
        <ClimateTimelineChart
          timeline={climateData.timeline}
          isLoading={isLoading}
        />
      )}

      {/* 6. EXPLANATORY PANEL: HOW CLIMATE SIGNALS INFLUENCE THE FORECAST */}
      {isLoading || !climateData ? (
        <LoadingSkeleton variant="card" className="h-64" />
      ) : (
        <ClimateExplanationPanel
          title={climateData.explanatoryGuidance.panelTitle}
          disclaimer={climateData.explanatoryGuidance.nonDeterministicDisclaimer}
          principles={climateData.explanatoryGuidance.principles}
        />
      )}
    </div>
  );
}
