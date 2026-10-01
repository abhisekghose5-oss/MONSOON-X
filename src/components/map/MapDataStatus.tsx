import React from 'react';
import type { MapDataStatusType } from '../../types/riskMap';
import { Database, AlertTriangle, CheckCircle2, Cpu, HardDrive } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MapDataStatusProps {
  status: MapDataStatusType;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function MapDataStatus({ status, size = 'sm', className }: MapDataStatusProps) {
  const configs: Record<
    MapDataStatusType,
    { label: string; icon: React.ElementType; bg: string; text: string; border: string }
  > = {
    'DEMO': {
      label: 'DEMO DATA',
      icon: AlertTriangle,
      bg: 'bg-[#FDF7EB]',
      text: 'text-[#8C5D00]',
      border: 'border-[#F4D79C]',
    },
    'DEMO MODEL OUTPUT': {
      label: 'DEMO MODEL OUTPUT',
      icon: Cpu,
      bg: 'bg-[#FDF7EB]',
      text: 'text-[#8C5D00]',
      border: 'border-[#F4D79C]',
    },
    'MODEL OUTPUT': {
      label: 'MODEL OUTPUT',
      icon: Cpu,
      bg: 'bg-[#EDF6FC]',
      text: 'text-[#0C4E83]',
      border: 'border-[#ACD5F2]',
    },
    'OBSERVED': {
      label: 'OBSERVED',
      icon: CheckCircle2,
      bg: 'bg-[#EDF7F1]',
      text: 'text-[#154D2F]',
      border: 'border-[#ABD7C0]',
    },
    'OFFICIAL FORECAST': {
      label: 'OFFICIAL FORECAST',
      icon: Database,
      bg: 'bg-[#EDF7F1]',
      text: 'text-[#154D2F]',
      border: 'border-[#ABD7C0]',
    },
    'CACHED': {
      label: 'CACHED',
      icon: HardDrive,
      bg: 'bg-[#F5F7FA]',
      text: 'text-[#4B5B6D]',
      border: 'border-[#CBD5E1]',
    },
  };

  const current = configs[status] || configs['DEMO MODEL OUTPUT'];
  const Icon = current.icon;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-bold uppercase rounded-sm border select-none',
        current.bg,
        current.text,
        current.border,
        sizeClasses[size],
        className
      )}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{current.label}</span>
    </span>
  );
}

export default MapDataStatus;
