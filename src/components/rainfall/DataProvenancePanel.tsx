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
      <div className="bg-[#0A192F]/85 border border-[#1E354D] rounded-md p-4 animate-pulse h-48" />
    );
  }

  return (
    <div className="bg-[#0A192F]/85 backdrop-blur-md border border-[#1E354D] rounded-md p-4 space-y-3.5 shadow-command-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E354D] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#38BDF8]" />
            <h4 className="font-bold font-mono text-sm tracking-tight text-white">
              DATA PROVENANCE
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail, authoritative meteorological agencies, spatial resolution, and archival status.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#4ADE80]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>IMD Climatological Standard Verified</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#1E354D] text-slate-400 bg-[#071324]">
              <th className="py-2 px-3 font-semibold">Dataset</th>
              <th className="py-2 px-3 font-semibold">Source Agency</th>
              <th className="py-2 px-3 font-semibold">Period</th>
              <th className="py-2 px-3 font-semibold">Spatial Resolution</th>
              <th className="py-2 px-3 font-semibold">Temporal Resolution</th>
              <th className="py-2 px-3 font-semibold">Last Updated</th>
              <th className="py-2 px-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E354D]/60">
            {sources.map((src) => {
              const isDisconnected = src.qualityStatus === 'MISSING';
              return (
                <tr key={src.id} className="hover:bg-[#0D2038]/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{src.name}</span>
                      {src.sourceUrl && (
                        <a
                          href={src.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#38BDF8] hover:text-[#7DD3FC]"
                          title="View Authoritative Source"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{src.source}</td>
                  <td className="py-2.5 px-3 text-slate-400">{src.period}</td>
                  <td className="py-2.5 px-3 text-slate-400">{src.spatialResolution}</td>
                  <td className="py-2.5 px-3 text-slate-400">{src.temporalResolution}</td>
                  <td className="py-2.5 px-3 text-slate-400">{src.retrievedAt}</td>
                  <td className="py-2.5 px-3">
                    {isDisconnected ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs bg-rose-950/60 text-rose-400 border border-rose-500/40">
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
