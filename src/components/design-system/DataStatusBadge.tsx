import React from 'react';
import type { DataStatus } from '../../types/dataArchitecture';
import {
  CheckCircle2,
  FileCheck,
  History,
  HardDrive,
  Cpu,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface DataStatusBadgeProps {
  status: DataStatus;
  labelOverride?: string;
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function DataStatusBadge({
  status,
  labelOverride,
  size = 'sm',
  showIcon = true,
  className,
}: DataStatusBadgeProps) {
  const configs: Record<
    DataStatus,
    { defaultLabel: string; icon: React.ElementType; bg: string; text: string; border: string; dot: string }
  > = {
    LIVE: {
      defaultLabel: 'LIVE TELEMETRY',
      icon: CheckCircle2,
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      dot: 'bg-emerald-400',
    },
    OFFICIAL: {
      defaultLabel: 'OFFICIAL IMD DATA',
      icon: FileCheck,
      bg: 'bg-sky-950/60',
      text: 'text-sky-300',
      border: 'border-sky-500/40',
      dot: 'bg-sky-400',
    },
    HISTORICAL: {
      defaultLabel: 'HISTORICAL DATA',
      icon: History,
      bg: 'bg-slate-800/60',
      text: 'text-slate-300',
      border: 'border-slate-600/40',
      dot: 'bg-slate-400',
    },
    CACHED: {
      defaultLabel: 'CACHED DATA',
      icon: HardDrive,
      bg: 'bg-slate-800/40',
      text: 'text-slate-300',
      border: 'border-slate-700/50',
      dot: 'bg-slate-400',
    },
    MODEL: {
      defaultLabel: 'MODEL OUTPUT',
      icon: Cpu,
      bg: 'bg-purple-950/60',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
      dot: 'bg-purple-400',
    },
    DEMO: {
      defaultLabel: 'DEMO DATA',
      icon: AlertTriangle,
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      dot: 'bg-amber-400',
    },
    MISSING: {
      defaultLabel: 'DATA UNAVAILABLE',
      icon: HelpCircle,
      bg: 'bg-rose-950/60',
      text: 'text-rose-300',
      border: 'border-rose-500/40',
      dot: 'bg-rose-400',
    },
  };

  const current = configs[status] || configs.DEMO;
  const Icon = current.icon;
  const label = labelOverride || current.defaultLabel;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-bold uppercase rounded-sm border select-none transition-colors shadow-xs',
        current.bg,
        current.text,
        current.border,
        sizeClasses[size],
        className
      )}
      title={`Data Provenance Status: ${status}`}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', current.dot)} />
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}

export default DataStatusBadge;
