import type { ILocationAdapter } from '../api/adapters/types';
import type { LocationData } from '../types/location';
import type { KoraputBlockInfo } from '../types/geo';
import { realAdapters } from '../api/adapters/realAdapters';
import { mockAdapters } from '../api/adapters/mockAdapters';
import { ApiClientError } from '../api/client';
import { KORAPUT_BLOCKS } from '../data/koraputBlocks';
import { geoService } from './geoService';
import type { PanchayatEntity, DistrictEntity, BlockEntity } from '../types/dataArchitecture';

/**
 * Administrative Location Intelligence Service (Step 5 - Section 13)
 * Unified hierarchy: India → Odisha → Koraput District → Blocks → Panchayats
 */
export class LocationService implements ILocationAdapter {
  private realAdapter = realAdapters.location;
  private mockAdapter = mockAdapters.location;

  /**
   * Primary adapter method for GET /api/v1/location/{location}
   */
  async getLocation(location: string = 'koraput'): Promise<LocationData> {
    const forceMock = import.meta.env.VITE_API_USE_MOCK === 'true';

    if (!forceMock) {
      try {
        const result = await this.realAdapter.getLocation(location);
        if (result && result.name && result.coordinates) {
          return result;
        }
      } catch (err: unknown) {
        if (err instanceof ApiClientError) {
          console.warn(`[LocationService] Backend returned ${err.statusCode} (${err.code}). Using mock fallback.`, err.message);
        } else {
          console.warn('[LocationService] Backend unavailable. Using local location registry.');
        }
      }
    }

    return this.mockAdapter.getLocation(location);
  }

  /**
   * Helper to retrieve all 14 Koraput administrative blocks
   */
  getAllBlocks(): KoraputBlockInfo[] {
    return KORAPUT_BLOCKS;
  }

  /**
   * Retrieves official district metadata
   */
  async getDistrict(): Promise<DistrictEntity | null> {
    return geoService.getKoraputDistrict();
  }

  /**
   * Retrieves administrative blocks via geoService
   */
  async getBlocks(): Promise<BlockEntity[]> {
    return geoService.getKoraputBlocks();
  }

  /**
   * Retrieves panchayats for a block or district
   */
  async getPanchayats(blockId?: string): Promise<PanchayatEntity[]> {
    return geoService.getKoraputPanchayats(blockId);
  }
}

const defaultLocationService = new LocationService();

export const locationService = {
  getLocation: defaultLocationService.getLocation.bind(defaultLocationService),
  getAllBlocks: defaultLocationService.getAllBlocks.bind(defaultLocationService),
  getDistrict: defaultLocationService.getDistrict.bind(defaultLocationService),
  getBlocks: defaultLocationService.getBlocks.bind(defaultLocationService),
  getPanchayats: defaultLocationService.getPanchayats.bind(defaultLocationService),
};

export default locationService;
