/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Rainfall Anomaly Calculation Engine (Step 5 - Section 7)
 * 
 * Standard IMD Anomaly Formula:
 * Anomaly % = ((Observed Rainfall - Normal Rainfall) / Normal Rainfall) * 100
 * 
 * Includes rigorous guards against:
 * - Null or undefined readings
 * - Zero or near-zero normal rainfall in dry months (preventing divide-by-zero or infinite spikes)
 * - Partial or incomplete series
 */

import type { ImdDepartureCategory } from '../types/rainfall';

export interface AnomalyComputationResult {
  observedMm: number | null;
  normalMm: number | null;
  anomalyMm: number | null;
  anomalyPercentage: number | null;
  category: ImdDepartureCategory | 'DATA_REQUIRED';
  isComputable: boolean;
  reason?: string;
}

/**
 * Calculates rainfall percentage anomaly for a single observation or period.
 * 
 * Formula: ((Observed - Normal) / Normal) * 100
 */
export function calculateRainfallAnomaly(
  observed: number | null | undefined,
  normal: number | null | undefined
): number | null {
  // Handle missing data: Never return fake numbers if inputs are missing
  if (observed === null || observed === undefined || Number.isNaN(observed)) {
    return null;
  }
  if (normal === null || normal === undefined || Number.isNaN(normal)) {
    return null;
  }

  // Handle negative values
  if (observed < 0 || normal < 0) {
    return null;
  }

  // Handle zero / near-zero normal rainfall (e.g. winter dry months in Koraput)
  if (normal === 0) {
    if (observed === 0) return 0; // Exactly matched zero normal
    // If normal is zero but observed > 0, departure is positive excess, clamped to 100% to prevent Infinity
    return 100.0;
  }

  // When normal is near-zero (< 1.0 mm), small absolute rain (e.g. 5mm) creates huge percentage (e.g. +500%).
  // We compute mathematically but clamp extreme anomalies to [-100, +500] for stability.
  const departure = ((observed - normal) / normal) * 100;
  return Math.round(Math.max(-100, Math.min(500, departure)) * 10) / 10;
}

/**
 * Categorizes an anomaly percentage according to standard India Meteorological Department (IMD) brackets:
 * - Large Excess: +60% or more
 * - Excess: +20% to +59%
 * - Normal: -19% to +19%
 * - Deficient: -59% to -20%
 * - Large Deficient: -60% or less
 * - No Rain: -100% when observed is 0
 */
export function getImdDepartureCategory(
  anomalyPercentage: number | null,
  observedRainfall?: number | null
): ImdDepartureCategory | 'DATA_REQUIRED' {
  if (anomalyPercentage === null || Number.isNaN(anomalyPercentage)) {
    return 'DATA_REQUIRED';
  }

  if (observedRainfall !== undefined && observedRainfall !== null && observedRainfall === 0 && anomalyPercentage <= -99) {
    return 'No Rain';
  }

  if (anomalyPercentage >= 60) return 'Large Excess';
  if (anomalyPercentage >= 20) return 'Excess';
  if (anomalyPercentage >= -19) return 'Normal';
  if (anomalyPercentage >= -59) return 'Deficient';
  return 'Large Deficient';
}

/**
 * Calculates cumulative anomaly over paired time series (e.g. day 1 to day N).
 * Rejects calculation if missing values exceed 20% of data points.
 */
export function calculateCumulativeAnomaly(
  observedSeries: (number | null | undefined)[],
  normalSeries: (number | null | undefined)[]
): AnomalyComputationResult {
  if (!observedSeries || !normalSeries || observedSeries.length === 0 || normalSeries.length === 0) {
    return {
      observedMm: null,
      normalMm: null,
      anomalyMm: null,
      anomalyPercentage: null,
      category: 'DATA_REQUIRED',
      isComputable: false,
      reason: 'Empty series supplied',
    };
  }

  const length = Math.min(observedSeries.length, normalSeries.length);
  let validObsSum = 0;
  let validNormSum = 0;
  let validCount = 0;

  for (let i = 0; i < length; i++) {
    const obs = observedSeries[i];
    const norm = normalSeries[i];

    if (obs !== null && obs !== undefined && norm !== null && norm !== undefined && !Number.isNaN(obs) && !Number.isNaN(norm)) {
      validObsSum += obs;
      validNormSum += norm;
      validCount++;
    }
  }

  // If less than 80% data is present, reject to prevent false conclusions
  if (validCount < length * 0.8) {
    return {
      observedMm: validCount > 0 ? Math.round(validObsSum * 10) / 10 : null,
      normalMm: validCount > 0 ? Math.round(validNormSum * 10) / 10 : null,
      anomalyMm: null,
      anomalyPercentage: null,
      category: 'DATA_REQUIRED',
      isComputable: false,
      reason: `Insufficient valid readings (${validCount}/${length} points)`,
    };
  }

  const roundedObs = Math.round(validObsSum * 10) / 10;
  const roundedNorm = Math.round(validNormSum * 10) / 10;
  const anomalyMm = Math.round((roundedObs - roundedNorm) * 10) / 10;
  const anomalyPercentage = calculateRainfallAnomaly(roundedObs, roundedNorm);

  return {
    observedMm: roundedObs,
    normalMm: roundedNorm,
    anomalyMm,
    anomalyPercentage,
    category: getImdDepartureCategory(anomalyPercentage, roundedObs),
    isComputable: true,
  };
}

/**
 * Calculates seasonal anomaly for South-West Monsoon (JJAS: June 1 to September 30)
 */
export function calculateSeasonalAnomaly(
  observedTotalMm: number | null | undefined,
  seasonalNormalLpaMm: number | null | undefined
): AnomalyComputationResult {
  if (observedTotalMm === null || observedTotalMm === undefined || seasonalNormalLpaMm === null || seasonalNormalLpaMm === undefined) {
    return {
      observedMm: null,
      normalMm: null,
      anomalyMm: null,
      anomalyPercentage: null,
      category: 'DATA_REQUIRED',
      isComputable: false,
      reason: 'Seasonal inputs unavailable',
    };
  }

  const pct = calculateRainfallAnomaly(observedTotalMm, seasonalNormalLpaMm);
  const diff = Math.round((observedTotalMm - seasonalNormalLpaMm) * 10) / 10;

  return {
    observedMm: Math.round(observedTotalMm * 10) / 10,
    normalMm: Math.round(seasonalNormalLpaMm * 10) / 10,
    anomalyMm: diff,
    anomalyPercentage: pct,
    category: getImdDepartureCategory(pct, observedTotalMm),
    isComputable: true,
  };
}
