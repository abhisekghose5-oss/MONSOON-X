import { useMemo } from 'react';
import { useGlobalFilters } from '../store/filterStore';
import { KORAPUT_BLOCKS } from '../data/koraputBlocks';
import type { KoraputBlockInfo, KoraputBlockId } from '../types/geo';

export function useBlockSelection() {
  const [filters, setFilters] = useGlobalFilters();

  const selectedBlock = useMemo<KoraputBlockInfo | null>(() => {
    if (filters.selectedBlockId === 'all') return null;
    return KORAPUT_BLOCKS.find((b) => b.id === filters.selectedBlockId) || null;
  }, [filters.selectedBlockId]);

  const selectBlock = (blockId: KoraputBlockId | 'all') => {
    setFilters({ selectedBlockId: blockId });
  };

  return {
    selectedBlockId: filters.selectedBlockId,
    selectedBlock,
    allBlocks: KORAPUT_BLOCKS,
    selectBlock,
    isDistrictWide: filters.selectedBlockId === 'all',
  };
}
