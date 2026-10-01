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
        return 'text-[#C43D3D] bg-[#FCEDEC] border-[#EEA9A7]';
      case 'high':
        return 'text-[#D99000] bg-[#FDF7EB] border-[#F4D79C]';
      case 'moderate':
        return 'text-[#1479C9] bg-[#EAF5FC] border-[#B9DCF4]';
      default:
        return 'text-[#247A4A] bg-[#EDF7F1] border-[#ABD7C0]';
    }
  };

  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#EDF7F1] text-[#154D2F]">
            <Sprout className="w-4 h-4 text-[#247A4A]" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
              CROP-WISE VULNERABILITY & EXTENSION ACTIONS
            </h3>
            <span className="text-[11px] text-[#6E7F94] font-mono">
              Kharif season risk matrix across major crops in Koraput District
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#0B1F33] text-white">
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
              className="p-3.5 rounded-md border border-[#E2E8F0] bg-white flex flex-col justify-between space-y-2 hover:border-[#CBD5E1] transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#0B1F33]">
                    {c.cropName}
                  </h4>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs border uppercase ${colorClass}`}
                  >
                    {c.riskLevel}
                  </span>
                </div>

                {/* Acreage info */}
                <div className="mt-1 flex items-center justify-between text-xs text-[#4B5B6D] font-mono">
                  <span>{c.districtAcreageHa.toLocaleString()} ha</span>
                  <span className="text-[#6E7F94]">({c.shareOfKharifPercent}% of district)</span>
                </div>

                {/* Critical Window & Tolerance */}
                <div className="mt-2.5 pt-2 border-t border-[#F0F3F7] space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-[#0B1F33]">
                    <Clock className="w-3.5 h-3.5 text-[#D99000] shrink-0" />
                    <span className="text-[11px] font-medium truncate">{c.criticalWindow}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4B5B6D]">
                    <AlertCircle className="w-3.5 h-3.5 text-[#6E7F94] shrink-0" />
                    <span className="text-[11px]">Dry Tolerance: <strong>{c.drySpellToleranceDays} Days</strong></span>
                  </div>
                </div>

                {/* Vulnerability factors */}
                <div className="mt-2 space-y-0.5 text-[11px] text-[#4B5B6D]">
                  {c.vulnerabilityFactors.map((v, i) => (
                    <div key={i} className="flex items-start gap-1 leading-tight">
                      <span className="text-[#1479C9] font-bold">•</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Directive */}
              <div className="mt-2 pt-2 border-t border-[#F0F3F7] text-[11px] text-[#154D2F] bg-[#EDF7F1]/60 p-2 rounded-xs border border-[#ABD7C0]/50">
                <strong className="block text-[10px] font-mono uppercase text-[#247A4A]">
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
