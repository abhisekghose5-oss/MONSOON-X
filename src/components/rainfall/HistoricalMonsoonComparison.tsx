import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { History, Check } from 'lucide-react';
import type { HistoricalSeason } from '../../types/rainfall';

export interface HistoricalMonsoonComparisonProps {
  seasons: HistoricalSeason[];
  isLoading?: boolean;
}

const YEAR_COLORS: Record<number, string> = {
  2025: '#0284C7', // Sky Blue (Current)
  2024: '#8B5CF6', // Purple
  2023: '#F59E0B', // Amber (El Nino Deficit)
  2022: '#10B981', // Emerald
  2021: '#6366F1', // Indigo
  2020: '#EC4899', // Pink
  2019: '#64748B', // Slate
};

export function HistoricalMonsoonComparison({
  seasons,
  isLoading: _isLoading = false,
}: HistoricalMonsoonComparisonProps) {
  // Available years from verified dataset
  const availableYears = seasons.map((s) => s.year);

  // Default: compare 2025, 2024, and 2023 (El Niño drought year)
  const [selectedYears, setSelectedYears] = useState<number[]>([2025, 2024, 2023]);

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 1) {
        setSelectedYears(selectedYears.filter((y) => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year].sort((a, b) => b - a));
    }
  };

  // Build chart data formatted by month
  const months = ['June', 'July', 'August', 'September', 'JJAS Total'];

  const chartData = months.map((m) => {
    const item: Record<string, string | number | null> = { month: m };

    for (const yr of selectedYears) {
      const season = seasons.find((s) => s.year === yr);
      if (!season) continue;

      if (m === 'June') item[`yr_${yr}`] = season.juneMm;
      else if (m === 'July') item[`yr_${yr}`] = season.julyMm;
      else if (m === 'August') item[`yr_${yr}`] = season.augustMm;
      else if (m === 'September') item[`yr_${yr}`] = season.septemberMm;
      else if (m === 'JJAS Total') item[`yr_${yr}`] = season.totalSeasonalMm;
    }

    return item;
  });

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 space-y-4 shadow-xs">
      {/* Header and Year Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#0284C7]" />
            <h4 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33]">
              HISTORICAL MONSOON COMPARISON
            </h4>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Inter-annual comparison of monthly and total seasonal rainfall across verified IMD records (2019–2025).
          </p>
        </div>

        {/* Multi-Year Selection Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-[#64748B] mr-1">Select Years:</span>
          {availableYears.map((yr) => {
            const isSelected = selectedYears.includes(yr);
            const color = YEAR_COLORS[yr] || '#64748B';
            return (
              <button
                key={yr}
                onClick={() => toggleYear(yr)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-xs border transition-colors flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#0B1F33] text-white border-[#0B1F33]'
                    : 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{yr}</span>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Bar Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#0B1F33', fontFamily: 'monospace', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
            />

            <YAxis
              tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="bg-[#0B1F33] text-white p-3 rounded-xs shadow-xl border border-[#1E354D] text-xs font-mono space-y-1.5">
                    <div className="font-bold border-b border-[#1E354D] pb-1 text-[#38BDF8]">
                      {label} Rainfall Comparison
                    </div>
                    <div className="space-y-1">
                      {payload.map((entry) => {
                        const yr = String(entry.dataKey).replace('yr_', '');
                        return (
                          <div key={String(entry.dataKey || '')} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-[#CBD5E1]">{yr}:</span>
                            </span>
                            <span className="font-bold text-white">
                              {Number(entry.value).toFixed(1)} mm
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 8, fontSize: 11, fontFamily: 'monospace' }}
              formatter={(value: string) => value.replace('yr_', 'Season ')}
            />

            {selectedYears.map((yr) => (
              <Bar
                key={yr}
                dataKey={`yr_${yr}`}
                name={`yr_${yr}`}
                fill={YEAR_COLORS[yr] || '#64748B'}
                radius={[2, 2, 0, 0]}
                maxBarSize={22}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table for Selected Years */}
      <div className="overflow-x-auto pt-2 border-t border-[#F1F5F9]">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
              <th className="py-2 px-3">Year</th>
              <th className="py-2 px-3 text-right">June (mm)</th>
              <th className="py-2 px-3 text-right">July (mm)</th>
              <th className="py-2 px-3 text-right">August (mm)</th>
              <th className="py-2 px-3 text-right">Sept (mm)</th>
              <th className="py-2 px-3 text-right">Total JJAS</th>
              <th className="py-2 px-3 text-right">LPA Normal</th>
              <th className="py-2 px-3 text-right">Departure %</th>
              <th className="py-2 px-3">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {selectedYears.map((yr) => {
              const s = seasons.find((item) => item.year === yr);
              if (!s) return null;
              const isPositive = (s.departurePercent ?? 0) >= 0;

              return (
                <tr key={yr} className="hover:bg-[#F8FAFC]">
                  <td className="py-2.5 px-3 font-bold text-[#0B1F33] flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: YEAR_COLORS[yr] || '#64748B' }}
                    />
                    {yr}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#475569]">{s.juneMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right text-[#475569]">{s.julyMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right text-[#475569]">{s.augustMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right text-[#475569]">{s.septemberMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#0284C7]">{s.totalSeasonalMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right text-[#64748B]">{s.normalSeasonalMm.toFixed(1)}</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${isPositive ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                    {s.departurePercent !== null ? `${isPositive ? '+' : ''}${s.departurePercent.toFixed(1)}%` : '--'}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#0B1F33]">{s.departureCategory}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default HistoricalMonsoonComparison;
