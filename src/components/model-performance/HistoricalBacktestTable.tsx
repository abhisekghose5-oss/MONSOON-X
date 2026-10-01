import React from 'react';
import type { BacktestYearResult } from '../../types/modelPerformance';
import { History, CheckCircle2, Clock } from 'lucide-react';

interface HistoricalBacktestTableProps {
  data: BacktestYearResult[];
  className?: string;
}

export function HistoricalBacktestTable({ data, className = '' }: HistoricalBacktestTableProps) {
  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden space-y-0 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#EAF0F6] text-[#1479C9]">
            <History className="w-4 h-4 text-[#1479C9]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
              HISTORICAL BACKTESTING REGISTER (2015–2025 KHARIF SEASONS)
            </h3>
            <span className="text-[11px] text-[#6E7F94] font-mono">
              Retrospective hindcast verification over Koraput pilot domain
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white">
          11 Seasons Tracked
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F0F4F8] border-b border-[#CBD5E1] text-[#0B1F33] font-mono text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 font-bold">Kharif Season</th>
              <th className="py-2.5 px-3 font-bold">Observed Onset</th>
              <th className="py-2.5 px-3 font-bold">Predicted Onset</th>
              <th className="py-2.5 px-3 font-bold text-center">Error (Days)</th>
              <th className="py-2.5 px-3 font-bold text-center">Break Spells</th>
              <th className="py-2.5 px-3 font-bold text-center">Heavy Rain</th>
              <th className="py-2.5 px-3 font-bold text-center">Brier Score</th>
              <th className="py-2.5 px-3 font-bold text-center">Status</th>
              <th className="py-2.5 px-3 font-bold">Synoptic Diagnostic Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-sans">
            {data.map((row) => {
              const isAwaiting = row.evaluationStatus === 'awaiting';

              return (
                <tr
                  key={row.year}
                  className={`hover:bg-[#F8FAFC] transition-colors ${
                    isAwaiting ? 'bg-[#FFFDF7]' : ''
                  }`}
                >
                  {/* Year */}
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0B1F33]">
                    {row.year}
                  </td>

                  {/* Observed Onset */}
                  <td className="py-2.5 px-3 font-medium">
                    {isAwaiting || !row.observedOnsetDate ? (
                      <span className="text-[11px] font-mono font-bold text-[#D99000] bg-[#FDF7EB] px-2 py-0.5 rounded border border-[#F4D79C]">
                        Awaiting model evaluation
                      </span>
                    ) : (
                      <span className="text-[#0B1F33] font-mono">{row.observedOnsetDate}</span>
                    )}
                  </td>

                  {/* Predicted Onset */}
                  <td className="py-2.5 px-3 font-medium">
                    {isAwaiting || !row.predictedOnsetDate ? (
                      <span className="text-[11px] font-mono text-[#6E7F94]">
                        Pending
                      </span>
                    ) : (
                      <span className="text-[#1479C9] font-mono font-semibold">{row.predictedOnsetDate}</span>
                    )}
                  </td>

                  {/* Error (Days) */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    {isAwaiting || row.onsetDeltaDays === null ? (
                      <span className="text-[#6E7F94]">--</span>
                    ) : (
                      <span
                        className={`px-1.5 py-0.5 rounded-xs font-bold ${
                          Math.abs(row.onsetDeltaDays) <= 1
                            ? 'bg-[#EDF7F1] text-[#154D2F]'
                            : 'bg-[#FDF7EB] text-[#8C5D00]'
                        }`}
                      >
                        {row.onsetDeltaDays > 0 ? `+${row.onsetDeltaDays}d` : `${row.onsetDeltaDays}d`}
                      </span>
                    )}
                  </td>

                  {/* Break Spells Observed vs Detected */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    {isAwaiting || row.breakSpellsObserved === null ? (
                      <span className="text-[#6E7F94]">--</span>
                    ) : (
                      <span className="font-semibold text-[#0B1F33]">
                        {row.breakSpellsDetected} / {row.breakSpellsObserved}
                      </span>
                    )}
                  </td>

                  {/* Heavy Rain Events */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    {isAwaiting || row.heavyRainObserved === null ? (
                      <span className="text-[#6E7F94]">--</span>
                    ) : (
                      <span className="font-semibold text-[#0B1F33]">
                        {row.heavyRainDetected} / {row.heavyRainObserved}
                      </span>
                    )}
                  </td>

                  {/* Brier Score */}
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-[#247A4A]">
                    {isAwaiting || row.brierScore === null ? '--' : row.brierScore.toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {isAwaiting ? (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D99000]" />
                        PENDING
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#247A4A]" />
                        VERIFIED
                      </span>
                    )}
                  </td>

                  {/* Diagnostic Notes */}
                  <td className="py-2.5 px-3 text-[11px] text-[#4B5B6D] max-w-xs">
                    {row.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-[#F5F7FA] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#6E7F94]">
        <span>
          Cross-validation protocol: Leave-one-year-out (LOO-CV) on 55-year IMD gridded baseline.
        </span>
        <span className="text-[#0B1F33]">
          Never fabricate metrics · Missing evaluations labeled explicitly
        </span>
      </div>
    </div>
  );
}
