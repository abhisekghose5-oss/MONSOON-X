import React from 'react';
import { cn } from '../../utils/cn';
import type { RainfallDataType } from '../../types/rainfall';

export interface DataTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: RainfallDataType | 'OBSERVED_AWS' | 'FORECAST_ENSEMBLE' | 'NORMAL_LPA' | 'MODEL_BIAS_CORRECTED';
  size?: 'xs' | 'sm' | 'md';
}

export function DataTypeBadge({
  type,
  size = 'xs',
  className,
  ...props
}: DataTypeBadgeProps) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string; indicator: 'dot' | 'pulse' | 'dash' | 'square' }
  > = {
    OBSERVED: {
      label: 'OBSERVED',
      bg: 'bg-[#EDF6FC]',
      text: 'text-[#0C4E83]',
      border: 'border-[#ACD5F2]',
      dot: 'bg-[#1479C9]',
      indicator: 'dot',
    },
    OBSERVED_AWS: {
      label: 'OBSERVED (AWS)',
      bg: 'bg-[#EDF6FC]',
      text: 'text-[#0C4E83]',
      border: 'border-[#ACD5F2]',
      dot: 'bg-[#1479C9]',
      indicator: 'dot',
    },
    FORECAST: {
      label: 'FORECAST',
      bg: 'bg-[#EAF0F6]',
      text: 'text-[#0B1F33]',
      border: 'border-[#7599C8]',
      dot: 'bg-[#439EE0]',
      indicator: 'pulse',
    },
    FORECAST_ENSEMBLE: {
      label: 'FORECAST (NWP)',
      bg: 'bg-[#EAF0F6]',
      text: 'text-[#0B1F33]',
      border: 'border-[#7599C8]',
      dot: 'bg-[#439EE0]',
      indicator: 'pulse',
    },
    NORMAL: {
      label: 'NORMAL',
      bg: 'bg-[#F0F3F7]',
      text: 'text-[#4B5B6D]',
      border: 'border-[#CBD5E1]',
      dot: 'bg-[#6E7F94]',
      indicator: 'dash',
    },
    NORMAL_LPA: {
      label: 'NORMAL (LPA)',
      bg: 'bg-[#F0F3F7]',
      text: 'text-[#4B5B6D]',
      border: 'border-[#CBD5E1]',
      dot: 'bg-[#6E7F94]',
      indicator: 'dash',
    },
    MODEL_OUTPUT: {
      label: 'MODEL OUTPUT',
      bg: 'bg-[#FDF7EB]',
      text: 'text-[#8C5D00]',
      border: 'border-[#F4D79C]',
      dot: 'bg-[#D99000]',
      indicator: 'square',
    },
    MODEL_BIAS_CORRECTED: {
      label: 'MODEL OUTPUT (BIAS-CORRECTED)',
      bg: 'bg-[#FDF7EB]',
      text: 'text-[#8C5D00]',
      border: 'border-[#F4D79C]',
      dot: 'bg-[#D99000]',
      indicator: 'square',
    },
  };

  const config = configs[type] || configs.OBSERVED;

  const sizeStyles = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded-sm border shrink-0',
        config.bg,
        config.text,
        config.border,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {config.indicator === 'dot' && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      )}
      {config.indicator === 'pulse' && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dot)} />
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', config.dot)} />
        </span>
      )}
      {config.indicator === 'dash' && (
        <span className="w-2 h-0.5 bg-[#6E7F94] rounded-sm shrink-0" />
      )}
      {config.indicator === 'square' && (
        <span className={cn('w-1.5 h-1.5 rounded-xs shrink-0', config.dot)} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
