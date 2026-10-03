import React from 'react';
import { cn } from '../../utils/cn';
import { LoadingSkeleton } from './LoadingSkeleton';

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  unit?: string;
  legend?: React.ReactNode;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  height?: number | string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children?: React.ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  unit,
  legend,
  toolbar,
  footer,
  height = 320,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No chart telemetry available for current selection',
  children,
  className,
  ...props
}: ChartContainerProps) {
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'rounded-lg border border-[#1E354D] bg-[#0A192F]/90 shadow-command-panel overflow-hidden flex flex-col text-slate-100 backdrop-blur-md',
        className
      )}
      {...props}
    >
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              {title}
            </h3>
            {unit && (
              <span className="font-mono text-[10px] text-[#38BDF8] font-medium bg-[#0284C7]/15 px-1.5 py-0.2 rounded border border-[#0284C7]/30">
                {unit}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-300 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {toolbar && <div className="shrink-0">{toolbar}</div>}
      </div>

      {/* Legend Sub-bar if present */}
      {legend && (
        <div className="px-4 py-2 border-b border-[#1E354D] bg-[#071324]/60 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
          {legend}
        </div>
      )}

      {/* Chart Canvas Area */}
      <div
        className="p-4 relative flex-1 flex flex-col items-center justify-center bg-transparent"
        style={{ minHeight: heightStyle }}
      >
        {isLoading ? (
          <div className="w-full h-full p-4 space-y-3">
            <LoadingSkeleton variant="text" lines={1} className="w-1/3" />
            <LoadingSkeleton variant="chart" className="w-full h-48" />
          </div>
        ) : isEmpty ? (
          <div className="text-center p-6 text-[#6E7F94] space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider">{emptyMessage}</p>
          </div>
        ) : (
          <div className="w-full h-full">{children}</div>
        )}
      </div>

      {/* Footnote / Provenance Bar */}
      {footer && (
        <div className="px-4 py-2 border-t border-[#F0F3F7] bg-[#F5F7FA]/40 text-[11px] text-[#6E7F94] flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
