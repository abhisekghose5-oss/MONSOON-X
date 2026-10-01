import React from 'react';
import { Database, ExternalLink, ShieldCheck } from 'lucide-react';
import { DataStatusBadge } from '../design-system/DataStatusBadge';
import type { DataSource } from '../../types/dataArchitecture';

export interface DataProvenancePanelProps {
  sources: DataSource[];
  isLoading?: boolean;
}

export function DataProvenancePanel({
  sources,
  isLoading = false,
}: DataProvenancePanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 animate-pulse h-48" />
    );
  }

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-4 space-y-3.5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0284C7]" />
            <h4 className="font-bold font-mono text-sm tracking-tight text-[#0B1F33]">
              DATA PROVENANCE
            </h4>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Audit trail, authoritative meteorological agencies, spatial resolution, and archival status.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#059669]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>IMD Climatological Standard Verified</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
              <th className="py-2 px-3 font-semibold">Dataset</th>
              <th className="py-2 px-3 font-semibold">Source Agency</th>
              <th className="py-2 px-3 font-semibold">Period</th>
              <th className="py-2 px-3 font-semibold">Spatial Resolution</th>
              <th className="py-2 px-3 font-semibold">Temporal Resolution</th>
              <th className="py-2 px-3 font-semibold">Last Updated</th>
              <th className="py-2 px-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {sources.map((src) => {
              const isDisconnected = src.qualityStatus === 'MISSING';
              return (
                <tr key={src.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#0B1F33]">
                    <div className="flex items-center gap-1.5">
                      <span>{src.name}</span>
                      {src.sourceUrl && (
                        <a
                          href={src.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0284C7] hover:text-[#0369A1]"
                          title="View Authoritative Source"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[#475569]">{src.source}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">{src.period}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">{src.spatialResolution}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">{src.temporalResolution}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">{src.retrievedAt}</td>
                  <td className="py-2.5 px-3">
                    {isDisconnected ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                        DATA SOURCE NOT CONNECTED
                      </span>
                    ) : (
                      <DataStatusBadge status={src.qualityStatus} size="xs" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default DataProvenancePanel;
