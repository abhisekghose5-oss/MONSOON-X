import React from 'react';
import type { BacktestYearResult } from '../../types/modelPerformance';
import { History, CheckCircle2, Clock } from 'lucide-react';

interface HistoricalBacktestTableProps {
  data: BacktestYearResult[];
  className?: string;
}

export function HistoricalBacktestTable({ data, className = '' }: HistoricalBacktestTableProps) {
  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-md border border-[#1E354D] shadow-command-panel overflow-hidden space-y-0 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#071324] text-[#38BDF8] border border-[#1E354D]">
            <History className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              HISTORICAL BACKTESTING REGISTER (2015–2025 KHARIF SEASONS)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Retrospective hindcast verification over Koraput pilot domain
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#071324] text-[#38BDF8] border border-[#1E354D] font-bold">
          11 Seasons Tracked
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#071324] border-b border-[#1E354D] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
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
          <tbody className="divide-y divide-[#1E354D]/60 font-sans">
            {data.map((row) => {
              const isAwaiting = row.evaluationStatus === 'awaiting';

              return (
                <tr
                  key={row.year}
                  className={`hover:bg-[#0D2038]/60 transition-colors ${
                    isAwaiting ? 'bg-[#071324]/40' : ''
                  }`}
                >
                  {/* Year */}
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    {row.year}
                  </td>

                  {/* Observed Onset */}
                  <td className="py-2.5 px-3 font-medium">
                    {isAwaiting || !row.observedOnsetDate ? (
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/40">
                        Awaiting model evaluation
                      </span>
                    ) : (
                      <span className="text-white font-mono">{row.observedOnsetDate}</span>
                    )}
                  </td>

                  {/* Predicted Onset */}
                  <td className="py-2.5 px-3 font-medium">
                    {isAwaiting || !row.predictedOnsetDate ? (
                      <span className="text-[11px] font-mono text-slate-500">
                        Pending
                      </span>
                    ) : (
                      <span className="text-[#38BDF8] font-mono font-semibold">{row.predictedOnsetDate}</span>
                    )}
                  </td>

                  {/* Error (Days) */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    {isAwaiting || row.onsetDeltaDays === null ? (
                      <span className="text-slate-500">--</span>
                    ) : (
                      <span
                        className={`px-1.5 py-0.5 rounded-xs font-bold ${
                          Math.abs(row.onsetDeltaDays) <= 1
                            ? 'bg-emerald-950/60 text-[#4ADE80] border border-emerald-500/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {row.onsetDeltaDays > 0 ? `+${row.onsetDeltaDays}d` : `${row.onsetDeltaDays}d`}
                      </span>
                    )}
                  </td>

                  {/* Break Spells Observed vs Detected */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    {isAwaiting || row.breakSpellsObserved === null ? (
                      <span className="text-slate-500">--</span>
                    ) : (
                      <span className="font-semibold text-white">
                        {row.breakSpellsDetected} / {row.breakSpellsObserved}
                      </span>
                    )}
                  </td>

                  {/* Heavy Rain Events */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    {isAwaiting || row.heavyRainObserved === null ? (
                      <span className="text-slate-500">--</span>
                    ) : (
                      <span className="font-semibold text-white">
                        {row.heavyRainDetected} / {row.heavyRainObserved}
                      </span>
                    )}
                  </td>

                  {/* Brier Score */}
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-[#4ADE80]">
                    {isAwaiting || row.brierScore === null ? '--' : row.brierScore.toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {isAwaiting ? (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-amber-950/60 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        PENDING
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs bg-emerald-950/60 text-[#4ADE80] border border-emerald-500/40 inline-flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" />
                        VERIFIED
                      </span>
                    )}
                  </td>

                  {/* Diagnostic Notes */}
                  <td className="py-2.5 px-3 text-[11px] text-slate-300 max-w-xs">
                    {row.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-[#071324] border-t border-[#1E354D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <span>
          Cross-validation protocol: Leave-one-year-out (LOO-CV) on 55-year IMD gridded baseline.
        </span>
        <span className="text-[#38BDF8] font-bold">
          Never fabricate metrics · Missing evaluations labeled explicitly
        </span>
      </div>
    </div>
  );
}
export default HistoricalBacktestTable;
