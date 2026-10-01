export type DataSourceCategory =
  | 'meteorological'
  | 'climate'
  | 'satellite'
  | 'reanalysis'
  | 'geospatial'
  | 'agricultural';

export type DataSourceStatus = 'LIVE' | 'UPDATED' | 'DELAYED' | 'CACHED' | 'DEMO';

export type EpistemicClassification =
  | 'observed'
  | 'official_forecast'
  | 'model_prediction'
  | 'simulation';

export interface DataSourceItem {
  id: string;
  name: string;
  source: string;
  agency: string;
  category: DataSourceCategory;
  variable: string;
  resolution: string;
  updateFrequency: string;
  historicalCoverage: string;
  status: DataSourceStatus;
  classification: EpistemicClassification;
  latency: string;
  protocol: string;
  citation: string;
  description: string;
  usageInPlatform: string;
}

export interface TelemetryHealthStats {
  totalFeeds: number;
  liveFeedsCount: number;
  updatedFeedsCount: number;
  delayedFeedsCount: number;
  cachedFeedsCount: number;
  demoFeedsCount: number;
  avgLatencyMinutes: number;
  lastHealthCheck: string;
  pipelineStatus: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
}

export interface DataStatusResponse {
  sources: DataSourceItem[];
  health: TelemetryHealthStats;
  totalAssimilated: number;
  lastUpdated: string;
}
