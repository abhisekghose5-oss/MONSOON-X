/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Rainfall Intelligence Domain Types (Step 6)
 */

import type { KoraputBlockId } from './geo';
import type {
  DataStatus,
  RainfallRecord,
  RainfallNormal,
  RainfallAnomaly,
  DataSource,
} from './dataArchitecture';
import type { DrySpellSeverity, ImdDepartureCategoryType } from '../config/meteorology';

export type {
  RainfallRecord,
  RainfallNormal,
  RainfallAnomaly,
  DataSource,
  DataStatus,
  DrySpellSeverity,
  ImdDepartureCategoryType,
};

export type RainfallDataType = 'OBSERVED' | 'FORECAST' | 'NORMAL' | 'MODEL_OUTPUT';

export type ImdRainfallCategory =
  | 'No Rain'
  | 'Very Light Rain'
  | 'Light Rain'
  | 'Moderate Rain'
  | 'Heavy Rain'
  | 'Very Heavy Rain'
  | 'Extremely Heavy Rain';

export type ImdDepartureCategory =
  | 'Large Excess' // +60% or more
  | 'Excess' // +20% to +59%
  | 'Normal' // -19% to +19%
  | 'Deficient' // -59% to -20%
  | 'Large Deficient' // -60% or less
  | 'No Rain';

/**
 * Primary Summary Metrics for Rainfall Intelligence (Section 5)
 */
export interface RainfallSummaryMetrics {
  currentRainfallMm: number | null;
  currentRainfallCategory: ImdRainfallCategory;
  currentObservationTime: string;
  currentStationName: string;
  isCurrentSimulated?: boolean;
  currentStatus?: DataStatus;
  currentSource?: string;

  sevenDayAccumulationMm: number | null;
  sevenDayNormalMm: number | null;
  sevenDayDeparturePercent: number | null;
  sevenDayStatus: 'excess' | 'normal' | 'deficient' | 'missing';
  sevenDayDataStatus?: DataStatus;
  sevenDaySource?: string;

  thirtyDayAccumulationMm: number | null;
  thirtyDayNormalMm: number | null;
  thirtyDayDeparturePercent: number | null;
  thirtyDayStatus: 'excess' | 'normal' | 'deficient' | 'missing';
  thirtyDayDataStatus?: DataStatus;
  thirtyDaySource?: string;

  seasonalRainfallMm: number | null; // Kharif season June 1 - Sept 30
  seasonalNormalMm: number | null;
  seasonalDeparturePercent: number | null;
  seasonalCategory: ImdDepartureCategory;
  seasonalDataStatus?: DataStatus;
  seasonalSource?: string;

  rainfallAnomalyPercent: number | null;
  rainfallAnomalyCategory: ImdDepartureCategory;
  anomalyPeriod?: string;
  anomalyDataStatus?: DataStatus;
  anomalySource?: string;

  historicalNormalMm: number | null; // IMD 1971-2020 Long Period Average
  annualHistoricalNormalMm: number | null; // District annual normal (~1538.8 mm)
  normalDataStatus?: DataStatus;
  normalSource?: string;

  rainyDaysCount: number; // Precipitation >= 2.5 mm
  heavyRainDaysCount: number; // Precipitation >= 64.5 mm
  lastUpdated: string;
  blockId: KoraputBlockId | 'all' | string;
  blockName: string;
}

// Alias for Section 22 compatibility
export type RainfallSummary = RainfallSummaryMetrics;

/**
 * Daily series point for charts and hyetographs
 */
export interface DailyRainfallPoint {
  date: string; // ISO YYYY-MM-DD
  displayDate: string; // DD MMM
  dayOfWeek: string;
  dataType: RainfallDataType;
  rainfallMm: number | null; // null represents missing observation (gap)
  normalMm: number;
  sevenDayRollingMm?: number | null;
  rollingNormalMm?: number;
  anomalyMm?: number | null;
  forecastConfidencePercent?: number;
  forecastSpreadMinMm?: number;
  forecastSpreadMaxMm?: number;
  imdCategory: ImdRainfallCategory;
  isSimulated: boolean;
  source?: string;
  qualityFlag?: 'verified' | 'suspect' | 'imputed' | 'missing';
}

/**
 * Cumulative rainfall point for Observed vs Normal curve
 */
export interface CumulativeRainfallPoint {
  date: string;
  displayDate: string;
  dayIndex: number;
  dataType: 'OBSERVED' | 'FORECAST' | 'NORMAL';
  cumulativeObservedMm: number | null;
  cumulativeNormalMm: number;
  cumulativePreviousSeasonMm?: number | null;
  cumulativeForecastMm?: number | null;
  forecastSpreadUpperMm?: number | null;
  forecastSpreadLowerMm?: number | null;
}

/**
 * Monthly profile item comparing Historical Normal vs Observed Year
 */
export interface MonthlyAnomalyPoint {
  month: string;
  monthFull: string;
  monthIndex?: number; // 1-12
  year: number;
  observedMm: number | null;
  normalMm: number;
  departurePercent: number | null;
  category: ImdDepartureCategory;
  dataType: RainfallDataType;
  isMonsoonMonth?: boolean; // June, July, August, September
  notes?: string;
}

/**
 * Dry spell record (Section 11 & 12)
 */
export interface DrySpell {
  id: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
  durationDays: number;
  maxDailyRainfallMm: number;
  severity: DrySpellSeverity;
  status: 'ACTIVE' | 'CONCLUDED';
  locationId: string;
  locationName: string;
}

/**
 * Dry spell monitor statistics
 */
export interface DrySpellMonitorStats {
  currentConsecutiveDryDays: number;
  longestDrySpellDays: number;
  averageDrySpellDays: number;
  totalDrySpellsCount: number;
  maxDrySpellCurrentMonsoon: number;
  activeDrySpell: DrySpell | null;
  drySpellsList: DrySpell[];
}

/**
 * Rainfall intensity distribution item (Section 13)
 */
export interface RainfallIntensityBand {
  category: ImdRainfallCategory;
  minMm: number;
  maxMm: number | null;
  daysCount: number;
  totalRainfallMm: number;
  percentageOfSeasonalTotal: number;
  color: string;
  description: string;
}

/**
 * Aggregate rainfall statistics (Section 22)
 */
export interface RainfallStatistics {
  locationId: string;
  locationName: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
  totalRainfallMm: number | null;
  normalRainfallMm: number | null;
  anomalyPercent: number | null;
  observedDaysCount: number;
  rainyDaysCount: number;
  dryDaysCount: number;
  heavyRainDaysCount: number;
  maxDailyMm: number | null;
  maxDailyDate: string | null;
  meanDailyMm: number | null;
  intensityDistribution: RainfallIntensityBand[];
  dataQuality: RainfallDataQuality;
}

/**
 * Scientific data quality metrics (Section 19 & 22)
 */
export interface RainfallDataQuality {
  totalExpectedDays: number;
  recordsAvailable: number;
  missingRecords: number;
  coveragePercentage: number;
  lastObservationDate: string;
  source: string;
  spatialResolution: string;
  temporalResolution: string;
  status: DataStatus;
}

/**
 * Historical Season row for monsoon comparison (Section 14 & 22)
 */
export interface HistoricalSeason {
  year: number;
  juneMm: number | null;
  julyMm: number | null;
  augustMm: number | null;
  septemberMm: number | null;
  totalSeasonalMm: number | null;
  normalSeasonalMm: number;
  departurePercent: number | null;
  departureCategory: ImdDepartureCategory;
  source: string;
}

/**
 * Comparative matrix across all 14 Koraput blocks (Section 16 & 22)
 */
export interface BlockRainfallSummary {
  blockId: KoraputBlockId | string;
  blockName: string;
  elevationMeters: number;
  currentMm?: number;
  sevenDayMm?: number;
  seasonalMm?: number;
  seasonalNormalMm?: number;
  seasonalRainfallMm?: number | null;
  normalMm?: number | null;
  departurePercent?: number | null;
  category?: ImdDepartureCategory;
  departureCategory?: ImdDepartureCategory;
  currentDrySpellDays?: number;
  soilMoistureStatus?: 'Adequate' | 'Moisture Stress' | 'Excess Saturated' | 'Optimal';
  isDataAvailable?: boolean;
  status?: DataStatus;
  statusNote?: string;
}

// Backward compatibility alias
export type BlockRainfallComparison = BlockRainfallSummary;

export type DateRangePreset =
  | 'today'
  | 'last7'
  | 'last14'
  | 'last30'
  | 'last90'
  | 'monsoon_season'
  | 'season_to_date'
  | 'forecast15'
  | 'custom';

export interface DateRangeFilterState {
  preset: DateRangePreset;
  startDate: string;
  endDate: string;
  selectedYear?: number;
}

export interface RainfallDashboardData {
  metrics: RainfallSummaryMetrics;
  dailySeries: DailyRainfallPoint[];
  cumulativeSeries: CumulativeRainfallPoint[];
  monthlySeries: MonthlyAnomalyPoint[];
  blockComparisons: BlockRainfallSummary[];
  drySpellStats: DrySpellMonitorStats;
  intensityDistribution: RainfallIntensityBand[];
  historicalSeasons: HistoricalSeason[];
  dataQuality: RainfallDataQuality;
  provenanceSources: DataSource[];
  metadata?: {
    sourceStations?: string[];
    radarIntegration?: string;
    satelliteModel?: string;
    nwpEnsemble?: string;
    climatologyBaseline?: string;
    lastTelemetryFetch?: string;
    simulationNotice?: string;
    [key: string]: unknown;
  };
}
