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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-advisory-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-md border border-[#CBD5E1] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-0 animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0B1F33] text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#247A4A] flex items-center justify-center text-white shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 id="generate-advisory-title" className="text-base font-bold font-mono uppercase tracking-wider text-white">
                OFFICIAL AGROMET ADVISORY BULLETIN (GKMS)
              </h3>
              <span className="text-[11px] text-[#A4BCDA] font-mono">
                Department of Agriculture & Farmers' Empowerment · Govt. of Odisha
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xs text-[#A4BCDA] hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#247A4A] focus-visible:outline-hidden"
            aria-label="Close advisory bulletin modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-3 bg-[#F5F7FA] border-b border-[#E2E8F0] flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-[#4B5B6D]">
            Horizon: <strong className="text-[#0B1F33] uppercase">{horizon}</strong> · Format: Official Institutional Dispatch
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xs bg-white hover:bg-slate-100 text-[#0B1F33] text-xs font-mono font-bold transition-all border border-[#CBD5E1] flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#247A4A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY TEXT'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xs bg-white hover:bg-slate-100 text-[#0B1F33] text-xs font-mono font-bold transition-all border border-[#CBD5E1] flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#1479C9]" />
              <span>DOWNLOAD .TXT</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xs bg-[#1479C9] hover:bg-[#0E63A8] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT</span>
            </button>
          </div>
        </div>

        {/* Formatted Official Document Preview */}
        <div className="p-6 bg-white space-y-4">
          <div className="p-5 rounded-xs bg-[#F8FAFC] border-2 border-[#CBD5E1] font-mono text-xs leading-relaxed text-[#16202A] whitespace-pre-wrap select-all">
            {bulletinText}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F7FA] border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#6E7F94]">
            Ready for dissemination via mKisan portal, AIR Jeypore & District Agromet Cell.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xs bg-[#0B1F33] hover:bg-[#142B44] text-white text-xs font-bold font-mono transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
