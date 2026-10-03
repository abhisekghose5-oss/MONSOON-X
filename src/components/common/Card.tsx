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
    default: 'bg-[#0A192F]/85 border-[#1E354D] shadow-2xl backdrop-blur-md',
    meteorological: 'bg-[#0A192F]/85 border-[#1E354D] border-t-2 border-t-cyan-400 shadow-2xl backdrop-blur-md relative overflow-hidden',
    interactive: 'bg-[#0A192F]/85 border-[#1E354D] hover:border-cyan-500/50 transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md',
    critical: 'bg-rose-950/20 border-rose-500/30 border-l-4 border-l-rose-500 shadow-2xl backdrop-blur-md',
  };

  return (
    <div
      className={cn(
        'rounded-xl border text-slate-200 transition-colors',
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
    <div className={cn('px-5 py-3.5 border-b border-[#1E354D] flex flex-col space-y-0.5', className)} {...props}>
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
      className={cn('text-xs font-bold uppercase tracking-wider text-white font-mono', className)}
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
    <p className={cn('text-xs text-slate-400 leading-relaxed', className)} {...props}>
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
      className={cn('px-5 py-2.5 border-t border-[#1E354D] bg-[#071324] rounded-b-xl flex items-center justify-between text-xs text-slate-400 font-mono', className)}
      {...props}
    >
      {children}
    </div>
  );
}
