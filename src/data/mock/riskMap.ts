/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * DEMO MODEL OUTPUT — HYPERLOCAL RISK MAP DATASET
 * 
 * DISCLAIMER:
 * This dataset contains DEMO MODEL OUTPUT generated for system demonstration and UI testing.
 * These are NOT official India Meteorological Department (IMD) operational forecasts.
 * Model accuracy and predictive metrics are simulated for demonstration purposes.
 */

import type { RiskMapRecord, ForecastHorizon } from '../../types/riskMap';

// Base metadata for demo dataset
export const DEMO_DATA_STATUS = 'DEMO MODEL OUTPUT' as const;
export const DEMO_MODEL_VERSION = 'NCUM-Koraput-v2.1 (Ensemble Experimental)';
export const DEMO_LAST_UPDATED = '2026-06-03T06:00:00+05:30';

interface BlockBaseProfile {
  id: string;
  name: string;
  elevationMeters: number;
  headquarters: string;
  agroEcologicalZone: string;
  totalAreaSqKm: number;
  panchayatsCount: number;
  telemetryStationCount: number;
  // Baseline probabilities at 14D
  baseOnset: number;
  baseBreak: number;
  baseHeavyRain: number;
  baseAnomaly: number;
  monsoonStatus: string;
  agriculturalSignal: string;
}

const BLOCK_PROFILES: BlockBaseProfile[] = [
  {
    id: 'kotpad',
    name: 'Kotpad',
    elevationMeters: 560,
    headquarters: 'Kotpad',
    agroEcologicalZone: 'Sabari-Kolab River Alluvial Plain',
    totalAreaSqKm: 630.5,
    panchayatsCount: 19,
    telemetryStationCount: 2,
    baseOnset: 72,
    baseBreak: 31,
    baseHeavyRain: 58,
    baseAnomaly: -12,
    monsoonStatus: 'Onset Watch',
    agriculturalSignal: 'Review sowing window',
  },
  {
    id: 'koraput',
    name: 'Koraput',
    elevationMeters: 870,
    headquarters: 'Koraput Town',
    agroEcologicalZone: 'Eastern Ghat High Altitude Zone',
    totalAreaSqKm: 562.4,
    panchayatsCount: 18,
    telemetryStationCount: 3,
    baseOnset: 76,
    baseBreak: 22,
    baseHeavyRain: 44,
    baseAnomaly: 24,
    monsoonStatus: 'Onset Imminent',
    agriculturalSignal: 'Prepare raised nursery beds for Mandia',
  },
  {
    id: 'jeypore',
    name: 'Jeypore',
    elevationMeters: 659,
    headquarters: 'Jeypore',
    agroEcologicalZone: 'Jeypore Valley / Central Lowland Plateau',
    totalAreaSqKm: 614.8,
    panchayatsCount: 22,
    telemetryStationCount: 3,
    baseOnset: 78,
    baseBreak: 18,
    baseHeavyRain: 52,
    baseAnomaly: 18,
    monsoonStatus: 'Active Surge Watch',
    agriculturalSignal: 'Clear irrigation ditches for paddy seedbeds',
  },
  {
    id: 'semiliguda',
    name: 'Semiliguda',
    elevationMeters: 910,
    headquarters: 'Semiliguda',
    agroEcologicalZone: 'Highland Undulating Plateau',
    totalAreaSqKm: 489.1,
    panchayatsCount: 16,
    telemetryStationCount: 2,
    baseOnset: 82,
    baseBreak: 20,
    baseHeavyRain: 65,
    baseAnomaly: 32,
    monsoonStatus: 'High Convective Watch',
    agriculturalSignal: 'Reinforce bunds against highland runoff',
  },
  {
    id: 'pottangi',
    name: 'Pottangi',
    elevationMeters: 960,
    headquarters: 'Pottangi',
    agroEcologicalZone: 'Deomali Foothills / High Rain Valley',
    totalAreaSqKm: 541.2,
    panchayatsCount: 14,
    telemetryStationCount: 2,
    baseOnset: 86,
    baseBreak: 14,
    baseHeavyRain: 78,
    baseAnomaly: 45,
    monsoonStatus: 'Orographic Surge Alert',
    agriculturalSignal: 'Halt upland fertilizer application ahead of heavy showers',
  },
  {
    id: 'nandapur',
    name: 'Nandapur',
    elevationMeters: 920,
    headquarters: 'Nandapur',
    agroEcologicalZone: 'Jalaput Catchment Zone',
    totalAreaSqKm: 512.6,
    panchayatsCount: 17,
    telemetryStationCount: 1,
    baseOnset: 80,
    baseBreak: 19,
    baseHeavyRain: 59,
    baseAnomaly: 28,
    monsoonStatus: 'Steady Onset Flow',
    agriculturalSignal: 'Begin pre-sowing soil tillage on terraced land',
  },
  {
    id: 'lamtaput',
    name: 'Lamtaput',
    elevationMeters: 840,
    headquarters: 'Lamtaput',
    agroEcologicalZone: 'Machkund Basin Highland',
    totalAreaSqKm: 478.3,
    panchayatsCount: 15,
    telemetryStationCount: 1,
    baseOnset: 74,
    baseBreak: 25,
    baseHeavyRain: 48,
    baseAnomaly: 15,
    monsoonStatus: 'Onset Watch',
    agriculturalSignal: 'Monitor soil moisture for millet broadcasting',
  },
  {
    id: 'dasamantapur',
    name: 'Dasamantapur',
    elevationMeters: 780,
    headquarters: 'Dasamantapur',
    agroEcologicalZone: 'Northern Hilly Forest Tract',
    totalAreaSqKm: 698.0,
    panchayatsCount: 16,
    telemetryStationCount: 1,
    baseOnset: 68,
    baseBreak: 34,
    baseHeavyRain: 42,
    baseAnomaly: -8,
    monsoonStatus: 'Moderate Onset Probability',
    agriculturalSignal: 'Check seed moisture before community storage release',
  },
  {
    id: 'laxmipur',
    name: 'Laxmipur',
    elevationMeters: 850,
    headquarters: 'Laxmipur',
    agroEcologicalZone: 'Eastern Mountain Corridor',
    totalAreaSqKm: 588.4,
    panchayatsCount: 18,
    telemetryStationCount: 2,
    baseOnset: 71,
    baseBreak: 29,
    baseHeavyRain: 54,
    baseAnomaly: 12,
    monsoonStatus: 'Onset Watch',
    agriculturalSignal: 'Inspect contour trenches across upland slopes',
  },
  {
    id: 'narayanpatna',
    name: 'Narayanpatna',
    elevationMeters: 420,
    headquarters: 'Narayanpatna',
    agroEcologicalZone: 'Jhanjavati Lowland Escarpment',
    totalAreaSqKm: 520.1,
    panchayatsCount: 13,
    telemetryStationCount: 1,
    baseOnset: 64,
    baseBreak: 42,
    baseHeavyRain: 36,
    baseAnomaly: -22,
    monsoonStatus: 'Dry Spell Advisory',
    agriculturalSignal: 'Delay dry seeding; wait for cumulative 35mm wetting event',
  },
  {
    id: 'bandhugaon',
    name: 'Bandhugaon',
    elevationMeters: 380,
    headquarters: 'Bandhugaon',
    agroEcologicalZone: 'Inter-State Border Escarpment',
    totalAreaSqKm: 495.7,
    panchayatsCount: 12,
    telemetryStationCount: 1,
    baseOnset: 62,
    baseBreak: 46,
    baseHeavyRain: 32,
    baseAnomaly: -28,
    monsoonStatus: 'Dry Spell Advisory',
    agriculturalSignal: 'Conserve farm pond water; delay high-water nurseries',
  },
  {
    id: 'borigumma',
    name: 'Borigumma',
    elevationMeters: 580,
    headquarters: 'Borigumma',
    agroEcologicalZone: 'North-Western Agricultural Plain',
    totalAreaSqKm: 742.3,
    panchayatsCount: 30,
    telemetryStationCount: 2,
    baseOnset: 75,
    baseBreak: 24,
    baseHeavyRain: 50,
    baseAnomaly: 8,
    monsoonStatus: 'Onset Watch',
    agriculturalSignal: 'Prepare medium-duration paddy varieties',
  },
  {
    id: 'kundura',
    name: 'Kundura',
    elevationMeters: 610,
    headquarters: 'Kundura',
    agroEcologicalZone: 'Western Undulating Forest Fringe',
    totalAreaSqKm: 482.9,
    panchayatsCount: 14,
    telemetryStationCount: 1,
    baseOnset: 73,
    baseBreak: 27,
    baseHeavyRain: 46,
    baseAnomaly: -5,
    monsoonStatus: 'Onset Watch',
    agriculturalSignal: 'Complete land prep for pulses and oilseeds',
  },
  {
    id: 'boipariguda',
    name: 'Boipariguda',
    elevationMeters: 620,
    headquarters: 'Boipariguda',
    agroEcologicalZone: 'Gupteswar Forest & Karst Basin',
    totalAreaSqKm: 673.8,
    panchayatsCount: 17,
    telemetryStationCount: 1,
    baseOnset: 77,
    baseBreak: 21,
    baseHeavyRain: 60,
    baseAnomaly: 22,
    monsoonStatus: 'Moderate Rain Expected',
    agriculturalSignal: 'Protect low-lying seedbeds from flash inundation',
  },
];

// Multipliers and shift curves across forecast horizons (7D, 14D, 21D, 30D)
const HORIZON_FACTORS: Record<
  ForecastHorizon,
  { onsetShift: number; breakShift: number; heavyShift: number; anomalyShift: number; confidence: number }
> = {
  '7D': { onsetShift: -8, breakShift: -5, heavyShift: 6, anomalyShift: -4, confidence: 88 },
  '14D': { onsetShift: 0, breakShift: 0, heavyShift: 0, anomalyShift: 0, confidence: 79 },
  '21D': { onsetShift: 10, breakShift: 6, heavyShift: -6, anomalyShift: 6, confidence: 68 },
  '30D': { onsetShift: 16, breakShift: 12, heavyShift: -12, anomalyShift: 10, confidence: 58 },
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

/**
 * Builds realistic DEMO MODEL OUTPUT records for all 14 blocks + district across all horizons
 */
function buildMockRiskMapRecords(): Record<ForecastHorizon, Record<string, RiskMapRecord>> {
  const horizons: ForecastHorizon[] = ['7D', '14D', '21D', '30D'];
  const result: Record<ForecastHorizon, Record<string, RiskMapRecord>> = {
    '7D': {},
    '14D': {},
    '21D': {},
    '30D': {},
  };

  for (const h of horizons) {
    const factor = HORIZON_FACTORS[h];
    let districtOnsetSum = 0;
    let districtBreakSum = 0;
    let districtHeavySum = 0;
    let districtAnomalySum = 0;

    for (const b of BLOCK_PROFILES) {
      const onset = clamp(b.baseOnset + factor.onsetShift, 5, 98);
      const breakRisk = clamp(b.baseBreak + factor.breakShift, 4, 95);
      const heavy = clamp(b.baseHeavyRain + factor.heavyShift, 5, 96);
      const anomaly = Math.round((b.baseAnomaly + factor.anomalyShift) * 10) / 10;

      districtOnsetSum += onset;
      districtBreakSum += breakRisk;
      districtHeavySum += heavy;
      districtAnomalySum += anomaly;

      let status = 'Moderate';
      if (onset >= 80) status = 'Very High';
      else if (onset >= 60) status = 'High';
      else if (onset < 40) status = 'Low';

      result[h][b.id] = {
        locationId: b.id,
        locationName: b.name,
        type: 'block',
        geometryId: b.id,
        onsetProbability: onset,
        breakProbability: breakRisk,
        heavyRainProbability: heavy,
        rainfallAnomaly: anomaly,
        forecastHorizon: h,
        confidence: factor.confidence,
        status,
        monsoonStatus: b.monsoonStatus,
        agriculturalSignal: b.agriculturalSignal,
        dataStatus: DEMO_DATA_STATUS,
        lastUpdated: DEMO_LAST_UPDATED,
        modelVersion: DEMO_MODEL_VERSION,
        elevationMeters: b.elevationMeters,
        headquarters: b.headquarters,
        agroEcologicalZone: b.agroEcologicalZone,
        totalAreaSqKm: b.totalAreaSqKm,
        panchayatsCount: b.panchayatsCount,
        telemetryStationCount: b.telemetryStationCount,
        observedRainfallMm: Math.round((60 + (b.elevationMeters / 30) + (anomaly * 0.4)) * 10) / 10,
        normalRainfallMm: Math.round((55 + (b.elevationMeters / 35)) * 10) / 10,
        expectedRainfall7dMm: Math.round((95 + (onset * 0.6)) * 10) / 10,
      };
    }

    const n = BLOCK_PROFILES.length;
    const avgOnset = Math.round(districtOnsetSum / n);
    const avgBreak = Math.round(districtBreakSum / n);
    const avgHeavy = Math.round(districtHeavySum / n);
    const avgAnomaly = Math.round((districtAnomalySum / n) * 10) / 10;

    const districtRecord: RiskMapRecord = {
      locationId: 'all',
      locationName: 'Koraput District',
      type: 'district',
      geometryId: 'koraput-district',
      onsetProbability: avgOnset,
      breakProbability: avgBreak,
      heavyRainProbability: avgHeavy,
      rainfallAnomaly: avgAnomaly,
      forecastHorizon: h,
      confidence: factor.confidence,
      status: avgOnset >= 70 ? 'High' : 'Moderate',
      monsoonStatus: 'District Monsoon Watch Active',
      agriculturalSignal: 'Review block-level sowing advisories based on elevation gradient',
      dataStatus: DEMO_DATA_STATUS,
      lastUpdated: DEMO_LAST_UPDATED,
      modelVersion: DEMO_MODEL_VERSION,
      elevationMeters: 740,
      headquarters: 'Koraput Town',
      agroEcologicalZone: 'South-Eastern Ghat Agro-Ecological Zone',
      totalAreaSqKm: 8807,
      panchayatsCount: 240,
      telemetryStationCount: 28,
      observedRainfallMm: 72.4,
      normalRainfallMm: 61.2,
      expectedRainfall7dMm: 118.0,
    };

    result[h]['all'] = districtRecord;
    result[h]['koraput-district'] = districtRecord;
  }

  return result;
}

export const MOCK_RISK_MAP_DATA = buildMockRiskMapRecords();
