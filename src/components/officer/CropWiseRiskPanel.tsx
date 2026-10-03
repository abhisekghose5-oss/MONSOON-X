import React from 'react';
import type { CropRiskSummary } from '../../types/officer';
import { Sprout, AlertCircle, Clock } from 'lucide-react';

interface CropWiseRiskPanelProps {
  crops: CropRiskSummary[];
  className?: string;
}

export function CropWiseRiskPanel({ crops, className = '' }: CropWiseRiskPanelProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-rose-300 bg-rose-950/70 border-rose-500/50';
      case 'high':
        return 'text-amber-300 bg-amber-950/70 border-amber-500/50';
      case 'moderate':
        return 'text-[#38BDF8] bg-[#0284C7]/20 border-[#0284C7]/40';
      default:
        return 'text-emerald-300 bg-emerald-950/70 border-emerald-500/50';
    }
  };

  return (
    <div className={`bg-[#0A192F]/85 backdrop-blur-md rounded-lg border border-[#1E354D] shadow-command-panel p-4 space-y-3.5 text-white ${className}`}>
      <div className="flex items-center justify-between border-b border-[#1E354D] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <Sprout className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              CROP-WISE VULNERABILITY & EXTENSION ACTIONS
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Kharif season risk matrix across major crops in Koraput District
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40">
          7 CROPS MONITORED
        </span>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {crops.map((c) => {
          const colorClass = getRiskColor(c.riskLevel);
          return (
            <div
              key={c.cropKey}
              className="p-3.5 rounded-lg border border-[#1E354D] bg-[#071324]/90 flex flex-col justify-between space-y-2 hover:border-[#0284C7]/50 hover:shadow-[0_0_15px_rgba(2,132,199,0.15)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">
                    {c.cropName}
                  </h4>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs border uppercase ${colorClass}`}
                  >
                    {c.riskLevel}
                  </span>
                </div>

                {/* Acreage info */}
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="text-slate-200 font-semibold">{c.districtAcreageHa.toLocaleString()} ha</span>
                  <span className="text-slate-500">({c.shareOfKharifPercent}% of district)</span>
                </div>

                {/* Critical Window & Tolerance */}
                <div className="mt-2.5 pt-2 border-t border-[#1E354D] space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-medium truncate">{c.criticalWindow}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-[11px]">Dry Tolerance: <strong className="text-white font-mono">{c.drySpellToleranceDays} Days</strong></span>
                  </div>
                </div>

                {/* Vulnerability factors */}
                <div className="mt-2 space-y-0.5 text-[11px] text-slate-400">
                  {c.vulnerabilityFactors.map((v, i) => (
                    <div key={i} className="flex items-start gap-1 leading-tight">
                      <span className="text-[#38BDF8] font-bold">•</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Directive */}
              <div className="mt-2 pt-2 border-t border-[#1E354D] text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-xs border border-emerald-500/30">
                <strong className="block text-[10px] font-mono uppercase text-[#4ADE80]">
                  Extension Directive:
                </strong>
                {c.actionDirective}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
