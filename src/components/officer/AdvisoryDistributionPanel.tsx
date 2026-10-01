import React from 'react';
import type { AdvisoryDistributionStats } from '../../types/officer';
import { Send, PhoneCall, Users, CheckCircle2, MessageSquare, Building2 } from 'lucide-react';

interface AdvisoryDistributionPanelProps {
  stats: AdvisoryDistributionStats;
  onGenerateAdvisory: () => void;
  className?: string;
}

export function AdvisoryDistributionPanel({
  stats,
  onGenerateAdvisory,
  className = '',
}: AdvisoryDistributionPanelProps) {
  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#EDF7F1] text-[#154D2F]">
            <Send className="w-4 h-4 text-[#247A4A]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
              GOVERNMENT ADVISORY DISTRIBUTION & EXTENSION DISPATCH
            </h3>
            <span className="text-[11px] text-[#6E7F94] font-mono">
              Multi-channel dissemination via GKMS, mKisan, and Block Agromet Networks
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerateAdvisory}
          className="px-3 py-1 text-xs font-mono font-bold bg-[#1479C9] hover:bg-[#0E63A8] text-white rounded-xs transition-all shadow-xs"
        >
          VIEW ACTIVE BULLETIN
        </button>
      </div>

      {/* Grid of Distribution Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        {/* Metric 1: SMS Count */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono uppercase font-bold">mKisan SMS</span>
            <Send className="w-3.5 h-3.5 text-[#1479C9]" />
          </div>
          <div className="text-lg font-black font-mono text-[#0B1F33]">
            {stats.smsDispatchedCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#247A4A] font-semibold flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> {stats.smsDeliveredPercent}% Delivered
          </span>
        </div>

        {/* Metric 2: WhatsApp Groups */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono uppercase font-bold">Agromet Groups</span>
            <MessageSquare className="w-3.5 h-3.5 text-[#247A4A]" />
          </div>
          <div className="text-lg font-black font-mono text-[#0B1F33]">
            {stats.whatsAppAgrometGroups} Groups
          </div>
          <span className="text-[10px] text-[#4B5B6D]">
            All 14 Blocks Active
          </span>
        </div>

        {/* Metric 3: KVK Helpline */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono uppercase font-bold">KVK Helpline</span>
            <PhoneCall className="w-3.5 h-3.5 text-[#D99000]" />
          </div>
          <div className="text-lg font-black font-mono text-[#0B1F33]">
            {stats.kvkHelplineTickets} Queries
          </div>
          <span className="text-[10px] text-[#8C5D00] font-semibold">
            Toll-Free + KVK Desk
          </span>
        </div>

        {/* Metric 4: Extension Staff */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono uppercase font-bold">Field Officers</span>
            <Users className="w-3.5 h-3.5 text-[#1479C9]" />
          </div>
          <div className="text-lg font-black font-mono text-[#0B1F33]">
            {stats.extensionStaffAlerted} BAOs / VAWs
          </div>
          <span className="text-[10px] text-[#154D2F] font-semibold">
            Village Workers Alerted
          </span>
        </div>

        {/* Metric 5: Bulletin ID */}
        <div className="p-3 rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#6E7F94]">
            <span className="text-[10px] font-mono uppercase font-bold">Active Bulletin</span>
            <Building2 className="w-3.5 h-3.5 text-[#0B1F33]" />
          </div>
          <div className="text-sm font-black font-mono text-[#0B1F33] truncate" title={stats.biweeklyBulletinNumber}>
            {stats.biweeklyBulletinNumber}
          </div>
          <span className="text-[10px] text-[#6E7F94] block truncate">
            {stats.issuingAuthority}
          </span>
        </div>
      </div>
    </div>
  );
}
