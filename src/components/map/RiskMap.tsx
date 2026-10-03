import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  useMap,
  ZoomControl,
} from 'react-leaflet';
import type { Layer, LeafletMouseEvent } from 'leaflet';
import type {
  KoraputGeoJson,
  RiskLayer,
  PanchayatInfo,
  BasemapType,
  ForecastHorizon,
  RiskMapRecord,
} from '../../types/riskMap';
import { getMetricFillColor } from '../../data/geo/layerConfigs';
import { generateTooltipHtml } from './tooltipUtils';
import { MapLegend } from './MapLegend';
import { MapLayerControl } from './MapLayerControl';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface RiskMapProps {
  geoJson: KoraputGeoJson | null;
  activeLayer: RiskLayer;
  forecastHorizon: ForecastHorizon;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  selectedPanchayat: PanchayatInfo | null;
  records?: Record<string, RiskMapRecord>;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  basemap?: BasemapType;
  onChangeBasemap?: (bm: BasemapType) => void;
  className?: string;
}

const KORAPUT_CENTER: [number, number] = [18.8135, 82.7123];
const DEFAULT_ZOOM = 9;

// Smooth panning/zooming controller
function MapViewController({
  targetCoords,
  targetZoom,
}: {
  targetCoords: [number, number];
  targetZoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(targetCoords, targetZoom, {
      duration: 1.0,
      easeLinearity: 0.25,
    });
  }, [map, targetCoords, targetZoom]);

  return null;
}

export function RiskMap({
  geoJson,
  activeLayer,
  forecastHorizon,
  selectedBlockId,
  onSelectBlock,
  selectedPanchayat,
  records,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  basemap: controlledBasemap,
  onChangeBasemap: controlledOnChangeBasemap,
  className,
}: RiskMapProps) {
  const [internalBasemap, setInternalBasemap] = useState<BasemapType>('positron');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const basemap = controlledBasemap ?? internalBasemap;
  const setBasemap = controlledOnChangeBasemap ?? setInternalBasemap;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Determine current map focal center
  const mapTarget: { coords: [number, number]; zoom: number } = useMemo(() => {
    if (selectedPanchayat) {
      return { coords: selectedPanchayat.coordinates, zoom: 12 };
    }
    if (selectedBlockId && selectedBlockId !== 'all' && geoJson) {
      const feat = geoJson.features.find((f) => f.properties.blockId === selectedBlockId);
      if (feat && feat.geometry.type === 'Polygon') {
        const ring = feat.geometry.coordinates[0];
        const avgLon = ring.reduce((acc, c) => acc + c[0], 0) / ring.length;
        const avgLat = ring.reduce((acc, c) => acc + c[1], 0) / ring.length;
        return { coords: [avgLat, avgLon], zoom: 10 };
      }
    }
    return { coords: KORAPUT_CENTER, zoom: DEFAULT_ZOOM };
  }, [selectedBlockId, selectedPanchayat, geoJson]);

  // Basemap tile URLs
  const basemapUrls: Record<BasemapType, { url: string; attribution: string }> = {
    positron: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, Maxar',
    },
  };

  // Helper to extract active metric value
  const getMetricValue = useCallback(
    (bId: string, props: any): number => {
      const rec = records ? records[bId] : null;
      if (rec) {
        if (activeLayer === 'onset') return rec.onsetProbability;
        if (activeLayer === 'break') return rec.breakProbability;
        if (activeLayer === 'heavyRain') return rec.heavyRainProbability;
        if (activeLayer === 'rainfallAnomaly') return rec.rainfallAnomaly;
      }
      if (activeLayer === 'onset') return props.onsetProbability ?? 70;
      if (activeLayer === 'break') return props.breakProbability ?? 20;
      if (activeLayer === 'heavyRain') return props.heavyRainProbability ?? 45;
      if (activeLayer === 'rainfallAnomaly') return props.rainfallAnomalyPercent ?? 0;
      return 0;
    },
    [activeLayer, records]
  );

  // Polygon style generator
  const getFeatureStyle = useCallback(
    (feature: any) => {
      const bId = feature.properties.blockId;
      const isSelected = selectedBlockId === bId;
      const val = getMetricValue(bId, feature.properties);
      const fillColor = getMetricFillColor(activeLayer, val);

      return {
        fillColor,
        weight: isSelected ? 3.5 : 1.5,
        opacity: 1,
        color: isSelected ? '#38BDF8' : '#334155',
        dashArray: isSelected ? '' : '2',
        fillOpacity: isSelected ? 0.88 : 0.68,
      };
    },
    [selectedBlockId, activeLayer, getMetricValue]
  );

  // Attach tooltips and interactive events
  const onEachFeature = useCallback(
    (feature: any, layer: Layer) => {
      const props = feature.properties;
      const bId = props.blockId;
      const val = getMetricValue(bId, props);

      // Bind rich HTML tooltip complying with Section 7
      const tooltipHtml = generateTooltipHtml({
        locationName: `${props.blockName} Block`,
        layer: activeLayer,
        value: val,
        horizon: forecastHorizon,
        elevationMeters: props.elevationMeters,
      });

      layer.bindTooltip(tooltipHtml, {
        sticky: true,
        className: 'leaflet-custom-tooltip',
      });

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          const target = e.target;
          target.setStyle({
            weight: 3.5,
            color: '#1479C9',
            fillOpacity: 0.9,
          });
        },
        mouseout: (e: LeafletMouseEvent) => {
          const target = e.target;
          const isSelected = selectedBlockId === bId;
          target.setStyle({
            weight: isSelected ? 3.5 : 1.5,
            color: isSelected ? '#0B1F33' : '#4B5B6D',
            fillOpacity: isSelected ? 0.88 : 0.68,
          });
        },
        click: () => {
          onSelectBlock(bId);
        },
      });
    },
    [activeLayer, forecastHorizon, getMetricValue, onSelectBlock, selectedBlockId]
  );

  // Error State Handling (Section 23)
  if (isError) {
    return (
      <div className="relative w-full h-full min-h-[580px] bg-[#F5F7FA] rounded-sm border border-[#CBD5E1] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FCEDEC] border border-[#EEA9A7] flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-[#C43D3D]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#0B1F33]">
            {errorMessage || 'Map data unavailable'}
          </h3>
          <p className="text-xs text-[#6E7F94] font-mono max-w-md">
            The spatial GIS service could not load the administrative boundary dataset.
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-sm bg-[#0B1F33] hover:bg-[#1479C9] text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-gov-card"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry GIS Ingestion</span>
          </button>
        )}
      </div>
    );
  }

  // Boundary data check
  if (!geoJson && !isLoading) {
    return (
      <div className="relative w-full h-full min-h-[580px] bg-[#F5F7FA] rounded-sm border border-[#CBD5E1] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-[#D99000]" />
        <h3 className="text-sm font-bold text-[#0B1F33] uppercase font-mono">
          Geographic dataset not loaded
        </h3>
        <p className="text-xs text-[#6E7F94] font-mono max-w-md">
          GeoJSON boundary definition was not found in the geographic repository.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[580px] bg-[#060D17] overflow-hidden rounded-lg border border-[#1E354D] ${className || ''}`}
    >
      {/* Top Floating Geo Banner */}
      <div className="absolute top-3 left-14 z-[1000] hidden md:flex items-center gap-2 px-3 py-1 rounded-sm bg-[#0B1F33]/90 backdrop-blur-xs text-white font-mono text-[10px] shadow-command-panel border border-[#1E354D] select-none">
        <span className="w-2 h-2 rounded-full bg-[#10B981] telemetry-pulse" />
        <span className="font-bold tracking-wide">KORAPUT GIS PLATFORM</span>
        <span className="text-[#38BDF8]">| 14 ADMINISTRATIVE BLOCKS</span>
      </div>

      {/* Floating Basemap & Extent Controls (Top-Right) */}
      <div className="absolute top-3 right-3 z-[1000]">
        <MapLayerControl
          basemap={basemap}
          onChangeBasemap={setBasemap}
          onLocateKoraput={() => onSelectBlock('all')}
          onResetExtent={() => onSelectBlock('all')}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>

      {/* Floating Bottom Legend (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-[1000] max-w-xs pointer-events-auto">
        <MapLegend activeLayer={activeLayer} />
      </div>

      {/* Leaflet Canvas */}
      {geoJson && (
        <MapContainer
          center={KORAPUT_CENTER}
          zoom={DEFAULT_ZOOM}
          minZoom={7}
          maxZoom={15}
          zoomControl={false}
          className="w-full h-full"
          style={{ height: '100%', minHeight: '580px', background: '#060D17' }}
        >
          <MapViewController targetCoords={mapTarget.coords} targetZoom={mapTarget.zoom} />

          <ZoomControl position="bottomright" />

          <TileLayer
            key={basemap}
            url={basemapUrls[basemap].url}
            attribution={basemapUrls[basemap].attribution}
          />

          <GeoJSON
            key={`${activeLayer}-${forecastHorizon}-${selectedBlockId}`}
            data={geoJson as any}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />

          {/* Selected Panchayat Marker if active */}
          {selectedPanchayat && (
            <CircleMarker
              center={selectedPanchayat.coordinates}
              radius={7}
              pathOptions={{
                fillColor: '#247A4A',
                color: '#FFFFFF',
                weight: 2,
                fillOpacity: 1,
              }}
            >
              <Tooltip permanent={true} direction="top" offset={[0, -8]}>
                <div className="font-mono text-[10px] font-bold text-[#0B1F33]">
                  GP: {selectedPanchayat.name} ({selectedPanchayat.elevationMeters}m)
                </div>
              </Tooltip>
            </CircleMarker>
          )}
        </MapContainer>
      )}
    </div>
  );
}

export default RiskMap;
