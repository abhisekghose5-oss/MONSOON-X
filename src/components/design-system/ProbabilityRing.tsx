import React from 'react';
import { cn } from '../../utils/cn';

export interface ProbabilityRingProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number;
  label?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'monsoon' | 'agri' | 'warning' | 'risk' | 'navy';
  strokeWidth?: number;
}

export function ProbabilityRing({
  percentage,
  label,
  subtext,
  size = 'md',
  variant = 'monsoon',
  strokeWidth,
  className,
  ...props
}: ProbabilityRingProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  const variantColors = {
    monsoon: { stroke: '#38BDF8', track: '#1E354D', text: '#38BDF8' },
    agri: { stroke: '#4ADE80', track: '#1E354D', text: '#4ADE80' },
    warning: { stroke: '#FCD34D', track: '#1E354D', text: '#FCD34D' },
    risk: { stroke: '#F87171', track: '#1E354D', text: '#F87171' },
    navy: { stroke: '#60A5FA', track: '#1E354D', text: '#FFFFFF' },
  };

  const dimensions = {
    sm: { diameter: 60, stroke: strokeWidth || 5, fontSize: 'text-xs font-extrabold' },
    md: { diameter: 92, stroke: strokeWidth || 7, fontSize: 'text-xl font-black' },
    lg: { diameter: 124, stroke: strokeWidth || 9, fontSize: 'text-2xl font-black' },
  };


  const { diameter, stroke, fontSize } = dimensions[size];
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div
      className={cn('inline-flex flex-col items-center justify-center text-center', className)}
      role="progressbar"
      aria-valuenow={clampedPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={diameter}
          height={diameter}
          className="transform -rotate-90"
        >
          {/* Background track circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="transparent"
            stroke={variantColors[variant].track}
            strokeWidth={stroke}
          />
          {/* Progress stroke */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="transparent"
            stroke={variantColors[variant].stroke}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={cn('font-bold font-mono tracking-tight', fontSize, 'text-white')}>
            {Math.round(clampedPercentage)}%
          </span>
        </div>
      </div>

      {(label || subtext) && (
        <div className="mt-2 space-y-0.5">
          {label && (
            <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
              {label}
            </p>
          )}
          {subtext && (
            <p className="text-[11px] text-slate-400 font-mono">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
