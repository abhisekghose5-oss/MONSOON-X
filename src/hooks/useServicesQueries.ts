import { useApiQuery, type EnhancedQueryResult } from './useApiQuery';
import { forecastService } from '../services/forecastService';
import { rainfallService } from '../services/rainfallService';
import { climateService } from '../services/climateService';
import { locationService } from '../services/locationService';
import { advisoryService } from '../services/advisoryService';
import { modelService } from '../services/modelService';
import { dataStatusService } from '../services/dataStatusService';

import type { HyperlocalForecastResponse, ForecastHorizon } from '../types/forecast';
import type { RainfallDashboardData } from '../types/rainfall';
import type { ClimateSignalDashboardData } from '../types/climate';
import type { LocationData } from '../types/location';
import type { AgricultureDashboardData } from '../types/agriculture';
import type { ModelPerformanceDashboardData } from '../types/modelPerformance';
import type { DataStatusResponse } from '../types/dataSources';

/**
 * 1. TanStack Query Hook: Forecast Service
 * Target Endpoint: GET /api/v1/forecast/{location}
 */
export function useForecastQuery(
  location: string = 'all',
  horizon: ForecastHorizon | number = '14d'
): EnhancedQueryResult<HyperlocalForecastResponse> {
  const horizonKey = typeof horizon === 'number' ? `${horizon}d` : horizon;
  return useApiQuery<HyperlocalForecastResponse>({
    queryKey: ['forecast', location, horizonKey],
    queryFn: () => forecastService.getForecast(location, horizon),
  });
}

/**
 * 2. TanStack Query Hook: Rainfall Service
 * Target Endpoint: GET /api/v1/rainfall/{location}
 */
export function useRainfallQuery(
  location: string = 'all'
): EnhancedQueryResult<RainfallDashboardData> {
  return useApiQuery<RainfallDashboardData>({
    queryKey: ['rainfall', location],
    queryFn: () => rainfallService.getRainfall(location),
  });
}

/**
 * 3. TanStack Query Hook: Climate Service
 * Target Endpoint: GET /api/v1/climate
 */
export function useClimateQuery(): EnhancedQueryResult<ClimateSignalDashboardData> {
  return useApiQuery<ClimateSignalDashboardData>({
    queryKey: ['climate', 'intelligence'],
    queryFn: () => climateService.getClimate(),
  });
}

/**
 * 4. TanStack Query Hook: Location Service
 * Target Endpoint: GET /api/v1/location/{location}
 */
export function useLocationQuery(
  location: string = 'koraput'
): EnhancedQueryResult<LocationData> {
  return useApiQuery<LocationData>({
    queryKey: ['location', location],
    queryFn: () => locationService.getLocation(location),
  });
}

/**
 * 5. TanStack Query Hook: Advisory Service
 * Target Endpoint: GET /api/v1/advisory/{location}
 */
export function useAdvisoryQuery(
  location: string = 'all',
  cropId?: string
): EnhancedQueryResult<AgricultureDashboardData> {
  return useApiQuery<AgricultureDashboardData>({
    queryKey: ['advisory', location, cropId || 'all'],
    queryFn: () => advisoryService.getAdvisory(location, cropId),
  });
}

/**
 * 6. TanStack Query Hook: Model Performance Service
 * Target Endpoint: GET /api/v1/model/performance
 */
export function useModelPerformanceQuery(): EnhancedQueryResult<ModelPerformanceDashboardData> {
  return useApiQuery<ModelPerformanceDashboardData>({
    queryKey: ['model', 'performance'],
    queryFn: () => modelService.getModelPerformance(),
  });
}

/**
 * 7. TanStack Query Hook: Data Status Service
 * Target Endpoint: GET /api/v1/data-status
 */
export function useDataStatusQuery(): EnhancedQueryResult<DataStatusResponse> {
  return useApiQuery<DataStatusResponse>({
    queryKey: ['data-status', 'telemetry'],
    queryFn: () => dataStatusService.getDataStatus(),
  });
}
