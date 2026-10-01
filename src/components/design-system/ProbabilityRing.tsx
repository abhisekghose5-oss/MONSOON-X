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
    monsoon: { stroke: '#1479C9', track: '#D5EBF8', text: '#0B1F33' },
    agri: { stroke: '#247A4A', track: '#D5ECE0', text: '#0B1F33' },
    warning: { stroke: '#D99000', track: '#FAECD0', text: '#0B1F33' },
    risk: { stroke: '#C43D3D', track: '#F7D6D5', text: '#0B1F33' },
    navy: { stroke: '#0B1F33', track: '#D2DEEB', text: '#0B1F33' },
  };

  const dimensions = {
    sm: { diameter: 64, stroke: strokeWidth || 6, fontSize: 'text-xs' },
    md: { diameter: 96, stroke: strokeWidth || 8, fontSize: 'text-lg' },
    lg: { diameter: 128, stroke: strokeWidth || 10, fontSize: 'text-2xl' },
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
          <span className={cn('font-bold font-mono tracking-tight', fontSize, 'text-[#16202A]')}>
            {Math.round(clampedPercentage)}%
          </span>
        </div>
      </div>

      {(label || subtext) && (
        <div className="mt-2 space-y-0.5">
          {label && (
            <p className="text-xs font-semibold text-[#16202A] uppercase tracking-wide">
              {label}
            </p>
          )}
          {subtext && (
            <p className="text-[11px] text-[#6E7F94] font-mono">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
