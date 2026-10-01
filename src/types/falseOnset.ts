/**
 * False Onset Watch Contracts & Threshold Configuration
 * SIH26086 - MONSOON-X
 */

export type FalseOnsetRiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface FalseOnsetInputs {
  onsetProbability: number; // 0 - 100%
  rainfallPersistenceDays: number; // Consecutive rain days (e.g. 2.5mm threshold)
  drySpellProbability: number; // 0 - 100% probability of dry spell immediately following
  forecastHorizonDays: number; // e.g. 14, 21, 30 days
}

export interface FalseOnsetThresholdConfig {
  // Configurable scientific criteria thresholds
  minOnsetProbabilityForTrigger: number; // Default: 40%
  highDrySpellProbabilityThreshold: number; // Default: 50%
  moderateDrySpellProbabilityThreshold: number; // Default: 30%
  maxRainfallPersistenceForFalseOnset: number; // Default: 4 days (transient rain, lack of continuity)
  troposphericMoistureThresholdMm: number; // Default: 45 mm PWV
  zonalWindReversalKnots: number; // Default: 15 knots at 850 hPa
}

export interface FalseOnsetDiagnosticCriterion {
  id: string;
  name: string;
  scientificBasis: string;
  thresholdLabel: string;
  currentValueLabel: string;
  isTriggered: boolean;
}

export interface FalseOnsetResult {
  isFalseOnsetDetected: boolean;
  riskLevel: FalseOnsetRiskLevel;
  inputs: FalseOnsetInputs;
  thresholdsUsed: FalseOnsetThresholdConfig;
  explanation: string; // "Initial rainfall conditions are detected, but the model indicates elevated probability of a subsequent dry spell."
  expectedWindow: {
    startDate: string;
    endDate: string;
    durationDays: number;
    windowLabel: string;
  };
  affectedBlocks: string[];
  confidence: {
    score: number; // 0 - 100%
    tier: 'High' | 'Moderate' | 'Low';
    basis: string;
  };
  recommendedAction: string;
  diagnosticCriteria: FalseOnsetDiagnosticCriterion[];
  metadata: {
    serviceName: string;
    modelVersion: string;
    lastEvaluated: string;
    isDemoModelOutput: boolean;
  };
}
