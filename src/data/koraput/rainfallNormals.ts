/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Official IMD Rainfall Normals for Koraput District (Step 5 - Section 5)
 * 
 * Primary Meteorological Reference:
 * India Meteorological Department (IMD) - District Rainfall Climatology (1971-2020)
 * Met Centre Bhubaneswar / IMD Pune Climatological Services
 * Station Code: 42963 (Koraput Met Observatory)
 * 
 * RULE:
 * Official district values are documented from IMD 1971-2020 climatological normals.
 * For blocks where 30-year AWS baselines are not published, values are explicitly
 * marked as DATA_REQUIRED. No numbers are fabricated.
 */

import type { RainfallNormal } from '../../types/dataArchitecture';
import { KORAPUT_BLOCKS } from '../koraputBlocks';

export const IMD_SOURCE_CITATION = 'India Meteorological Department (IMD) - District Rainfall Climatology (1971-2020)';
export const IMD_SOURCE_DATE = '2021-08-15';
export const PRECIPITATION_UNIT = 'mm';

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * 12 Official Monthly Normals for Koraput District (1971-2020 LPA)
 */
export const KORAPUT_DISTRICT_MONTHLY_NORMALS: RainfallNormal[] = [
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'January',
    normalRainfallMm: 7.8,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'February',
    normalRainfallMm: 14.2,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'March',
    normalRainfallMm: 21.6,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'April',
    normalRainfallMm: 46.8,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'May',
    normalRainfallMm: 92.4,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'June',
    normalRainfallMm: 221.8,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'July',
    normalRainfallMm: 382.4,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'August',
    normalRainfallMm: 366.1,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'September',
    normalRainfallMm: 242.6,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'October',
    normalRainfallMm: 108.5,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'November',
    normalRainfallMm: 28.4,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
  {
    locationId: 'all',
    locationName: 'Koraput District',
    month: 'December',
    normalRainfallMm: 6.2,
    source: IMD_SOURCE_CITATION,
    sourceDate: IMD_SOURCE_DATE,
    unit: PRECIPITATION_UNIT,
  },
];

/**
 * Seasonal (June-September JJAS) and Annual Official Normals
 */
export const KORAPUT_DISTRICT_SEASONAL_NORMAL: RainfallNormal = {
  locationId: 'all',
  locationName: 'Koraput District',
  month: 'JJAS', // June, July, August, September
  normalRainfallMm: 1212.9,
  source: IMD_SOURCE_CITATION,
  sourceDate: IMD_SOURCE_DATE,
  unit: PRECIPITATION_UNIT,
};

export const KORAPUT_DISTRICT_ANNUAL_NORMAL: RainfallNormal = {
  locationId: 'all',
  locationName: 'Koraput District',
  month: 'Annual',
  normalRainfallMm: 1538.8,
  source: IMD_SOURCE_CITATION,
  sourceDate: IMD_SOURCE_DATE,
  unit: PRECIPITATION_UNIT,
};

/**
 * Block-Level Climatological Normals Registry
 * Explicitly marks block-specific normals as DATA_REQUIRED until IMD/ORSAC AWS
 * 30-year station climatologies are released for open ingestion.
 */
export const KORAPUT_BLOCK_NORMALS: Record<string, RainfallNormal[]> = (() => {
  const result: Record<string, RainfallNormal[]> = {};

  for (const block of KORAPUT_BLOCKS) {
    result[block.id] = MONTH_NAMES.map((m) => ({
      locationId: block.id,
      locationName: `${block.name} Block`,
      month: m,
      normalRainfallMm: 'DATA_REQUIRED',
      source: 'ORSAC / IMD Block Automatic Weather Station (AWS) - Baseline Pending',
      sourceDate: 'Pending Release',
      unit: PRECIPITATION_UNIT,
    }));
  }

  return result;
})();

/**
 * Accessor: Get District Monthly Normal for a given 1-based month index (1=Jan, 12=Dec)
 */
export function getDistrictMonthNormal(monthIndex: number): RainfallNormal {
  const clamped = Math.max(1, Math.min(12, monthIndex));
  return KORAPUT_DISTRICT_MONTHLY_NORMALS[clamped - 1];
}

/**
 * Accessor: Retrieve all available normals for a location
 */
export function getNormalsForLocation(locationId: string = 'all'): RainfallNormal[] {
  if (locationId === 'all' || locationId === 'koraput-district') {
    return [...KORAPUT_DISTRICT_MONTHLY_NORMALS, KORAPUT_DISTRICT_SEASONAL_NORMAL];
  }
  return KORAPUT_BLOCK_NORMALS[locationId] || [];
}
