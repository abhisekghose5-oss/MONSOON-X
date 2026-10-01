import type { IForecastAdapter } from '../api/adapters/types';
import type { HyperlocalForecastResponse, ForecastHorizon } from '../types/forecast';
import { realAdapters } from '../api/adapters/realAdapters';
import { mockAdapters } from '../api/adapters/mockAdapters';
import { ApiClientError } from '../api/client';

/**
 * Hyperlocal Monsoon Forecast Service
 * Endpoint: GET /api/v1/forecast/{location}
 * 
 * Implements IForecastAdapter with automatic fallback to calibrated simulation
 * when the backend is offline or unreachable.
 */
export class ForecastService implements IForecastAdapter {
  private realAdapter = realAdapters.forecast;
  private mockAdapter = mockAdapters.forecast;

  async getForecast(
    location: string = 'all',
    horizon: ForecastHorizon | number = '14d'
  ): Promise<HyperlocalForecastResponse> {
    const forceMock = import.meta.env.VITE_API_USE_MOCK === 'true';

    if (!forceMock) {
      try {
        const result = await this.realAdapter.getForecast(location, horizon);
        if (result && result.timeline && result.timeline.length > 0) {
          return result;
        }
      } catch (err: unknown) {
        if (err instanceof ApiClientError) {
          console.warn(`[ForecastService] Backend returned ${err.statusCode} (${err.code}). Falling back to calibrated mock.`, err.message);
        } else {
          console.warn('[ForecastService] Backend connection failed. Falling back to calibrated mock.');
        }
      }
    }

    return this.mockAdapter.getForecast(location, horizon);
  }
}

export const forecastService = new ForecastService();
export default forecastService;
