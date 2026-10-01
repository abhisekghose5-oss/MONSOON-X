export type CropCategory = 'cereal' | 'millet' | 'oilseed' | 'cash_crop' | 'pulses' | 'horticulture';

export interface CropDefinition {
  id: string; // 'paddy', 'maize', 'ragi', 'groundnut', 'pulses', 'cotton', 'vegetables'
  name: string;
  localName: string; // Odia common name (e.g. Dhan, Mandia, Makka, Chinabadam)
  category: CropCategory;
  scientificName: string;
  typicalDurationDays: number;
  optimalSoilType: string;
  isKharifPrimary: boolean;
}

export type AgronomicRiskLevel = 'nominal' | 'watch' | 'alert' | 'warning';

export interface CropRiskDetail {
  cropId: string;
  cropName: string;
  localName: string;
  category: CropCategory;
  currentRisk: AgronomicRiskLevel;
  currentRiskLabel: string;
  rainfallOutlook: string; // Expected precipitation accumulation & context
  drySpellProbability: number; // 0 - 100%
  heavyRainProbability: number; // 0 - 100%
  sowingWindow: {
    status: 'Optimal Window Open' | 'Caution - Monitor Soil' | 'Window Closing' | 'Sowing Concluded';
    windowClosesInDays?: number;
    recommendedWindowDate: string;
    advice: string;
  };
  waterStress: {
    level: 'None' | 'Low' | 'Moderate' | 'High';
    description: string;
    rootZoneMoistureVolumetricPct: number; // e.g. 34%
    statusColor: 'agriculture' | 'normal' | 'warning' | 'risk';
  };
  recommendedAction: string;
  confidence: {
    score: number; // 0 - 100%
    tier: 'High' | 'Moderate' | 'Low';
    basis: string;
  };
  phenologyStage: string; // e.g. "Nursery / Early Tillering"
}

export interface CropRiskMatrixRow {
  cropId: string;
  cropName: string;
  localName: string;
  category: CropCategory;
  onsetRisk: {
    level: 'Low' | 'Moderate' | 'High';
    detail: string;
  };
  drySpellRisk: {
    level: 'Low' | 'Moderate' | 'High' | 'Critical';
    probability: number;
  };
  heavyRainRisk: {
    level: 'Low' | 'Moderate' | 'High' | 'Severe';
    probability: number;
  };
  recommendation: string;
}

export interface StructuredAdvisory {
  cropId: string;
  cropName: string;
  localName: string;
  issuanceDate: string;
  validUntil: string;
  targetBlock: string;
  whatIsHappening: string;
  why: string;
  whatShouldIDo: string[];
  when: string;
  confidence: {
    score: number;
    tier: 'High' | 'Moderate' | 'Low';
    statement: string;
  };
}

export interface AgricultureDashboardData {
  availableCrops: CropDefinition[];
  selectedCropId: string;
  cropDetails: Record<string, CropRiskDetail>;
  riskMatrix: CropRiskMatrixRow[];
  advisories: Record<string, StructuredAdvisory>;
  blockAgroContext: {
    blockId: string;
    blockName: string;
    elevationMeters: number;
    soilType: string;
    agroEcologicalZone: string;
    generalBulletinNotice: string;
  };
  metadata: {
    sourceAgency: string;
    ruleEngineVersion: string;
    lastUpdated: string;
    isDemoModelOutput: boolean;
  };
}
