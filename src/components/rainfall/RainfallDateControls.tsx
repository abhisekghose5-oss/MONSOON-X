import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { DateRangePreset, DateRangeFilterState } from '../../types/rainfall';

export interface RainfallDateControlsProps {
  filter: DateRangeFilterState;
  onFilterChange: (newFilter: DateRangeFilterState) => void;
}

export function RainfallDateControls({
  filter,
  onFilterChange,
}: RainfallDateControlsProps) {
  const presets: { id: DateRangePreset; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'last7', label: '7 Days' },
    { id: 'last30', label: '30 Days' },
    { id: 'last90', label: '90 Days' },
    { id: 'monsoon_season', label: 'Monsoon Season' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const handlePresetClick = (preset: DateRangePreset) => {
    let startDate = '2025-06-01';
    let endDate = '2025-09-30';

    if (preset === 'today') {
      startDate = '2025-09-30';
      endDate = '2025-09-30';
    } else if (preset === 'last7') {
      startDate = '2025-09-24';
      endDate = '2025-09-30';
    } else if (preset === 'last30') {
      startDate = '2025-09-01';
      endDate = '2025-09-30';
    } else if (preset === 'last90') {
      startDate = '2025-07-01';
      endDate = '2025-09-30';
    } else if (preset === 'monsoon_season') {
      startDate = '2025-06-01';
      endDate = '2025-09-30';
    } else if (preset === 'custom') {
      startDate = filter.startDate || '2025-06-01';
      endDate = filter.endDate || '2025-09-30';
    }

    onFilterChange({
      ...filter,
      preset,
      startDate,
      endDate,
    });
  };

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-3.5 space-y-3 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#0B1F33] mr-2">
            <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>TIME HORIZON:</span>
          </div>
          {presets.map((p) => {
            const isActive = filter.preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePresetClick(p.id)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-xs transition-colors ${
                  isActive
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Date Display / Custom Range Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
          {filter.preset === 'custom' ? (
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) =>
                  onFilterChange({ ...filter, startDate: e.target.value })
                }
                className="border border-[#CBD5E1] rounded-xs px-2 py-1 text-xs font-mono bg-white text-[#0B1F33]"
              />
              <span className="text-[#64748B]">to</span>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) =>
                  onFilterChange({ ...filter, endDate: e.target.value })
                }
                className="border border-[#CBD5E1] rounded-xs px-2 py-1 text-xs font-mono bg-white text-[#0B1F33]"
              />
            </div>
          ) : (
            <span className="text-[#475569] font-medium">
              Window: <strong className="text-[#0B1F33]">{filter.startDate}</strong> to{' '}
              <strong className="text-[#0B1F33]">{filter.endDate}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
export default RainfallDateControls;
