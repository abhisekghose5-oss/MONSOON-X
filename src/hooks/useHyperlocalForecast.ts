import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { getForecast } from '../api/forecastApi';
import { useBlockSelection } from './useBlockSelection';
import type { ForecastHorizon } from '../types/forecast';

export function useHyperlocalForecast(horizon: ForecastHorizon = '14d') {
  const { selectedBlockId } = useBlockSelection();

  const query = useQuery({
    queryKey: queryKeys.forecast.byLocation(selectedBlockId, horizon),
    queryFn: () => getForecast(selectedBlockId, horizon),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    forecast: query.data,
  };
}
