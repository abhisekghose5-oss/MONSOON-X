import React, { useState, useMemo } from 'react';
import type { RiskLayer, ForecastHorizon, PanchayatInfo, RiskMapRecord } from '../types/riskMap';
import { useRiskMapGeoJson, useRiskMapDataQuery, usePanchayats, usePanchayatGeoData } from '../hooks/useRiskMapData';
import { useBlockSelection } from '../hooks/useBlockSelection';
import { KORAPUT_BLOCKS } from '../data/koraputBlocks';
import { DEFAULT_LOCATION, DEFAULT_STATE } from '../data/geo/config';

// Step 4 Reusable Components (Section 21)
import {
  RiskMap,
  RiskLayerSelector,
  ForecastHorizonSelector,
  LocationSearch,
  LocationBreadcrumb,
  RiskDetailPanel,
  PanchayatSelector,
  MobileMapSheet,
  MapDataStatus,
} from '../components/map';

import { Loading } from '../components/common/Loading';
import {
  RotateCcw,
  Info,
  MapPin,
  Compass,
  AlertCircle,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';

export function RiskMapPage() {
  const { selectedBlockId, selectBlock, selectedBlock } = useBlockSelection();

  // 1. Forecast Horizon (Section 3 & 13) — Default: 14D
  const [forecastHorizon, setForecastHorizon] = useState<ForecastHorizon>('14D');

  // 2. Risk Layer (Section 3 & 5) — Default: onset (Onset Probability)
  const [activeLayer, setActiveLayer] = useState<RiskLayer>('onset');

  // 3. Selected Gram Panchayat (Section 3 & 9)
  const [selectedPanchayat, setSelectedPanchayat] = useState<PanchayatInfo | null>(null);

  // 4. Detail Panel Visibility (Desktop / Tablet)
  const [detailPanelOpen, setDetailPanelOpen] = useState<boolean>(true);

  // 5. Mobile Bottom Sheet State (Section 17)
  const [mobileSheetOpen, setMobileSheetOpen] = useState<boolean>(false);

  // React Query: Fetch GeoJSON and Risk Data via Service Architecture (Sections 13, 15)
  const {
    data: geoJson,
    isLoading: isGeoLoading,
    error: geoError,
    refetch: refetchGeo,
  } = useRiskMapGeoJson(forecastHorizon);

  const {
    data: riskData,
    isLoading: isRiskLoading,
    error: riskError,
    refetch: refetchRisk,
  } = useRiskMapDataQuery({
    location: selectedBlockId,
    horizon: forecastHorizon,
    layer: activeLayer,
  });

  const { data: panchayatGeoResult } = usePanchayatGeoData();
  const { data: panchayatsList = [] } = usePanchayats(
    selectedBlockId === 'all' ? undefined : selectedBlockId
  );

  const isPanchayatGeoAvailable = panchayatGeoResult?.isAvailable ?? false;

  // Selected Risk Record: Block record or District record
  const currentRecord: RiskMapRecord | null = useMemo(() => {
    if (!riskData) return null;
    if (selectedBlockId && selectedBlockId !== 'all') {
      return riskData.records[selectedBlockId] || riskData.districtSummary;
    }
    return riskData.districtSummary;
  }, [riskData, selectedBlockId]);

  // Handle Block selection from map, search, or dropdown
  const handleBlockSelect = (blockId: string) => {
    selectBlock(blockId as any);
    setSelectedPanchayat(null);
    setDetailPanelOpen(true);
    // On mobile screens, trigger the bottom sheet
    if (window.innerWidth < 1024) {
      setMobileSheetOpen(true);
    }
  };

  // Handle Panchayat selection
  const handlePanchayatSelect = (panchayat: PanchayatInfo | null) => {
    if (!panchayat) {
      setSelectedPanchayat(null);
      return;
    }
    selectBlock(panchayat.blockId as any);
    setSelectedPanchayat(panchayat);
    setDetailPanelOpen(true);
    if (window.innerWidth < 1024) {
      setMobileSheetOpen(true);
    }
  };

  // Reset to full Koraput District extent
  const handleResetToDistrict = () => {
    selectBlock('all');
    setSelectedPanchayat(null);
  };

  // Initial Loading State
  if (isGeoLoading || isRiskLoading) {
    return (
      <div className="py-24">
        <Loading
          label="INITIALIZING KORAPUT SPATIAL GIS ENGINE..."
          subtext="Loading Survey of India / ORSAC boundary polygons and meteorological ensemble"
        />
      </div>
    );
  }

  // Error State Handling (Section 23)
  if (geoError || !geoJson) {
    return (
      <div className="py-12 px-4 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-rose-500/30 bg-[#0A192F]/90 p-8 shadow-2xl text-center space-y-4 backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-500/40 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase font-mono tracking-tight">
              Geographic dataset not loaded
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Could not ingest Koraput block boundaries from src/data/geo/koraput-blocks.geojson.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetchGeo()}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
          >
            Retry GIS Ingestion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* =========================================================================
          1. COMPACT GIS COMMAND BAR: Horizon, Layer & Navigation
          ========================================================================= */}
      <div className="rounded-lg border border-[#1E354D] bg-[#0A192F] p-3.5 shadow-command-panel space-y-2.5 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1 rounded-xs bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8]">
              <Compass className="w-4 h-4" />
            </span>
            <h1 className="text-sm font-bold font-mono tracking-tight text-white uppercase">
              KORAPUT SPATIAL RISK MAP
            </h1>
            <span className="text-slate-500">•</span>
            {/* Breadcrumb Hierarchy */}
            <LocationBreadcrumb
              stateName={DEFAULT_STATE}
              districtName={DEFAULT_LOCATION}
              blockName={selectedBlock?.name ?? null}
              panchayatName={selectedPanchayat?.name ?? null}
              onSelectDistrict={handleResetToDistrict}
              onSelectBlock={() => setSelectedPanchayat(null)}
            />
          </div>

          {/* Right side: Compact Forecast Horizon (3D, 7D, 14D, 30D) */}
          <ForecastHorizonSelector
            value={forecastHorizon}
            onChange={setForecastHorizon}
          />
        </div>

        {/* Row 2: Block Selectors, Search, Reset, and Risk Layer Tabs */}
        <div className="pt-2 border-t border-[#1E354D] flex flex-col xl:flex-row xl:items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Block Selector */}
            <div className="flex items-center gap-1.5 bg-[#071324] border border-[#1E354D] rounded-xs px-2.5 py-1 text-white">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Block:
              </span>
              <select
                value={selectedBlockId}
                onChange={(e) => handleBlockSelect(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-hidden cursor-pointer"
              >
                <option value="all" className="bg-[#0A192F] text-white">All Blocks (14 Units)</option>
                {KORAPUT_BLOCKS.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#0A192F] text-white">
                    {b.name} ({b.elevationMeters}m MSL)
                  </option>
                ))}
              </select>
            </div>

            {/* Panchayat Selector */}
            <PanchayatSelector
              panchayats={panchayatsList}
              selectedPanchayatId={selectedPanchayat?.id || ''}
              onSelectPanchayat={handlePanchayatSelect}
            />

            {/* Location Search */}
            <LocationSearch
              onSelectBlock={handleBlockSelect}
              onSelectPanchayat={handlePanchayatSelect}
            />

            <button
              type="button"
              onClick={handleResetToDistrict}
              className="px-2.5 py-1 rounded-xs bg-[#071324] hover:bg-[#0B1F33] border border-[#1E354D] text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-2xs shrink-0 cursor-pointer"
              title={`Reset to Full ${DEFAULT_LOCATION} District Extent`}
            >
              <RotateCcw className="w-3 h-3 text-[#38BDF8]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* 5-Layer Risk Layer Selector */}
          <RiskLayerSelector
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
          />
        </div>
      </div>

      {/* =========================================================================
          2. MAIN GIS WORKSPACE (Dominant Leaflet Map + Sleek Detail Panel)
          ========================================================================= */}
      <div className="relative w-full h-[660px] rounded-lg border border-[#1E354D] overflow-hidden flex shadow-command-panel bg-[#060D17]">

        {/* LEAFLET MAP HERO ELEMENT (Occupies most of the screen) */}
        <div className="relative flex-1 h-full min-w-0">
          <RiskMap
            geoJson={geoJson}
            activeLayer={activeLayer}
            forecastHorizon={forecastHorizon}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleBlockSelect}
            selectedPanchayat={selectedPanchayat}
            records={riskData?.records}
            isLoading={isGeoLoading || isRiskLoading}
            isError={!!riskError}
            errorMessage={riskError ? 'Map data unavailable' : undefined}
            onRetry={() => refetchRisk()}
          />

          {/* Desktop/Tablet Panel Toggle Button */}
          <button
            type="button"
            onClick={() => setDetailPanelOpen(!detailPanelOpen)}
            className="hidden lg:flex absolute top-3 right-20 z-[1000] p-1.5 rounded-sm bg-[#0A192F]/90 backdrop-blur-md border border-[#1E354D] text-slate-300 hover:text-white hover:bg-[#0284C7]/20 shadow-command-panel transition-all items-center gap-1.5 text-[11px] font-mono cursor-pointer"
            title={detailPanelOpen ? 'Collapse Detail Panel' : 'Expand Detail Panel'}
          >
            {detailPanelOpen ? <PanelRightClose className="w-4 h-4 text-[#38BDF8]" /> : <PanelRightOpen className="w-4 h-4 text-[#38BDF8]" />}
            <span className="text-[10px] font-bold">{detailPanelOpen ? 'Hide' : 'Inspect'}</span>
          </button>

          {/* Re-open panel quick trigger if closed */}
          {!detailPanelOpen && currentRecord && (
            <button
              type="button"
              onClick={() => setDetailPanelOpen(true)}
              className="hidden lg:flex absolute top-3 right-3 z-[1000] px-3 py-1.5 rounded-sm bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-mono font-bold uppercase shadow-command-panel items-center gap-1.5 transition-all border border-[#38BDF8]/40 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Inspect {currentRecord.locationName}</span>
            </button>
          )}

          {/* Mobile Floating Inspect Trigger */}
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="lg:hidden absolute bottom-3 right-3 z-[1000] px-3 py-2 rounded-sm bg-[#0284C7] text-white text-xs font-mono font-bold uppercase shadow-command-panel flex items-center gap-1.5 border border-[#38BDF8]/40"
          >
            <MapPin className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Details</span>
          </button>
        </div>

        {/* RIGHT DETAIL PANEL (Section 8) — Desktop & Tablet */}
        {detailPanelOpen && currentRecord && (
          <div className="hidden lg:flex h-full shrink-0">
            <RiskDetailPanel
              record={currentRecord}
              panchayats={panchayatsList}
              selectedPanchayat={selectedPanchayat}
              onSelectPanchayat={handlePanchayatSelect}
              onClose={() => setDetailPanelOpen(false)}
              isPanchayatGeoAvailable={isPanchayatGeoAvailable}
            />
          </div>
        )}
      </div>

      {/* =========================================================================
          4. MOBILE BOTTOM SHEET (Section 17)
          ========================================================================= */}
      <MobileMapSheet
        isOpen={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        record={currentRecord}
        panchayats={panchayatsList}
        selectedPanchayat={selectedPanchayat}
        onSelectPanchayat={handlePanchayatSelect}
        isPanchayatGeoAvailable={isPanchayatGeoAvailable}
      />

      {/* =========================================================================
          5. SCIENTIFIC TRANSPARENCY & DATA PROVENANCE (Section 20)
          ========================================================================= */}
      <footer className="p-3 rounded-lg bg-[#0A192F]/85 backdrop-blur-md border border-[#1E354D] shadow-command-panel text-[11px] font-mono text-slate-400 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            <span className="font-bold text-white">Data:</span>
            <span className="text-amber-400 font-semibold">{riskData?.dataStatus || 'DEMO / MODEL OUTPUT'}</span>
          </div>

          <span className="text-[#1E354D]">|</span>

          <div>
            <span className="font-bold text-white">Forecast Horizon:</span>{' '}
            <span className="text-slate-200 font-semibold">{forecastHorizon.replace('D', ' Days')}</span>
          </div>

          <span className="text-[#1E354D]">|</span>

          <div>
            <span className="font-bold text-white">Model:</span>{' '}
            <span className="text-slate-200 font-semibold">{riskData?.modelVersion || 'Demo Forecast Engine'}</span>
          </div>

          <span className="text-[#1E354D]">|</span>

          <div>
            <span className="font-bold text-white">Last Updated:</span>{' '}
            <span className="text-slate-200">{riskData?.lastUpdated || 'Demo timestamp'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold shrink-0">
          <span>Projection: EPSG:4326 (WGS84)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] telemetry-pulse" />
        </div>
      </footer>
    </div>
  );
}

export default RiskMapPage;
