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
        <div className="rounded-sm border border-[#EEA9A7] bg-white p-6 shadow-gov-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FCEDEC] border border-[#EEA9A7] mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-[#C43D3D]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B1F33]">
              Geographic dataset not loaded
            </h2>
            <p className="text-xs text-[#6E7F94] font-mono mt-1">
              Could not ingest Koraput block boundaries from src/data/geo/koraput-blocks.geojson.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetchGeo()}
            className="px-4 py-2 rounded-sm bg-[#0B1F33] hover:bg-[#1479C9] text-white text-xs font-mono font-bold transition-colors"
          >
            Retry GIS Ingestion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* =========================================================================
          1. HEADER (Section 3)
          ========================================================================= */}
      <header className="rounded-sm border border-[#CBD5E1] bg-white p-3.5 shadow-gov-card flex flex-col md:flex-row md:items-center justify-between gap-3 select-none">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#1479C9]" />
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F33]">
              HYPERLOCAL RISK MAP
            </h1>
            <span className="hidden sm:inline-block">
              <MapDataStatus status={riskData?.dataStatus || 'DEMO MODEL OUTPUT'} size="xs" />
            </span>
          </div>
          <p className="text-xs font-mono text-[#6E7F94] mt-0.5">
            {DEFAULT_LOCATION} District · {DEFAULT_STATE}
          </p>
        </div>

        {/* Right side: Forecast Horizon (7D, 14D, 21D, 30D — Default: 14D) */}
        <ForecastHorizonSelector
          value={forecastHorizon}
          onChange={setForecastHorizon}
        />
      </header>

      {/* =========================================================================
          2. CONTROL BAR (Section 3)
          ========================================================================= */}
      <div className="rounded-sm border border-[#CBD5E1] bg-white p-3 shadow-gov-card space-y-2.5">
        {/* Row 1: Administrative Breadcrumb Hierarchy & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Breadcrumb Hierarchy: Odisha -> Koraput -> Block -> Panchayat */}
          <LocationBreadcrumb
            stateName={DEFAULT_STATE}
            districtName={DEFAULT_LOCATION}
            blockName={selectedBlock?.name ?? null}
            panchayatName={selectedPanchayat?.name ?? null}
            onSelectDistrict={handleResetToDistrict}
            onSelectBlock={() => setSelectedPanchayat(null)}
          />

          {/* Location Autocomplete Search (Driven by geographic data) */}
          <div className="flex items-center gap-2">
            <LocationSearch
              onSelectBlock={handleBlockSelect}
              onSelectPanchayat={handlePanchayatSelect}
            />

            <button
              type="button"
              onClick={handleResetToDistrict}
              className="px-2.5 py-1.5 rounded-sm bg-[#F5F7FA] hover:bg-[#EAF0F6] border border-[#CBD5E1] text-[#0B1F33] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              title={`Reset to Full ${DEFAULT_LOCATION} District Extent`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#1479C9]" />
              <span className="hidden sm:inline">Reset Extent</span>
            </button>
          </div>
        </div>

        {/* Row 2: Cascading Administrative Selectors & Risk Layer Tabs */}
        <div className="pt-2 border-t border-[#F0F3F7] flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs">
          {/* Location / Block / Panchayat Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Fixed Location Pill */}
            <div className="flex items-center gap-1 bg-[#F5F7FA] border border-[#CBD5E1] rounded-sm px-2 py-1 font-mono text-[11px]">
              <span className="text-[#6E7F94] font-bold">Location:</span>
              <span className="text-[#0B1F33] font-bold">{DEFAULT_LOCATION} District</span>
            </div>

            {/* Block Selector */}
            <div className="flex items-center gap-1.5 bg-[#F5F7FA] border border-[#CBD5E1] rounded-sm px-2.5 py-1">
              <span className="text-[10px] font-mono uppercase text-[#6E7F94] font-bold">
                Block:
              </span>
              <select
                value={selectedBlockId}
                onChange={(e) => handleBlockSelect(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#0B1F33] focus:outline-none cursor-pointer"
              >
                <option value="all">All Blocks (14 Administrative Units)</option>
                {KORAPUT_BLOCKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.elevationMeters}m MSL)
                  </option>
                ))}
              </select>
            </div>

            {/* Panchayat Selector (Cascading from selected block) */}
            <PanchayatSelector
              panchayats={panchayatsList}
              selectedPanchayatId={selectedPanchayat?.id || ''}
              onSelectPanchayat={handlePanchayatSelect}
            />

            {/* Missing Panchayat GeoJSON Notification */}
            {!isPanchayatGeoAvailable && (
              <span className="hidden 2xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] text-[10px] font-mono">
                <AlertCircle className="w-3 h-3 text-[#D99000]" />
                <span>Panchayat boundary unavailable</span>
              </span>
            )}
          </div>

          {/* Risk Layer Selector Tabs (Onset, Break, Heavy Rain, Rainfall Anomaly) */}
          <RiskLayerSelector
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
          />
        </div>
      </div>

      {/* =========================================================================
          3. MAIN GIS WORKSPACE (Interactive Map + Detail Panel)
          ========================================================================= */}
      <div className="relative w-full h-[620px] rounded-sm border border-[#CBD5E1] overflow-hidden flex shadow-gov-card bg-[#EAF0F6]">
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
            className="hidden lg:flex absolute top-3 right-20 z-[1000] p-1.5 rounded-sm bg-white/95 border border-[#CBD5E1] text-[#0B1F33] hover:text-[#1479C9] shadow-gov-card transition-colors items-center gap-1 text-[11px] font-mono"
            title={detailPanelOpen ? 'Collapse Detail Panel' : 'Expand Detail Panel'}
          >
            {detailPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <span className="text-[10px] font-bold">{detailPanelOpen ? 'Hide' : 'Inspect'}</span>
          </button>

          {/* Re-open panel quick trigger if closed */}
          {!detailPanelOpen && currentRecord && (
            <button
              type="button"
              onClick={() => setDetailPanelOpen(true)}
              className="hidden lg:flex absolute top-3 right-3 z-[1000] px-3 py-1.5 rounded-sm bg-[#0B1F33] text-white text-xs font-mono font-bold uppercase shadow-gov-elevated items-center gap-1.5 transition-colors hover:bg-[#1479C9]"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Inspect {currentRecord.locationName}</span>
            </button>
          )}

          {/* Mobile Floating Inspect Trigger */}
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="lg:hidden absolute bottom-3 right-3 z-[1000] px-3 py-2 rounded-sm bg-[#0B1F33] text-white text-xs font-mono font-bold uppercase shadow-gov-elevated flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-[#247A4A]" />
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
      <footer className="p-3 rounded-sm bg-white border border-[#CBD5E1] shadow-gov-card text-[11px] font-mono text-[#6E7F94] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#1479C9] shrink-0" />
            <span className="font-bold text-[#0B1F33]">Data:</span>
            <span className="text-[#8C5D00] font-semibold">{riskData?.dataStatus || 'DEMO / MODEL OUTPUT'}</span>
          </div>

          <span className="text-[#CBD5E1]">|</span>

          <div>
            <span className="font-bold text-[#0B1F33]">Forecast Horizon:</span>{' '}
            <span className="text-[#0B1F33] font-semibold">{forecastHorizon.replace('D', ' Days')}</span>
          </div>

          <span className="text-[#CBD5E1]">|</span>

          <div>
            <span className="font-bold text-[#0B1F33]">Model:</span>{' '}
            <span className="text-[#0B1F33] font-semibold">{riskData?.modelVersion || 'Demo Forecast Engine'}</span>
          </div>

          <span className="text-[#CBD5E1]">|</span>

          <div>
            <span className="font-bold text-[#0B1F33]">Last Updated:</span>{' '}
            <span className="text-[#16202A]">{riskData?.lastUpdated || 'Demo timestamp'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#0B1F33] font-bold shrink-0">
          <span>Projection: EPSG:4326 (WGS84)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#247A4A]" />
        </div>
      </footer>
    </div>
  );
}

export default RiskMapPage;
