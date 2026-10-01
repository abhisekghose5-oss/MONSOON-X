import { useState, useEffect } from 'react';
import type { KoraputBlockId } from '../types/geo';

export interface GlobalFilterState {
  selectedBlockId: KoraputBlockId | 'all';
  selectedHorizon: '3d' | '7d' | '14d' | 'season';
  seasonYear: number;
}

const defaultState: GlobalFilterState = {
  selectedBlockId: 'all',
  selectedHorizon: '7d',
  seasonYear: 2026,
};

// Global event-based subscriber pattern for zero-dependency shared state
const listeners = new Set<(state: GlobalFilterState) => void>();
let currentState: GlobalFilterState = { ...defaultState };

export function setGlobalFilter(updates: Partial<GlobalFilterState>) {
  currentState = { ...currentState, ...updates };
  listeners.forEach((listener) => listener(currentState));
}

export function useGlobalFilters(): [GlobalFilterState, typeof setGlobalFilter] {
  const [state, setState] = useState<GlobalFilterState>(currentState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return [state, setGlobalFilter];
}
