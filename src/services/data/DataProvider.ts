/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Data Provider Abstraction (Step 5 - Section 10)
 * 
 * Clean abstraction separating UI components from underlying datasets and APIs.
 * Architecture:
 * React Component → Service → DataProvider → Dataset / FastAPI
 */

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

export interface DataProvider {
  readonly id: string;
  readonly name: string;
  readonly type: 'static' | 'mock' | 'api';

  // Geographic boundary access
  getDistrictGeoJson(): Promise<DistrictFeatureCollection | null>;
  getBlocksGeoJson(): Promise<BlockFeatureCollection | null>;
  getPanchayatsGeoJson(blockId?: string): Promise<PanchayatFeatureCollection | null>;

  // Rainfall climatology & observations
  getRainfallNormals(locationId?: string): Promise<RainfallNormal[]>;
  getHistoricalRainfall(
    locationId?: string,
    startDate?: string,
    endDate?: string,
    granularity?: 'daily' | 'monthly' | 'seasonal'
  ): Promise<RainfallRecord[]>;

  // Planetary climate drivers
  getClimateIndices(): Promise<ClimateIndex[]>;

  // Data governance & provenance metadata
  getDataSources(): Promise<DataSource[]>;
}
