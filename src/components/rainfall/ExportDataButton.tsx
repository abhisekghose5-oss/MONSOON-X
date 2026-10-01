import React, { useState } from 'react';
import { Download, FileSpreadsheet, Image as ImageIcon, ChevronDown } from 'lucide-react';
import type { DailyRainfallPoint } from '../../types/rainfall';

export interface ExportDataButtonProps {
  locationName: string;
  startDate: string;
  endDate: string;
  data: DailyRainfallPoint[];
  sourceName?: string;
}

export function ExportDataButton({
  locationName,
  startDate,
  endDate,
  data,
  sourceName = 'IMD 0.25° Gridded Dataset',
}: ExportDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportCSV = () => {
    setIsOpen(false);
    if (!data || data.length === 0) return;

    const headers = [
      'Location',
      'Date',
      'DayOfWeek',
      'ObservedRainfallMm',
      'NormalRainfallMm',
      'AnomalyMm',
      'IMDCategory',
      'QualityFlag',
      'Source',
    ];

    const rows = data.map((d) => [
      `"${locationName}"`,
      d.date,
      d.dayOfWeek,
      d.rainfallMm !== null ? d.rainfallMm.toFixed(1) : '',
      d.normalMm.toFixed(1),
      d.anomalyMm !== null && d.anomalyMm !== undefined ? d.anomalyMm.toFixed(1) : '',
      `"${d.imdCategory}"`,
      d.qualityFlag || 'verified',
      `"${d.source || sourceName}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `koraput_rainfall_${locationName.toLowerCase().replace(/\s+/g, '_')}_${startDate}_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    setIsOpen(false);
    // Print / Save as PDF or Image dialog
    window.print();
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xs border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0B1F33] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <Download className="w-3.5 h-3.5 text-[#0284C7]" />
        <span>Export Data</span>
        <ChevronDown className="w-3 h-3 text-[#64748B]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 rounded-xs bg-white border border-[#CBD5E1] shadow-lg py-1 z-50 text-xs font-mono">
          <button
            onClick={handleExportCSV}
            className="w-full px-3 py-2 text-left text-[#0B1F33] hover:bg-[#F1F5F9] flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#059669]" />
            <div>
              <div className="font-bold">Export CSV</div>
              <div className="text-[10px] text-[#64748B]">Complete daily series & metadata</div>
            </div>
          </button>
          <button
            onClick={handleExportPNG}
            className="w-full px-3 py-2 text-left text-[#0B1F33] hover:bg-[#F1F5F9] flex items-center gap-2 border-t border-[#F1F5F9]"
          >
            <ImageIcon className="w-4 h-4 text-[#0284C7]" />
            <div>
              <div className="font-bold">Print / Save Chart Image</div>
              <div className="text-[10px] text-[#64748B]">High-res printable hyetograph</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
export default ExportDataButton;
