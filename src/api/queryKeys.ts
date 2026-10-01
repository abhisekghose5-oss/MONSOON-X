/**
 * TanStack React Query cache key factory
 * Ensures strict cache invalidation and query deduplication
 */
export const queryKeys = {
  overview: {
    all: ['overview'] as const,
    summary: (blockId?: string) => ['overview', 'summary', blockId ?? 'all'] as const,
  },
  riskMap: {
    all: ['riskMap'] as const,
    geoJson: () => ['riskMap', 'geoJson'] as const,
    blockDetail: (blockId: string) => ['riskMap', 'blockDetail', blockId] as const,
    panchayats: (blockId?: string) => ['riskMap', 'panchayats', blockId ?? 'all'] as const,
  },
  monsoon: {
    all: ['monsoon'] as const,
    onset: (blockId?: string) => ['monsoon', 'onset', blockId ?? 'all'] as const,
    breaks: (blockId?: string) => ['monsoon', 'breaks', blockId ?? 'all'] as const,
    synoptic: () => ['monsoon', 'synoptic'] as const,
  },
  weather: {
    all: ['weather'] as const,
    current: (blockId?: string) => ['weather', 'current', blockId ?? 'all'] as const,
    forecast: (blockId?: string, horizon?: string) => ['weather', 'forecast', blockId ?? 'all', horizon ?? '7d'] as const,
    rainfallAnomaly: (blockId?: string) => ['weather', 'rainfall-anomaly', blockId ?? 'all'] as const,
  },
  forecast: {
    all: ['forecast'] as const,
    byLocation: (locationId?: string, horizon?: string) =>
      ['forecast', locationId ?? 'all', horizon ?? '14d'] as const,
  },
  rainfall: {
    all: ['rainfall'] as const,
    dashboard: (blockId?: string) => ['rainfall', 'dashboard', blockId ?? 'all'] as const,
    metrics: (blockId?: string) => ['rainfall', 'metrics', blockId ?? 'all'] as const,
    daily: (blockId?: string, preset?: string) => ['rainfall', 'daily', blockId ?? 'all', preset ?? 'all'] as const,
    cumulative: (blockId?: string) => ['rainfall', 'cumulative', blockId ?? 'all'] as const,
    monthly: (blockId?: string) => ['rainfall', 'monthly', blockId ?? 'all'] as const,
    blocks: () => ['rainfall', 'blocks'] as const,
  },
  agriculture: {
    all: ['agriculture'] as const,
    dashboard: (blockId?: string) => ['agriculture', 'dashboard', blockId ?? 'all'] as const,
    advisories: (blockId?: string) => ['agriculture', 'advisories', blockId ?? 'all'] as const,
    soilMoisture: (blockId?: string) => ['agriculture', 'soil-moisture', blockId ?? 'all'] as const,
  },
  climate: {
    all: ['climate'] as const,
    teleconnections: () => ['climate', 'teleconnections'] as const,
  },
  models: {
    validation: () => ['models', 'validation'] as const,
  },
  telemetry: {
    stations: () => ['telemetry', 'stations'] as const,
  },
};
