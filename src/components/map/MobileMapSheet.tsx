import React from 'react';
import type { RiskMapRecord, PanchayatInfo } from '../../types/riskMap';
import { RiskDetailPanel } from './RiskDetailPanel';
import { X } from 'lucide-react';

interface MobileMapSheetProps {
  isOpen: boolean;
  onClose: () => void;
  record: RiskMapRecord | null;
  panchayats?: PanchayatInfo[];
  selectedPanchayat?: PanchayatInfo | null;
  onSelectPanchayat?: (panchayat: PanchayatInfo | null) => void;
  isPanchayatGeoAvailable?: boolean;
}

export function MobileMapSheet({
  isOpen,
  onClose,
  record,
  panchayats = [],
  selectedPanchayat,
  onSelectPanchayat,
  isPanchayatGeoAvailable = false,
}: MobileMapSheetProps) {
  if (!isOpen || !record) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Location Details Bottom Sheet"
      className="fixed inset-0 z-[2000] lg:hidden flex flex-col justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div className="relative bg-[#0A192F] rounded-t-xl max-h-[85vh] h-[540px] flex flex-col shadow-2xl border-t border-[#1E354D] overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Drag handle & Mobile Close */}
        <div className="bg-[#0B1F33] pt-2 pb-1 px-4 flex items-center justify-between border-b border-[#1E354D]">
          <div className="w-10 h-1 bg-[#4B5B6D] rounded-full mx-auto" />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-sm text-[#A4BCDA] hover:text-white"
            title="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Embedded RiskDetailPanel */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <RiskDetailPanel
            record={record}
            panchayats={panchayats}
            selectedPanchayat={selectedPanchayat}
            onSelectPanchayat={onSelectPanchayat}
            onClose={onClose}
            isPanchayatGeoAvailable={isPanchayatGeoAvailable}
            className="w-full border-l-0 shadow-none h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default MobileMapSheet;
