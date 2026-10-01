/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Mock Data Provider (Step 5 - Section 10)
 * 
 * Provides fallback mock data explicitly tagged with DEMO quality status.
 */

import type { DataProvider } from './DataProvider';
import type {
  DistrictFeatureCollection,
  BlockFeatureCollection,
  PanchayatFeatureCollection,
} from '../../types/geography';
import type {
  RainfallNormal,
  RainfallRecord,
  ClimateIndex,
  DataSource,
} from '../../types/dataArchitecture';

import { StaticDataProvider } from './StaticDataProvider';

export class MockDataProvider implements DataProvider {
  public readonly id = 'mock-provider';
  public readonly name = 'Simulation / Mock Data Provider';
  public readonly type = 'mock' as const;

  private staticProvider = new StaticDataProvider();

  async getDistrictGeoJson(): Promise<DistrictFeatureCollection | null> {
    return this.staticProvider.getDistrictGeoJson();
  }

  async getBlocksGeoJson(): Promise<BlockFeatureCollection | null> {
    return this.staticProvider.getBlocksGeoJson();
  }

  async getPanchayatsGeoJson(blockId?: string): Promise<PanchayatFeatureCollection | null> {
    return this.staticProvider.getPanchayatsGeoJson(blockId);
  }

  async getRainfallNormals(locationId?: string): Promise<RainfallNormal[]> {
    const list = await this.staticProvider.getRainfallNormals(locationId);
    return list.map((item) => ({
      ...item,
      source: `${item.source} (Simulated)`,
    }));
  }

  async getHistoricalRainfall(
    locationId?: string,
    startDate?: string,
    endDate?: string,
    granularity?: 'daily' | 'monthly' | 'seasonal'
  ): Promise<RainfallRecord[]> {
    const records = await this.staticProvider.getHistoricalRainfall(locationId, startDate, endDate, granularity);
    return records.map((r) => ({
      ...r,
      source: 'Mock Simulated Generator',
      observationType: 'derived',
    }));
  }

  async getClimateIndices(): Promise<ClimateIndex[]> {
    const list = await this.staticProvider.getClimateIndices();
    return list.map((item) => ({
      ...item,
      dataStatus: 'DEMO',
      source: `${item.source} (Demo Stream)`,
    }));
  }

  async getDataSources(): Promise<DataSource[]> {
    const sources = await this.staticProvider.getDataSources();
    return sources.map((s) => ({
      ...s,
      qualityStatus: 'DEMO',
    }));
  }
}
