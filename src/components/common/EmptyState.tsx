import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { DatabaseZap } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No Observational Records Found',
  description = 'No sensor telemetry or forecast ensemble passes matched the current spatial filter.',
  icon: Icon = DatabaseZap,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-sm border border-dashed border-[#CBD5E1] bg-[#F5F7FA]/70 my-3',
        className
      )}
    >
      <div className="w-11 h-11 rounded-sm bg-white border border-[#CBD5E1] flex items-center justify-center text-[#1479C9] mb-3 shadow-xs">
        <Icon className="w-5 h-5" />
      </div>

      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
        {title}
      </h4>

      <p className="text-xs text-[#4B5B6D] max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider bg-[#0B1F33] hover:bg-[#1479C9] text-white transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
