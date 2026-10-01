import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  subtext?: string;
  status?: 'nominal' | 'alert' | 'favorable' | 'warning';
}

export function Metric({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendText,
  subtext,
  status = 'nominal',
  className,
  ...props
}: MetricProps) {
  const statusStyles = {
    nominal: 'border-[#E2E8F0] border-t-[#0B1F33]',
    alert: 'border-[#EEA9A7] border-t-[#C43D3D] bg-[#FCEDEC]/40',
    warning: 'border-[#F4D79C] border-t-[#D99000] bg-[#FDF7EB]/40',
    favorable: 'border-[#ABD7C0] border-t-[#247A4A] bg-[#EDF7F1]/40',
  };

  const trendColors = {
    up: 'text-[#1479C9]',
    down: 'text-[#C43D3D]',
    neutral: 'text-[#6E7F94]',
  };

  return (
    <div
      className={cn(
        'rounded-md border border-t-4 p-4 bg-white shadow-gov-card transition-all text-[#16202A]',
        statusStyles[status],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B5B6D]">
          {label}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-sm bg-[#F5F7FA] border border-[#E2E8F0] text-[#1479C9]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5 my-1">
        <div className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[#16202A]">
          {value}
        </div>
        {unit && (
          <span className="text-xs font-medium text-[#6E7F94] font-mono">
            {unit}
          </span>
        )}
      </div>

      {(trend || trendText || subtext) && (
        <div className="mt-2.5 flex items-center justify-between text-xs border-t border-[#F0F3F7] pt-2">
          {trendText && (
            <div className="flex items-center gap-1 font-mono text-[11px]">
              {trend === 'up' && <ArrowUpRight className={cn('w-3.5 h-3.5', trendColors.up)} />}
              {trend === 'down' && <ArrowDownRight className={cn('w-3.5 h-3.5', trendColors.down)} />}
              {trend === 'neutral' && <Minus className={cn('w-3.5 h-3.5', trendColors.neutral)} />}
              <span className={cn('font-semibold', trend ? trendColors[trend] : 'text-[#4B5B6D]')}>
                {trendText}
              </span>
            </div>
          )}
          {subtext && (
            <span className="text-[#6E7F94] text-[10px] font-mono truncate max-w-[180px]">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
