/**
 * MONSOON-X - OVERVIEW COMMAND CENTRE CONTRACTS
 * SIH26086: Hyperlocal Monsoon Onset & Break Prediction System
 */

export interface MonsoonProbabilities {
  monsoonOnset: {
    probability: number; // 0 - 100
    predictedDateRange: string;
    confidenceLevel: 'High' | 'Moderate' | 'Low';
    historicalNormalDate: string;
    daysAnomaly: number; // positive = later than normal, negative = earlier
    primaryDriver: string;
  };
  breakDrySpell: {
    probability: number; // 0 - 100
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    windowStart: string;
    expectedDurationDays: number;
    rainfallDeficitExpected: number; // percentage
    warningSummary: string;
  };
  heavyRainfall: {
    probability: number; // 0 - 100
    thresholdMm24h: number;
    peakWindow: string;
    convectiveIntensity: 'Moderate' | 'High' | 'Severe';
    vulnerableTerrain: string;
  };
}

export interface FalseOnsetWatch {
  status: 'active_watch' | 'nominal_monsoon' | 'false_onset_detected';
  riskScore: number; // 0 - 100
  title: string;
  summary: string;
  zonalWindReversalMet: boolean; // 850 hPa Westerlies
  troposphericMoistureDepthMet: boolean; // Precipitable water > 50mm
  olrThresholdMet: boolean; // Outgoing Longwave Radiation < 200 W/m²
  rainfallContinuityMet: boolean; // Spatial rain continuity over 48h
  recommendationToFarmers: string;
}

export interface RainfallAnomalySummary {
  observedRainfallMm: number;
  normalLpaMm: number;
  departurePercentage: number;
  departureStatus: 'Large Deficient' | 'Deficient' | 'Normal' | 'Excess' | 'Large Excess';
  rainyDaysCount: number;
  drySpellsRecorded: number;
  lastRainEventDate: string;
}

export interface DailyRainfallPoint {
  date: string;
  displayDate: string;
  forecastRainfallMm: number;
  normalBaselineMm: number;
  lowerConfidenceMm: number;
  upperConfidenceMm: number;
  probabilityPercent: number;
  weatherCondition: 'Dry' | 'Isolated Light' | 'Scattered Moderate' | 'Fairly Widespread' | 'Widespread Heavy';
}

export interface BlockRiskStatus {
  blockId: string;
  blockName: string;
  elevationMeters: number;
  riskLevel: 'nominal' | 'watch' | 'alert' | 'warning';
  primaryRisk: string;
  expected7dRainfallMm: number;
  sowingReadiness: 'Optimal' | 'Caution - Await Deep Moisture' | 'Delay Sowing' | 'Favorable';
}

export interface ClimateSignalOverview {
  index: 'ENSO' | 'IOD' | 'MJO' | 'BSISO';
  currentPhase: string;
  anomalyValue: string;
  impactOnKoraput: string;
  monsoonTrendContribution: 'Favorable' | 'Neutral' | 'Suppressing' | 'Delayed';
}

export interface AgroAdvisoryOverview {
  id: string;
  cropName: string;
  localName: string;
  category: 'Cereal' | 'Millet' | 'Cash Crop' | 'Pulses';
  urgency: 'critical' | 'high' | 'moderate' | 'low';
  headline: string;
  actionRequired: string;
  stage: string;
  validUntil: string;
}

export interface DataHealthOverview {
  sourceName: string;
  type: string;
  status: 'operational' | 'syncing' | 'delayed' | 'offline';
  latency: string;
  lastSyncTime: string;
  coverage: string;
}

export interface OverviewDashboardData {
  metadata: {
    generatedAt: string;
    synopticCycle: string;
    district: string;
    activeBlock: string;
    activeBlockName: string;
    horizonDays: number;
    isSimulation: boolean;
    disclaimer: string;
  };
  answers: {
    currentSituation: string;
    next7to30DaysOutlook: string;
    increasingRisks: string[];
    farmerActions: string[];
  };
  probabilities: MonsoonProbabilities;
  falseOnsetWatch: FalseOnsetWatch;
  rainfallAnomaly: RainfallAnomalySummary;
  fourteenDayRainfall: DailyRainfallPoint[];
  blockRisks: BlockRiskStatus[];
  climateSignals: ClimateSignalOverview[];
  advisories: AgroAdvisoryOverview[];
  dataHealth: DataHealthOverview[];
}
