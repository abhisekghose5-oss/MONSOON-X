/**
 * MONSOON-X (SIH26086)
 * Real Data Integration Architecture Types (Step 5)
 */

import type { Geometry } from './geography';

// 1. Data Provenance & Status Classification (Section 9)
export type DataStatus =
  | 'LIVE'
  | 'OFFICIAL'
  | 'HISTORICAL'
  | 'CACHED'
  | 'MODEL'
  | 'DEMO'
  | 'MISSING';

// 2. Geographic Hierarchy & Entity Interfaces (Section 3 & 19)
export interface GeoLocation {
  id: string;
  name: string;
  type: 'district' | 'block' | 'panchayat';
  district: string;
  state: string;
  geometry: Geometry;
  center?: [number, number]; // [lat, lon]
  elevationMeters?: number;
  properties?: Record<string, unknown>;
}

export interface DistrictEntity {
  id: string;
  name: string;
  type: 'district';
  district: string;
  state: string;
  country: string;
  center: [number, number];
  boundingBox?: [number, number, number, number];
  totalAreaSqKm: number;
  blocksCount: number;
  geometry: Geometry;
  properties?: Record<string, unknown>;
}

export interface BlockEntity {
  id: string;
  name: string;
  type: 'block';
  district: string;
  districtId: string;
  state: string;
  headquarters: string;
  coordinates: [number, number];
  elevationMeters: number;
  totalAreaSqKm: number;
  agroEcologicalZone: string;
  panchayatsCount?: number;
  telemetryStationCount?: number;
  geometry: Geometry;
  properties?: Record<string, unknown>;
}

export interface PanchayatEntity {
  id: string;
  name: string;
  type: 'panchayat';
  blockId: string;
  blockName: string;
  district: string;
  state: string;
  coordinates?: [number, number];
  elevationMeters?: number;
  vulnerabilityTag?: string;
  soilType?: string;
  geometry: Geometry; // null if official boundary GeoJSON not yet available
  properties?: Record<string, unknown>;
}

// 3. Rainfall Normal Data Model (Section 5 & 19)
export interface RainfallNormal {
  locationId: string;
  locationName: string;
  month: number | string; // 1-12 or 'January' or 'JJAS'
  normalRainfallMm: number | 'DATA_REQUIRED';
  source: string;
  sourceDate: string;
  unit: string;
}

// 4. Historical Rainfall Observation (Section 6 & 19)
export interface RainfallRecord {
  date: string; // ISO date YYYY-MM-DD
  locationId: string;
  locationName?: string;
  rainfallMm: number | null;
  source: string;
  observationType: 'observed' | 'derived' | 'gridded' | 'forecast';
  granularity?: 'daily' | 'monthly' | 'seasonal';
  qualityFlag?: 'verified' | 'suspect' | 'imputed' | 'missing';
}

// 5. Rainfall Anomaly Contract (Section 7 & 19)
export interface RainfallAnomaly {
  locationId: string;
  observedMm: number | null;
  normalMm: number | null;
  anomalyMm: number | null;
  anomalyPercentage: number | null;
  departureCategory:
    | 'Large Excess'
    | 'Excess'
    | 'Normal'
    | 'Deficient'
    | 'Large Deficient'
    | 'No Rain'
    | 'DATA_REQUIRED';
  period: string; // e.g. "June 2026", "Monsoon JJAS 2026", "2026-06-15"
  dataStatus: DataStatus;
}

// 6. Global Climate Teleconnection Indices (Section 4 & 19)
export interface ClimateIndex {
  name: string;
  code: 'ENSO' | 'IOD' | 'MJO' | 'BSISO';
  value: number | string;
  unit: string;
  anomaly?: number;
  phase?: string;
  source: string;
  sourceUrl: string;
  observationDate: string;
  dataStatus: DataStatus;
  impactOnKoraput: string;
  description?: string;
}

// 7. Data Provenance & Metadata Container (Section 8 & 19)
export interface DataSource {
  id: string;
  name: string;
  source: string;
  sourceUrl: string;
  retrievedAt: string;
  period: string;
  spatialResolution: string;
  temporalResolution: string;
  unit: string;
  qualityStatus: DataStatus;
  description: string;
  recordsCount?: number | string;
}
