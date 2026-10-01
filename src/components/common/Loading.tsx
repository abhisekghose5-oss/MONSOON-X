import React from 'react';
import { Loader2, Radio } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LoadingProps {
  label?: string;
  subtext?: string;
  variant?: 'spinner' | 'radar' | 'skeleton';
  className?: string;
  fullScreen?: boolean;
}

export function Loading({
  label = 'SYNCHRONIZING METEOROLOGICAL TELEMETRY...',
  subtext = 'Processing numerical weather prediction ensemble and AWS observation feeds',
  variant = 'radar',
  className,
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-sm',
        fullScreen ? 'fixed inset-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-xs' : 'w-full py-10',
        className
      )}
    >
      {variant === 'radar' && (
        <div className="relative flex items-center justify-center mb-3">
          <div className="w-12 h-12 rounded-full border border-[#1479C9]/30 animate-ping absolute" />
          <div className="w-9 h-9 rounded-full bg-[#EDF6FC] border border-[#1479C9] flex items-center justify-center relative shadow-xs">
            <Radio className="w-4 h-4 text-[#1479C9]" />
          </div>
        </div>
      )}

      {variant === 'spinner' && (
        <Loader2 className="w-7 h-7 text-[#1479C9] animate-spin mb-3" />
      )}

      {variant === 'skeleton' && (
        <div className="w-full max-w-md space-y-2.5 animate-pulse">
          <div className="h-3.5 bg-[#E2E8F0] rounded-sm w-3/4 mx-auto" />
          <div className="h-2.5 bg-[#CBD5E1] rounded-sm w-1/2 mx-auto" />
        </div>
      )}

      {variant !== 'skeleton' && (
        <>
          <p className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider font-mono">
            {label}
          </p>
          {subtext && (
            <p className="text-[11px] text-[#4B5B6D] mt-1 max-w-sm leading-relaxed">
              {subtext}
            </p>
          )}
        </>
      )}
    </div>
  );

  return content;
}

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-sm bg-[#E2E8F0] border border-[#CBD5E1]',
        className
      )}
    />
  );
}
