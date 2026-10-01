import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { ClimateService } from '../services/climateService';

export function useClimateData() {
  const query = useQuery({
    queryKey: queryKeys.climate.teleconnections(),
    queryFn: () => ClimateService.getClimateSignals(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    climateData: query.data,
  };
}
