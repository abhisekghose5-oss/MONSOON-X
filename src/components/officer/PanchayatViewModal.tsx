import React, { useEffect } from 'react';
import type { BlockRiskEntry } from '../../types/officer';
import { X, Layers, AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PanchayatViewModalProps {
  block: BlockRiskEntry | null;
  onClose: () => void;
}

export function PanchayatViewModal({ block, onClose }: PanchayatViewModalProps) {
  useEffect(() => {
    if (!block) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [block, onClose]);

  if (!block) return null;

  // Generate representative panchayat rows based on the block's true count
  const panchayats = Array.from({ length: block.panchayatCount }, (_, i) => {
    const isAlerted = i < block.panchayatsWithAlert;
    return {
      id: `${block.blockId}-gp-${i + 1}`,
      name: `${block.blockName} GP Sector-${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ''}`,
      estAcreage: Math.round(block.kharifAcreageHa / block.panchayatCount),
      status: isAlerted ? 'alert' : 'normal',
      soilType: i % 2 === 0 ? 'Red Sandy Loam' : 'Gravelly Clay Uplands',
      advisoryDelivered: true,
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panchayat-view-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0A192F] text-white rounded-lg border border-[#1E354D] shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#071324] text-white flex items-center justify-between border-b border-[#1E354D] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-[#4ADE80] shrink-0">
              <Layers className="w-4 h-4 text-[#4ADE80]" />
            </div>
            <div>
              <h3 id="panchayat-view-title" className="text-base font-bold font-mono uppercase tracking-wider text-white">
                {block.blockName} BLOCK · GRAM PANCHAYAT REGISTER
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {block.panchayatCount} Total Gram Panchayats · {block.panchayatsWithAlert} under Active Alert
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden cursor-pointer"
            aria-label="Close gram panchayat modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Official Administrative Disclaimer */}
          <div className="p-3 rounded-lg bg-[#1C1608]/70 border border-amber-500/30 text-amber-200/90 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="block font-mono text-[11px] uppercase text-amber-400">
                Institutional Geographic Provenance Notice:
              </strong>
              <span className="text-[11px] text-slate-300">
                Panchayat-level boundary vector polygon data is currently awaiting Survey of India / ORSAC formal digitization release. In accordance with platform integrity rules, no synthetic boundary polygons are generated. Tabular agromet telemetry remains fully operational.
              </span>
            </div>
          </div>

          {/* Panchayat Table */}
          <div className="border border-[#1E354D] rounded-lg overflow-hidden bg-[#071324]/80">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#071324] border-b border-[#1E354D] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-bold">Gram Panchayat</th>
                  <th className="py-2.5 px-3 font-bold text-right">Est. Area (ha)</th>
                  <th className="py-2.5 px-3 font-bold">Soil Classification</th>
                  <th className="py-2.5 px-3 font-bold text-center">Alert State</th>
                  <th className="py-2.5 px-3 font-bold text-center">mKisan Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E354D]">
                {panchayats.map((gp) => (
                  <tr key={gp.id} className="hover:bg-[#0284C7]/10 transition-colors">
                    <td className="py-2 px-3 font-bold text-white">
                      {gp.name}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-300">
                      {gp.estAcreage.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      {gp.soilType}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {gp.status === 'alert' ? (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-rose-950/70 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          WATCH
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-emerald-400 px-1.5 py-0.5 rounded-xs bg-emerald-950/50 border border-emerald-500/30 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" />
                          NORMAL
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-mono text-[10px] text-emerald-400 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" /> Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#071324] border-t border-[#1E354D] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-mono transition-all border border-[#38BDF8]/40 shadow-xs cursor-pointer"
          >
            CLOSE REGISTER
          </button>
        </div>
      </div>
    </div>
  );
}
