import type { HyperlocalForecastResponse, ForecastHorizon } from '../../types/forecast';
import type { RainfallDashboardData } from '../../types/rainfall';
import type { ClimateSignalDashboardData } from '../../types/climate';
import type { LocationData } from '../../types/location';
import type { AgricultureDashboardData } from '../../types/agriculture';
import type { ModelPerformanceDashboardData } from '../../types/modelPerformance';
import type { DataStatusResponse } from '../../types/dataSources';

/**
 * Common provenance wrapper for Service responses
 */
export interface ServiceResult<T> {
  data: T;
  isFallbackMock: boolean;
  isFromCache: boolean;
  source: 'api' | 'mock-fallback' | 'offline-cache';
  timestamp: string;
}

/**
 * 1. Forecast Adapter Interface
 * Endpoint: GET /api/v1/forecast/{location}
 */
export interface IForecastAdapter {
  getForecast(location: string, horizon?: ForecastHorizon | number): Promise<HyperlocalForecastResponse>;
}

/**
 * 2. Rainfall Adapter Interface
 * Endpoint: GET /api/v1/rainfall/{location}
 */
export interface IRainfallAdapter {
  getRainfall(location: string): Promise<RainfallDashboardData>;
}

/**
 * 3. Climate Adapter Interface
 * Endpoint: GET /api/v1/climate
 */
export interface IClimateAdapter {
  getClimate(): Promise<ClimateSignalDashboardData>;
}

/**
 * 4. Location Adapter Interface
 * Endpoint: GET /api/v1/location/{location}
 */
export interface ILocationAdapter {
  getLocation(location: string): Promise<LocationData>;
}

/**
 * 5. Advisory Adapter Interface
 * Endpoint: GET /api/v1/advisory/{location}
 */
export interface IAdvisoryAdapter {
  getAdvisory(location: string, cropId?: string): Promise<AgricultureDashboardData>;
}

/**
 * 6. Model Performance Adapter Interface
 * Endpoint: GET /api/v1/model/performance
 */
export interface IModelAdapter {
  getModelPerformance(): Promise<ModelPerformanceDashboardData>;
}

/**
 * 7. Data Status Adapter Interface
 * Endpoint: GET /api/v1/data-status
 */
export interface IDataStatusAdapter {
  getDataStatus(): Promise<DataStatusResponse>;
}
