/**
 * Hyperlocal Monsoon Forecast Contracts
 * SIH26086 - MONSOON-X
 */

export type ForecastHorizon = '7d' | '14d' | '21d' | '30d';

export type MonsoonPhaseState =
  | 'Pre-Onset'
  | 'Onset Watch'
  | 'Onset'
  | 'Active'
  | 'Break Watch'
  | 'Break'
  | 'Revival';

export interface ForecastTimelinePoint {
  day: number; // 1 to 30
  date: string; // ISO YYYY-MM-DD
  displayDate: string; // e.g. "30 Sep"
  dayOfWeek: string; // e.g. "Wed"
  
  // Three primary prediction series (0 - 100%)
  onsetProbability: number;
  breakProbability: number;
  heavyRainProbability: number;

  // Uncertainty band (10th to 90th percentile ensemble spread)
  uncertaintyBand: {
    lowerBound: number;
    upperBound: number;
    spreadMm?: number;
  };

  // Expected rainfall and meteorological indicators
  expectedRainfallMm: number;
  rainfallProbabilityPercent: number;
  confidenceScore: number; // 0 - 100%
  convectiveRisk: 'Nominal' | 'Moderate' | 'High' | 'Severe';
}

export interface MonsoonPhaseInfo {
  // Backend provided phase (strictly null if not provided by backend)
  currentPhase: MonsoonPhaseState | null;
  phaseCode: string;
  confidenceScore: number; // 0 - 100%
  synopticBasis: string;
  transitionRisk: string;
  agriculturalAdvisory: string;
  phaseSinceDate?: string;
  expectedNextPhase?: MonsoonPhaseState | null;
  phaseTrajectory: Array<{
    phase: MonsoonPhaseState;
    probability: number;
    horizonDays: number;
  }>;
}

export interface ForecastConfidenceIndicator {
  overallScore: number; // 0 - 100%
  tier: 'High' | 'Moderate' | 'Low';
  decayFactorPerWeek: number; // e.g. -12% per week
  assessmentText: string;
  satelliteValidation: 'Verified' | 'Pending' | 'Nominal';
}

export interface ForecastSummaryNarrative {
  headline: string;
  synopticDynamics: string;
  primaryHazardWindow: string;
  agriculturalImpact: string;
  convectiveOutlook: string;
}

export interface ForecastMetadata {
  modelVersion: string; // e.g. "KMI-Downscaled Ensemble v2.4"
  generatedTimestamp: string; // ISO timestamp
  cycleName: string; // e.g. "06:00 UTC (11:30 IST) Run"
  gridResolutionKm: number; // e.g. 1.2
  ensembleMembers: number; // e.g. 51
  isDemoModelOutput: boolean; // Must show "DEMO MODEL OUTPUT" if true
  dataSources: string[];
}

export interface HyperlocalForecastResponse {
  locationId: string;
  locationName: string;
  elevationMeters: number;
  horizon: ForecastHorizon;
  horizonDays: number; // 7 | 14 | 21 | 30
  timeline: ForecastTimelinePoint[];
  monsoonPhase: MonsoonPhaseInfo | null; // Strict: null if not provided by backend
  confidence: ForecastConfidenceIndicator;
  summary: ForecastSummaryNarrative;
  metadata: ForecastMetadata;
}
