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
    <div className="bg-[#0A192F]/85 backdrop-blur-md border border-[#1E354D] rounded-md p-4 space-y-4 shadow-command-panel">
      {/* Header and Year Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E354D] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#38BDF8]" />
            <h4 className="font-bold font-mono text-sm tracking-tight text-white">
              HISTORICAL MONSOON COMPARISON
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inter-annual comparison of monthly and total seasonal rainfall across verified IMD records (2019–2025).
          </p>
        </div>

        {/* Multi-Year Selection Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-1">Select Years:</span>
          {availableYears.map((yr) => {
            const isSelected = selectedYears.includes(yr);
            const color = YEAR_COLORS[yr] || '#64748B';
            return (
              <button
                key={yr}
                onClick={() => toggleYear(yr)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-xs border transition-colors flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-[#071324] text-white border-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                    : 'bg-[#071324]/50 text-slate-400 border-[#1E354D] hover:bg-[#0D2038] hover:text-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{yr}</span>
                {isSelected && <Check className="w-3 h-3 text-[#38BDF8]" />}
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
            <CartesianGrid strokeDasharray="3 3" stroke="#1E354D" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'monospace', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#1E354D' }}
            />

            <YAxis
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#1E354D' }}
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
              formatter={(value: string) => <span className="text-slate-300">{value.replace('yr_', 'Season ')}</span>}
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
      <div className="overflow-x-auto pt-2 border-t border-[#1E354D]">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#1E354D] text-slate-400 bg-[#071324]">
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
          <tbody className="divide-y divide-[#1E354D]/60">
            {selectedYears.map((yr) => {
              const s = seasons.find((item) => item.year === yr);
              if (!s) return null;
              const isPositive = (s.departurePercent ?? 0) >= 0;

              return (
                <tr key={yr} className="hover:bg-[#0D2038]/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: YEAR_COLORS[yr] || '#64748B' }}
                    />
                    {yr}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{s.juneMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{s.julyMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{s.augustMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{s.septemberMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#38BDF8]">{s.totalSeasonalMm?.toFixed(1) ?? '--'}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{s.normalSeasonalMm.toFixed(1)}</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${isPositive ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
                    {s.departurePercent !== null ? `${isPositive ? '+' : ''}${s.departurePercent.toFixed(1)}%` : '--'}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{s.departureCategory}</td>
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
