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
    <div className="rounded-sm border border-[#E2E8F0] bg-white p-4 shadow-gov-card space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F3F7] pb-2.5">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#1479C9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
            Telemetry Ingestion & Model Pipeline Health
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#247A4A] flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 4/4 FEEDS SYNCHRONIZED
          </span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1 rounded hover:bg-[#F5F7FA] text-[#4B5B6D] border border-[#CBD5E1] transition-colors"
              title="Ping All Telemetry Streams"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#1479C9]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {feeds.map((feed) => (
          <div
            key={feed.sourceName}
            className="p-2.5 rounded-sm bg-[#F5F7FA] border border-[#E2E8F0] space-y-1.5 text-xs font-mono"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-[#0B1F33] truncate text-[11px]">
                {feed.sourceName}
              </span>
              <StatusBadge status={feed.status} size="sm" showDot={true} />
            </div>

            <div className="text-[10px] text-[#6E7F94] font-sans truncate">
              {feed.type}
            </div>

            <div className="pt-1 border-t border-[#CBD5E1]/40 flex items-center justify-between text-[10px] text-[#4B5B6D]">
              <span>Latency: <strong className="text-[#1479C9]">{feed.latency}</strong></span>
              <span>{feed.lastSyncTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
