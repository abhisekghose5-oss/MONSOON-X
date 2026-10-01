import React from 'react';
import { cn } from '../../utils/cn';

export interface MapLegendItem {
  label: string;
  color: string;
  description?: string;
  shape?: 'square' | 'circle' | 'line';
  borderColor?: string;
}

export interface MapLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  items: MapLegendItem[];
  compact?: boolean;
}

export function MapLegend({
  title = 'Geospatial Classification Legend',
  subtitle,
  items,
  compact = false,
  className,
  ...props
}: MapLegendProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-[#CBD5E1] bg-white/95 backdrop-blur-sm p-3 shadow-gov-card text-[#16202A]',
        className
      )}
      {...props}
    >
      <div className="border-b border-[#F0F3F7] pb-1.5 mb-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F33]">
          {title}
        </h4>
        {subtitle && (
          <p className="text-[10px] text-[#6E7F94] font-mono">{subtitle}</p>
        )}
      </div>

      <div className={cn('space-y-1.5', compact && 'grid grid-cols-2 gap-x-3 gap-y-1 space-y-0')}>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            {item.shape === 'line' ? (
              <span
                className="w-4 h-1 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            ) : item.shape === 'circle' ? (
              <span
                className="w-3 h-3 shrink-0 rounded-full border"
                style={{
                  backgroundColor: item.color,
                  borderColor: item.borderColor || item.color,
                }}
              />
            ) : (
              <span
                className="w-3 h-3 shrink-0 rounded-sm border"
                style={{
                  backgroundColor: item.color,
                  borderColor: item.borderColor || 'transparent',
                }}
              />
            )}

            <div className="flex-1 min-w-0">
              <span className="font-medium text-[#16202A] block truncate text-[11px]">
                {item.label}
              </span>
              {item.description && (
                <span className="text-[10px] text-[#6E7F94] block truncate font-mono">
                  {item.description}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
