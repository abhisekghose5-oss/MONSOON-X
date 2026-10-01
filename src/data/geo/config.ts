/**
 * MONSOON-X - GEOGRAPHIC CONFIGURATION
 * SIH26086: Hyperlocal Monsoon Onset & Break Prediction System
 */

export const DEFAULT_LOCATION = 'KORAPUT';
export const DEFAULT_STATE = 'ODISHA';
export const DEFAULT_COUNTRY = 'INDIA';

export const GEO_CONFIG = {
  location: DEFAULT_LOCATION,
  state: DEFAULT_STATE,
  country: DEFAULT_COUNTRY,
  districtName: 'Koraput',
  districtCenter: [18.8135, 82.7123] as [number, number],
  defaultZoom: 9,
  boundingBox: [82.08, 18.23, 83.44, 19.34] as [number, number, number, number], // [minLon, minLat, maxLon, maxLat]
  blocksCount: 14,
  crs: 'EPSG:4326',
  files: {
    district: '/src/data/geo/koraput-district.geojson',
    blocks: '/src/data/geo/koraput-blocks.geojson',
    panchayats: '/src/data/geo/koraput-panchayats.geojson',
  },
} as const;
