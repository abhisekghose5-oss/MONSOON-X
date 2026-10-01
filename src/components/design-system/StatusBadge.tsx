import React from 'react';
import { cn } from '../../utils/cn';

export type SystemStatus = 'operational' | 'syncing' | 'offline' | 'standby' | 'calibrated' | 'delayed';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: SystemStatus;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export function StatusBadge({
  status,
  label,
  size = 'md',
  showDot = true,
  className,
  ...props
}: StatusBadgeProps) {
  const configs: Record<
    SystemStatus,
    { defaultLabel: string; bg: string; text: string; border: string; dot: string; pulse?: boolean }
  > = {
    operational: {
      defaultLabel: 'OPERATIONAL',
      bg: 'bg-[#EDF7F1]',
      text: 'text-[#154D2F]',
      border: 'border-[#ABD7C0]',
      dot: 'bg-[#247A4A]',
    },
    syncing: {
      defaultLabel: 'TELEMETRY SYNC',
      bg: 'bg-[#EDF6FC]',
      text: 'text-[#0C4E83]',
      border: 'border-[#ACD5F2]',
      dot: 'bg-[#1479C9]',
      pulse: true,
    },
    standby: {
      defaultLabel: 'STANDBY',
      bg: 'bg-[#EAF0F6]',
      text: 'text-[#0B1F33]',
      border: 'border-[#CBD5E1]',
      dot: 'bg-[#0B1F33]',
    },
    calibrated: {
      defaultLabel: 'CALIBRATED',
      bg: 'bg-[#F0F3F7]',
      text: 'text-[#4B5B6D]',
      border: 'border-[#CBD5E1]',
      dot: 'bg-[#4B5B6D]',
    },
    delayed: {
      defaultLabel: 'LATENCY DELAY',
      bg: 'bg-[#FDF7EB]',
      text: 'text-[#8C5D00]',
      border: 'border-[#F4D79C]',
      dot: 'bg-[#D99000]',
    },
    offline: {
      defaultLabel: 'FEED OFFLINE',
      bg: 'bg-[#FCEDEC]',
      text: 'text-[#802626]',
      border: 'border-[#EEA9A7]',
      dot: 'bg-[#C43D3D]',
    },
  };

  const config = configs[status];
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider font-mono font-semibold',
    md: 'text-xs px-2.5 py-0.5 tracking-wide font-mono font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border uppercase select-none',
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {config.pulse && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                config.dot
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', config.dot)} />
        </span>
      )}
      <span>{displayLabel}</span>
    </span>
  );
}
