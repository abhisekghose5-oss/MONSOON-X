import type { HyperlocalForecastResponse, ForecastHorizon } from '../types/forecast';
import { forecastService } from '../services/forecastService';

/**
 * Forecast API Abstraction
 * Delegates to ForecastService with adapter-pattern support and mock fallback.
 */
export async function getForecast(
  locationId: string = 'all',
  horizon: ForecastHorizon | number = '14d'
): Promise<HyperlocalForecastResponse> {
  return forecastService.getForecast(locationId, horizon);
}

export const forecastApi = {
  getForecast,
};

export default forecastApi;
