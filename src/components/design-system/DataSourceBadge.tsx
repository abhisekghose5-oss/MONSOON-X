import React from 'react';
import { Satellite, Radio, Cpu, Database, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn';

export type DataSourceAgency = 'IMD' | 'ISRO' | 'ECMWF' | 'NCMRWF' | 'OUAT' | 'AWS' | 'ERA5' | string;

export interface DataSourceBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  source: DataSourceAgency;
  type?: 'satellite' | 'radar' | 'station' | 'model' | 'survey';
  latency?: string;
  size?: 'sm' | 'md';
}

export function DataSourceBadge({
  source,
  type,
  latency,
  size = 'md',
  className,
  ...props
}: DataSourceBadgeProps) {
  const typeIcons = {
    satellite: Satellite,
    radar: Radio,
    station: MapPin,
    model: Cpu,
    survey: Database,
  };

  const Icon = type ? typeIcons[type] : Database;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#EAF0F6] border border-[#CBD5E1] text-[#0B1F33] font-mono text-[11px] font-semibold tracking-wide uppercase',
        size === 'sm' && 'text-[10px] px-1.5 py-0.2',
        className
      )}
      {...props}
    >
      <Icon className="w-3 h-3 text-[#1479C9] shrink-0" />
      <span>{source}</span>
      {latency && (
        <span className="text-[10px] text-[#6E7F94] font-normal lowercase pl-1 border-l border-[#CBD5E1]">
          {latency}
        </span>
      )}
    </span>
  );
}
