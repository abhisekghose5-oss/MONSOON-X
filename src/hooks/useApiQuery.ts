import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { isBrowserOffline } from '../api/client';

export type ApiQueryState = 'loading' | 'success' | 'error' | 'empty' | 'offline';

export type EnhancedQueryResult<TData, TError = Error> = UseQueryResult<TData, TError> & {
  isEmpty: boolean;
  isOffline: boolean;
  isFromCache: boolean;
  apiState: ApiQueryState;
};

/**
 * Checks if a dataset is considered empty
 */
function checkIfEmpty(data: unknown): boolean {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') {
    // Check if object has no own keys
    const keys = Object.keys(data as object);
    if (keys.length === 0) return true;
    
    // Check common list containers
    if ('timeline' in data && Array.isArray((data as { timeline: unknown[] }).timeline)) {
      return (data as { timeline: unknown[] }).timeline.length === 0;
    }
    if ('dailySeries' in data && Array.isArray((data as { dailySeries: unknown[] }).dailySeries)) {
      return (data as { dailySeries: unknown[] }).dailySeries.length === 0;
    }
    if ('sources' in data && Array.isArray((data as { sources: unknown[] }).sources)) {
      return (data as { sources: unknown[] }).sources.length === 0;
    }
  }
  return false;
}

/**
 * Enhanced TanStack Query wrapper implementing:
 * loading, success, error, empty, offline/cache states
 */
export function useApiQuery<TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError>
): EnhancedQueryResult<TData, TError> {
  const queryResult = useQuery<TData, TError>({
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection retention
    retry: (failureCount, _error) => {
      // Don't retry if offline
      if (isBrowserOffline()) return false;
      return failureCount < 2;
    },
    ...options,
  });

  const { data, isLoading, isError, isFetching, dataUpdatedAt } = queryResult;
  const isOffline = isBrowserOffline();
  const isEmpty = !isLoading && !isError && checkIfEmpty(data);
  const isFromCache = data !== undefined && !isFetching && dataUpdatedAt > 0;

  let apiState: ApiQueryState = 'loading';
  if (isLoading) {
    apiState = 'loading';
  } else if (isError) {
    apiState = isOffline ? 'offline' : 'error';
  } else if (isEmpty) {
    apiState = 'empty';
  } else {
    apiState = isOffline ? 'offline' : 'success';
  }

  return {
    ...queryResult,
    isEmpty,
    isOffline,
    isFromCache,
    apiState,
  };
}
