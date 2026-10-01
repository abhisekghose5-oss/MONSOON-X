import React from 'react';
import type { DataSourceStatus } from '../../types/dataSources';

interface DataSourceStatusBadgeProps {
  status: DataSourceStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function DataSourceStatusBadge({
  status,
  size = 'md',
  className = '',
}: DataSourceStatusBadgeProps) {
  const getStyle = (s: DataSourceStatus) => {
    switch (s) {
      case 'LIVE':
        return {
          bg: 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]',
          dot: 'bg-[#247A4A] animate-pulse',
        };
      case 'UPDATED':
        return {
          bg: 'bg-[#EAF5FC] text-[#0E63A8] border-[#B9DCF4]',
          dot: 'bg-[#1479C9]',
        };
      case 'DELAYED':
        return {
          bg: 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]',
          dot: 'bg-[#D99000]',
        };
      case 'CACHED':
        return {
          bg: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
          dot: 'bg-[#64748B]',
        };
      case 'DEMO':
      default:
        return {
          bg: 'bg-[#FAF5FF] text-[#6B21A8] border-[#E9D5FF]',
          dot: 'bg-[#9333EA]',
        };
    }
  };

  const style = getStyle(status);
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`font-mono font-bold rounded-xs border uppercase inline-flex items-center gap-1.5 shadow-2xs select-none ${style.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      <span>{status}</span>
    </span>
  );
}
