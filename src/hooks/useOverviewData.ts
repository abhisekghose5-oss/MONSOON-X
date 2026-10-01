import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { overviewService } from '../services/overviewService';
import { useBlockSelection } from './useBlockSelection';

export function useOverviewData() {
  const { selectedBlockId } = useBlockSelection();

  return useQuery({
    queryKey: queryKeys.overview.summary(selectedBlockId),
    queryFn: () => overviewService.getOverviewData(selectedBlockId),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    refetchOnWindowFocus: false,
  });
}
