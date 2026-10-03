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
    nominal: 'border-[#1E354D] border-t-cyan-500 bg-[#0A192F]/85',
    alert: 'border-rose-500/30 border-t-rose-500 bg-rose-950/20',
    warning: 'border-amber-500/30 border-t-amber-500 bg-amber-950/20',
    favorable: 'border-emerald-500/30 border-t-emerald-500 bg-emerald-950/20',
  };

  const trendColors = {
    up: 'text-cyan-400',
    down: 'text-rose-400',
    neutral: 'text-slate-400',
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-t-4 p-4.5 shadow-2xl backdrop-blur-md transition-all text-slate-200',
        statusStyles[status],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          {label}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-[#071324] border border-[#1E354D] text-cyan-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5 my-1">
        <div className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-white">
          {value}
        </div>
        {unit && (
          <span className="text-xs font-semibold text-slate-400 font-mono">
            {unit}
          </span>
        )}
      </div>

      {(trend || trendText || subtext) && (
        <div className="mt-2.5 flex items-center justify-between text-xs border-t border-[#1E354D] pt-2">
          {trendText && (
            <div className="flex items-center gap-1 font-mono text-[11px]">
              {trend === 'up' && <ArrowUpRight className={cn('w-3.5 h-3.5', trendColors.up)} />}
              {trend === 'down' && <ArrowDownRight className={cn('w-3.5 h-3.5', trendColors.down)} />}
              {trend === 'neutral' && <Minus className={cn('w-3.5 h-3.5', trendColors.neutral)} />}
              <span className={cn('font-semibold', trend ? trendColors[trend] : 'text-slate-300')}>
                {trendText}
              </span>
            </div>
          )}
          {subtext && (
            <span className="text-slate-400 text-[10px] font-mono truncate max-w-[180px]">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
