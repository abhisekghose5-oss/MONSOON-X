import React from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  accentColor?: 'navy' | 'monsoon' | 'agri' | 'warning' | 'risk';
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  accentColor = 'navy',
  className,
  ...props
}: SectionHeaderProps) {
  const accentBorders = {
    navy: 'border-l-[#38BDF8]',
    monsoon: 'border-l-[#0284C7]',
    agri: 'border-l-[#10B981]',
    warning: 'border-l-[#F59E0B]',
    risk: 'border-l-[#EF4444]',
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 pl-3.5 py-1',
        accentBorders[accentColor],
        className
      )}
      {...props}
    >
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-sans">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 self-start sm:self-center">{action}</div>}
    </div>
  );
}
