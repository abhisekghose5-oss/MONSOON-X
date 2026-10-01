import type { KoraputBlockInfo } from './geo';

export interface LocationData {
  id: string; // 'all' or 'koraput' or block ID e.g. 'semiliguda'
  name: string; // e.g. 'Koraput District' or 'Semiliguda Block'
  type: 'district' | 'block';
  headquarters: string;
  state: string; // 'Odisha'
  country: string; // 'India'
  coordinates: {
    latitude: number;
    longitude: number;
  };
  elevationMeters: number;
  agroEcologicalZone: string;
  totalAreaSqKm: number;
  panchayatCount: number;
  availableBlocks?: KoraputBlockInfo[];
  metadata: {
    sourceAgency: string;
    isRealSurveyBoundary: boolean;
    lastUpdated: string;
  };
}
