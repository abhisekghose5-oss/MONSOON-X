/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Meteorological Standards & Configuration
 * 
 * Configurable scientific thresholds for Koraput precipitation analysis,
 * dry-spell monitoring, and IMD departure classifications.
 * 
 * Scientific References:
 * - India Meteorological Department (IMD) Glossary & Standards
 * - IMD Pune National Climate Centre (NCC) Climatological Normals
 * - WMO Guidelines on Drought Indices & Break Monsoon Classification
 */

/**
 * IMD Definition of a Rainy Day:
 * A day with 24-hour rainfall of 2.5 mm or more is classified as a Rainy Day.
 * Any day with < 2.5 mm is classified as a Dry Day.
 */
export const DRY_DAY_RAINFALL_THRESHOLD_MM = 2.5;

/**
 * Dry Spell Severity Thresholds (Consecutive Dry Days during SW Monsoon):
 * - LOW: 5 to 7 days (early moisture depletion in upland paddy / ragi)
 * - MODERATE: 8 to 14 days (significant vegetative water stress)
 * - HIGH: >= 15 days (severe agricultural drought / prolonged break monsoon)
 */
export const DRY_SPELL_SEVERITY_THRESHOLDS = {
  MIN_DRY_SPELL_DAYS: 3, // Minimum consecutive days to register as a spell
  LOW_MAX_DAYS: 7,
  MODERATE_MIN_DAYS: 8,
  MODERATE_MAX_DAYS: 14,
  HIGH_MIN_DAYS: 15,
} as const;

export type DrySpellSeverity = 'LOW' | 'MODERATE' | 'HIGH';

export function getDrySpellSeverity(durationDays: number): DrySpellSeverity {
  if (durationDays >= DRY_SPELL_SEVERITY_THRESHOLDS.HIGH_MIN_DAYS) {
    return 'HIGH';
  }
  if (durationDays >= DRY_SPELL_SEVERITY_THRESHOLDS.MODERATE_MIN_DAYS) {
    return 'MODERATE';
  }
  return 'LOW';
}

/**
 * Official IMD 24-hour Rainfall Intensity Classification:
 * Source: IMD Operational Met Terms
 */
export interface ImdRainfallIntensityDefinition {
  category: string;
  minMm: number;
  maxMm: number | null; // null for unbounded upper limit
  color: string;
  description: string;
}

export const IMD_RAINFALL_INTENSITIES: ImdRainfallIntensityDefinition[] = [
  {
    category: 'No Rain',
    minMm: 0,
    maxMm: 0.0,
    color: '#94A3B8', // Slate
    description: 'Nil precipitation (0.0 mm)',
  },
  {
    category: 'Very Light Rain',
    minMm: 0.1,
    maxMm: 2.4,
    color: '#CBD5E1', // Light slate
    description: '0.1 to 2.4 mm (Dry day by IMD standard)',
  },
  {
    category: 'Light Rain',
    minMm: 2.5,
    maxMm: 15.5,
    color: '#38BDF8', // Sky
    description: '2.5 to 15.5 mm (Rainy day)',
  },
  {
    category: 'Moderate Rain',
    minMm: 15.6,
    maxMm: 64.4,
    color: '#0284C7', // Deep blue
    description: '15.6 to 64.4 mm (Favorable crop recharge)',
  },
  {
    category: 'Heavy Rain',
    minMm: 64.5,
    maxMm: 115.5,
    color: '#F59E0B', // Amber
    description: '64.5 to 115.5 mm (Potential runoff & waterlogging)',
  },
  {
    category: 'Very Heavy Rain',
    minMm: 115.6,
    maxMm: 204.4,
    color: '#EF4444', // Red
    description: '115.6 to 204.4 mm (Flash flood / slope wash risk)',
  },
  {
    category: 'Extremely Heavy Rain',
    minMm: 204.5,
    maxMm: null,
    color: '#7F1D1D', // Dark crimson
    description: '>= 204.5 mm (Exceptional extreme precipitation)',
  },
];

/**
 * Official IMD Rainfall Departure (Anomaly) Standard:
 */
export const IMD_DEPARTURE_THRESHOLDS = {
  LARGE_EXCESS_MIN: 60, // >= +60%
  EXCESS_MIN: 20, // +20% to +59%
  NORMAL_MIN: -19, // -19% to +19%
  DEFICIENT_MIN: -59, // -59% to -20%
  LARGE_DEFICIENT_MAX: -60, // <= -60%
} as const;

export type ImdDepartureCategoryType =
  | 'Large Excess'
  | 'Excess'
  | 'Normal'
  | 'Deficit'
  | 'Strong Deficit'
  | 'No Rain';

export function classifyDepartureCategory(departurePercent: number | null): ImdDepartureCategoryType {
  if (departurePercent === null || Number.isNaN(departurePercent)) return 'Normal';
  if (departurePercent >= IMD_DEPARTURE_THRESHOLDS.LARGE_EXCESS_MIN) return 'Large Excess';
  if (departurePercent >= IMD_DEPARTURE_THRESHOLDS.EXCESS_MIN) return 'Excess';
  if (departurePercent >= IMD_DEPARTURE_THRESHOLDS.NORMAL_MIN) return 'Normal';
  if (departurePercent > IMD_DEPARTURE_THRESHOLDS.LARGE_DEFICIENT_MAX) return 'Deficit';
  return 'Strong Deficit';
}
