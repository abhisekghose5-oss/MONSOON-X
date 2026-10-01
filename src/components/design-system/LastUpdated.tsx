import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LastUpdatedProps extends React.HTMLAttributes<HTMLDivElement> {
  timestamp?: string | Date;
  cycle?: string;
  isLive?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function LastUpdated({
  timestamp,
  cycle = 'Synoptic Cycle',
  isLive = true,
  onRefresh,
  isRefreshing = false,
  className,
  ...props
}: LastUpdatedProps) {
  const formattedTime = React.useMemo(() => {
    if (!timestamp) return 'Synced';
    try {
      const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' IST';
    } catch {
      return String(timestamp);
    }
  }, [timestamp]);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 text-xs font-mono text-[#6E7F94]',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-[#1479C9]" />
        <span>{cycle}:</span>
        <span className="text-[#16202A] font-medium">{formattedTime}</span>
      </div>

      {isLive && (
        <span className="flex items-center gap-1 pl-1.5 border-l border-[#E2E8F0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#247A4A] animate-pulse" />
          <span className="text-[10px] text-[#247A4A] font-semibold uppercase">LIVE</span>
        </span>
      )}

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1 rounded hover:bg-[#EAF0F6] text-[#4B5B6D] hover:text-[#0B1F33] transition-colors disabled:opacity-50"
          title="Refresh Data Feed"
        >
          <RefreshCw className={cn('w-3 h-3', isRefreshing && 'animate-spin')} />
        </button>
      )}
    </div>
  );
}
