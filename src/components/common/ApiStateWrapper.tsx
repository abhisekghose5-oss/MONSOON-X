import React from 'react';
import type { EnhancedQueryResult } from '../../hooks/useApiQuery';
import { Loader2, AlertCircle, WifiOff, Database, RefreshCw } from 'lucide-react';

interface ApiStateWrapperProps<TData> {
  query: EnhancedQueryResult<TData>;
  children: React.ReactNode | ((data: TData) => React.ReactNode);
  loadingText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function ApiStateWrapper<TData>({
  query,
  children,
  loadingText = 'Assimilating telemetry from atmospheric observation network...',
  emptyTitle = 'No Telemetry Records Available',
  emptyDescription = 'The requested endpoint returned an empty dataset for this administrative spatial parameter.',
  className = '',
}: ApiStateWrapperProps<TData>) {
  const { isLoading, isError, error, isEmpty, isOffline, isFromCache, data, refetch } = query;

  // 1. Loading State
  if (isLoading) {
    return (
      <div className={`p-8 rounded-md border border-[#E2E8F0] bg-white text-center space-y-3 shadow-gov-card ${className}`}>
        <div className="inline-flex p-3 rounded-full bg-[#EDF6FC] text-[#1479C9] animate-spin">
          <Loader2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F33]">
            INGESTING HYDRO-METEOROLOGICAL DATA
          </h4>
          <p className="text-xs text-[#4B5B6D] font-mono max-w-md mx-auto">
            {loadingText}
          </p>
        </div>
      </div>
    );
  }

  // 2. Fatal Error State (when no data and not offline)
  if (isError && !data) {
    return (
      <div className={`p-6 rounded-md border border-[#EEA9A7] bg-[#FCEDEC] text-left space-y-3 ${className}`}>
        <div className="flex items-center gap-2 text-[#802626]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
            BACKEND TELEMETRY INGESTION ERROR
          </h4>
        </div>
        <p className="text-xs font-mono text-[#802626]">
          {error instanceof Error ? error.message : 'Failed to retrieve observational dataset from API.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-3 py-1 rounded-xs bg-[#C43D3D] text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-[#A82B2B] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> RETRY CONNECTION
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (isEmpty && !isError) {
    return (
      <div className={`p-8 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-center space-y-2 font-mono ${className}`}>
        <div className="inline-flex p-3 rounded-full bg-[#F1F5F9] text-[#6E7F94]">
          <Database className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-bold text-[#0B1F33] uppercase">
          {emptyTitle}
        </h4>
        <p className="text-xs text-[#6E7F94] max-w-md mx-auto font-sans">
          {emptyDescription}
        </p>
      </div>
    );
  }

  // 4. Offline or From-Cache Banner (renders above children)
  return (
    <div className={`space-y-3 ${className}`}>
      {isOffline && (
        <div className="p-2.5 rounded-sm border border-[#F4D79C] bg-[#FDF7EB] text-[#8C5D00] text-xs font-mono flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-[#D99000] shrink-0" />
            <span>
              <strong>OFFLINE MODE:</strong> Network disconnected. Serving locally cached data and contingency simulation.
            </span>
          </div>
          {isFromCache && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-white border border-[#F4D79C] font-bold">
              CACHED TELEMETRY
            </span>
          )}
        </div>
      )}

      {/* 5. Success Content */}
      {typeof children === 'function' ? (data ? children(data) : null) : children}
    </div>
  );
}

export default ApiStateWrapper;
