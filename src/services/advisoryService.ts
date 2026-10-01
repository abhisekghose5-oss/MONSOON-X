import type { IAdvisoryAdapter } from '../api/adapters/types';
import type {
  AgricultureDashboardData,
  CropDefinition,
  CropRiskDetail,
  StructuredAdvisory,
} from '../types/agriculture';
import { realAdapters } from '../api/adapters/realAdapters';
import { mockAdapters } from '../api/adapters/mockAdapters';
import { ApiClientError } from '../api/client';

/**
 * Agro-Meteorological Advisory Service
 * Endpoint: GET /api/v1/advisory/{location}
 * 
 * Implements IAdvisoryAdapter with OUAT/GKMS standardized agronomic directives
 * and resilient FastAPI backend fallback.
 */
export class AdvisoryService implements IAdvisoryAdapter {
  private realAdapter = realAdapters.advisory;
  private mockAdapter = mockAdapters.advisory;

  /**
   * Primary adapter method for GET /api/v1/advisory/{location}
   */
  async getAdvisory(location: string = 'all', cropId?: string): Promise<AgricultureDashboardData> {
    const forceMock = import.meta.env.VITE_API_USE_MOCK === 'true';

    if (!forceMock) {
      try {
        const result = await this.realAdapter.getAdvisory(location, cropId);
        if (result && result.availableCrops && result.availableCrops.length > 0) {
          return result;
        }
      } catch (err: unknown) {
        if (err instanceof ApiClientError) {
          console.warn(`[AdvisoryService] Backend returned ${err.statusCode} (${err.code}). Using mock fallback.`, err.message);
        } else {
          console.warn('[AdvisoryService] Backend unavailable. Using calibrated agronomic rules.');
        }
      }
    }

    return this.mockAdapter.getAdvisory(location, cropId);
  }

  /**
   * Helper to retrieve crop definitions
   */
  async getCropList(location: string = 'all'): Promise<CropDefinition[]> {
    const data = await this.getAdvisory(location);
    return data.availableCrops;
  }

  /**
   * Helper to retrieve single crop risk detail
   */
  async getCropRiskDetail(location: string, cropId: string): Promise<CropRiskDetail | null> {
    const data = await this.getAdvisory(location, cropId);
    return data.cropDetails[cropId] || null;
  }

  /**
   * Helper to retrieve 5-part structured advisory
   */
  async getStructuredAdvisory(location: string, cropId: string): Promise<StructuredAdvisory | null> {
    const data = await this.getAdvisory(location, cropId);
    return data.advisories[cropId] || null;
  }
}

const defaultAdvisoryService = new AdvisoryService();

export const advisoryService = {
  getAdvisory: defaultAdvisoryService.getAdvisory.bind(defaultAdvisoryService),
  getCropList: defaultAdvisoryService.getCropList.bind(defaultAdvisoryService),
  getCropRiskDetail: defaultAdvisoryService.getCropRiskDetail.bind(defaultAdvisoryService),
  getStructuredAdvisory: defaultAdvisoryService.getStructuredAdvisory.bind(defaultAdvisoryService),
};

export default advisoryService;
