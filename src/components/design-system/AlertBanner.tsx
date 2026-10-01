import React from 'react';
import { AlertCircle, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type AlertBannerLevel = 'info' | 'advisory' | 'warning' | 'critical';

export interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  level: AlertBannerLevel;
  title: string;
  message: React.ReactNode;
  action?: React.ReactNode;
  targetBlock?: string;
  onDismiss?: () => void;
}

export function AlertBanner({
  level,
  title,
  message,
  action,
  targetBlock,
  onDismiss,
  className,
  ...props
}: AlertBannerProps) {
  const configs: Record<
    AlertBannerLevel,
    { bg: string; border: string; text: string; subtext: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    info: {
      bg: 'bg-[#EDF6FC]',
      border: 'border-[#1479C9]',
      text: 'text-[#0B1F33]',
      subtext: 'text-[#0C4E83]',
      icon: Info,
    },
    advisory: {
      bg: 'bg-[#FDF7EB]',
      border: 'border-[#D99000]',
      text: 'text-[#0B1F33]',
      subtext: 'text-[#8C5D00]',
      icon: AlertTriangle,
    },
    warning: {
      bg: 'bg-[#FAECD0]',
      border: 'border-[#B37700]',
      text: 'text-[#0B1F33]',
      subtext: 'text-[#664400]',
      icon: AlertCircle,
    },
    critical: {
      bg: 'bg-[#FCEDEC]',
      border: 'border-[#C43D3D]',
      text: 'text-[#0B1F33]',
      subtext: 'text-[#802626]',
      icon: AlertOctagon,
    },
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        'rounded-md border-l-4 border p-4 shadow-gov-card relative flex items-start gap-3.5',
        config.bg,
        config.border,
        className
      )}
      {...props}
    >
      <div className="shrink-0 mt-0.5">
        <Icon className={cn('w-5 h-5', config.subtext)} />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('font-bold text-xs uppercase tracking-wider', config.text)}>
            {title}
          </span>
          {targetBlock && (
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/70 border border-[#CBD5E1] text-[#0B1F33] font-semibold">
              {targetBlock}
            </span>
          )}
        </div>

        <div className={cn('text-xs leading-relaxed', config.subtext)}>
          {message}
        </div>

        {action && <div className="pt-2">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-[#6E7F94] hover:text-[#0B1F33] p-1 rounded transition-colors shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
