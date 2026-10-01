/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Static Data Provider (Step 5 - Section 10)
 * 
 * Default production provider delivering verified bundled datasets
 * for Koraput District, Odisha without external runtime latency.
 */

import type { DataProvider } from './DataProvider';
import type {
  DistrictFeatureCollection,
  BlockFeatureCollection,
  PanchayatFeatureCollection,
} from '../../types/geography';
import type {
  RainfallNormal,
  RainfallRecord,
  ClimateIndex,
  DataSource,
} from '../../types/dataArchitecture';

// GeoJSON Bundled Imports
import districtGeoJsonRaw from '../../data/geo/koraput-district.geojson';
import blocksGeoJsonRaw from '../../data/geo/koraput-blocks.geojson';
import panchayatsGeoJsonRaw from '../../data/geo/koraput-panchayats.geojson';

// Rainfall Datasets
import { getNormalsForLocation } from '../../data/koraput/rainfallNormals';
import {
  HISTORICAL_DAILY_RECORDS,
  HISTORICAL_MONTHLY_RECORDS,
  HISTORICAL_SEASONAL_RECORDS,
} from '../../data/koraput/historicalRainfall';

// Climate Datasets
import { ENSO_DATA } from '../../data/climate/enso';
import { IOD_DATA } from '../../data/climate/iod';
import { MJO_DATA } from '../../data/climate/mjo';

export class StaticDataProvider implements DataProvider {
  public readonly id = 'static-provider';
  public readonly name = 'Static / Bundled Data Provider';
  public readonly type = 'static' as const;

  async getDistrictGeoJson(): Promise<DistrictFeatureCollection | null> {
    try {
      const response = await fetch('/data/geo/koraput-district.geojson');
      if (response.ok) {
        return (await response.json()) as DistrictFeatureCollection;
      }
    } catch {
      // Fall through to bundled asset
    }
    if (districtGeoJsonRaw && (districtGeoJsonRaw as any).features?.length > 0) {
      return districtGeoJsonRaw as unknown as DistrictFeatureCollection;
    }
    return null;
  }

  async getBlocksGeoJson(): Promise<BlockFeatureCollection | null> {
    try {
      const response = await fetch('/data/geo/koraput-blocks.geojson');
      if (response.ok) {
        return (await response.json()) as BlockFeatureCollection;
      }
    } catch {
      // Fall through to bundled asset
    }
    if (blocksGeoJsonRaw && (blocksGeoJsonRaw as any).features?.length > 0) {
      return blocksGeoJsonRaw as unknown as BlockFeatureCollection;
    }
    return null;
  }

  async getPanchayatsGeoJson(blockId?: string): Promise<PanchayatFeatureCollection | null> {
    let raw: any = null;
    try {
      const response = await fetch('/data/geo/koraput-panchayats.geojson');
      if (response.ok) {
        raw = await response.json();
      }
    } catch {
      raw = panchayatsGeoJsonRaw;
    }
    if (!raw) raw = panchayatsGeoJsonRaw;

    if (!raw?.features || raw.features.length === 0) {
      return null; // Gracefully signal that Panchayat boundary polygons are not yet available
    }

    if (blockId && blockId !== 'all') {
      const filtered = {
        ...raw,
        features: raw.features.filter((f: any) => f.properties?.blockId === blockId),
      };
      return filtered as PanchayatFeatureCollection;
    }

    return raw as PanchayatFeatureCollection;
  }

  async getRainfallNormals(locationId: string = 'all'): Promise<RainfallNormal[]> {
    return getNormalsForLocation(locationId);
  }

  async getHistoricalRainfall(
    locationId: string = 'all',
    startDate?: string,
    endDate?: string,
    granularity: 'daily' | 'monthly' | 'seasonal' = 'daily'
  ): Promise<RainfallRecord[]> {
    let sourceData = HISTORICAL_DAILY_RECORDS;
    if (granularity === 'monthly') sourceData = HISTORICAL_MONTHLY_RECORDS;
    if (granularity === 'seasonal') sourceData = HISTORICAL_SEASONAL_RECORDS;

    let filtered = sourceData;
    if (locationId !== 'all' && locationId !== 'koraput-district') {
      filtered = filtered.filter((r) => r.locationId === locationId);
    }

    if (startDate) {
      filtered = filtered.filter((r) => r.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((r) => r.date <= endDate);
    }

    return filtered;
  }

  async getClimateIndices(): Promise<ClimateIndex[]> {
    return [ENSO_DATA, IOD_DATA, MJO_DATA];
  }

  async getDataSources(): Promise<DataSource[]> {
    return [
      {
        id: 'imd-rainfall-normals',
        name: 'Koraput District Rainfall Normals (1971-2020)',
        source: 'India Meteorological Department (IMD)',
        sourceUrl: 'https://imdpune.gov.in/Clim_Pred_LRF_New/Reports.html',
        retrievedAt: '2026-05-15',
        period: '1971–2020 (30-Year Climatological Normal)',
        spatialResolution: 'District Level (Station Code: 42963)',
        temporalResolution: 'Monthly & Monsoon Seasonal (JJAS)',
        unit: 'mm',
        qualityStatus: 'OFFICIAL',
        description: 'Official 30-year Long Period Average (LPA) precipitation baseline for Koraput District.',
        recordsCount: 14,
      },
      {
        id: 'imd-gridded-rainfall',
        name: 'IMD High-Resolution Gridded Daily Rainfall',
        source: 'India Meteorological Department (IMD)',
        sourceUrl: 'https://www.imdpune.gov.in/cmpg/Griddata/Rainfall_25_Bin.html',
        retrievedAt: '2026-06-01',
        period: '2015–2025',
        spatialResolution: '0.25° × 0.25° (~27 km × 27 km)',
        temporalResolution: 'Daily (08:30 IST to 08:30 IST)',
        unit: 'mm / day',
        qualityStatus: 'HISTORICAL',
        description: 'Multi-station interpolated gridded daily surface rainfall for agricultural verification.',
        recordsCount: '3,650+ Daily Gridpoints',
      },
      {
        id: 'noaa-cpc-enso',
        name: 'NOAA CPC Niño 3.4 & Oceanic Niño Index (ONI)',
        source: 'NOAA Climate Prediction Center (CPC)',
        sourceUrl: 'https://www.cpc.ncep.noaa.gov/data/indices/sstoi.indices',
        retrievedAt: '2026-05-28',
        period: '1950–Present',
        spatialResolution: 'Tropical Pacific (5°N–5°S, 170°W–120°W)',
        temporalResolution: 'Monthly SST Anomalies',
        unit: '°C Anomaly',
        qualityStatus: 'OFFICIAL',
        description: 'Global equatorial Pacific SST index governing monsoon circulation and break-spell risks.',
        recordsCount: 'Monthly Timeseries',
      },
      {
        id: 'noaa-ncei-iod',
        name: 'Dipole Mode Index (DMI / Indian Ocean Dipole)',
        source: 'NOAA NCEI / Australian Bureau of Meteorology',
        sourceUrl: 'https://www.stateoftheocean.osmc.noaa.gov/sur/ind/dmi.php',
        retrievedAt: '2026-05-31',
        period: '1982–Present',
        spatialResolution: 'Equatorial Indian Ocean Basin',
        temporalResolution: 'Weekly / Monthly Anomaly',
        unit: '°C Anomaly',
        qualityStatus: 'OFFICIAL',
        description: 'Zonal sea-surface temperature gradient index between western and eastern equatorial Indian Ocean.',
        recordsCount: 'Weekly Timeseries',
      },
      {
        id: 'bom-mjo-rmm',
        name: 'Madden-Julian Oscillation (RMM1, RMM2)',
        source: 'Australian Bureau of Meteorology (BoM)',
        sourceUrl: 'http://www.bom.gov.au/climate/mjo/',
        retrievedAt: '2026-06-02',
        period: '1974–Present',
        spatialResolution: 'Global Tropics (15°S–15°N)',
        temporalResolution: 'Daily Multivariate EOF',
        unit: 'Phase (1-8) & Amplitude',
        qualityStatus: 'OFFICIAL',
        description: 'Intraseasonal convective wave tracking moisture surge pulses across the Indian Ocean.',
        recordsCount: 'Daily Index',
      },
      {
        id: 'soi-orsac-boundaries',
        name: 'Survey of India / ORSAC Administrative Boundaries',
        source: 'Survey of India & Odisha Space Applications Centre',
        sourceUrl: 'https://orsac.gov.in',
        retrievedAt: '2026-04-10',
        period: 'Census 2011 / Delimited 2020',
        spatialResolution: 'Vector Polygons (WGS84 EPSG:4326)',
        temporalResolution: 'Static Cadastral',
        unit: 'Polygon Boundaries',
        qualityStatus: 'OFFICIAL',
        description: 'Official administrative polygons for Koraput District and 14 Community Development Blocks.',
        recordsCount: '15 Polygons',
      },
      {
        id: 'panchayat-cadastral',
        name: 'Gram Panchayat Cadastral Polygon Layer',
        source: 'Panchayati Raj & Drinking Water Dept, Odisha',
        sourceUrl: 'https://panchayat.odisha.gov.in',
        retrievedAt: '2026-06-01',
        period: 'Current Administrative',
        spatialResolution: 'Gram Panchayat Polygons',
        temporalResolution: 'Static',
        unit: 'Polygon Boundary',
        qualityStatus: 'MISSING',
        description: 'Cadastral Gram Panchayat boundary GeoJSON is not yet released for public open-access ingestion.',
        recordsCount: '0 (Data Unavailable)',
      },
    ];
  }
}
