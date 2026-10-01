/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Strict Data Validation Engine (Step 5 - Section 11)
 * 
 * Rejects invalid meteorological data, checks bounding extents,
 * enforces unit consistency, and safely flags missing data without silent corruption.
 */

import { KORAPUT_BLOCKS } from '../data/koraputBlocks';

export interface ValidationResult<T> {
  isValid: boolean;
  value: T | null;
  error?: string;
  isMissing?: boolean;
}

// Known valid location IDs in Koraput District
const VALID_LOCATION_IDS = new Set<string>([
  'all',
  'koraput-district',
  ...KORAPUT_BLOCKS.map((b) => b.id),
]);

// Koraput Geographic Bounding Envelope (approx 18.1°N - 19.4°N, 82.0°E - 83.5°E)
export const KORAPUT_BOUNDS = {
  minLat: 18.0,
  maxLat: 19.5,
  minLon: 82.0,
  maxLon: 83.6,
};

/**
 * Validates geographic latitude and longitude
 */
export function validateCoordinates(
  lat: unknown,
  lon: unknown,
  strictKoraputBounds: boolean = false
): ValidationResult<[number, number]> {
  if (lat === null || lat === undefined || lon === null || lon === undefined) {
    return { isValid: false, value: null, isMissing: true, error: 'Coordinates missing' };
  }

  const numLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
  const numLon = typeof lon === 'number' ? lon : parseFloat(String(lon));

  if (Number.isNaN(numLat) || Number.isNaN(numLon)) {
    return { isValid: false, value: null, error: 'Coordinates are not valid numbers' };
  }

  if (numLat < -90 || numLat > 90 || numLon < -180 || numLon > 180) {
    return { isValid: false, value: null, error: `Coordinates out of WGS84 range: [${numLat}, ${numLon}]` };
  }

  if (strictKoraputBounds) {
    if (
      numLat < KORAPUT_BOUNDS.minLat ||
      numLat > KORAPUT_BOUNDS.maxLat ||
      numLon < KORAPUT_BOUNDS.minLon ||
      numLon > KORAPUT_BOUNDS.maxLon
    ) {
      return {
        isValid: false,
        value: null,
        error: `Coordinates [${numLat}, ${numLon}] fall outside Koraput administrative envelope`,
      };
    }
  }

  return { isValid: true, value: [numLat, numLon] };
}

/**
 * Validates precipitation values (mm).
 * Enforces non-negativity and flags extreme physical bursts (>1200 mm/24h).
 */
export function validateRainfall(rainfall: unknown): ValidationResult<number> {
  if (rainfall === null || rainfall === undefined || rainfall === '') {
    return { isValid: false, value: null, isMissing: true, error: 'Rainfall data missing' };
  }

  const num = typeof rainfall === 'number' ? rainfall : parseFloat(String(rainfall));

  if (Number.isNaN(num)) {
    return { isValid: false, value: null, error: 'Rainfall value is not a valid number' };
  }

  if (num < 0) {
    return { isValid: false, value: null, error: `Invalid negative rainfall: ${num} mm` };
  }

  // Physical world record 24h rainfall is ~1825mm; above 1200mm in Koraput is sensor anomaly/malfunction
  if (num > 1200) {
    return { isValid: false, value: null, error: `Physically implausible 24h rainfall spike: ${num} mm` };
  }

  return { isValid: true, value: num };
}

/**
 * Validates ISO date strings (e.g. YYYY-MM-DD)
 */
export function validateDate(dateStr: unknown): ValidationResult<string> {
  if (!dateStr || typeof dateStr !== 'string') {
    return { isValid: false, value: null, isMissing: true, error: 'Date string missing or invalid type' };
  }

  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return { isValid: false, value: null, error: `Invalid date format: ${dateStr}` };
  }

  // Ensure reasonable year range (e.g. 1950 - 2050)
  const year = parsed.getUTCFullYear();
  if (year < 1950 || year > 2050) {
    return { isValid: false, value: null, error: `Date year out of operational scope: ${year}` };
  }

  return { isValid: true, value: dateStr };
}

/**
 * Validates probabilistic metrics (0% to 100%)
 */
export function validateProbability(prob: unknown): ValidationResult<number> {
  if (prob === null || prob === undefined || prob === '') {
    return { isValid: false, value: null, isMissing: true, error: 'Probability value missing' };
  }

  const num = typeof prob === 'number' ? prob : parseFloat(String(prob));

  if (Number.isNaN(num)) {
    return { isValid: false, value: null, error: 'Probability is not a valid number' };
  }

  if (num < 0 || num > 100) {
    return { isValid: false, value: null, error: `Probability must be between 0 and 100, got: ${num}` };
  }

  return { isValid: true, value: num };
}

/**
 * Validates administrative location ID against the Koraput hierarchy
 */
export function validateLocationId(locationId: unknown): ValidationResult<string> {
  if (!locationId || typeof locationId !== 'string') {
    return { isValid: false, value: null, isMissing: true, error: 'Location ID missing' };
  }

  const normalized = locationId.toLowerCase().trim();
  if (!VALID_LOCATION_IDS.has(normalized) && !normalized.startsWith('gp-') && !normalized.startsWith('kpt-')) {
    return { isValid: false, value: null, error: `Unrecognized Koraput administrative location ID: ${locationId}` };
  }

  return { isValid: true, value: normalized };
}

/**
 * Validates data source attribution
 */
export function validateSource(source: unknown): ValidationResult<string> {
  if (!source || typeof source !== 'string' || source.trim().length === 0) {
    return { isValid: false, value: null, isMissing: true, error: 'Source attribution missing' };
  }

  return { isValid: true, value: source.trim() };
}

/**
 * Validates unit consistency
 */
export function validateUnit(unit: unknown, expectedUnit: string): ValidationResult<string> {
  if (!unit || typeof unit !== 'string') {
    return { isValid: false, value: null, isMissing: true, error: `Expected unit [${expectedUnit}], but unit is missing` };
  }

  if (unit.trim().toLowerCase() !== expectedUnit.toLowerCase()) {
    return { isValid: false, value: null, error: `Unit mismatch: expected [${expectedUnit}], got [${unit}]` };
  }

  return { isValid: true, value: unit.trim() };
}
