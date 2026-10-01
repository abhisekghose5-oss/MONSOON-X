import { useQuery } from '@tanstack/react-query';
import { openMeteoService } from '../services/openMeteoService';
import { useBlockSelection } from './useBlockSelection';

export function useLiveWeather(overrideBlockId?: string) {
  const { selectedBlockId } = useBlockSelection();
  const effectiveBlockId = overrideBlockId || selectedBlockId || 'koraput';

  const query = useQuery({
    queryKey: ['live-weather', effectiveBlockId],
    queryFn: () => openMeteoService.getLiveWeather(effectiveBlockId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes auto-refresh
  });

  return {
    current: query.data?.current,
    daily: query.data?.daily ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
