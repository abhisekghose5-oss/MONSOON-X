export type OfficerHorizon = '7d' | '14d' | '21d' | '30d';

export type RiskGrade = 'low' | 'moderate' | 'high' | 'critical';

export interface BlockRiskEntry {
  blockId: string;
  blockName: string;
  headquarters: string;
  elevationMeters: number;
  agroEcologicalZone: string;
  kharifAcreageHa: number;
  onsetAnomalyDays: number;
  isFalseOnsetAlert: boolean;
  drySpellProbability: number;
  drySpellSeverity: 'mild' | 'moderate' | 'severe' | 'extreme';
  heavyRainProbability: number;
  soilMoistureDeficitPercent: number;
  overallRiskLevel: RiskGrade;
  primaryCropVulnerable: string;
  recommendedDirective: string;
  panchayatCount: number;
  panchayatsWithAlert: number;
}

export interface CropRiskSummary {
  cropKey: string;
  cropName: string;
  districtAcreageHa: number;
  shareOfKharifPercent: number;
  riskLevel: RiskGrade;
  vulnerabilityFactors: string[];
  drySpellToleranceDays: number;
  criticalWindow: string;
  actionDirective: string;
}

export interface DistrictOfficerOverview {
  totalKharifAreaHa: number;
  blocksMonitored: number;
  highRiskBlocksCount: number;
  criticalAlertsActive: number;
  farmerSmsReach: number;
  panchayatCoverage: number;
  lastModelRun: string;
  monsoonPhase: string;
}

export interface HistoricalClimComparison {
  climatologicalNormalOnsetDate: string;
  predictedOnsetDate: string;
  onsetAnomalyDays: number;
  historicalDrySpellFreqJuly: string;
  analogousClimYears: string[];
  groundwaterRechargeIndex: string;
  decadalTrendOnsetShift: string;
}

export interface ForecastConfidenceMetrics {
  modelConfidenceScore: number;
  ensembleAgreementPercent: number;
  brierSkillScore: number;
  leadTimeReliabilityTier: 'Tier-A (Operational)' | 'Tier-B (High Confidence)' | 'Tier-C (Experimental)';
  uncertaintySpreadDays: number;
  dataFeedLatency: string;
}

export interface AdvisoryDistributionStats {
  biweeklyBulletinNumber: string;
  issuingAuthority: string;
  smsDispatchedCount: number;
  smsDeliveredPercent: number;
  whatsAppAgrometGroups: number;
  kvkHelplineTickets: number;
  extensionStaffAlerted: number;
}
