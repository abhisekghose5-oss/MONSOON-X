import type { KoraputBlockId } from './geo';
import type { RiskSeverity } from '../utils/severity';

export type MonsoonPhase =
  | 'pre-onset'
  | 'onset-imminent'
  | 'active'
  | 'break-warning'
  | 'break-active'
  | 'revival'
  | 'withdrawal';

export interface MonsoonOnsetPrediction {
  blockId: KoraputBlockId;
  predictedOnsetDate: string;
  historicalNormalDate: string;
  onsetAnomalyDays: number;
  confidenceScore: number;
  lowerConfidenceBound: string;
  upperConfidenceBound: string;
  drivers: string[];
}

export interface BreakSpellAlert {
  id: string;
  blockId: KoraputBlockId | 'all';
  phase: MonsoonPhase;
  severity: RiskSeverity;
  predictedStartDate: string;
  predictedDurationDays: number;
  expectedRainfallDeficitPercent: number;
  summary: string;
  agriculturalImpact: string;
}

export interface ClimateIndexSignal {
  indexName: 'ENSO' | 'IOD' | 'MJO' | 'BSISO' | 'BayOfBengal_SST';
  currentPhase: string;
  numericalValue: number;
  impactOnKoraput: string;
  lastUpdated: string;
}

/**
 * Bayesian Probabilistic Onset Distribution Point
 * Models daily onset trigger probability density (PDF) and cumulative distribution (CDF)
 */
export interface OnsetProbabilityDensityPoint {
  date: string;
  dayLabel: string;
  pdfProbability: number; // Daily probability density (%)
  cdfProbability: number; // Cumulative probability of onset having arrived (%)
  historicalNormalPdf: number; // Climatological normal bell curve (centered June 11)
  isNormalDate?: boolean;
  isModelPeakDate?: boolean;
}

/**
 * Bayesian Onset Summary & Credible Intervals
 */
export interface OnsetBayesianSummary {
  predictedDate: string; // e.g. "12 June 2026"
  normalDate: string; // "11 June"
  anomalyDays: number; // +1 day (lag) or -2 days (early)
  confidenceInterval50: [string, string]; // 50% Bayesian Credible Interval e.g. ["10 Jun", "14 Jun"]
  confidenceInterval90: [string, string]; // 90% Bayesian Credible Interval e.g. ["07 Jun", "17 Jun"]
  peakProbability: number; // % at peak mode
  confidenceScore: number; // % overall confidence
  atmosphericDriver: string;
}

/**
 * Synoptic Monsoon Trough Latitudinal Tracking
 * Normal axis: ~22.5° N across Central India to Bay of Bengal
 * Foothills break displacement: > 26.5° N causing dry spell / break monsoon
 * Active southern displacement: < 21.0° N with Bay of Bengal depressions
 */
export interface TroughLatitudePoint {
  date: string;
  observedLat: number; // ° N
  normalLat: number; // 22.5° N
  foothillsLat: number; // 27.0° N (Foothills break boundary)
}

export interface MonsoonTroughState {
  currentAxisLat: number; // e.g. 21.6° N
  normalAxisLat: number; // 22.5° N
  foothillsBreakLat: number; // 27.0° N
  troughStatus: 'normal' | 'south_active' | 'foothills_break' | 'cyclonic_shear';
  statusLabel: string;
  activeLowPressureAreas: number; // Active Bay of Bengal depressions
  synopticSystemName: string;
  breakHazardRisk: 'LOW' | 'MODERATE' | 'HIGH';
  synopticSummary: string;
  latitudeTimeline: TroughLatitudePoint[];
}

/**
 * 850 hPa Low-Level Jet (LLJ) & Cross-Equatorial Flow Dynamics
 * Evaluates Findlater Somali Jet core velocity, zonal westerly shear, and moisture transport
 */
export interface LowLevelJetPoint {
  date: string;
  windSpeedKnots: number;
  zonalComponentKnots: number;
  thresholdKnots: number; // 15 knots critical onset threshold
}

export interface LowLevelJetMetrics {
  coreWindSpeedKnots: number;
  normalWindSpeedKnots: number;
  zonalWesterlyComponentKnots: number;
  moistureFluxConvergence: number; // g / (kg · m · s)
  windDirectionDeg: number; // e.g. 250° (WSW)
  status: 'strengthening' | 'established' | 'weakening' | 'collapsed';
  statusLabel: string;
  crossEquatorialSurgeVerified: boolean;
  timeline: LowLevelJetPoint[];
  scientificAnalysis: string;
}

/**
 * Complete Monsoon Dynamics Dashboard Aggregate
 */
export interface MonsoonDashboardData {
  blockId: KoraputBlockId | 'all';
  blockName: string;
  currentPhase: MonsoonPhase;
  phaseLabel: string;
  onsetSummary: OnsetBayesianSummary;
  onsetDistribution: OnsetProbabilityDensityPoint[];
  troughState: MonsoonTroughState;
  lljMetrics: LowLevelJetMetrics;
  breakAlerts: BreakSpellAlert[];
  dataSourceProvenance: {
    onsetModel: string;
    troughTracking: string;
    lljReanalysis: string;
  };
  lastUpdated: string;
}
