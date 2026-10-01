import React from 'react';
import { Link } from 'react-router-dom';
import type { OfficerHorizon } from '../../types/officer';
import {
  FileText,
  Download,
  Calendar,
  Sprout,
  Building,
} from 'lucide-react';

interface OfficerToolbarProps {
  horizon: OfficerHorizon;
  onSelectHorizon: (h: OfficerHorizon) => void;
  onOpenAdvisoryModal: () => void;
  onExportCsv: () => void;
  className?: string;
}

export function OfficerToolbar({
  horizon,
  onSelectHorizon,
  onOpenAdvisoryModal,
  onExportCsv,
  className = '',
}: OfficerToolbarProps) {
  const horizons: { id: OfficerHorizon; label: string; days: string }[] = [
    { id: '7d', label: '7 Days', days: 'Immediate Window' },
    { id: '14d', label: '14 Days', days: 'Operational Core' },
    { id: '21d', label: '21 Days', days: 'Extended Range' },
    { id: '30d', label: '30 Days', days: 'Monthly Outlook' },
  ];

  return (
    <div
      className={`bg-[#0B1F33] text-white rounded-md border border-[#1E354D] p-3.5 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${className}`}
    >
      {/* Title & Institutional Identification */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-[#1479C9] flex items-center justify-center text-white shrink-0 shadow-sm border border-[#439EE0]">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base lg:text-lg font-bold tracking-tight text-white uppercase font-mono">
              AGRICULTURE OFFICER OPERATIONS COMMAND
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#247A4A] text-white border border-[#3CA76B]">
              DAO / BAO PORTAL
            </span>
          </div>
          <p className="text-[11px] text-[#A4BCDA] font-mono mt-0.5">
            District Administration & Extension Decision Support · Koraput Pilot Node (SIH26086)
          </p>
        </div>
      </div>

      {/* Horizon Controls & Action Buttons */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Horizon Tabs */}
        <div className="flex items-center bg-[#071523] p-1 rounded-sm border border-[#1E354D]">
          <span className="text-[10px] font-mono text-[#7599C8] uppercase px-2 font-bold hidden sm:inline flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#1479C9]" /> Horizon:
          </span>
          {horizons.map((h) => {
            const isActive = horizon === h.id;
            return (
              <button
                key={h.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectHorizon(h.id)}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs transition-all focus-visible:ring-2 focus-visible:ring-[#439EE0] focus-visible:outline-hidden ${
                  isActive
                    ? 'bg-[#1479C9] text-white shadow-xs'
                    : 'text-[#A4BCDA] hover:text-white hover:bg-[#142B44]'
                }`}
                title={h.days}
              >
                {h.label}
              </button>
            );
          })}
        </div>

        {/* Generate Advisory Button */}
        <button
          type="button"
          onClick={onOpenAdvisoryModal}
          className="px-3.5 py-1.5 rounded-sm bg-[#247A4A] hover:bg-[#1D633C] text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm border border-[#3CA76B] focus-visible:ring-2 focus-visible:ring-[#3CA76B] focus-visible:outline-hidden"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>GENERATE ADVISORY</span>
        </button>

        {/* Export Report CSV Button */}
        <button
          type="button"
          onClick={onExportCsv}
          className="px-3.5 py-1.5 rounded-sm bg-[#142B44] hover:bg-[#1E354D] text-[#D2DEEB] hover:text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 border border-[#1E354D] focus-visible:ring-2 focus-visible:ring-[#439EE0] focus-visible:outline-hidden"
        >
          <Download className="w-3.5 h-3.5 text-[#439EE0]" />
          <span>EXPORT CSV</span>
        </button>

        {/* Switch to Farmer Mode Button */}
        <Link
          to="/farmer"
          className="px-3 py-1.5 rounded-sm bg-[#EDF7F1] text-[#154D2F] hover:bg-[#DDF0E5] text-xs font-bold font-mono transition-all flex items-center gap-1.5 border border-[#ABD7C0] focus-visible:ring-2 focus-visible:ring-[#247A4A] focus-visible:outline-hidden"
          title="Open simplified Farmer Mode"
        >
          <Sprout className="w-3.5 h-3.5 text-[#247A4A]" />
          <span>FARMER MODE</span>
        </Link>
      </div>
    </div>
  );
}
