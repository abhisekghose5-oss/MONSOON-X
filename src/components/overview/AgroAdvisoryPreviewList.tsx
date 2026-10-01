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
    critical: 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]',
    high: 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]',
    moderate: 'bg-[#EDF6FC] text-[#0C4E83] border-[#ACD5F2]',
    low: 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#6E7F94] font-mono">
          Priority field advisories aligned with Odisha University of Agriculture & Technology (OUAT):
        </span>
        <Link
          to="/advisories"
          className="text-[#1479C9] hover:underline font-semibold flex items-center gap-1 text-[11px]"
        >
          <span>View All Actionable Bulletins</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {advisories.map((item) => (
          <div
            key={item.id}
            className="rounded-sm border border-[#E2E8F0] bg-white p-3.5 shadow-gov-card space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#0B1F33]">
                    {item.cropName} ({item.localName})
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#F0F3F7] text-[#4B5B6D] border border-[#CBD5E1]">
                    {item.category}
                  </span>
                </div>
                <span
                  className={cn(
                    'text-[10px] font-mono px-2 py-0.2 rounded-xs border font-bold uppercase shrink-0',
                    urgencyBadges[item.urgency]
                  )}
                >
                  {item.urgency}
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#16202A] leading-snug">
                {item.headline}
              </h4>

              <p className="text-xs text-[#4B5B6D] leading-relaxed">
                {item.actionRequired}
              </p>
            </div>

            <div className="pt-2 border-t border-[#F0F3F7] flex items-center justify-between text-[10px] font-mono text-[#6E7F94]">
              <span>Stage: {item.stage}</span>
              <span className="flex items-center gap-1 text-[#0B1F33]">
                <Calendar className="w-3 h-3 text-[#1479C9]" /> Valid: {item.validUntil}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
