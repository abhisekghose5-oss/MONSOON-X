export type HistoricalEnsoPhase = 'El Niño' | 'La Niña' | 'Neutral';

export type DecadalPeriod =
  | '1970-1979'
  | '1980-1989'
  | '1990-1999'
  | '2000-2009'
  | '2010-2019'
  | '2020-2025';

export interface HistoricalOnsetRecord {
  year: number;
  onsetDate: string; // e.g. "12 Jun"
  dayOfYear: number; // Day in June (e.g. 12)
  anomalyDays: number; // +1 or -3
  monsoonTotalRainfallMm: number;
  breakSpellsCount: number;
  longestBreakDays: number;
  ensoPhase: HistoricalEnsoPhase;
  decadalPeriod: DecadalPeriod;
  isMilestoneYear?: boolean;
  milestoneDescription?: string;
}

export interface DecadalDriftSummary {
  decade: DecadalPeriod;
  label: string;
  meanOnsetDate: string;
  meanAnomalyDays: number;
  meanMonsoonRainfallMm: number;
  meanBreakSpellsPerYear: number;
  extremeDrySpellYearsCount: number;
  trendObservation: string;
}

export interface BreakDurationDistributionPoint {
  durationBin: string; // e.g. "3-5 Days"
  frequency: number; // Total count in 55 years
  percentageOfBreaks: number;
  averageSoilMoistureDeficitPct: number;
  typicalCropImpact: string;
}

export interface HistoricalClimatologyDashboard {
  metrics: {
    lpaNormalDate: string;
    stdDevDays: number;
    lpaRainfallMm: number;
    breakFrequencyPerYear: number;
    decadalOnsetDriftDays: number;
    totalYearsAnalyzed: number;
    datasetCitation: string;
  };
  yearlyRecords: HistoricalOnsetRecord[];
  decadalSummaries: DecadalDriftSummary[];
  breakDurationDistribution: BreakDurationDistributionPoint[];
  lastUpdated: string;
}
