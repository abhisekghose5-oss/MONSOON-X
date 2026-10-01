/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Real Geographic Intelligence Service (Step 5 - Section 3)
 * 
 * Hierarchy:
 * India → Odisha → Koraput District → 14 Administrative Blocks → Gram Panchayats
 * 
 * Functions required:
 * - getKoraputDistrict()
 * - getKoraputBlocks()
 * - getKoraputPanchayats(blockId?)
 * - getLocationById(locationId)
 */

import { getDataProvider } from './data';
import { KORAPUT_BLOCKS } from '../data/koraputBlocks';
import { KORAPUT_PANCHAYATS } from '../data/geo/panchayats';
import { DEFAULT_LOCATION, DEFAULT_STATE, DEFAULT_COUNTRY, GEO_CONFIG } from '../data/geo/config';
import type {
  DistrictFeatureCollection,
  BlockFeatureCollection,
} from '../types/geography';
import type {
  DistrictEntity,
  BlockEntity,
  PanchayatEntity,
  GeoLocation,
} from '../types/dataArchitecture';

export class GeoService {
  /**
   * Retrieves official Koraput District geographic entity
   */
  async getKoraputDistrict(): Promise<DistrictEntity | null> {
    const provider = getDataProvider();
    const geoJson = await provider.getDistrictGeoJson();

    const geometry = geoJson && geoJson.features && geoJson.features.length > 0
      ? geoJson.features[0].geometry
      : null;

    return {
      id: 'koraput-district',
      name: `${DEFAULT_LOCATION} District`,
      type: 'district',
      district: DEFAULT_LOCATION,
      state: DEFAULT_STATE,
      country: DEFAULT_COUNTRY,
      center: GEO_CONFIG.districtCenter,
      boundingBox: GEO_CONFIG.boundingBox,
      totalAreaSqKm: 8807,
      blocksCount: 14,
      geometry,
      properties: geoJson?.features[0]?.properties,
    };
  }

  /**
   * Retrieves all 14 official administrative blocks with verified coordinates,
   * elevations, agro-ecological tracts, and boundary polygons.
   */
  async getKoraputBlocks(): Promise<BlockEntity[]> {
    const provider = getDataProvider();
    const geoJson = await provider.getBlocksGeoJson();

    return KORAPUT_BLOCKS.map((b) => {
      let geometry = null;
      if (geoJson && geoJson.features) {
        const match = geoJson.features.find(
          (f: any) =>
            f.id === b.id ||
            f.properties?.blockId === b.id ||
            f.properties?.blockName?.toLowerCase() === b.name.toLowerCase()
        );
        if (match) geometry = match.geometry;
      }

      return {
        id: b.id,
        name: b.name,
        type: 'block',
        district: DEFAULT_LOCATION,
        districtId: 'koraput-district',
        state: DEFAULT_STATE,
        headquarters: b.headquarters,
        coordinates: [b.coordinates.latitude, b.coordinates.longitude],
        elevationMeters: b.elevationMeters,
        totalAreaSqKm: b.totalAreaSqKm,
        agroEcologicalZone: b.agroEcologicalZone,
        geometry,
        properties: {
          elevationMeters: b.elevationMeters,
          headquarters: b.headquarters,
          agroEcologicalZone: b.agroEcologicalZone,
        },
      };
    });
  }

  /**
   * Retrieves Gram Panchayats for a specific block or district-wide.
   * Gracefully returns geometry: null if cadastral boundaries are not yet released.
   */
  async getKoraputPanchayats(blockId?: string): Promise<PanchayatEntity[]> {
    const provider = getDataProvider();
    const geoJson = await provider.getPanchayatsGeoJson(blockId);

    let list = KORAPUT_PANCHAYATS;
    if (blockId && blockId !== 'all') {
      list = list.filter((p) => p.blockId === blockId);
    }

    return list.map((p) => {
      let geometry = null;
      if (geoJson && geoJson.features) {
        const match = geoJson.features.find(
          (f: any) => f.id === p.id || f.properties?.id === p.id || f.properties?.name === p.name
        );
        if (match) geometry = match.geometry;
      }

      return {
        id: p.id,
        name: p.name,
        type: 'panchayat',
        blockId: p.blockId,
        blockName: p.blockName,
        district: DEFAULT_LOCATION,
        state: DEFAULT_STATE,
        coordinates: p.coordinates,
        elevationMeters: p.elevationMeters,
        vulnerabilityTag: p.vulnerabilityTag,
        soilType: p.soilType,
        geometry,
        properties: {
          elevationMeters: p.elevationMeters,
          vulnerabilityTag: p.vulnerabilityTag,
          soilType: p.soilType,
        },
      };
    });
  }

  /**
   * Resolves any location ID across district, block, and panchayat tiers
   */
  async getLocationById(locationId: string): Promise<GeoLocation | null> {
    const norm = locationId.toLowerCase().trim();

    // 1. Check District
    if (norm === 'all' || norm === 'koraput' || norm === 'koraput-district') {
      const dist = await this.getKoraputDistrict();
      if (!dist) return null;
      return {
        id: dist.id,
        name: dist.name,
        type: 'district',
        district: dist.district,
        state: dist.state,
        geometry: dist.geometry,
        center: dist.center,
        elevationMeters: 740,
        properties: dist.properties,
      };
    }

    // 2. Check Blocks
    const blocks = await this.getKoraputBlocks();
    const matchedBlock = blocks.find((b) => b.id === norm || b.name.toLowerCase() === norm);
    if (matchedBlock) {
      return {
        id: matchedBlock.id,
        name: `${matchedBlock.name} Block`,
        type: 'block',
        district: matchedBlock.district,
        state: matchedBlock.state,
        geometry: matchedBlock.geometry,
        center: matchedBlock.coordinates,
        elevationMeters: matchedBlock.elevationMeters,
        properties: matchedBlock.properties,
      };
    }

    // 3. Check Panchayats
    const panchayats = await this.getKoraputPanchayats();
    const matchedGp = panchayats.find((p) => p.id === norm || p.name.toLowerCase() === norm);
    if (matchedGp) {
      return {
        id: matchedGp.id,
        name: `GP: ${matchedGp.name}`,
        type: 'panchayat',
        district: matchedGp.district,
        state: matchedGp.state,
        geometry: matchedGp.geometry,
        center: matchedGp.coordinates,
        elevationMeters: matchedGp.elevationMeters,
        properties: matchedGp.properties,
      };
    }

    return null;
  }

  /**
   * Fast check for Panchayat cadastral boundary availability
   */
  async isPanchayatBoundaryAvailable(): Promise<boolean> {
    const provider = getDataProvider();
    const geoJson = await provider.getPanchayatsGeoJson();
    return !!geoJson && Array.isArray(geoJson.features) && geoJson.features.length > 0;
  }

  /**
   * Raw GeoJSON Accessors for Leaflet maps
   */
  async getDistrictGeoJson(): Promise<DistrictFeatureCollection | null> {
    return getDataProvider().getDistrictGeoJson();
  }

  async getBlocksGeoJson(): Promise<BlockFeatureCollection | null> {
    return getDataProvider().getBlocksGeoJson();
  }
}

export const geoService = new GeoService();
export default geoService;
