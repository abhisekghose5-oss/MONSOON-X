import React from 'react';
import { cn } from '../../utils/cn';

interface RiskMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  statusLabel?: string;
  colorScheme?: 'blue' | 'amber' | 'red' | 'green' | 'navy' | 'neutral';
  subtext?: string;
  className?: string;
}

export function RiskMetricCard({
  label,
  value,
  unit,
  statusLabel,
  colorScheme = 'blue',
  subtext,
  className,
}: RiskMetricCardProps) {
  const schemeStyles = {
    blue: {
      card: 'border-[#1E354D] bg-[#071324] text-white',
      value: 'text-[#38BDF8]',
      tag: 'bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40',
    },
    amber: {
      card: 'border-[#1E354D] bg-[#1C1608]/70 text-white',
      value: 'text-[#FCD34D]',
      tag: 'bg-[#F59E0B]/20 text-[#FCD34D] border border-[#F59E0B]/40',
    },
    red: {
      card: 'border-[#1E354D] bg-[#200D0D]/70 text-white',
      value: 'text-[#F87171]',
      tag: 'bg-rose-950/60 text-rose-400 border border-rose-500/40',
    },
    green: {
      card: 'border-[#1E354D] bg-[#081C1B]/70 text-white',
      value: 'text-[#4ADE80]',
      tag: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40',
    },
    navy: {
      card: 'border-[#1E354D] bg-[#071324] text-white',
      value: 'text-white',
      tag: 'bg-[#1E354D] text-[#38BDF8]',
    },
    neutral: {
      card: 'border-[#1E354D] bg-[#071324] text-white',
      value: 'text-slate-200',
      tag: 'bg-[#0B1F33] text-slate-300 border border-[#1E354D]',
    },
  };

  const current = schemeStyles[colorScheme];

  return (
    <div
      className={cn(
        'p-2.5 rounded-sm border flex flex-col justify-between transition-all select-none',
        current.card,
        className
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-mono uppercase font-bold tracking-wider truncate">
          {label}
        </span>
        {statusLabel && (
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-xs text-[9px] font-mono font-bold uppercase shrink-0',
              current.tag
            )}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className="my-1.5 flex items-baseline gap-1">
        <span className={cn('text-2xl font-bold font-mono tracking-tight', current.value)}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono font-medium opacity-80">{unit}</span>
        )}
      </div>

      {subtext && (
        <span className="text-[9px] font-mono leading-tight opacity-75 truncate block">
          {subtext}
        </span>
      )}
    </div>
  );
}

export default RiskMetricCard;
