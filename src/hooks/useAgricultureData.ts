import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { AgricultureService } from '../services/agricultureService';
import { useBlockSelection } from './useBlockSelection';

export function useAgricultureData() {
  const { selectedBlockId } = useBlockSelection();

  const query = useQuery({
    queryKey: queryKeys.agriculture.dashboard(selectedBlockId),
    queryFn: () => AgricultureService.getDashboardData(selectedBlockId),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    agroData: query.data,
  };
}
