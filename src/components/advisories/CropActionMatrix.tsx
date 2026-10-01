import React, { useState } from 'react';
import { Sprout, Clock } from 'lucide-react';

interface CropActionMatrixProps {
  blockName?: string;
  className?: string;
}

interface CropRowData {
  id: string;
  name: string;
  localName: string;
  stage: string;
  hydrometTrigger: string;
  directive: string;
  timing: string;
  urgency: 'URGENT (24H)' | 'PRECAUTIONARY (48H)' | 'ROUTINE';
  urgencyColor: string;
  confidence: number;
}

export function CropActionMatrix({
  blockName = 'Koraput District',
  className = '',
}: CropActionMatrixProps) {
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const rows: CropRowData[] = [
    {
      id: 'paddy',
      name: 'Paddy',
      localName: 'Dhan',
      stage: 'Active Tillering & Panicle Initiation',
      hydrometTrigger: 'Heavy rain surge (44% prob, 45-70mm) & ponding risk',
      directive: 'Open field bund drainage channels to cap standing water at 5 cm. Postpone nitrogen (urea) top-dressing and bio-pesticides until 04 October.',
      timing: 'Immediately within next 24-48 hours',
      urgency: 'URGENT (24H)',
      urgencyColor: 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]',
      confidence: 86,
    },
    {
      id: 'maize',
      name: 'Maize',
      localName: 'Makka',
      stage: 'Tasseling & Early Silking',
      hydrometTrigger: 'Root-zone waterlogging hazard (Tolerance: Very Low)',
      directive: 'Dig 20-25 cm deep drainage furrows between paired rows. Earth-up stalk bases to resist convective squalls. Scout for Fall Armyworm.',
      timing: 'Today before rain intensification',
      urgency: 'URGENT (24H)',
      urgencyColor: 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]',
      confidence: 84,
    },
    {
      id: 'ragi',
      name: 'Finger Millet',
      localName: 'Mandia',
      stage: 'Vegetative Tillering (Upland Terraces)',
      hydrometTrigger: 'Favorable moisture (Drought tolerance: Very High)',
      directive: 'Maintain contour bunds for slow water percolation. Perform manual weeding with cycle hoe. Thin late direct-seeded plots to 25x10 cm spacing.',
      timing: 'During clear weather window (04-06 Oct)',
      urgency: 'ROUTINE',
      urgencyColor: 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]',
      confidence: 88,
    },
    {
      id: 'groundnut',
      name: 'Groundnut',
      localName: 'Badam / Chinabadam',
      stage: 'Pegging & Early Pod Setting',
      hydrometTrigger: 'Excess soil moisture at pegging (Collar rot risk)',
      directive: 'Provide broad-bed and furrow (BBF) drainage to prevent standing water in pod zone. Avoid cultivation while soil is wet. Apply Trichoderma viride.',
      timing: 'Drainage within 24h; intercultural operations delayed',
      urgency: 'PRECAUTIONARY (48H)',
      urgencyColor: 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]',
      confidence: 82,
    },
    {
      id: 'pulses',
      name: 'Pulses (Arhar / Biri)',
      localName: 'Kandula / Biri',
      stage: 'Branching & Vegetative Growth',
      hydrometTrigger: 'Root asphyxiation risk from water stagnation > 12h',
      directive: 'Excavate temporary drainage ditches every 10-12 rows. Drench root collars with Metalaxyl + Mancozeb (2 g/L) if initial wilting occurs.',
      timing: 'Within 12-36 hours prior to heavy showers',
      urgency: 'URGENT (24H)',
      urgencyColor: 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]',
      confidence: 85,
    },
    {
      id: 'cotton',
      name: 'Cotton',
      localName: 'Kapa',
      stage: 'Square Formation & Early Flowering',
      hydrometTrigger: 'Convective squalls & square shedding under high humidity',
      directive: 'Clear furrow drainage between ridges. Spray Streptocycline (1 g/10 L) + Copper oxychloride (25 g/10 L) during rain break against bacterial leaf blight.',
      timing: 'Drainage within 24h; chemical spray post 04 Oct',
      urgency: 'PRECAUTIONARY (48H)',
      urgencyColor: 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]',
      confidence: 80,
    },
    {
      id: 'vegetables',
      name: 'Vegetables',
      localName: 'Pana Pariba (Tomato/Chilli)',
      stage: 'Fruiting & Nursery Extension',
      hydrometTrigger: 'Damping-off & fruit splitting under continuous saturation',
      directive: 'Maintain 15-20 cm raised nursery beds. Stake tomato and chilli vines off wet soil. Harvest mature vegetables immediately before 01 October.',
      timing: 'Harvest harvestable produce today; stake within 24h',
      urgency: 'URGENT (24H)',
      urgencyColor: 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]',
      confidence: 87,
    },
  ];

  const filteredRows = rows.filter((r) => {
    if (selectedCrop !== 'all' && r.id !== selectedCrop) return false;
    if (selectedUrgency !== 'all' && !r.urgency.toLowerCase().includes(selectedUrgency.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden space-y-0 ${className}`}>
      {/* Table Header & Filter Row */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#247A4A]" />
              BLOCK-WISE MULTI-CROP AGRONOMIC ACTION MATRIX
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#0B1F33] text-white">
              OUAT / KVK KORAPUT
            </span>
          </div>
          <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
            Prescriptive farm-level operational directives conditioned on downscaled soil moisture and rainfall intensity for {blockName}.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Crop Filter */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-2 py-1 rounded-xs border border-[#CBD5E1] bg-white text-[#0B1F33] text-xs font-mono focus:outline-hidden focus:border-[#1479C9]"
          >
            <option value="all">All Crops (7)</option>
            <option value="paddy">Paddy (Dhan)</option>
            <option value="maize">Maize (Makka)</option>
            <option value="ragi">Finger Millet (Mandia)</option>
            <option value="groundnut">Groundnut</option>
            <option value="pulses">Pulses</option>
            <option value="cotton">Cotton</option>
            <option value="vegetables">Vegetables</option>
          </select>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#6E7F94] uppercase font-bold mr-1">Urgency:</span>
            {['all', 'urgent', 'precautionary', 'routine'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setSelectedUrgency(u)}
                className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-xs transition-all uppercase ${
                  selectedUrgency === u
                    ? 'bg-[#0B1F33] text-white'
                    : 'bg-white text-[#4B5B6D] border border-[#CBD5E1] hover:bg-slate-50'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Tabular Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F0F4F8] border-b border-[#CBD5E1] text-[#0B1F33] font-mono text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 font-bold">Crop & Phenology</th>
              <th className="py-2.5 px-3 font-bold">Hydromet Weather Trigger</th>
              <th className="py-2.5 px-3 font-bold">Prescriptive Field Directive</th>
              <th className="py-2.5 px-3 font-bold">Execution Timing</th>
              <th className="py-2.5 px-3 font-bold text-center">Urgency</th>
              <th className="py-2.5 px-3 font-bold text-center">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-sans">
            {filteredRows.map((r) => (
              <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                {/* Crop & Phenology */}
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="font-bold text-[#0B1F33] text-xs">
                    {r.name} <span className="text-[#6E7F94] font-normal font-mono">({r.localName})</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#247A4A] block mt-0.5 font-medium">
                    {r.stage}
                  </span>
                </td>

                {/* Weather Trigger */}
                <td className="py-2.5 px-3 max-w-[200px]">
                  <span className="text-xs text-[#334155] leading-snug block font-mono">
                    {r.hydrometTrigger}
                  </span>
                </td>

                {/* Directive */}
                <td className="py-2.5 px-3 min-w-[280px]">
                  <p className="text-xs text-[#0B1F33] leading-relaxed">
                    {r.directive}
                  </p>
                </td>

                {/* Timing */}
                <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-[#4B5B6D]">
                  <div className="flex items-center gap-1 text-[#D99000] font-semibold">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{r.timing}</span>
                  </div>
                </td>

                {/* Urgency Badge */}
                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs border uppercase ${r.urgencyColor}`}>
                    {r.urgency}
                  </span>
                </td>

                {/* Confidence */}
                <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono text-[11px] font-bold text-[#247A4A]">
                  {r.confidence}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#F5F7FA] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#6E7F94]">
        <span>Showing {filteredRows.length} Crop Directives for {blockName}</span>
        <span className="text-[#0B1F33] font-bold">
          Calibrated to ICAR-CRIDA Crop Contingency Guidelines
        </span>
      </div>
    </div>
  );
}
