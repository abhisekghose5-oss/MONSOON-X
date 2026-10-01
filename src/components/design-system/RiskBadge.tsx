import React from 'react';
import { ShieldCheck, Eye, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '../../utils/cn';

export type RiskLevel = 'nominal' | 'watch' | 'alert' | 'warning';

export interface RiskBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function RiskBadge({
  level,
  label,
  size = 'md',
  showIcon = true,
  className,
  ...props
}: RiskBadgeProps) {
  const configs: Record<
    RiskLevel,
    { defaultLabel: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    nominal: {
      defaultLabel: 'NOMINAL / NO RISK',
      bg: 'bg-[#EDF7F1]',
      text: 'text-[#154D2F]',
      border: 'border-[#ABD7C0]',
      icon: ShieldCheck,
    },
    watch: {
      defaultLabel: 'METEOROLOGICAL WATCH',
      bg: 'bg-[#EDF6FC]',
      text: 'text-[#0C4E83]',
      border: 'border-[#ACD5F2]',
      icon: Eye,
    },
    alert: {
      defaultLabel: 'AGRO ADVISORY / ALERT',
      bg: 'bg-[#FDF7EB]',
      text: 'text-[#8C5D00]',
      border: 'border-[#F4D79C]',
      icon: AlertTriangle,
    },
    warning: {
      defaultLabel: 'CRITICAL / SEVERE WARNING',
      bg: 'bg-[#FCEDEC]',
      text: 'text-[#802626]',
      border: 'border-[#EEA9A7]',
      icon: AlertOctagon,
    },
  };

  const config = configs[level];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider font-mono font-semibold',
    md: 'text-xs px-2.5 py-1 tracking-wide font-mono font-semibold',
    lg: 'text-sm px-3.5 py-1.5 tracking-wide font-mono font-bold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
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
      {showIcon && <Icon className={cn('shrink-0', iconSizes[size])} />}
      <span>{displayLabel}</span>
    </span>
  );
}
