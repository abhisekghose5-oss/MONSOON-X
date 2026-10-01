import React from 'react';
import { cn } from '../../utils/cn';

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'text' | 'chart' | 'table' | 'ring' | 'block';
  lines?: number;
}

export function LoadingSkeleton({
  variant = 'block',
  lines = 3,
  className,
  ...props
}: LoadingSkeletonProps) {
  if (variant === 'text') {
    return (
      <div className={cn('space-y-2 w-full animate-pulse', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-3.5 bg-[#E2E8F0] rounded-sm',
              i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'rounded-md border border-[#E2E8F0] bg-white p-4 shadow-gov-card space-y-3 animate-pulse',
          className
        )}
        {...props}
      >
        <div className="flex justify-between items-center">
          <div className="h-3 w-1/3 bg-[#E2E8F0] rounded-sm" />
          <div className="h-5 w-5 bg-[#E2E8F0] rounded-sm" />
        </div>
        <div className="h-8 w-1/2 bg-[#CBD5E1] rounded-sm" />
        <div className="h-3 w-3/4 bg-[#F0F3F7] rounded-sm" />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div
        className={cn(
          'w-full h-56 rounded-sm bg-[#F5F7FA] border border-[#E2E8F0] p-4 flex flex-col justify-between animate-pulse',
          className
        )}
        {...props}
      >
        <div className="flex justify-between">
          <div className="h-3 w-28 bg-[#CBD5E1] rounded-sm" />
          <div className="h-3 w-16 bg-[#E2E8F0] rounded-sm" />
        </div>
        <div className="flex items-end justify-between gap-2 h-36 pt-4">
          {[40, 65, 30, 80, 55, 90, 45, 70, 35, 60].map((h, idx) => (
            <div
              key={idx}
              className="flex-1 bg-[#CBD5E1]/60 rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="h-2 w-full bg-[#E2E8F0] rounded-sm" />
      </div>
    );
  }

  if (variant === 'ring') {
    return (
      <div
        className={cn('inline-flex flex-col items-center justify-center p-2 animate-pulse', className)}
        {...props}
      >
        <div className="w-20 h-20 rounded-full border-4 border-[#E2E8F0] border-t-[#CBD5E1]" />
        <div className="h-3 w-16 bg-[#E2E8F0] mt-3 rounded-sm" />
      </div>
    );
  }

  return (
    <div
      className={cn('bg-[#E2E8F0] rounded-sm animate-pulse', className)}
      {...props}
    />
  );
}
