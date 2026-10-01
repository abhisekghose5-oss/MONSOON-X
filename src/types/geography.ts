import type {
  Geometry as GeoJsonGeometry,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  FeatureCollection,
} from 'geojson';

/**
 * Standard GeoJSON Geometry representation
 */
export type Geometry =
  | GeoJsonGeometry
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon
  | null;

/**
 * District-level geographic representation
 */
export interface District {
  id: string;
  name: string;
  state: string;
  country: string;
  center: [number, number]; // [latitude, longitude]
  boundingBox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  totalAreaSqKm: number;
  blocksCount: number;
  geometry: Geometry;
  properties?: Record<string, unknown>;
}

/**
 * Administrative Block representation (e.g. 14 blocks of Koraput)
 */
export interface Block {
  id: string;
  name: string;
  districtId: string;
  headquarters: string;
  coordinates: [number, number]; // [latitude, longitude]
  elevationMeters: number;
  totalAreaSqKm: number;
  agroEcologicalZone: string;
  geometry: Geometry;
  properties?: Record<string, unknown>;
}

/**
 * Gram Panchayat representation
 */
export interface Panchayat {
  id: string;
  name: string;
  blockId: string;
  blockName?: string;
  coordinates?: [number, number]; // [latitude, longitude]
  elevationMeters?: number;
  geometry: Geometry; // null if official boundary data is unavailable
  properties?: Record<string, unknown>;
}

/**
 * GeoDataService result when loading geographic layers
 */
export interface GeoDataLoadResult<T> {
  isAvailable: boolean;
  data: T | null;
  message?: string;
  error?: string;
}

export type DistrictFeatureCollection = FeatureCollection<Polygon | MultiPolygon, Record<string, unknown>>;
export type BlockFeatureCollection = FeatureCollection<Polygon | MultiPolygon | Point, Record<string, unknown>>;
export type PanchayatFeatureCollection = FeatureCollection<Polygon | MultiPolygon | Point, Record<string, unknown>>;
