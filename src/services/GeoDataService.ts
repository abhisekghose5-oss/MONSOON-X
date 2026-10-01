import { DEFAULT_LOCATION, DEFAULT_STATE, DEFAULT_COUNTRY, GEO_CONFIG } from '../data/geo/config';
import type {
  DistrictFeatureCollection,
  BlockFeatureCollection,
  PanchayatFeatureCollection,
  GeoDataLoadResult,
} from '../types/geography';

// Static/bundled imports for zero-latency fallback and offline stability
import districtGeoJsonRaw from '../data/geo/koraput-district.geojson';
import blocksGeoJsonRaw from '../data/geo/koraput-blocks.geojson';
import panchayatsGeoJsonRaw from '../data/geo/koraput-panchayats.geojson';

export class GeoDataService {
  /**
   * Geographic configuration constants
   */
  public static readonly DEFAULT_LOCATION = DEFAULT_LOCATION;
  public static readonly DEFAULT_STATE = DEFAULT_STATE;
  public static readonly DEFAULT_COUNTRY = DEFAULT_COUNTRY;
  public static readonly CONFIG = GEO_CONFIG;

  /**
   * Loads the real Koraput District boundary GeoJSON
   */
  public static async loadDistrict(): Promise<GeoDataLoadResult<DistrictFeatureCollection>> {
    try {
      const response = await fetch('/data/geo/koraput-district.geojson');
      if (response.ok) {
        const json = await response.json();
        return {
          isAvailable: true,
          data: json as DistrictFeatureCollection,
          message: 'District boundary loaded from /data/geo/koraput-district.geojson',
        };
      }
    } catch {
      // Fallback to static bundled import
    }

    if (districtGeoJsonRaw && (districtGeoJsonRaw as any).features?.length > 0) {
      return {
        isAvailable: true,
        data: districtGeoJsonRaw as unknown as DistrictFeatureCollection,
        message: 'District boundary loaded from bundled asset',
      };
    }

    return {
      isAvailable: false,
      data: null,
      message: 'District boundary data unavailable',
      error: 'FILE_NOT_FOUND',
    };
  }

  /**
   * Loads the 14 Koraput administrative blocks GeoJSON
   */
  public static async loadBlocks(): Promise<GeoDataLoadResult<BlockFeatureCollection>> {
    try {
      const response = await fetch('/data/geo/koraput-blocks.geojson');
      if (response.ok) {
        const json = await response.json();
        return {
          isAvailable: true,
          data: json as BlockFeatureCollection,
          message: 'Block boundaries loaded from /data/geo/koraput-blocks.geojson',
        };
      }
    } catch {
      // Fallback to static bundled import
    }

    if (blocksGeoJsonRaw && (blocksGeoJsonRaw as any).features?.length > 0) {
      return {
        isAvailable: true,
        data: blocksGeoJsonRaw as unknown as BlockFeatureCollection,
        message: 'Block boundaries loaded from bundled asset',
      };
    }

    return {
      isAvailable: false,
      data: null,
      message: 'Block boundary data unavailable',
      error: 'FILE_NOT_FOUND',
    };
  }

  /**
   * Loads Panchayat boundaries GeoJSON.
   * Gracefully handles missing/unavailable boundary data.
   */
  public static async loadPanchayats(): Promise<GeoDataLoadResult<PanchayatFeatureCollection>> {
    let json: any = null;

    try {
      const response = await fetch('/data/geo/koraput-panchayats.geojson');
      if (response.ok) {
        json = await response.json();
      }
    } catch {
      // Fallback to static import check
      json = panchayatsGeoJsonRaw;
    }

    if (!json) {
      json = panchayatsGeoJsonRaw;
    }

    // Inspect if valid polygon features are present
    const features = json?.features || [];
    const isAvailable = Array.isArray(features) && features.length > 0;

    if (!isAvailable) {
      return {
        isAvailable: false,
        data: null,
        message: 'Panchayat-level boundary data unavailable',
      };
    }

    return {
      isAvailable: true,
      data: json as PanchayatFeatureCollection,
      message: `Loaded ${features.length} panchayat boundary features`,
    };
  }

  /**
   * Fast check for Panchayat boundary availability
   */
  public static async isPanchayatDataAvailable(): Promise<boolean> {
    const result = await this.loadPanchayats();
    return result.isAvailable;
  }

  /**
   * Returns current administrative hierarchy string
   */
  public static getHierarchyString(blockName?: string, panchayatName?: string): string {
    const parts = [DEFAULT_STATE, `${DEFAULT_LOCATION} DISTRICT`];
    if (blockName) parts.push(`${blockName.toUpperCase()} BLOCK`);
    if (panchayatName) parts.push(`GP: ${panchayatName.toUpperCase()}`);
    return parts.join(' → ');
  }
}
