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
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      dot: 'bg-emerald-400',
    },
    syncing: {
      defaultLabel: 'TELEMETRY SYNC',
      bg: 'bg-sky-950/60',
      text: 'text-sky-400',
      border: 'border-sky-500/40',
      dot: 'bg-sky-400',
      pulse: true,
    },
    standby: {
      defaultLabel: 'STANDBY',
      bg: 'bg-slate-800/60',
      text: 'text-slate-300',
      border: 'border-slate-600/40',
      dot: 'bg-slate-400',
    },
    calibrated: {
      defaultLabel: 'CALIBRATED',
      bg: 'bg-slate-800/40',
      text: 'text-slate-300',
      border: 'border-slate-700/50',
      dot: 'bg-sky-400',
    },
    delayed: {
      defaultLabel: 'LATENCY DELAY',
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      dot: 'bg-amber-400',
    },
    offline: {
      defaultLabel: 'FEED OFFLINE',
      bg: 'bg-rose-950/60',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      dot: 'bg-rose-400',
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
