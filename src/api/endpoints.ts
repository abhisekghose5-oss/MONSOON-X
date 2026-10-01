/**
 * Central API Endpoint Registry
 * Maps to FastAPI v1 backend microservice routes
 * SIH26086 - MONSOON-X
 */
export const API_ENDPOINTS = {
  // 7 Core Required FastAPI v1 Routes
  FORECAST: (location: string) => `/api/v1/forecast/${encodeURIComponent(location)}`,
  RAINFALL: (location: string) => `/api/v1/rainfall/${encodeURIComponent(location)}`,
  CLIMATE: '/api/v1/climate',
  LOCATION: (location: string) => `/api/v1/location/${encodeURIComponent(location)}`,
  ADVISORY: (location: string) => `/api/v1/advisory/${encodeURIComponent(location)}`,
  MODEL_PERFORMANCE: '/api/v1/model/performance',
  DATA_STATUS: '/api/v1/data-status',

  // Monsoon prediction engine
  MONSOON_ONSET: '/api/v1/monsoon/onset',
  MONSOON_BREAK_ALERTS: '/api/v1/monsoon/break-alerts',
  MONSOON_TRACK: '/api/v1/monsoon/synoptic-track',
  
  // Downscaled weather & hydrology
  WEATHER_CURRENT: '/api/v1/weather/current',
  WEATHER_FORECAST: '/api/v1/weather/forecast',
  RAINFALL_ANOMALY: '/api/v1/weather/rainfall-anomaly',
  
  // Agro-meteorological decision support
  AGRI_ADVISORIES: '/api/v1/agriculture/advisories',
  AGRI_SOIL_MOISTURE: '/api/v1/agriculture/soil-moisture',
  AGRI_CROP_CALENDAR: '/api/v1/agriculture/crop-calendar',
  
  // Climate teleconnections & indexes
  CLIMATE_INDEXES: '/api/v1/climate/teleconnections',
  
  // Verification & Historical Data
  HISTORICAL_BASELINES: '/api/v1/historical/baselines',
  MODEL_METRICS: '/api/v1/models/validation-metrics',
  TELEMETRY_FEEDS: '/api/v1/telemetry/station-status',
} as const;
