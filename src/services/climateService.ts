import type { IClimateAdapter } from '../api/adapters/types';
import type { ClimateSignalDashboardData } from '../types/climate';
import { realAdapters } from '../api/adapters/realAdapters';
import { mockAdapters } from '../api/adapters/mockAdapters';
import { ApiClientError } from '../api/client';

/**
 * Climate Signal Intelligence Data Service
 * Endpoint: GET /api/v1/climate
 * 
 * Implements IClimateAdapter with resilient FastAPI backend integration
 * and automatic fallback to calibrated teleconnection data.
 */
export class ClimateService implements IClimateAdapter {
  private realAdapter = realAdapters.climate;
  private mockAdapter = mockAdapters.climate;

  /**
   * Primary adapter method for GET /api/v1/climate
   */
  async getClimate(): Promise<ClimateSignalDashboardData> {
    const forceMock = import.meta.env.VITE_API_USE_MOCK === 'true';

    if (!forceMock) {
      try {
        const result = await this.realAdapter.getClimate();
        if (result && result.enso && result.iod && result.mjo) {
          return result;
        }
      } catch (err: unknown) {
        if (err instanceof ApiClientError) {
          console.warn(`[ClimateService] Backend returned ${err.statusCode} (${err.code}). Using mock fallback.`, err.message);
        } else {
          console.warn('[ClimateService] Backend unavailable. Using calibrated mock data.');
        }
      }
    }

    return this.mockAdapter.getClimate();
  }

  /**
   * Backward-compatible alias
   */
  async getClimateSignals(): Promise<ClimateSignalDashboardData> {
    return this.getClimate();
  }

  /**
   * Static accessors for backward compatibility
   */
  static async getClimate() {
    return defaultClimateService.getClimate();
  }
  static async getClimateSignals() {
    return defaultClimateService.getClimateSignals();
  }
}

const defaultClimateService = new ClimateService();

export const climateService = {
  getClimate: defaultClimateService.getClimate.bind(defaultClimateService),
  getClimateSignals: defaultClimateService.getClimateSignals.bind(defaultClimateService),
};

export default climateService;
