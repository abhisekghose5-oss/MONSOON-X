import React from 'react';
import { Layers } from 'lucide-react';
import type { RainfallIntensityBand } from '../../types/rainfall';

export interface RainfallIntensityDistributionProps {
  distribution: RainfallIntensityBand[];
  isLoading?: boolean;
}

export function RainfallIntensityDistribution({
  distribution,
  isLoading = false,
}: RainfallIntensityDistributionProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 animate-pulse h-60" />
    );
  }

  const totalDays = distribution.reduce((sum, d) => sum + d.daysCount, 0);
  const totalRainfall = distribution.reduce((sum, d) => sum + d.totalRainfallMm, 0);

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 space-y-3.5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0284C7]" />
            <h4 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33]">
              RAINFALL INTENSITY DISTRIBUTION
            </h4>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Breakdown of precipitation events by official IMD 24-hr intensity classification.
          </p>
        </div>

        <div className="text-right text-xs font-mono">
          <span className="text-[#64748B]">Total Period: </span>
          <strong className="text-[#0B1F33]">{totalDays} Days</strong> ·{' '}
          <strong className="text-[#0284C7]">{totalRainfall.toFixed(1)} mm</strong>
        </div>
      </div>

      {/* Responsive Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
              <th className="py-2 px-3 font-semibold">IMD Classification</th>
              <th className="py-2 px-3 font-semibold">24h Threshold</th>
              <th className="py-2 px-3 font-semibold text-right">Days Count</th>
              <th className="py-2 px-3 font-semibold text-right">Total Rainfall</th>
              <th className="py-2 px-3 font-semibold text-right">% of Seasonal</th>
              <th className="py-2 px-3 font-semibold">Visual Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {distribution.map((band) => (
              <tr key={band.category} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: band.color }}
                    />
                    <span className="font-bold text-[#0B1F33]">{band.category}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-[#64748B]">
                  {band.maxMm === 0
                    ? '0.0 mm'
                    : band.maxMm === null
                    ? `≥ ${band.minMm} mm`
                    : `${band.minMm} – ${band.maxMm} mm`}
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-[#0B1F33]">
                  {band.daysCount} <span className="text-[10px] text-[#94A3B8]">days</span>
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-[#0284C7]">
                  {band.totalRainfallMm.toFixed(1)} mm
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-[#0B1F33]">
                  {band.percentageOfSeasonalTotal.toFixed(1)}%
                </td>
                <td className="py-2.5 px-3 w-40">
                  <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, band.percentageOfSeasonalTotal))}%`,
                        backgroundColor: band.color,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default RainfallIntensityDistribution;
