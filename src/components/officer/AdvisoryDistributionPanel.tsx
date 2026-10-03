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
    <div className={`bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] shadow-command-panel p-4 space-y-3.5 text-white ${className}`}>
      <div className="flex items-center justify-between border-b border-[#1E354D] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <Send className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              GOVERNMENT ADVISORY DISTRIBUTION & EXTENSION DISPATCH
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Multi-channel dissemination via GKMS, mKisan, and Block Agromet Networks
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerateAdvisory}
          className="px-3 py-1.5 text-xs font-mono font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-sm transition-all shadow-xs border border-[#38BDF8]/40 cursor-pointer"
        >
          VIEW ACTIVE BULLETIN
        </button>
      </div>

      {/* Grid of Distribution Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        {/* Metric 1: SMS Count */}
        <div className="p-3 rounded-lg bg-[#071324]/90 border border-[#1E354D] space-y-1 hover:border-[#0284C7]/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">mKisan SMS</span>
            <Send className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="text-lg font-black font-mono text-white">
            {stats.smsDispatchedCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#4ADE80] font-semibold flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3" /> {stats.smsDeliveredPercent}% Delivered
          </span>
        </div>

        {/* Metric 2: WhatsApp Groups */}
        <div className="p-3 rounded-lg bg-[#071324]/90 border border-[#1E354D] space-y-1 hover:border-[#10B981]/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Agromet Groups</span>
            <MessageSquare className="w-3.5 h-3.5 text-[#4ADE80]" />
          </div>
          <div className="text-lg font-black font-mono text-white">
            {stats.whatsAppAgrometGroups} Groups
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            All 14 Blocks Active
          </span>
        </div>

        {/* Metric 3: KVK Helpline */}
        <div className="p-3 rounded-lg bg-[#071324]/90 border border-[#1E354D] space-y-1 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">KVK Helpline</span>
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-black font-mono text-white">
            {stats.kvkHelplineTickets} Queries
          </div>
          <span className="text-[10px] text-amber-300 font-semibold font-mono">
            Toll-Free + KVK Desk
          </span>
        </div>

        {/* Metric 4: Extension Staff */}
        <div className="p-3 rounded-lg bg-[#071324]/90 border border-[#1E354D] space-y-1 hover:border-[#0284C7]/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Field Officers</span>
            <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="text-lg font-black font-mono text-white">
            {stats.extensionStaffAlerted} BAOs / VAWs
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold font-mono">
            Village Workers Alerted
          </span>
        </div>

        {/* Metric 5: Bulletin ID */}
        <div className="p-3 rounded-lg bg-[#071324]/90 border border-[#1E354D] space-y-1 col-span-2 sm:col-span-1 hover:border-[#0284C7]/50 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase font-bold">Active Bulletin</span>
            <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="text-sm font-black font-mono text-[#38BDF8] truncate" title={stats.biweeklyBulletinNumber}>
            {stats.biweeklyBulletinNumber}
          </div>
          <span className="text-[10px] text-slate-400 block truncate font-mono">
            {stats.issuingAuthority}
          </span>
        </div>
      </div>
    </div>
  );
}
