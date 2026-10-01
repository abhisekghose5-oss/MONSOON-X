import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { DatabaseZap } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No Observational Records Ingested',
  description = 'No sensor telemetry or numerical prediction ensemble matches the current spatial and temporal filter parameters.',
  icon: Icon = DatabaseZap,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-md border border-dashed border-[#CBD5E1] bg-[#F5F7FA]/70 my-3',
        className
      )}
      {...props}
    >
      <div className="w-11 h-11 rounded-sm bg-white border border-[#CBD5E1] flex items-center justify-center text-[#4B5B6D] mb-3 shadow-xs">
        <Icon className="w-5 h-5 text-[#1479C9]" />
      </div>

      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
        {title}
      </h4>

      <p className="text-xs text-[#4B5B6D] max-w-md mt-1 mb-4 leading-relaxed">
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
}
