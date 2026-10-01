/**
 * MONSOON-X (SIH26086)
 * Historical Rainfall Service (Step 5 - Section 6)
 * 
 * Provides verified historical observations across daily, monthly, and seasonal grains
 * with strict provenance, absence of mixed granularities, and anomaly synthesis.
 */

import { getDataProvider } from './data';
import type { RainfallRecord, RainfallAnomaly } from '../types/dataArchitecture';
import { getDistrictMonthNormal, KORAPUT_DISTRICT_SEASONAL_NORMAL } from '../data/koraput/rainfallNormals';
import { calculateRainfallAnomaly, getImdDepartureCategory } from '../utils/rainfallAnomaly';

export interface HistoricalRainfallQuery {
  locationId?: string;
  startDate?: string;
  endDate?: string;
  granularity?: 'daily' | 'monthly' | 'seasonal';
}

export interface HistoricalRainfallSummary {
  locationId: string;
  granularity: 'daily' | 'monthly' | 'seasonal';
  records: RainfallRecord[];
  totalRainfallMm: number | null;
  observedDaysCount: number;
  rainyDaysCount: number; // >= 2.5 mm
  heavyRainDaysCount: number; // >= 64.5 mm
  maxDailyMm: number | null;
  anomaly?: RainfallAnomaly;
  dataStatus: 'HISTORICAL' | 'OFFICIAL' | 'MISSING';
}

export class HistoricalRainfallService {
  /**
   * Primary service function as required in Section 6:
   * getHistoricalRainfall(locationId, startDate, endDate, granularity?)
   */
  async getHistoricalRainfall(
    locationId: string = 'all',
    startDate?: string,
    endDate?: string,
    granularity: 'daily' | 'monthly' | 'seasonal' = 'daily'
  ): Promise<RainfallRecord[]> {
    const provider = getDataProvider();
    return provider.getHistoricalRainfall(locationId, startDate, endDate, granularity);
  }

  /**
   * Retrieves full aggregated analytical summary for a period
   */
  async getHistoricalSummary(query: HistoricalRainfallQuery): Promise<HistoricalRainfallSummary> {
    const granularity = query.granularity || 'daily';
    const locationId = query.locationId || 'all';

    const records = await this.getHistoricalRainfall(
      locationId,
      query.startDate,
      query.endDate,
      granularity
    );

    if (!records || records.length === 0) {
      return {
        locationId,
        granularity,
        records: [],
        totalRainfallMm: null,
        observedDaysCount: 0,
        rainyDaysCount: 0,
        heavyRainDaysCount: 0,
        maxDailyMm: null,
        dataStatus: 'MISSING',
      };
    }

    let sum = 0;
    let validCount = 0;
    let rainyDays = 0;
    let heavyDays = 0;
    let maxRain = 0;

    for (const r of records) {
      if (r.rainfallMm !== null && !Number.isNaN(r.rainfallMm)) {
        sum += r.rainfallMm;
        validCount++;
        if (r.rainfallMm >= 2.5) rainyDays++;
        if (r.rainfallMm >= 64.5) heavyDays++;
        if (r.rainfallMm > maxRain) maxRain = r.rainfallMm;
      }
    }

    const total = validCount > 0 ? Math.round(sum * 10) / 10 : null;

    // Derive seasonal or monthly comparison if available
    let anomaly: RainfallAnomaly | undefined;
    if (granularity === 'seasonal' && total !== null) {
      const normalLpa = KORAPUT_DISTRICT_SEASONAL_NORMAL.normalRainfallMm as number;
      const pct = calculateRainfallAnomaly(total, normalLpa);
      anomaly = {
        locationId,
        observedMm: total,
        normalMm: normalLpa,
        anomalyMm: Math.round((total - normalLpa) * 10) / 10,
        anomalyPercentage: pct,
        departureCategory: getImdDepartureCategory(pct, total),
        period: query.startDate ? `Period ${query.startDate}` : 'Seasonal JJAS',
        dataStatus: 'HISTORICAL',
      };
    }

    return {
      locationId,
      granularity,
      records,
      totalRainfallMm: total,
      observedDaysCount: validCount,
      rainyDaysCount: rainyDays,
      heavyRainDaysCount: heavyDays,
      maxDailyMm: validCount > 0 ? maxRain : null,
      anomaly,
      dataStatus: 'HISTORICAL',
    };
  }

  /**
   * Retrieves monthly normal baseline for comparison
   */
  getMonthlyNormal(monthNumber: number) {
    return getDistrictMonthNormal(monthNumber);
  }
}

export const historicalRainfallService = new HistoricalRainfallService();
export default historicalRainfallService;
