import React from 'react';
import type { AgroAdvisoryOverview } from '../../types/overview';
import { ExternalLink, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface AgroAdvisoryPreviewListProps {
  advisories: AgroAdvisoryOverview[];
}

export function AgroAdvisoryPreviewList({ advisories }: AgroAdvisoryPreviewListProps) {
  const urgencyBadges = {
    critical: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    high: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    moderate: 'bg-sky-950/60 text-sky-300 border-sky-500/40',
    low: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono">
          Priority field advisories aligned with Odisha University of Agriculture & Technology (OUAT):
        </span>
        <Link
          to="/advisories"
          className="text-[#38BDF8] hover:underline font-semibold flex items-center gap-1 text-[11px]"
        >
          <span>View All Actionable Bulletins</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {advisories.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-[#1E354D] bg-[#0A192F] p-4 shadow-command-panel hover:border-[#10B981]/50 transition-all space-y-2.5 flex flex-col justify-between text-white"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white font-sans">
                    {item.cropName} ({item.localName})
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#0B1F33] text-slate-300 border border-[#1E354D]">
                    {item.category}
                  </span>
                </div>
                <span
                  className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded-xs border font-bold uppercase shrink-0',
                    urgencyBadges[item.urgency]
                  )}
                >
                  {item.urgency}
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#38BDF8] leading-snug font-sans">
                {item.headline}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {item.actionRequired}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1E354D] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Stage: {item.stage}</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Calendar className="w-3 h-3 text-[#38BDF8]" /> Valid: {item.validUntil}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
