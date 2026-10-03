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
    normal: 'border-t-[#38BDF8]',
    monsoon: 'border-t-[#0284C7]',
    agriculture: 'border-t-[#10B981]',
    warning: 'border-t-[#F59E0B]',
    risk: 'border-t-[#EF4444]',
  };

  const statusIcons = {
    normal: 'text-[#38BDF8] bg-[#0284C7]/20 border border-[#0284C7]/30',
    monsoon: 'text-[#38BDF8] bg-[#0284C7]/20 border border-[#0284C7]/30',
    agriculture: 'text-[#4ADE80] bg-[#10B981]/20 border border-[#10B981]/30',
    warning: 'text-[#FCD34D] bg-[#F59E0B]/20 border border-[#F59E0B]/30',
    risk: 'text-[#F87171] bg-[#EF4444]/20 border border-[#EF4444]/30',
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-[#1E354D] border-t-[3px] p-4 bg-[#0A192F] shadow-command-panel transition-all duration-200 hover:border-[#0284C7]/60 text-white',
        statusAccents[status],
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
          {title}
        </span>
        {Icon && (
          <div className={cn('p-1 rounded-xs shrink-0', statusIcons[status])}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono font-medium text-slate-300">
            {unit}
          </span>
        )}
      </div>

      {delta && (
        <div className="flex items-center gap-1 text-xs font-mono mt-1">
          {delta.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8]" />}
          {delta.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-[#F87171]" />}
          {delta.trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
          <span
            className={cn(
              'font-semibold',
              delta.isFavorable === true
                ? 'text-[#4ADE80]'
                : delta.isFavorable === false
                ? 'text-[#F87171]'
                : 'text-slate-300'
            )}
          >
            {delta.value}
          </span>
        </div>
      )}

      {(baselineText || caption) && (
        <div className="mt-2.5 pt-2 border-t border-[#1E354D] flex flex-col gap-0.5 text-[11px] text-slate-400">
          {baselineText && <span className="text-slate-300">{baselineText}</span>}
          {caption && <span className="font-mono text-slate-400">{caption}</span>}
        </div>
      )}
    </div>
  );
}

