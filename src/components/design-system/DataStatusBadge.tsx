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
      bg: 'bg-[#EDF7F1]',
      text: 'text-[#154D2F]',
      border: 'border-[#ABD7C0]',
      dot: 'bg-[#247A4A]',
    },
    OFFICIAL: {
      defaultLabel: 'OFFICIAL IMD DATA',
      icon: FileCheck,
      bg: 'bg-[#EDF6FC]',
      text: 'text-[#0C4E83]',
      border: 'border-[#ACD5F2]',
      dot: 'bg-[#1479C9]',
    },
    HISTORICAL: {
      defaultLabel: 'HISTORICAL DATA',
      icon: History,
      bg: 'bg-[#F1F5F9]',
      text: 'text-[#334155]',
      border: 'border-[#CBD5E1]',
      dot: 'bg-[#64748B]',
    },
    CACHED: {
      defaultLabel: 'CACHED DATA',
      icon: HardDrive,
      bg: 'bg-[#F5F7FA]',
      text: 'text-[#4B5B6D]',
      border: 'border-[#CBD5E1]',
      dot: 'bg-[#94A3B8]',
    },
    MODEL: {
      defaultLabel: 'MODEL OUTPUT',
      icon: Cpu,
      bg: 'bg-[#F3E8FF]',
      text: 'text-[#6B21A8]',
      border: 'border-[#D8B4FE]',
      dot: 'bg-[#9333EA]',
    },
    DEMO: {
      defaultLabel: 'DEMO DATA',
      icon: AlertTriangle,
      bg: 'bg-[#FDF7EB]',
      text: 'text-[#8C5D00]',
      border: 'border-[#F4D79C]',
      dot: 'bg-[#D99000]',
    },
    MISSING: {
      defaultLabel: 'DATA UNAVAILABLE',
      icon: HelpCircle,
      bg: 'bg-[#FCEDEC]',
      text: 'text-[#802626]',
      border: 'border-[#EEA9A7]',
      dot: 'bg-[#C43D3D]',
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
