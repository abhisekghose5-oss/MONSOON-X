import { useQuery } from '@tanstack/react-query';
import { rainfallService } from '../services/rainfallService';
import type { DateRangeFilterState, RainfallDashboardData } from '../types/rainfall';

export function useRainfallData(locationId: string = 'all', dateFilter?: DateRangeFilterState) {
  const query = useQuery<RainfallDashboardData>({
    queryKey: ['rainfall', 'dashboard', locationId, dateFilter?.preset, dateFilter?.startDate, dateFilter?.endDate],
    queryFn: () => rainfallService.getDashboardData(locationId, dateFilter),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    rainfallData: query.data,
  };
}
