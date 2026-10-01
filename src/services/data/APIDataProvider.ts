/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * API Data Provider (Step 5 - Section 10 & 16)
 * 
 * Future FastAPI backend connection bridge.
 * Transparently falls back to StaticDataProvider if backend is unreachable,
 * ensuring zero disruption to UI components.
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

export class APIDataProvider implements DataProvider {
  public readonly id = 'api-provider';
  public readonly name = 'FastAPI Microservice Provider';
  public readonly type = 'api' as const;

  private fallbackProvider = new StaticDataProvider();
  private baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

  async getDistrictGeoJson(): Promise<DistrictFeatureCollection | null> {
    try {
      const res = await fetch(`${this.baseUrl}/geo/district`);
      if (res.ok) return await res.json();
    } catch {
      // Backend not yet deployed; use local verified dataset
    }
    return this.fallbackProvider.getDistrictGeoJson();
  }

  async getBlocksGeoJson(): Promise<BlockFeatureCollection | null> {
    try {
      const res = await fetch(`${this.baseUrl}/geo/blocks`);
      if (res.ok) return await res.json();
    } catch {
      // Backend not yet deployed
    }
    return this.fallbackProvider.getBlocksGeoJson();
  }

  async getPanchayatsGeoJson(blockId?: string): Promise<PanchayatFeatureCollection | null> {
    try {
      const query = blockId ? `?blockId=${blockId}` : '';
      const res = await fetch(`${this.baseUrl}/geo/panchayats${query}`);
      if (res.ok) return await res.json();
    } catch {
      // Backend not yet deployed
    }
    return this.fallbackProvider.getPanchayatsGeoJson(blockId);
  }

  async getRainfallNormals(locationId?: string): Promise<RainfallNormal[]> {
    try {
      const query = locationId ? `?locationId=${locationId}` : '';
      const res = await fetch(`${this.baseUrl}/rainfall/normals${query}`);
      if (res.ok) return await res.json();
    } catch {
      // Backend fallback
    }
    return this.fallbackProvider.getRainfallNormals(locationId);
  }

  async getHistoricalRainfall(
    locationId?: string,
    startDate?: string,
    endDate?: string,
    granularity?: 'daily' | 'monthly' | 'seasonal'
  ): Promise<RainfallRecord[]> {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (granularity) params.append('granularity', granularity);

      const res = await fetch(`${this.baseUrl}/rainfall/historical?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Backend fallback
    }
    return this.fallbackProvider.getHistoricalRainfall(locationId, startDate, endDate, granularity);
  }

  async getClimateIndices(): Promise<ClimateIndex[]> {
    try {
      const res = await fetch(`${this.baseUrl}/climate/indices`);
      if (res.ok) return await res.json();
    } catch {
      // Backend fallback
    }
    return this.fallbackProvider.getClimateIndices();
  }

  async getDataSources(): Promise<DataSource[]> {
    try {
      const res = await fetch(`${this.baseUrl}/data-sources`);
      if (res.ok) return await res.json();
    } catch {
      // Backend fallback
    }
    return this.fallbackProvider.getDataSources();
  }
}
