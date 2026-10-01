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

import { generateMockForecast } from '../../data/mock/forecastMockData';
import { getMockRainfallData } from '../../data/mock/rainfallMockData';
import { mockClimateDashboardData } from '../../data/mock/climateMockData';
import { generateMockAgricultureData } from '../../data/mock/agricultureMockData';
import { KORAPUT_BLOCKS } from '../../data/koraputBlocks';
import { ModelPerformanceService } from '../../services/modelPerformanceService';
import { DataSourcesService } from '../../services/dataSourcesService';
import type { KoraputBlockId } from '../../types/geo';

/**
 * Mock API Adapter: Forecast Service
 */
export class MockForecastAdapter implements IForecastAdapter {
  async getForecast(location: string, horizon: ForecastHorizon | number = '14d'): Promise<HyperlocalForecastResponse> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return generateMockForecast(location, horizon);
  }
}

/**
 * Mock API Adapter: Rainfall Service
 */
export class MockRainfallAdapter implements IRainfallAdapter {
  async getRainfall(location: string): Promise<RainfallDashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return getMockRainfallData(location as KoraputBlockId | 'all');
  }
}

/**
 * Mock API Adapter: Climate Service
 */
export class MockClimateAdapter implements IClimateAdapter {
  async getClimate(): Promise<ClimateSignalDashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return mockClimateDashboardData;
  }
}

/**
 * Mock API Adapter: Location Service
 */
export class MockLocationAdapter implements ILocationAdapter {
  async getLocation(location: string): Promise<LocationData> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const locId = location.toLowerCase();

    if (locId === 'all' || locId === 'koraput' || locId === 'district') {
      return {
        id: 'koraput',
        name: 'Koraput District',
        type: 'district',
        headquarters: 'Koraput Town',
        state: 'Odisha',
        country: 'India',
        coordinates: { latitude: 18.8135, longitude: 82.7123 },
        elevationMeters: 870,
        agroEcologicalZone: 'Eastern Ghat High Altitude Zone (Zone VII)',
        totalAreaSqKm: 8807,
        panchayatCount: 240,
        availableBlocks: KORAPUT_BLOCKS,
        metadata: {
          sourceAgency: 'Survey of India / Odisha Spatial Data Infrastructure (OSDI)',
          isRealSurveyBoundary: true,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    const block = KORAPUT_BLOCKS.find((b) => b.id.toLowerCase() === locId);
    if (block) {
      return {
        id: block.id,
        name: `${block.name} Block`,
        type: 'block',
        headquarters: block.headquarters,
        state: 'Odisha',
        country: 'India',
        coordinates: block.coordinates,
        elevationMeters: block.elevationMeters,
        agroEcologicalZone: block.agroEcologicalZone,
        totalAreaSqKm: block.totalAreaSqKm,
        panchayatCount: 16,
        metadata: {
          sourceAgency: 'Survey of India (Real Administrative Boundaries)',
          isRealSurveyBoundary: true,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    // Default fallback to Koraput District
    return {
      id: 'koraput',
      name: 'Koraput District',
      type: 'district',
      headquarters: 'Koraput Town',
      state: 'Odisha',
      country: 'India',
      coordinates: { latitude: 18.8135, longitude: 82.7123 },
      elevationMeters: 870,
      agroEcologicalZone: 'Eastern Ghat High Altitude Zone',
      totalAreaSqKm: 8807,
      panchayatCount: 240,
      availableBlocks: KORAPUT_BLOCKS,
      metadata: {
        sourceAgency: 'Survey of India',
        isRealSurveyBoundary: true,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}

/**
 * Mock API Adapter: Advisory Service
 */
export class MockAdvisoryAdapter implements IAdvisoryAdapter {
  async getAdvisory(location: string, _cropId?: string): Promise<AgricultureDashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return generateMockAgricultureData(location);
  }
}

/**
 * Mock API Adapter: Model Performance Service
 */
export class MockModelAdapter implements IModelAdapter {
  async getModelPerformance(): Promise<ModelPerformanceDashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return {
      inputVariables: ModelPerformanceService.getInputVariables(),
      taskMetrics: {
        onset: ModelPerformanceService.getTaskMetrics('onset'),
        break: ModelPerformanceService.getTaskMetrics('break'),
        heavyRain: ModelPerformanceService.getTaskMetrics('heavyRain'),
      },
      calibrationPoints: {
        onset: ModelPerformanceService.getReliabilityData('onset'),
        break: ModelPerformanceService.getReliabilityData('break'),
        heavyRain: ModelPerformanceService.getReliabilityData('heavyRain'),
      },
      backtestResults: ModelPerformanceService.getHistoricalBacktest(),
      actualVsPredicted: ModelPerformanceService.getActualVsPredicted(),
      leadTimeDecay: ModelPerformanceService.getLeadTimeDecay(),
      evaluationStatus: 'evaluated',
      lastEvaluated: new Date().toISOString(),
    };
  }
}

/**
 * Mock API Adapter: Data Status Service
 */
export class MockDataStatusAdapter implements IDataStatusAdapter {
  async getDataStatus(): Promise<DataStatusResponse> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const sources = DataSourcesService.getAllDataSources();
    const health = DataSourcesService.getTelemetryHealth();
    return {
      sources,
      health,
      totalAssimilated: sources.length,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const mockAdapters = {
  forecast: new MockForecastAdapter(),
  rainfall: new MockRainfallAdapter(),
  climate: new MockClimateAdapter(),
  location: new MockLocationAdapter(),
  advisory: new MockAdvisoryAdapter(),
  model: new MockModelAdapter(),
  dataStatus: new MockDataStatusAdapter(),
};
