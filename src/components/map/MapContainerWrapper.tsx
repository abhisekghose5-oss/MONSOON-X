import React, { useEffect } from 'react';
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
import type { KoraputGeoJson, RiskMapLayerId, PanchayatInfo, BasemapType } from '../../types/riskMap';
import { getFeatureFillColor } from '../../data/geo/layerConfigs';

interface MapContainerWrapperProps {
  geoJson: KoraputGeoJson;
  activeLayer: RiskMapLayerId;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  selectedPanchayat: PanchayatInfo | null;
  basemap: BasemapType;
}

const KORAPUT_CENTER: [number, number] = [18.8135, 82.7123];
const DEFAULT_ZOOM = 9;

// Controller component to smoothly pan/zoom map on selection
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
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [map, targetCoords, targetZoom]);

  return null;
}

export function MapContainerWrapper({
  geoJson,
  activeLayer,
  selectedBlockId,
  onSelectBlock,
  selectedPanchayat,
  basemap,
}: MapContainerWrapperProps) {
  // Determine current map focal point
  const mapTarget: { coords: [number, number]; zoom: number } = React.useMemo(() => {
    if (selectedPanchayat) {
      return { coords: selectedPanchayat.coordinates, zoom: 12 };
    }
    if (selectedBlockId && selectedBlockId !== 'all') {
      const feat = geoJson.features.find((f) => f.properties.blockId === selectedBlockId);
      if (feat && feat.geometry.type === 'Polygon') {
        const ring = feat.geometry.coordinates[0];
        // Calculate centroid
        const avgLon = ring.reduce((acc, c) => acc + c[0], 0) / ring.length;
        const avgLat = ring.reduce((acc, c) => acc + c[1], 0) / ring.length;
        return { coords: [avgLat, avgLon], zoom: 10 };
      }
    }
    return { coords: KORAPUT_CENTER, zoom: DEFAULT_ZOOM };
  }, [selectedBlockId, selectedPanchayat, geoJson]);

  // Basemap URLs
  const basemapUrls: Record<BasemapType, { url: string; attribution: string }> = {
    positron: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    },
  };

  // Styling function for block polygons
  const getFeatureStyle = (feature: any) => {
    const isSelected = selectedBlockId === feature.properties.blockId;
    const fillColor = getFeatureFillColor(activeLayer, feature.properties);

    return {
      fillColor,
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
      color: isSelected ? '#0B1F33' : '#4B5B6D',
      dashArray: isSelected ? '' : '2',
      fillOpacity: isSelected ? 0.85 : 0.65,
    };
  };

  // Bind interactive click & hover events to block polygons
  const onEachFeature = (feature: any, layer: Layer) => {
    const props = feature.properties;

    // Hover tooltip
    layer.bindTooltip(
      `
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px 6px;">
        <strong style="color: #0B1F33; text-transform: uppercase;">${props.blockName} Block</strong><br/>
        <span style="color: #6E7F94;">Elevation: ${props.elevationMeters}m MSL</span><br/>
        <span style="color: #1479C9; font-weight: bold;">
          ${activeLayer === 'onset' ? `Onset: ${props.onsetProbability}%` : ''}
          ${activeLayer === 'break' ? `Break Risk: ${props.breakProbability}%` : ''}
          ${activeLayer === 'heavyRain' ? `Heavy Rain: ${props.heavyRainProbability}%` : ''}
          ${activeLayer === 'rainfallAnomaly' ? `Departure: +${props.rainfallAnomalyPercent}%` : ''}
        </span>
      </div>
      `,
      { sticky: true, className: 'leaflet-gov-tooltip' }
    );

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle({
          weight: 3,
          color: '#1479C9',
          fillOpacity: 0.85,
        });
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target;
        const isSelected = selectedBlockId === props.blockId;
        target.setStyle({
          weight: isSelected ? 3 : 1.5,
          color: isSelected ? '#0B1F33' : '#4B5B6D',
          fillOpacity: isSelected ? 0.85 : 0.65,
        });
      },
      click: () => {
        onSelectBlock(props.blockId);
      },
    });
  };

  return (
    <div className="relative w-full h-full min-h-[580px] bg-[#F5F7FA] overflow-hidden rounded-sm border border-[#CBD5E1]">
      {/* Survey of India / ORSAC Boundary Banner */}
      <div className="absolute top-2 left-14 z-[1000] hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#0B1F33]/90 text-white font-mono text-[10px] shadow-gov-card border border-[#1E354D] select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#247A4A]" />
        <span>SURVEY OF INDIA / ORSAC • 14 REVENUE BLOCKS BOUNDARY GEOJSON</span>
      </div>

      <MapContainer
        center={KORAPUT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={7}
        maxZoom={15}
        zoomControl={false}
        className="w-full h-full"
        style={{ height: '100%', minHeight: '580px', background: '#EAF0F6' }}
      >
        <MapViewController
          targetCoords={mapTarget.coords}
          targetZoom={mapTarget.zoom}
        />

        {/* Custom Zoom Control in Bottom Right */}
        <ZoomControl position="bottomright" />

        {/* Dynamic Basemap Tile Layer */}
        <TileLayer
          key={basemap}
          url={basemapUrls[basemap].url}
          attribution={basemapUrls[basemap].attribution}
        />

        {/* 14 Block Polygons Choropleth */}
        <GeoJSON
          key={`${activeLayer}-${selectedBlockId}`}
          data={geoJson as any}
          style={getFeatureStyle}
          onEachFeature={onEachFeature}
        />

        {/* Selected Panchayat Marker if applicable */}
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
    </div>
  );
}
