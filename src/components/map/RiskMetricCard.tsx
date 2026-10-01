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
      card: 'border-[#ACD5F2] bg-[#EDF6FC] text-[#0C4E83]',
      value: 'text-[#0C4E83]',
      tag: 'bg-[#1479C9] text-white',
    },
    amber: {
      card: 'border-[#F4D79C] bg-[#FDF7EB] text-[#8C5D00]',
      value: 'text-[#8C5D00]',
      tag: 'bg-[#D97706] text-white',
    },
    red: {
      card: 'border-[#EEA9A7] bg-[#FCEDEC] text-[#802626]',
      value: 'text-[#802626]',
      tag: 'bg-[#C43D3D] text-white',
    },
    green: {
      card: 'border-[#ABD7C0] bg-[#EDF7F1] text-[#154D2F]',
      value: 'text-[#154D2F]',
      tag: 'bg-[#247A4A] text-white',
    },
    navy: {
      card: 'border-[#CBD5E1] bg-[#0B1F33] text-white',
      value: 'text-white',
      tag: 'bg-[#1E354D] text-[#A4BCDA]',
    },
    neutral: {
      card: 'border-[#E2E8F0] bg-[#F5F7FA] text-[#0B1F33]',
      value: 'text-[#0B1F33]',
      tag: 'bg-[#E2E8F0] text-[#4B5B6D]',
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
