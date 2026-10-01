import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import type { RiskLevel } from '../components/design-system/RiskBadge';

// 1. Primary Risk Layers
export type RiskLayer = 'onset' | 'break' | 'heavyRain' | 'rainfallAnomaly';
export type RiskMapLayerId = RiskLayer; // Alias for backward compatibility

// 2. Forecast Horizons
export type ForecastHorizon = '7D' | '14D' | '21D' | '30D';

// 3. Administrative Geography Hierarchy
export type LocationType = 'district' | 'block' | 'panchayat';

export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  parentId?: string;
  parentName?: string;
  coordinates: [number, number]; // [lat, lng]
  elevationMeters: number;
}

// 4. Data Provenance Status
export type MapDataStatusType =
  | 'DEMO'
  | 'MODEL OUTPUT'
  | 'OBSERVED'
  | 'OFFICIAL FORECAST'
  | 'CACHED'
  | 'DEMO MODEL OUTPUT';

// 5. Canonical Risk Record Schema (Section 14)
export interface RiskMapRecord {
  locationId: string;
  locationName: string;
  type: LocationType;
  geometryId: string;
  onsetProbability: number;          // 0 - 100%
  breakProbability: number;          // 0 - 100%
  heavyRainProbability: number;      // 0 - 100%
  rainfallAnomaly: number;           // % departure from normal (-100 to +200)
  forecastHorizon: ForecastHorizon;
  confidence: number;                // 0 - 100%
  status: string;                    // e.g. "Very High", "Moderate", "Onset Watch"
  monsoonStatus: string;             // e.g. "Onset Watch", "Active Surge", "Break Threat"
  agriculturalSignal: string;        // e.g. "Review sowing window", "Delay nursery transplantation"
  dataStatus: MapDataStatusType;
  lastUpdated: string;
  modelVersion: string;
  
  // Supplementary Geographic & Meteorological Details
  elevationMeters?: number;
  headquarters?: string;
  observedRainfallMm?: number;
  normalRainfallMm?: number;
  expectedRainfall7dMm?: number;
  agroEcologicalZone?: string;
  totalAreaSqKm?: number;
  panchayatsCount?: number;
  telemetryStationCount?: number;
  soilMoistureProfile?: string;
}

// 6. Comprehensive Detail Payload for Selected Location
export interface RiskDetail {
  record: RiskMapRecord;
  location: MapLocation;
  panchayatsCount?: number;
  advisoryText?: string;
}

// 7. API / Service Response Container
export interface RiskMapResponse {
  horizon: ForecastHorizon;
  layer: RiskLayer;
  locationId: string;
  records: Record<string, RiskMapRecord>;
  districtSummary: RiskMapRecord;
  dataStatus: MapDataStatusType;
  modelVersion: string;
  lastUpdated: string;
}

// 8. Legend Step
export interface LegendColorStep {
  min: number;
  max: number;
  label: string;
  subLabel?: string;
  color: string;
  borderColor?: string;
  textColor?: string;
}

// 9. Layer Configuration
export interface RiskMapLayerConfig {
  id: RiskLayer;
  name: string;
  shortName: string;
  unit: string;
  description: string;
  colorScale: LegendColorStep[];
}

// 10. GeoJSON Properties for Leaflet Integration
export interface BlockRiskGeoProperties {
  blockId: string;
  blockName: string;
  headquarters: string;
  elevationMeters: number;
  totalAreaSqKm: number;
  agroEcologicalZone: string;
  
  // Dynamic Thematic Values
  onsetProbability: number;
  breakProbability: number;
  heavyRainProbability: number;
  rainfallAnomalyPercent: number;
  observedRainfallMm: number;
  normalRainfallMm: number;
  expectedRainfall7dMm: number;

  // Decision & Classification
  riskLevel: RiskLevel;
  primaryHazard: string;
  agriculturalAdvisory: string;
  sowingStatus: string;
  soilMoistureProfile: string;
  
  // Metadata
  panchayatsCount: number;
  telemetryStationCount: number;
  lastUpdated: string;
  modelVersion: string;
  isBoundaryPlaceholder: boolean;
}

export type KoraputGeoJson = FeatureCollection<Polygon | MultiPolygon, BlockRiskGeoProperties>;

// 11. Gram Panchayat Detail Record
export interface PanchayatInfo {
  id: string;
  name: string;
  blockId: string;
  blockName: string;
  coordinates: [number, number]; // [lat, lon]
  elevationMeters: number;
  vulnerabilityTag: string;
  soilType: string;
}

// 12. Leaflet Basemap Provider Type
export type BasemapType = 'positron' | 'satellite' | 'terrain' | 'osm';
