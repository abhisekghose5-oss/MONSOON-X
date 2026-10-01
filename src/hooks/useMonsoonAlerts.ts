import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { monsoonService } from '../services/monsoonService';
import type { KoraputBlockId } from '../types/geo';

export function useMonsoonAlerts(blockId?: KoraputBlockId) {
  return useQuery({
    queryKey: queryKeys.monsoon.breaks(blockId),
    queryFn: () => monsoonService.getBreakAlerts(blockId),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    enabled: false, // In architectural phase, manual or on-demand fetch until backend is live
  });
}
