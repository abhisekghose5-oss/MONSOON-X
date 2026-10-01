import React, { useState } from 'react';
import {
  SectionHeader,
  AlertBanner,
  LoadingSkeleton,
  DataStatusBadge,
} from '../components/design-system';
import {
  RainfallLocationControls,
  RainfallDateControls,
  RainfallMetricCards,
  DailyRainfallChart,
  ObservedVsNormalChart,
  MonthlyProfileChart,
  RainfallAnomalyTimeline,
  CumulativeRainfallChart,
  DrySpellMonitor,
  DrySpellTimeline,
  RainfallIntensityDistribution,
  HistoricalMonsoonComparison,
  RainfallCalendarHeatmap,
  BlockPrecipitationTable,
  DataProvenancePanel,
  DataQualityPanel,
  ExportDataButton,
} from '../components/rainfall';
import { useRainfallData } from '../hooks/useRainfallData';
import type { DateRangeFilterState } from '../types/rainfall';
import { RefreshCw } from 'lucide-react';

export function RainfallPage() {
  // 1. Location state: 'all' for District synthesis, or blockId
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedPanchayat, setSelectedPanchayat] = useState<string>('all');

  // 2. Time Horizon state (Default: Monsoon Season)
  const [dateFilter, setDateFilter] = useState<DateRangeFilterState>({
    preset: 'monsoon_season',
    startDate: '2025-06-01',
    endDate: '2025-09-30',
  });

  // 3. Fetch data through React Query & RainfallService
  const { rainfallData, isLoading, isError, error, refetch, isFetching } =
    useRainfallData(selectedLocation, dateFilter);

  const isDistrict = selectedLocation === 'all' || selectedLocation === 'koraput-district';
  // Block data availability flag (blocks pending AWS telemetry)
  const isBlockDataAvailable = isDistrict;

  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <AlertBanner
          level="critical"
          title="Failed to Ingest Precipitation Telemetry"
          message={error instanceof Error ? error.message : 'Unknown hydrometeorological service failure'}
          action={
            <button
              onClick={() => refetch()}
              className="text-xs font-mono font-semibold bg-[#DC2626] text-white px-3 py-1 rounded-xs"
            >
              Retry Ingestion
            </button>
          }
        />
      </div>
    );
  }

  const locationTitle = isDistrict ? 'Koraput District' : `${selectedLocation} Block`;

  return (
    <div className="space-y-6">
      {/* 1. INSTITUTIONAL HEADER */}
      <SectionHeader
        title="RAINFALL INTELLIGENCE"
        subtitle="Koraput District · Historical & Current Rainfall Analysis"
        accentColor="monsoon"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <DataStatusBadge
              status={isDistrict ? 'OFFICIAL' : 'MISSING'}
              size="md"
            />
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1.5 rounded-xs border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#475569] transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            {rainfallData && (
              <ExportDataButton
                locationName={locationTitle}
                startDate={dateFilter.startDate}
                endDate={dateFilter.endDate}
                data={rainfallData.dailySeries}
              />
            )}
          </div>
        }
      />

      {/* 2. TOP LOCATION CONTROLS (Section 3) */}
      <RainfallLocationControls
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedPanchayat={selectedPanchayat}
        onPanchayatChange={setSelectedPanchayat}
        isBlockDataAvailable={isBlockDataAvailable}
      />

      {/* 3. TIME HORIZON CONTROLS (Section 4) */}
      <RainfallDateControls
        filter={dateFilter}
        onFilterChange={setDateFilter}
      />

      {/* 4. SUMMARY METRIC CARDS (Section 5) */}
      {isLoading || !rainfallData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
      ) : (
        <RainfallMetricCards
          metrics={rainfallData.metrics}
          isDataAvailable={isBlockDataAvailable}
        />
      )}

      {/* 5. PRIMARY CHARTS & ANALYTICS */}
      {isLoading || !rainfallData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <LoadingSkeleton variant="chart" className="h-80" />
            <LoadingSkeleton variant="chart" className="h-80" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <LoadingSkeleton variant="chart" className="h-80" />
            <LoadingSkeleton variant="chart" className="h-80" />
          </div>
        </div>
      ) : (
        <>
          {/* Row 1: Daily Rainfall Hyetograph & Observed vs Normal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: Daily Rainfall (Section 6) */}
            <DailyRainfallChart
              data={rainfallData.dailySeries}
              isLoading={isLoading}
            />

            {/* Chart 2: Observed Rainfall vs Historical Normal (Section 7) */}
            <ObservedVsNormalChart
              data={rainfallData.cumulativeSeries}
              isLoading={isLoading}
            />
          </div>

          {/* Row 2: Monthly Profile & Anomaly Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 3: Koraput Monthly Profile (Section 8) */}
            <MonthlyProfileChart
              data={rainfallData.monthlySeries}
              isLoading={isLoading}
              selectedYear={2025}
            />

            {/* Chart 4: Rainfall Anomaly Analysis (Section 9) */}
            <RainfallAnomalyTimeline
              data={rainfallData.dailySeries}
              isLoading={isLoading}
            />
          </div>

          {/* Row 3: Cumulative Seasonal Rainfall (Section 10) */}
          <div className="w-full">
            <CumulativeRainfallChart
              data={rainfallData.cumulativeSeries}
              isLoading={isLoading}
            />
          </div>

          {/* Row 4: Dry Spell Analysis & Timeline (Sections 11 & 12) */}
          <div className="space-y-4">
            <DrySpellMonitor
              stats={rainfallData.drySpellStats}
              isLoading={isLoading}
            />
            <DrySpellTimeline
              drySpells={rainfallData.drySpellStats.drySpellsList}
              isLoading={isLoading}
            />
          </div>

          {/* Row 5: Rainfall Intensity & Historical Monsoon Comparison (Sections 13 & 14) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <RainfallIntensityDistribution
              distribution={rainfallData.intensityDistribution}
              isLoading={isLoading}
            />
            <HistoricalMonsoonComparison
              seasons={rainfallData.historicalSeasons}
              isLoading={isLoading}
            />
          </div>

          {/* Row 6: Rainfall Calendar Heatmap (Section 15) */}
          <div className="w-full">
            <RainfallCalendarHeatmap
              data={rainfallData.dailySeries}
              isLoading={isLoading}
            />
          </div>

          {/* Row 7: Koraput Block Comparison Matrix (Section 16) */}
          <div className="w-full">
            <BlockPrecipitationTable
              blocks={rainfallData.blockComparisons}
              onSelectBlock={(bId) => setSelectedLocation(bId)}
            />
          </div>

          {/* Row 8: Data Quality & Data Provenance (Sections 18 & 19) */}
          <div className="space-y-4">
            <DataQualityPanel
              quality={rainfallData.dataQuality}
              isLoading={isLoading}
            />
            <DataProvenancePanel
              sources={rainfallData.provenanceSources}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}
export default RainfallPage;
