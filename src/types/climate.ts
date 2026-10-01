/**
 * Climate Signal Intelligence Contracts
 * SIH26086 - MONSOON-X
 */

export type EnsoPhase = 'El Niño' | 'La Niña' | 'ENSO-Neutral';
export type IodPhase = 'Positive IOD' | 'Negative IOD' | 'Neutral IOD';

export interface EnsoSignalData {
  nino34: number; // Sea Surface Temperature Anomaly in °C (e.g. -0.42)
  phase: EnsoPhase;
  trend: string;
  source: string;
  observationDate: string;
  thresholds: {
    elNinoThreshold: number; // +0.5°C
    laNinaThreshold: number; // -0.5°C
  };
  modelInputRole: string; // "Model input: Serves as lower boundary condition in seasonal priors"
  potentialInfluenceKoraput: string; // "Statistical relationship indicates potential enhancement..."
  analogYears: string[];
}

export interface IodSignalData {
  dmi: number; // Dipole Mode Index in °C (e.g. +0.34)
  phase: IodPhase;
  trend: string;
  source: string;
  observationDate: string;
  westernPoleSst: number;
  easternPoleSst: number;
  modelInputRole: string; // "Model input: Modulates zonal moisture transport vectors..."
  potentialInfluenceKoraput: string; // "Statistical relationship suggests positive IOD dampens break risks..."
}

export interface MjoSignalData {
  phase: string; // e.g. "Phase 3 (East Indian Ocean)"
  phaseNumber: number; // 1 to 8
  amplitude: number; // e.g. 1.38 (> 1 = convectively active)
  movement: string; // e.g. "Eastward propagating at ~5 m/s toward Maritime Continent"
  source: string;
  observationDate: string;
  convectiveState: 'Convectively Active' | 'Suppressed' | 'Weak / Inactive';
  modelInputRole: string; // "Model input: Sub-seasonal intra-seasonal convective pulse driver"
  potentialInfluenceKoraput: string; // "Statistical relationship demonstrates higher frequency of convective events..."
}

export type CascadeStageId =
  | 'GLOBAL_CLIMATE'
  | 'REGIONAL_ATMOSPHERE'
  | 'LOCAL_RAINFALL'
  | 'AGRICULTURAL_RISK';

export interface TeleconnectionCascadeStage {
  stageId: CascadeStageId;
  order: number; // 1, 2, 3, 4
  levelName: string; // "GLOBAL CLIMATE", "REGIONAL ATMOSPHERE", etc.
  headline: string;
  activePhenomenon: string;
  physicalProcess: string;
  statisticalLink: string; // Non-deterministic wording: "Statistical relationship", "Potential influence"
  koraputImpact: string;
  statusBadge: string;
}

export interface ClimateTimelinePoint {
  month: string;
  displayMonth: string;
  year: number;
  nino34Anomaly: number;
  iodDmiAnomaly: number;
  mjoPhase: string;
  isForecastProjection: boolean;
  koraputRainfallDeparturePercent?: number;
  dominantInfluence: string;
}

export interface ClimateGuidancePrinciple {
  principleTitle: string;
  keyTerminology: 'Model input' | 'Potential influence' | 'Statistical relationship' | string;
  scientificExplanation: string;
  operationalApplication: string;
}

export interface ClimateSignalDashboardData {
  enso: EnsoSignalData;
  iod: IodSignalData;
  mjo: MjoSignalData;
  cascadeStages: TeleconnectionCascadeStage[];
  timeline: ClimateTimelinePoint[];
  explanatoryGuidance: {
    panelTitle: string;
    nonDeterministicDisclaimer: string;
    principles: ClimateGuidancePrinciple[];
  };
  metadata: {
    cycleTimestamp: string;
    modelCoupling: string;
    isDemoModelOutput: boolean;
  };
}
