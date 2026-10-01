import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'meteorological' | 'interactive' | 'critical';
  children: React.ReactNode;
}

export function Card({
  className,
  variant = 'default',
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white border-[#E2E8F0] shadow-gov-card',
    meteorological: 'bg-white border-[#E2E8F0] border-t-2 border-t-[#1479C9] shadow-gov-card relative overflow-hidden',
    interactive: 'bg-white border-[#E2E8F0] hover:border-[#1479C9] transition-all duration-200 cursor-pointer shadow-gov-card hover:shadow-gov-elevated',
    critical: 'bg-[#FCEDEC] border-[#EEA9A7] border-l-4 border-l-[#C43D3D] shadow-gov-card',
  };

  return (
    <div
      className={cn(
        'rounded-md border text-[#16202A] transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 py-3.5 border-b border-[#F0F3F7] flex flex-col space-y-0.5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-xs font-bold uppercase tracking-wider text-[#0B1F33]', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-[#4B5B6D] leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-5 py-2.5 border-t border-[#F0F3F7] bg-[#F5F7FA]/50 rounded-b-md flex items-center justify-between text-xs text-[#6E7F94]', className)}
      {...props}
    >
      {children}
    </div>
  );
}
