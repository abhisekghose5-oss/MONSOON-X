import { client } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  IForecastAdapter,
  IRainfallAdapter,
  IClimateAdapter,
  ILocationAdapter,
  IAdvisoryAdapter,
  IModelAdapter,
  IDataStatusAdapter,
} from './types';
import type { HyperlocalForecastResponse, ForecastHorizon } from '../../types/forecast';
import type { RainfallDashboardData } from '../../types/rainfall';
import type { ClimateSignalDashboardData } from '../../types/climate';
import type { LocationData } from '../../types/location';
import type { AgricultureDashboardData } from '../../types/agriculture';
import type { ModelPerformanceDashboardData } from '../../types/modelPerformance';
import type { DataStatusResponse } from '../../types/dataSources';

/**
 * Real API Adapter: Forecast Service
 * Target Endpoint: GET /api/v1/forecast/{location}
 */
export class RealForecastAdapter implements IForecastAdapter {
  async getForecast(location: string, horizon: ForecastHorizon | number = '14d'): Promise<HyperlocalForecastResponse> {
    const horizonParam = typeof horizon === 'number' ? `${horizon}d` : horizon;
    return client.get<HyperlocalForecastResponse>(
      API_ENDPOINTS.FORECAST(location),
      { horizon: horizonParam }
    );
  }
}

/**
 * Real API Adapter: Rainfall Service
 * Target Endpoint: GET /api/v1/rainfall/{location}
 */
export class RealRainfallAdapter implements IRainfallAdapter {
  async getRainfall(location: string): Promise<RainfallDashboardData> {
    return client.get<RainfallDashboardData>(API_ENDPOINTS.RAINFALL(location));
  }
}

/**
 * Real API Adapter: Climate Service
 * Target Endpoint: GET /api/v1/climate
 */
export class RealClimateAdapter implements IClimateAdapter {
  async getClimate(): Promise<ClimateSignalDashboardData> {
    return client.get<ClimateSignalDashboardData>(API_ENDPOINTS.CLIMATE);
  }
}

/**
 * Real API Adapter: Location Service
 * Target Endpoint: GET /api/v1/location/{location}
 */
export class RealLocationAdapter implements ILocationAdapter {
  async getLocation(location: string): Promise<LocationData> {
    return client.get<LocationData>(API_ENDPOINTS.LOCATION(location));
  }
}

/**
 * Real API Adapter: Advisory Service
 * Target Endpoint: GET /api/v1/advisory/{location}
 */
export class RealAdvisoryAdapter implements IAdvisoryAdapter {
  async getAdvisory(location: string, cropId?: string): Promise<AgricultureDashboardData> {
    return client.get<AgricultureDashboardData>(
      API_ENDPOINTS.ADVISORY(location),
      cropId ? { crop: cropId } : undefined
    );
  }
}

/**
 * Real API Adapter: Model Performance Service
 * Target Endpoint: GET /api/v1/model/performance
 */
export class RealModelAdapter implements IModelAdapter {
  async getModelPerformance(): Promise<ModelPerformanceDashboardData> {
    return client.get<ModelPerformanceDashboardData>(API_ENDPOINTS.MODEL_PERFORMANCE);
  }
}

/**
 * Real API Adapter: Data Status Service
 * Target Endpoint: GET /api/v1/data-status
 */
export class RealDataStatusAdapter implements IDataStatusAdapter {
  async getDataStatus(): Promise<DataStatusResponse> {
    return client.get<DataStatusResponse>(API_ENDPOINTS.DATA_STATUS);
  }
}

export const realAdapters = {
  forecast: new RealForecastAdapter(),
  rainfall: new RealRainfallAdapter(),
  climate: new RealClimateAdapter(),
  location: new RealLocationAdapter(),
  advisory: new RealAdvisoryAdapter(),
  model: new RealModelAdapter(),
  dataStatus: new RealDataStatusAdapter(),
};
