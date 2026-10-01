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
    navy: 'border-l-[#0B1F33]',
    monsoon: 'border-l-[#1479C9]',
    agri: 'border-l-[#247A4A]',
    warning: 'border-l-[#D99000]',
    risk: 'border-l-[#C43D3D]',
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 pl-3.5 py-0.5',
        accentBorders[accentColor],
        className
      )}
      {...props}
    >
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#16202A] uppercase">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-[#4B5B6D] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 self-start sm:self-center">{action}</div>}
    </div>
  );
}
