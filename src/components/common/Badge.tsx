import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
    default: {
      badge: 'bg-[#EAF0F6] text-[#0B1F33] border-[#CBD5E1]',
      dot: 'bg-[#0B1F33]',
    },
    info: {
      badge: 'bg-[#EDF6FC] text-[#0C4E83] border-[#ACD5F2]',
      dot: 'bg-[#1479C9]',
    },
    success: {
      badge: 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]',
      dot: 'bg-[#247A4A]',
    },
    warning: {
      badge: 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]',
      dot: 'bg-[#D99000]',
    },
    danger: {
      badge: 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]',
      dot: 'bg-[#C43D3D]',
    },
    outline: {
      badge: 'bg-transparent text-[#4B5B6D] border-[#CBD5E1]',
      dot: 'bg-[#4B5B6D]',
    },
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider font-mono font-semibold',
    md: 'text-xs px-2.5 py-0.5 tracking-wide font-mono font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border uppercase select-none',
        variantStyles[variant].badge,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                variantStyles[variant].dot
              )}
            />
          )}
          <span
            className={cn('relative inline-flex rounded-full h-1.5 w-1.5', variantStyles[variant].dot)}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
