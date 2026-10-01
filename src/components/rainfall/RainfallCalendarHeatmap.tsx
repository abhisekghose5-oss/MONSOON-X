import React, { useState } from 'react';
import { Calendar, HelpCircle } from 'lucide-react';
import type { DailyRainfallPoint } from '../../types/rainfall';

export interface RainfallCalendarHeatmapProps {
  data: DailyRainfallPoint[];
  isLoading?: boolean;
}

export function RainfallCalendarHeatmap({
  data,
  isLoading = false,
}: RainfallCalendarHeatmapProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DailyRainfallPoint | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 animate-pulse h-64" />
    );
  }

  // Helper for color intensity
  const getCellColor = (point: DailyRainfallPoint) => {
    const mm = point.rainfallMm;
    if (mm === null) return 'bg-[#CBD5E1] border-dashed border-[#94A3B8]'; // Missing
    if (mm === 0) return 'bg-[#F1F5F9] border-[#E2E8F0]';
    if (mm < 2.5) return 'bg-[#BAE6FD] border-[#7DD3FC]'; // Trace / Dry
    if (mm <= 15.5) return 'bg-[#38BDF8] border-[#0284C7] text-white'; // Light
    if (mm <= 64.4) return 'bg-[#0284C7] border-[#0369A1] text-white'; // Moderate
    if (mm <= 115.5) return 'bg-[#F59E0B] border-[#D97706] text-white'; // Heavy
    return 'bg-[#DC2626] border-[#B91C1C] text-white'; // Very Heavy
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Organize data into weekly chunks
  const weeks: Array<Array<DailyRainfallPoint | null>> = [];
  if (data.length > 0) {
    let currentWeek: Array<DailyRainfallPoint | null> = [];
    const firstDate = new Date(data[0].date);
    const leadingEmpty = firstDate.getDay(); // 0 for Sun

    for (let i = 0; i < leadingEmpty; i++) {
      currentWeek.push(null);
    }

    for (const point of data) {
      currentWeek.push(point);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
  }

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 space-y-3.5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0284C7]" />
            <h4 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33]">
              RAINFALL CALENDAR HEATMAP
            </h4>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Daily hyetograph matrix illustrating persistent monsoon spells, dry gaps, and extreme cloudburst events.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] font-mono flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F1F5F9] border border-[#CBD5E1]" />
            <span>0 mm</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#BAE6FD]" />
            <span>&lt;2.5 mm (Dry)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38BDF8]" />
            <span>2.5–15 mm</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0284C7]" />
            <span>15–64 mm</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" />
            <span>≥64.5 mm (Heavy)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#CBD5E1] border-dashed border-[#94A3B8]" />
            <span>Missing</span>
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px] space-y-1">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-[#64748B] pb-1">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Weeks Rows */}
          {weeks.map((week, wIdx) => (
            <div key={`week-${wIdx}`} className="grid grid-cols-7 gap-1">
              {week.map((point, dIdx) => {
                if (!point) {
                  return (
                    <div
                      key={`empty-${wIdx}-${dIdx}`}
                      className="h-10 rounded-xs bg-[#F8FAFC]/50 border border-transparent"
                    />
                  );
                }

                const cellClasses = getCellColor(point);

                return (
                  <div
                    key={point.date}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className={`h-10 rounded-xs p-1 border text-xs font-mono flex flex-col justify-between cursor-pointer transition-transform hover:scale-105 hover:z-10 hover:shadow-md ${cellClasses}`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-90 leading-none">
                      <span>{point.displayDate.split(' ')[0]}</span>
                      <span className="text-[9px] uppercase">{point.displayDate.split(' ')[1]}</span>
                    </div>

                    <div className="text-right font-bold text-[11px] leading-none">
                      {point.rainfallMm !== null ? `${point.rainfallMm.toFixed(0)}` : '—'}
                      <span className="text-[9px] font-normal ml-0.5">
                        {point.rainfallMm !== null ? 'mm' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tooltip Card at Bottom of Calendar */}
      <div className="p-2.5 rounded-xs bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-between text-xs font-mono min-h-[42px]">
        {hoveredPoint ? (
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-[#0B1F33]">
              {hoveredPoint.date} ({hoveredPoint.dayOfWeek}):{' '}
              <strong className="text-[#0284C7]">
                {hoveredPoint.rainfallMm !== null ? `${hoveredPoint.rainfallMm.toFixed(1)} mm` : 'Missing Data'}
              </strong>
            </span>
            <span className="text-[#64748B]">
              Status:{' '}
              <strong
                className={
                  hoveredPoint.rainfallMm === null
                    ? 'text-[#DC2626]'
                    : hoveredPoint.rainfallMm < 2.5
                    ? 'text-[#D97706]'
                    : 'text-[#059669]'
                }
              >
                {hoveredPoint.rainfallMm === null
                  ? 'Data Gap'
                  : hoveredPoint.rainfallMm < 2.5
                  ? 'Dry Day (<2.5mm)'
                  : 'Rainy Day (≥2.5mm)'}
              </strong>{' '}
              · Category: <strong className="text-[#0B1F33]">{hoveredPoint.imdCategory}</strong>
            </span>
          </div>
        ) : (
          <span className="text-[#94A3B8] italic flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Hover over any calendar cell to inspect daily precipitation, dry spell status, and IMD intensity.
          </span>
        )}
      </div>
    </div>
  );
}
export default RainfallCalendarHeatmap;
