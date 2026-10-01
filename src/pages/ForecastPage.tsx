import React, { useState } from 'react';
import {
  ForecastHeaderBar,
  ForecastHorizonSelector,
  ForecastHorizonMetrics,
  ForecastProbabilityChart,
  MonsoonPhasePanel,
  ForecastSummaryCard,
} from '../components/forecast';
import { LoadingSkeleton, AlertBanner } from '../components/design-system';
import { useHyperlocalForecast } from '../hooks/useHyperlocalForecast';
import type { ForecastHorizon } from '../types/forecast';

export function ForecastPage() {
  const [horizon, setHorizon] = useState<ForecastHorizon>('14d');
  const { forecast, isLoading, isError, error, refetch } =
    useHyperlocalForecast(horizon);

  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <AlertBanner
          level="critical"
          title="Failed to Retrieve Numerical Weather Prediction"
          message={error instanceof Error ? error.message : 'Unknown forecast service failure'}
          action={
            <button
              onClick={() => refetch()}
              className="text-xs font-mono font-semibold bg-[#C43D3D] text-white px-3 py-1 rounded-sm"
            >
              Retry Forecast Query
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Header Bar with Title, Model Version, Timestamp & Confidence */}
      {isLoading || !forecast ? (
        <LoadingSkeleton variant="card" className="h-28" />
      ) : (
        <ForecastHeaderBar
          locationName={forecast.locationName}
          elevationMeters={forecast.elevationMeters}
          metadata={forecast.metadata}
          confidence={forecast.confidence}
        />
      )}

      {/* 2. Forecast Horizon Selector (7 DAYS, 14 DAYS, 21 DAYS, 30 DAYS) */}
      <ForecastHorizonSelector
        selectedHorizon={horizon}
        onSelectHorizon={setHorizon}
        confidenceScore={forecast?.confidence.overallScore}
        confidenceTier={forecast?.confidence.tier}
      />

      {/* 3. Horizon Summary Metric Cards */}
      {isLoading || !forecast ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" className="h-28" />
          ))}
        </div>
      ) : (
        <ForecastHorizonMetrics
          timeline={forecast.timeline}
          horizonDays={forecast.horizonDays}
        />
      )}

      {/* 4. Probability Timeline Chart with Uncertainty Band */}
      {isLoading || !forecast ? (
        <LoadingSkeleton variant="chart" className="h-96" />
      ) : (
        <ForecastProbabilityChart
          timeline={forecast.timeline}
          horizonDays={forecast.horizonDays}
          isLoading={isLoading}
        />
      )}

      {/* 5. MONSOON PHASE PANEL (Placed strictly below the chart) */}
      {isLoading || !forecast ? (
        <LoadingSkeleton variant="card" className="h-44" />
      ) : (
        <MonsoonPhasePanel
          phaseInfo={forecast.monsoonPhase}
          isDemoModelOutput={forecast.metadata.isDemoModelOutput}
        />
      )}

      {/* 6. Meteorological Forecast Summary Narrative */}
      {isLoading || !forecast ? (
        <LoadingSkeleton variant="card" className="h-40" />
      ) : (
        <ForecastSummaryCard summary={forecast.summary} />
      )}
    </div>
  );
}
