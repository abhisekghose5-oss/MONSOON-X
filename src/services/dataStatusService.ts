import type { IDataStatusAdapter } from '../api/adapters/types';
import type {
  DataStatusResponse,
  DataSourceItem,
  TelemetryHealthStats,
} from '../types/dataSources';
import { realAdapters } from '../api/adapters/realAdapters';
import { mockAdapters } from '../api/adapters/mockAdapters';
import { ApiClientError } from '../api/client';

/**
 * Data Telemetry & Ingestion Status Service
 * Endpoint: GET /api/v1/data-status
 * 
 * Implements IDataStatusAdapter with real-time station health monitoring,
 * epistemic classification, and resilient FastAPI backend fallback.
 */
export class DataStatusService implements IDataStatusAdapter {
  private realAdapter = realAdapters.dataStatus;
  private mockAdapter = mockAdapters.dataStatus;

  /**
   * Primary adapter method for GET /api/v1/data-status
   */
  async getDataStatus(): Promise<DataStatusResponse> {
    const forceMock = import.meta.env.VITE_API_USE_MOCK === 'true';

    if (!forceMock) {
      try {
        const result = await this.realAdapter.getDataStatus();
        if (result && result.sources && result.health) {
          return result;
        }
      } catch (err: unknown) {
        if (err instanceof ApiClientError) {
          console.warn(`[DataStatusService] Backend returned ${err.statusCode} (${err.code}). Using mock fallback.`, err.message);
        } else {
          console.warn('[DataStatusService] Backend unavailable. Using cataloged telemetry register.');
        }
      }
    }

    return this.mockAdapter.getDataStatus();
  }

  /**
   * Helper to retrieve all cataloged data sources
   */
  async getAllSources(): Promise<DataSourceItem[]> {
    const data = await this.getDataStatus();
    return data.sources;
  }

  /**
   * Helper to retrieve telemetry health overview
   */
  async getTelemetryHealth(): Promise<TelemetryHealthStats> {
    const data = await this.getDataStatus();
    return data.health;
  }
}

const defaultDataStatusService = new DataStatusService();

export const dataStatusService = {
  getDataStatus: defaultDataStatusService.getDataStatus.bind(defaultDataStatusService),
  getAllSources: defaultDataStatusService.getAllSources.bind(defaultDataStatusService),
  getTelemetryHealth: defaultDataStatusService.getTelemetryHealth.bind(defaultDataStatusService),
};

export default dataStatusService;
