import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { GeoDataService } from '../services/GeoDataService';
import { riskMapService } from '../services/riskMapService';
import type { KoraputGeoJson, ForecastHorizon, RiskLayer, RiskMapResponse } from '../types/riskMap';

export function useRiskMapGeoJson(horizon: ForecastHorizon = '14D') {
  return useQuery({
    queryKey: ['riskMap', 'geoJson', horizon],
    queryFn: async (): Promise<KoraputGeoJson | null> => {
      return riskMapService.getKoraputGeoJson(horizon);
    },
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}

export function useRiskMapDataQuery(params: {
  location?: string;
  horizon?: ForecastHorizon;
  layer?: RiskLayer;
}) {
  const horizon = params.horizon || '14D';
  const layer = params.layer || 'onset';
  const location = params.location || 'all';

  return useQuery<RiskMapResponse>({
    queryKey: ['riskMap', 'data', location, horizon, layer],
    queryFn: () => riskMapService.getRiskMapData({ location, horizon, layer }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function usePanchayatGeoData() {
  return useQuery({
    queryKey: ['geoData', 'panchayats'],
    queryFn: () => GeoDataService.loadPanchayats(),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

export function usePanchayats(blockId?: string) {
  return useQuery({
    queryKey: queryKeys.riskMap.panchayats(blockId),
    queryFn: () => riskMapService.getPanchayats(blockId),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
