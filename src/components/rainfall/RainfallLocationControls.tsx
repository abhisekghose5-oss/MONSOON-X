import React from 'react';
import { MapPin, AlertCircle, ChevronDown } from 'lucide-react';
import { KORAPUT_BLOCKS } from '../../data/koraputBlocks';
import { KORAPUT_PANCHAYATS } from '../../data/geo/panchayats';

export interface RainfallLocationControlsProps {
  selectedLocation: string; // 'all' or blockId
  onLocationChange: (locationId: string) => void;
  selectedPanchayat: string; // 'all' or panchayatId
  onPanchayatChange: (panchayatId: string) => void;
  isBlockDataAvailable: boolean;
}

export function RainfallLocationControls({
  selectedLocation,
  onLocationChange,
  selectedPanchayat,
  onPanchayatChange,
  isBlockDataAvailable,
}: RainfallLocationControlsProps) {
  const currentBlock = KORAPUT_BLOCKS.find((b) => b.id === selectedLocation);
  const isDistrict = selectedLocation === 'all' || selectedLocation === 'koraput-district';

  // Panchayats filtered by active block if block selected
  const availablePanchayats = React.useMemo(() => {
    if (isDistrict) return KORAPUT_PANCHAYATS;
    return KORAPUT_PANCHAYATS.filter((p) => p.blockId === selectedLocation);
  }, [isDistrict, selectedLocation]);

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-sm p-3.5 space-y-3 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Geographic Selectors Group */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0B1F33]">
            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>LOCATION:</span>
          </div>

          {/* 1. District Level */}
          <div className="relative">
            <select
              aria-label="District Selector"
              value="koraput-district"
              disabled
              className="appearance-none bg-[#F8FAFC] border border-[#CBD5E1] text-[#0B1F33] text-xs font-mono font-semibold rounded-xs px-2.5 py-1.5 pr-7 cursor-not-allowed"
            >
              <option value="koraput-district">Koraput District (Odisha)</option>
            </select>
          </div>

          <span className="text-[#94A3B8] font-mono">/</span>

          {/* 2. Block Level */}
          <div className="relative">
            <select
              aria-label="Block Selector"
              value={selectedLocation}
              onChange={(e) => {
                onLocationChange(e.target.value);
                onPanchayatChange('all');
              }}
              className="appearance-none bg-white border border-[#0284C7] text-[#0B1F33] text-xs font-mono font-semibold rounded-xs px-2.5 py-1.5 pr-7 hover:bg-[#F8FAFC] focus:outline-hidden focus:ring-1 focus:ring-[#0284C7] cursor-pointer"
            >
              <option value="all">All Blocks (District Synthesis)</option>
              {KORAPUT_BLOCKS.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name} Block ({block.elevationMeters}m MSL)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <span className="text-[#94A3B8] font-mono">/</span>

          {/* 3. Panchayat Level */}
          <div className="relative">
            <select
              aria-label="Panchayat Selector"
              value={selectedPanchayat}
              onChange={(e) => onPanchayatChange(e.target.value)}
              disabled={selectedLocation === 'all'}
              className={`appearance-none text-xs font-mono rounded-xs px-2.5 py-1.5 pr-7 focus:outline-hidden ${
                selectedLocation === 'all'
                  ? 'bg-[#F1F5F9] border border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                  : 'bg-white border border-[#CBD5E1] text-[#0B1F33] font-semibold hover:bg-[#F8FAFC] cursor-pointer'
              }`}
            >
              <option value="all">All Panchayats</option>
              {availablePanchayats.map((gp) => (
                <option key={gp.id} value={gp.id}>
                  GP: {gp.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Spatial Resolution Badge */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#64748B]">
            Spatial Resolution:
          </span>
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-xs bg-[#F1F5F9] text-[#0B1F33] border border-[#E2E8F0]">
            {isDistrict ? 'District LPA Grid (0.25°)' : 'Sub-district AWS Point'}
          </span>
        </div>
      </div>

      {/* Spatial Data Availability Notice (Section 3) */}
      {!isBlockDataAvailable && !isDistrict && (
        <div className="p-2.5 rounded-xs bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#92400E] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>
              <strong>Data unavailable at this spatial level:</strong> Official calibrated daily rainfall telemetry for {currentBlock?.name || 'this location'} is currently pending release by IMD/ORSAC AWS network.
            </span>
          </div>
          <button
            onClick={() => onLocationChange('all')}
            className="text-[11px] font-bold underline hover:text-[#78350F] ml-3 shrink-0"
          >
            Switch to District Level
          </button>
        </div>
      )}
    </div>
  );
}
export default RainfallLocationControls;
