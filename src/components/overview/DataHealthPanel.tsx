import React from 'react';
import type { DataHealthOverview } from '../../types/overview';
import { StatusBadge } from '../design-system/StatusBadge';
import { Database, RefreshCw, CheckCircle2 } from 'lucide-react';

interface DataHealthPanelProps {
  feeds: DataHealthOverview[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DataHealthPanel({ feeds, onRefresh, isRefreshing }: DataHealthPanelProps) {
  return (
    <div className="rounded-lg border border-[#1E354D] bg-[#0A192F] p-4 sm:p-5 shadow-command-panel space-y-3.5 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E354D] pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Telemetry Ingestion & Model Pipeline Health
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#4ADE80] flex items-center gap-1 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-xs border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" /> 4/4 FEEDS SYNCHRONIZED
          </span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1 rounded-sm hover:bg-[#071324] text-slate-300 border border-[#1E354D] transition-colors cursor-pointer"
              title="Ping All Telemetry Streams"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#38BDF8]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {feeds.map((feed) => (
          <div
            key={feed.sourceName}
            className="p-3 rounded-md bg-[#071324] border border-[#1E354D] space-y-1.5 text-xs font-mono"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-white truncate text-[11px]">
                {feed.sourceName}
              </span>
              <StatusBadge status={feed.status} size="sm" showDot={true} />
            </div>

            <div className="text-[10px] text-slate-400 font-sans truncate">
              {feed.type}
            </div>

            <div className="pt-1.5 border-t border-[#1E354D] flex items-center justify-between text-[10px] text-slate-400">
              <span>Latency: <strong className="text-[#38BDF8]">{feed.latency}</strong></span>
              <span>{feed.lastSyncTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
