import { KORAPUT_BLOCKS_GEOJSON } from '../data/geo/koraputGeoJson';
import { KORAPUT_PANCHAYATS } from '../data/geo/panchayats';
import { MOCK_RISK_MAP_DATA, DEMO_DATA_STATUS, DEMO_MODEL_VERSION, DEMO_LAST_UPDATED } from '../data/mock/riskMap';
import { geoService } from './geoService';
import type {
  KoraputGeoJson,
  BlockRiskGeoProperties,
  PanchayatInfo,
  RiskLayer,
  ForecastHorizon,
  RiskMapResponse,
  RiskMapRecord,
} from '../types/riskMap';

export interface GetRiskMapDataParams {
  location?: string;
  horizon?: ForecastHorizon;
  layer?: RiskLayer;
}

export const riskMapService = {
  /**
   * Primary service function as specified in Step 4 Architecture (Sections 13, 15)
   * Fetches risk map records for a specific horizon, location, and layer.
   * UI -> riskMapService -> mock data (or FastAPI later)
   */
  async getRiskMapData(params: GetRiskMapDataParams): Promise<RiskMapResponse> {
    const horizon: ForecastHorizon = params.horizon || '14D';
    const layer: RiskLayer = params.layer || 'onset';
    const locationId = params.location || 'all';

    // Simulate minor network latency (e.g. 50ms) to ensure async compliance
    await new Promise((resolve) => setTimeout(resolve, 50));

    const horizonRecords = MOCK_RISK_MAP_DATA[horizon] || MOCK_RISK_MAP_DATA['14D'];
    const districtSummary = horizonRecords['all'] || horizonRecords['koraput-district'];

    return {
      horizon,
      layer,
      locationId,
      records: horizonRecords,
      districtSummary,
      dataStatus: DEMO_DATA_STATUS,
      modelVersion: DEMO_MODEL_VERSION,
      lastUpdated: DEMO_LAST_UPDATED,
    };
  },

  /**
   * Fetches the Koraput block boundaries GeoJSON via GeoService
   * Architecture: GeoService -> Real GeoJSON -> RiskMap (Step 5 - Section 12)
   * Dynamically attaches the selected horizon's risk properties so Leaflet renders the exact values
   */
  async getKoraputGeoJson(horizon: ForecastHorizon = '14D'): Promise<KoraputGeoJson | null> {
    let baseGeoJson: KoraputGeoJson | null = null;

    const blocksData = await geoService.getBlocksGeoJson();
    if (blocksData && blocksData.features && blocksData.features.length > 0) {
      baseGeoJson = blocksData as unknown as KoraputGeoJson;
    } else {
      baseGeoJson = KORAPUT_BLOCKS_GEOJSON;
    }

    if (!baseGeoJson || !baseGeoJson.features || baseGeoJson.features.length === 0) {
      return null;
    }

    // Enrich GeoJSON features with the requested horizon's risk records
    const horizonData = MOCK_RISK_MAP_DATA[horizon] || MOCK_RISK_MAP_DATA['14D'];
    const enrichedFeatures = baseGeoJson.features.map((feature) => {
      const bId = feature.properties?.blockId || feature.id;
      const record = horizonData[bId as string];
      if (!record) return feature;

      const updatedProperties: BlockRiskGeoProperties = {
        ...feature.properties,
        onsetProbability: record.onsetProbability,
        breakProbability: record.breakProbability,
        heavyRainProbability: record.heavyRainProbability,
        rainfallAnomalyPercent: record.rainfallAnomaly,
        observedRainfallMm: record.observedRainfallMm ?? feature.properties.observedRainfallMm,
        normalRainfallMm: record.normalRainfallMm ?? feature.properties.normalRainfallMm,
        expectedRainfall7dMm: record.expectedRainfall7dMm ?? feature.properties.expectedRainfall7dMm,
        agriculturalAdvisory: record.agriculturalSignal || feature.properties.agriculturalAdvisory,
        sowingStatus: record.status || feature.properties.sowingStatus,
        lastUpdated: record.lastUpdated,
        modelVersion: record.modelVersion,
      };

      return {
        ...feature,
        properties: updatedProperties,
      };
    });

    return {
      ...baseGeoJson,
      features: enrichedFeatures,
    };
  },

  /**
   * Retrieves Panchayats for a given block or all blocks via GeoService
   */
  async getPanchayats(blockId?: string): Promise<PanchayatInfo[]> {
    const list = await geoService.getKoraputPanchayats(blockId);
    if (list && list.length > 0) {
      return list.map((p) => ({
        id: p.id,
        name: p.name,
        blockId: p.blockId,
        blockName: p.blockName,
        coordinates: (p.coordinates || [18.8135, 82.7123]) as [number, number],
        elevationMeters: p.elevationMeters || 800,
        vulnerabilityTag: p.vulnerabilityTag || 'Nominal',
        soilType: p.soilType || 'Laterite loam',
      }));
    }
    if (!blockId || blockId === 'all') {
      return KORAPUT_PANCHAYATS;
    }
    return KORAPUT_PANCHAYATS.filter((p) => p.blockId === blockId);
  },

  /**
   * Retrieves comprehensive risk detail for a single block at a specific horizon
   */
  async getBlockDetail(
    blockId: string,
    horizon: ForecastHorizon = '14D'
  ): Promise<RiskMapRecord | null> {
    const horizonData = MOCK_RISK_MAP_DATA[horizon] || MOCK_RISK_MAP_DATA['14D'];
    return horizonData[blockId] || null;
  },
};
