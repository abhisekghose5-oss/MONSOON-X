import React, { useState, useEffect } from 'react';
import type { OfficerHorizon } from '../../types/officer';
import { OfficerService } from '../../services/officerService';
import { X, Printer, Copy, Check, Download, FileText } from 'lucide-react';

interface GenerateAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  horizon: OfficerHorizon;
}

export function GenerateAdvisoryModal({ isOpen, onClose, horizon }: GenerateAdvisoryModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bulletinText = OfficerService.generateOfficialBulletin(horizon);

  const handleCopy = () => {
    navigator.clipboard.writeText(bulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([bulletinText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GKMS_AGROMET_BULLETIN_KORAPUT_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-advisory-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0A192F] text-white rounded-lg border border-[#1E354D] shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-0 animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#071324] text-white flex items-center justify-between border-b border-[#1E354D] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-[#4ADE80] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 id="generate-advisory-title" className="text-base font-bold font-mono uppercase tracking-wider text-white">
                OFFICIAL AGROMET ADVISORY BULLETIN (GKMS)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Department of Agriculture & Farmers' Empowerment · Govt. of Odisha
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-hidden cursor-pointer"
            aria-label="Close advisory bulletin modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-3 bg-[#071324]/90 border-b border-[#1E354D] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <span className="text-xs font-mono text-slate-400">
            Horizon: <strong className="text-[#38BDF8] uppercase">{horizon}</strong> · Format: Official Institutional Dispatch
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-sm bg-[#0B1F33] hover:bg-[#0284C7] text-white text-xs font-mono font-bold transition-all border border-[#1E354D] flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5 text-[#38BDF8]" />}
              <span>{copied ? 'COPIED' : 'COPY TEXT'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-sm bg-[#0B1F33] hover:bg-[#0284C7] text-white text-xs font-mono font-bold transition-all border border-[#1E354D] flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>DOWNLOAD .TXT</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-sm bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-xs border border-[#38BDF8]/40 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>
          </div>
        </div>

        {/* Formatted Official Document Preview */}
        <div className="p-5 bg-[#071324]/50 space-y-4">
          <div className="p-4 rounded-lg bg-[#060D17] border border-[#1E354D] font-mono text-xs leading-relaxed text-slate-200 whitespace-pre-wrap select-all shadow-inner">
            {bulletinText}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#071324] border-t border-[#1E354D] flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Ready for dissemination via mKisan portal, AIR Jeypore & District Agromet Cell.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-[#0B1F33] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold font-mono transition-all border border-[#1E354D] cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
