import React, { useState } from 'react';
import { AlertOctagon, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  details?: string | Record<string, unknown>;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Telemetry Ingestion Error',
  message = 'Failed to retrieve or process downscaled meteorological data from the prediction node.',
  errorCode = 'ERR_STREAM_INTERRUPTED',
  details,
  onRetry,
  className,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={cn(
        'rounded-md border border-[#EEA9A7] border-l-4 border-l-[#C43D3D] bg-[#FCEDEC] p-5 text-[#16202A] shadow-gov-card',
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-sm bg-[#F7D6D5] border border-[#EEA9A7] text-[#C43D3D] shrink-0">
          <AlertOctagon className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#802626]">
              {title}
            </h4>
            {errorCode && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-sm bg-[#F7D6D5] border border-[#EEA9A7] text-[#802626] font-semibold">
                {errorCode}
              </span>
            )}
          </div>

          <p className="text-xs text-[#802626] leading-relaxed max-w-2xl">
            {message}
          </p>

          {details && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#802626] hover:text-[#381010] transition-colors"
              >
                <span>Diagnostics</span>
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showDetails && (
                <pre className="mt-2 p-2.5 rounded-sm bg-white border border-[#EEA9A7] text-[10px] font-mono text-[#4B5B6D] overflow-x-auto max-h-40">
                  {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
                </pre>
              )}
            </div>
          )}

          {onRetry && (
            <div className="pt-2.5">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-[#C43D3D] hover:bg-[#A33131] text-white shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
