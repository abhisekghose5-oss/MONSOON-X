import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  unit?: string;
  baselineText?: string;
  delta?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    isFavorable?: boolean;
  };
  status?: 'normal' | 'monsoon' | 'agriculture' | 'warning' | 'risk';
  icon?: LucideIcon;
  caption?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  baselineText,
  delta,
  status = 'normal',
  icon: Icon,
  caption,
  className,
  ...props
}: MetricCardProps) {
  // Border and accent indicators based on operational domain
  const statusAccents = {
    normal: 'border-t-[#0B1F33] bg-white',
    monsoon: 'border-t-[#1479C9] bg-white',
    agriculture: 'border-t-[#247A4A] bg-white',
    warning: 'border-t-[#D99000] bg-white',
    risk: 'border-t-[#C43D3D] bg-white',
  };

  const statusIcons = {
    normal: 'text-[#0B1F33] bg-[#EAF0F6]',
    monsoon: 'text-[#1479C9] bg-[#EDF6FC]',
    agriculture: 'text-[#247A4A] bg-[#EDF7F1]',
    warning: 'text-[#D99000] bg-[#FDF7EB]',
    risk: 'text-[#C43D3D] bg-[#FCEDEC]',
  };

  return (
    <div
      className={cn(
        'rounded-md border border-[#E2E8F0] border-t-4 p-4 shadow-gov-card transition-all',
        statusAccents[status],
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#4B5B6D]">
          {title}
        </span>
        {Icon && (
          <div className={cn('p-1.5 rounded-sm shrink-0', statusIcons[status])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[#16202A]">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono font-medium text-[#6E7F94]">
            {unit}
          </span>
        )}
      </div>

      {delta && (
        <div className="flex items-center gap-1 text-xs font-mono mt-1.5">
          {delta.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-[#1479C9]" />}
          {delta.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-[#C43D3D]" />}
          {delta.trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-[#6E7F94]" />}
          <span
            className={cn(
              'font-medium',
              delta.isFavorable === true
                ? 'text-[#247A4A]'
                : delta.isFavorable === false
                ? 'text-[#C43D3D]'
                : 'text-[#4B5B6D]'
            )}
          >
            {delta.value}
          </span>
        </div>
      )}

      {(baselineText || caption) && (
        <div className="mt-3 pt-2.5 border-t border-[#F0F3F7] flex flex-col gap-0.5 text-[11px] text-[#6E7F94]">
          {baselineText && <span>{baselineText}</span>}
          {caption && <span className="font-mono text-[#4B5B6D]">{caption}</span>}
        </div>
      )}
    </div>
  );
}
