/**
 * MONSOON-X (SIH26086)
 * Rainfall Intelligence Service (Step 6 - Section 21)
 * 
 * Strict architectural flow:
 * React UI Components → rainfallService → DataProvider → Datasets
 * 
 * Enforces scientific transparency:
 * - Real IMD observations & 1971-2020 normals for Koraput District
 * - Explicit 'MISSING' status when block-level telemetry is not connected
 * - Non-zero representations for missing observations (gaps)
 * - Rigorous IMD departure classifications & dry-spell algorithms
 */

import { getDataProvider } from './data';
import {
  KORAPUT_DISTRICT_MONTHLY_NORMALS,
  KORAPUT_DISTRICT_SEASONAL_NORMAL,
  KORAPUT_DISTRICT_ANNUAL_NORMAL,
  getDistrictMonthNormal,
} from '../data/koraput/rainfallNormals';
import { KORAPUT_BLOCKS } from '../data/koraputBlocks';
import {
  calculateRainfallAnomaly,
  getImdDepartureCategory,
} from '../utils/rainfallAnomaly';
import {
  calculateDrySpellStats,
  detectDrySpells,
  calculateIntensityDistribution,
  calculateDataQuality,
} from '../utils/drySpellAnalysis';
import type {
  RainfallRecord,
  RainfallNormal,
  RainfallAnomaly,
  RainfallSummaryMetrics,
  DailyRainfallPoint,
  CumulativeRainfallPoint,
  MonthlyAnomalyPoint,
  DrySpell,
  RainfallStatistics,
  HistoricalSeason,
  BlockRainfallSummary,
  RainfallDashboardData,
  DateRangeFilterState,
  ImdRainfallCategory,
  ImdDepartureCategory,
} from '../types/rainfall';

function categorizeRainfall(mm: number | null): ImdRainfallCategory {
  if (mm === null || Number.isNaN(mm)) return 'No Rain';
  if (mm === 0) return 'No Rain';
  if (mm < 2.5) return 'Very Light Rain';
  if (mm <= 15.5) return 'Light Rain';
  if (mm <= 64.4) return 'Moderate Rain';
  if (mm <= 115.5) return 'Heavy Rain';
  if (mm <= 204.4) return 'Very Heavy Rain';
  return 'Extremely Heavy Rain';
}

function formatDisplayDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${monthNames[mIdx] || parts[1]}`;
}

function getDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()] || '';
}

export class RainfallService {
  /**
   * Adapter integration method for GET /api/v1/rainfall/{location}
   */
  async getRainfall(location: string = 'all'): Promise<RainfallDashboardData> {
    return this.getDashboardData(location);
  }

  /**
   * Section 21 Function 1: getCurrentRainfall(locationId)
   */
  async getCurrentRainfall(locationId: string = 'all') {
    if (locationId !== 'all' && locationId !== 'koraput-district') {
      return {
        locationId,
        rainfallMm: null,
        observationTime: 'N/A',
        stationName: 'AWS Station Unconnected',
        status: 'MISSING' as const,
        note: 'Block-level rainfall telemetry is not currently connected.',
      };
    }

    const provider = getDataProvider();
    const dailyRecords = await provider.getHistoricalRainfall('all', '2025-06-01', '2025-09-30', 'daily');
    const validRecords = dailyRecords.filter((r) => r.rainfallMm !== null);
    const latest = validRecords[validRecords.length - 1];

    return {
      locationId: 'all',
      rainfallMm: latest?.rainfallMm ?? null,
      observationTime: latest?.date ?? '2025-09-30',
      stationName: 'IMD Koraput Observatory (42963)',
      status: 'OFFICIAL' as const,
      source: 'IMD 0.25° Gridded Daily Rainfall Dataset',
    };
  }

  /**
   * Section 21 Function 2: getHistoricalRainfall(locationId, startDate, endDate)
   */
  async getHistoricalRainfall(
    locationId: string = 'all',
    startDate?: string,
    endDate?: string
  ): Promise<RainfallRecord[]> {
    const provider = getDataProvider();
    return provider.getHistoricalRainfall(locationId, startDate, endDate, 'daily');
  }

  /**
   * Section 21 Function 3: getRainfallNormals(locationId)
   */
  async getRainfallNormals(locationId: string = 'all'): Promise<RainfallNormal[]> {
    const provider = getDataProvider();
    return provider.getRainfallNormals(locationId);
  }

  /**
   * Section 21 Function 4: getRainfallAnomaly(locationId, period)
   */
  async getRainfallAnomaly(
    locationId: string = 'all',
    period: string = 'Monsoon Season (JJAS)'
  ): Promise<RainfallAnomaly> {
    if (locationId !== 'all' && locationId !== 'koraput-district') {
      return {
        locationId,
        observedMm: null,
        normalMm: null,
        anomalyMm: null,
        anomalyPercentage: null,
        departureCategory: 'DATA_REQUIRED',
        period,
        dataStatus: 'MISSING',
      };
    }

    const provider = getDataProvider();
    const dailyRecords = await provider.getHistoricalRainfall('all', '2025-06-01', '2025-09-30', 'daily');
    let observedTotal = 0;
    for (const r of dailyRecords) {
      if (r.rainfallMm !== null) observedTotal += r.rainfallMm;
    }
    observedTotal = Math.round(observedTotal * 10) / 10;
    const normalTotal = KORAPUT_DISTRICT_SEASONAL_NORMAL.normalRainfallMm as number;
    const anomalyPct = calculateRainfallAnomaly(observedTotal, normalTotal);
    const category = getImdDepartureCategory(anomalyPct);

    return {
      locationId: 'all',
      observedMm: observedTotal,
      normalMm: normalTotal,
      anomalyMm: Math.round((observedTotal - normalTotal) * 10) / 10,
      anomalyPercentage: anomalyPct,
      departureCategory: category,
      period,
      dataStatus: 'HISTORICAL',
    };
  }

  /**
   * Section 21 Function 5: getDrySpells(locationId, startDate, endDate)
   */
  async getDrySpells(
    locationId: string = 'all',
    startDate: string = '2025-06-01',
    endDate: string = '2025-09-30'
  ): Promise<DrySpell[]> {
    if (locationId !== 'all' && locationId !== 'koraput-district') {
      return [];
    }
    const provider = getDataProvider();
    const records = await provider.getHistoricalRainfall('all', startDate, endDate, 'daily');
    return detectDrySpells(records, locationId, 'Koraput District');
  }

  /**
   * Section 21 Function 6: getRainfallStatistics(locationId, startDate, endDate)
   */
  async getRainfallStatistics(
    locationId: string = 'all',
    startDate: string = '2025-06-01',
    endDate: string = '2025-09-30'
  ): Promise<RainfallStatistics> {
    const isDistrict = locationId === 'all' || locationId === 'koraput-district';
    const provider = getDataProvider();
    const records = isDistrict
      ? await provider.getHistoricalRainfall('all', startDate, endDate, 'daily')
      : [];

    let totalMm = 0;
    let validCount = 0;
    let rainyDays = 0;
    let dryDays = 0;
    let heavyDays = 0;
    let maxMm = 0;
    let maxDate: string | null = null;

    for (const r of records) {
      if (r.rainfallMm !== null && !Number.isNaN(r.rainfallMm)) {
        totalMm += r.rainfallMm;
        validCount++;
        if (r.rainfallMm >= 2.5) {
          rainyDays++;
        } else {
          dryDays++;
        }
        if (r.rainfallMm >= 64.5) heavyDays++;
        if (r.rainfallMm > maxMm) {
          maxMm = r.rainfallMm;
          maxDate = r.date;
        }
      }
    }

    const total = validCount > 0 ? Math.round(totalMm * 10) / 10 : null;
    const normal = isDistrict ? (KORAPUT_DISTRICT_SEASONAL_NORMAL.normalRainfallMm as number) : null;
    const anomaly = total !== null && normal !== null ? calculateRainfallAnomaly(total, normal) : null;
    const mean = validCount > 0 && total !== null ? Math.round((total / validCount) * 10) / 10 : null;

    return {
      locationId,
      locationName: isDistrict ? 'Koraput District' : `${locationId} Block`,
      periodLabel: `${startDate} to ${endDate}`,
      startDate,
      endDate,
      totalRainfallMm: total,
      normalRainfallMm: normal,
      anomalyPercent: anomaly,
      observedDaysCount: validCount,
      rainyDaysCount: rainyDays,
      dryDaysCount: dryDays,
      heavyRainDaysCount: heavyDays,
      maxDailyMm: maxMm > 0 ? maxMm : null,
      maxDailyDate: maxDate,
      meanDailyMm: mean,
      intensityDistribution: calculateIntensityDistribution(records),
      dataQuality: calculateDataQuality(records),
    };
  }

  /**
   * Section 21 Function 7: getBlockRainfallComparison()
   */
  async getBlockRainfallComparison(): Promise<BlockRainfallSummary[]> {
    return KORAPUT_BLOCKS.map((block) => {
      return {
        blockId: block.id,
        blockName: block.name,
        elevationMeters: block.elevationMeters,
        seasonalRainfallMm: null,
        normalMm: null,
        departurePercent: null,
        departureCategory: 'Normal',
        currentDrySpellDays: 0,
        isDataAvailable: false,
        status: 'MISSING',
        statusNote: 'Block AWS telemetry pending release by IMD / ORSAC',
      };
    });
  }

  /**
   * Historical Monsoon Comparison across available years (Section 14)
   * Only returns years present in the dataset (2019 - 2025)
   */
  async getHistoricalMonsoonComparison(): Promise<HistoricalSeason[]> {
    const provider = getDataProvider();
    const monthlyRecords = await provider.getHistoricalRainfall('all', undefined, undefined, 'monthly');
    const seasonalRecords = await provider.getHistoricalRainfall('all', undefined, undefined, 'seasonal');
    const normalSeasonal = KORAPUT_DISTRICT_SEASONAL_NORMAL.normalRainfallMm as number;

    const availableYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

    return availableYears.map((yr) => {
      const yrStr = String(yr);
      const jun = monthlyRecords.find((r) => r.date === `${yrStr}-06`)?.rainfallMm ?? null;
      const jul = monthlyRecords.find((r) => r.date === `${yrStr}-07`)?.rainfallMm ?? null;
      const aug = monthlyRecords.find((r) => r.date === `${yrStr}-08`)?.rainfallMm ?? null;
      const sep = monthlyRecords.find((r) => r.date === `${yrStr}-09`)?.rainfallMm ?? null;
      const sRecord = seasonalRecords.find((r) => r.date === yrStr);
      const total = sRecord?.rainfallMm ?? (jun && jul && aug && sep ? Math.round((jun + jul + aug + sep) * 10) / 10 : null);

      const anomalyPct = total !== null ? calculateRainfallAnomaly(total, normalSeasonal) : null;
      const category = getImdDepartureCategory(anomalyPct);

      return {
        year: yr,
        juneMm: jun,
        julyMm: jul,
        augustMm: aug,
        septemberMm: sep,
        totalSeasonalMm: total,
        normalSeasonalMm: normalSeasonal,
        departurePercent: anomalyPct,
        departureCategory: category as ImdDepartureCategory,
        source: 'IMD CRIS / 0.25° Gridded Dataset',
      };
    });
  }

  /**
   * Complete Unified Dashboard Data Fetcher
   */
  async getDashboardData(
    locationId: string = 'all',
    dateFilter?: DateRangeFilterState
  ): Promise<RainfallDashboardData> {
    const isDistrict = locationId === 'all' || locationId === 'koraput-district';
    const provider = getDataProvider();

    // Default season dates: 2025-06-01 to 2025-09-30
    let start = '2025-06-01';
    let end = '2025-09-30';

    if (dateFilter) {
      if (dateFilter.preset === 'today') {
        start = '2025-09-30';
        end = '2025-09-30';
      } else if (dateFilter.preset === 'last7') {
        start = '2025-09-24';
        end = '2025-09-30';
      } else if (dateFilter.preset === 'last30') {
        start = '2025-09-01';
        end = '2025-09-30';
      } else if (dateFilter.preset === 'last90') {
        start = '2025-07-01';
        end = '2025-09-30';
      } else if (dateFilter.preset === 'custom' && dateFilter.startDate && dateFilter.endDate) {
        start = dateFilter.startDate;
        end = dateFilter.endDate;
      }
    }

    const allSeasonDaily2025 = isDistrict
      ? await provider.getHistoricalRainfall('all', '2025-06-01', '2025-09-30', 'daily')
      : [];

    const allSeasonDaily2024 = isDistrict
      ? await provider.getHistoricalRainfall('all', '2024-06-01', '2024-09-30', 'daily')
      : [];

    // Filter to selected window
    const filteredDaily = allSeasonDaily2025.filter((r) => r.date >= start && r.date <= end);

    // 1. Build Daily Series Points
    const dailySeries: DailyRainfallPoint[] = filteredDaily.map((record) => {
      // Find normal for the day's month
      const monthIdx = parseInt(record.date.split('-')[1], 10);
      const mNormal = getDistrictMonthNormal(monthIdx);
      const daysInM = [6, 9].includes(monthIdx) ? 30 : 31;
      const dailyNormal = typeof mNormal.normalRainfallMm === 'number'
        ? Math.round((mNormal.normalRainfallMm / daysInM) * 10) / 10
        : 7.5;

      return {
        date: record.date,
        displayDate: formatDisplayDate(record.date),
        dayOfWeek: getDayOfWeek(record.date),
        dataType: 'OBSERVED',
        rainfallMm: record.rainfallMm,
        normalMm: dailyNormal,
        anomalyMm: record.rainfallMm !== null ? Math.round((record.rainfallMm - dailyNormal) * 10) / 10 : null,
        imdCategory: categorizeRainfall(record.rainfallMm),
        isSimulated: false,
        source: record.source,
        qualityFlag: record.qualityFlag,
      };
    });

    // 2. Build Cumulative Series Points (June 1 - Sept 30)
    let runningObserved = 0;
    let runningNormal = 0;
    let running2024 = 0;

    const cumulativeSeries: CumulativeRainfallPoint[] = allSeasonDaily2025.map((r, idx) => {
      if (r.rainfallMm !== null) runningObserved += r.rainfallMm;
      const mIdx = parseInt(r.date.split('-')[1], 10);
      const mNormal = getDistrictMonthNormal(mIdx);
      const daysInM = [6, 9].includes(mIdx) ? 30 : 31;
      const dailyNorm = typeof mNormal.normalRainfallMm === 'number'
        ? mNormal.normalRainfallMm / daysInM
        : 8.0;
      runningNormal += dailyNorm;

      const prevRec = allSeasonDaily2024[idx];
      if (prevRec && prevRec.rainfallMm !== null) running2024 += prevRec.rainfallMm;

      return {
        date: r.date,
        displayDate: formatDisplayDate(r.date),
        dayIndex: idx + 1,
        dataType: 'OBSERVED',
        cumulativeObservedMm: Math.round(runningObserved * 10) / 10,
        cumulativeNormalMm: Math.round(runningNormal * 10) / 10,
        cumulativePreviousSeasonMm: prevRec ? Math.round(running2024 * 10) / 10 : null,
      };
    });

    // 3. Build Monthly Profile Points (Jan - Dec)
    const monthlySeries: MonthlyAnomalyPoint[] = KORAPUT_DISTRICT_MONTHLY_NORMALS.map((norm, i) => {
      const monthIndex = i + 1;
      const monthStr = String(monthIndex).padStart(2, '0');
      // Look for 2025 observed monthly
      const mRecord = allSeasonDaily2025.length > 0
        ? allSeasonDaily2025.filter((r) => r.date.startsWith(`2025-${monthStr}`))
        : [];
      
      let observedSum: number | null = null;
      if (mRecord.length > 0) {
        let sum = 0;
        let count = 0;
        for (const r of mRecord) {
          if (r.rainfallMm !== null) {
            sum += r.rainfallMm;
            count++;
          }
        }
        if (count > 0) observedSum = Math.round(sum * 10) / 10;
      }

      const normalVal = norm.normalRainfallMm as number;
      const depPct = observedSum !== null ? calculateRainfallAnomaly(observedSum, normalVal) : null;
      const depCat = getImdDepartureCategory(depPct);

      return {
        month: (norm.month as string).slice(0, 3),
        monthFull: norm.month as string,
        monthIndex,
        year: 2025,
        observedMm: observedSum,
        normalMm: normalVal,
        departurePercent: depPct,
        category: depCat as ImdDepartureCategory,
        dataType: observedSum !== null ? 'OBSERVED' : 'NORMAL',
        isMonsoonMonth: [6, 7, 8, 9].includes(monthIndex),
      };
    });

    // 4. Dry Spell Stats
    const drySpellStats = calculateDrySpellStats(allSeasonDaily2025, locationId, isDistrict ? 'Koraput District' : `${locationId} Block`);

    // 5. Intensity Distribution
    const intensityDistribution = calculateIntensityDistribution(allSeasonDaily2025);

    // 6. Data Quality
    const dataQuality = calculateDataQuality(allSeasonDaily2025);

    // 7. Historical Seasons Comparison
    const historicalSeasons = await this.getHistoricalMonsoonComparison();

    // 8. Block Comparisons
    const blockComparisons = await this.getBlockRainfallComparison();

    // 9. Six Summary Metrics
    let seasonalObserved: number | null = null;
    let last7Observed: number | null = null;
    let last30Observed: number | null = null;
    let currentMm: number | null = null;
    let rainyDays = 0;
    let heavyDays = 0;

    if (isDistrict && allSeasonDaily2025.length > 0) {
      let sumAll = 0;
      for (const r of allSeasonDaily2025) {
        if (r.rainfallMm !== null) {
          sumAll += r.rainfallMm;
          if (r.rainfallMm >= 2.5) rainyDays++;
          if (r.rainfallMm >= 64.5) heavyDays++;
        }
      }
      seasonalObserved = Math.round(sumAll * 10) / 10;

      // Current = latest observation
      currentMm = allSeasonDaily2025[allSeasonDaily2025.length - 1]?.rainfallMm ?? null;

      // Last 7 days
      const last7 = allSeasonDaily2025.slice(-7);
      let s7 = 0;
      for (const r of last7) {
        if (r.rainfallMm !== null) s7 += r.rainfallMm;
      }
      last7Observed = Math.round(s7 * 10) / 10;

      // Last 30 days
      const last30 = allSeasonDaily2025.slice(-30);
      let s30 = 0;
      for (const r of last30) {
        if (r.rainfallMm !== null) s30 += r.rainfallMm;
      }
      last30Observed = Math.round(s30 * 10) / 10;
    }

    const seasonalNormal = isDistrict ? (KORAPUT_DISTRICT_SEASONAL_NORMAL.normalRainfallMm as number) : null;
    const seasonalDep = seasonalObserved !== null && seasonalNormal !== null
      ? calculateRainfallAnomaly(seasonalObserved, seasonalNormal)
      : null;
    const seasonalCat = getImdDepartureCategory(seasonalDep);

    // 7-day normal approx (Sept normal ~242.6 mm / 30 * 7 = 56.6 mm)
    const sevenDayNorm = isDistrict ? 56.6 : null;
    const sevenDayDep = last7Observed !== null && sevenDayNorm !== null
      ? calculateRainfallAnomaly(last7Observed, sevenDayNorm)
      : null;

    // 30-day normal (Sept normal = 242.6 mm)
    const thirtyDayNorm = isDistrict ? 242.6 : null;
    const thirtyDayDep = last30Observed !== null && thirtyDayNorm !== null
      ? calculateRainfallAnomaly(last30Observed, thirtyDayNorm)
      : null;

    const metrics: RainfallSummaryMetrics = {
      currentRainfallMm: currentMm,
      currentRainfallCategory: categorizeRainfall(currentMm),
      currentObservationTime: '2025-09-30 08:30 IST',
      currentStationName: isDistrict ? 'Koraput Met Observatory (42963)' : `${locationId} AWS (Unconnected)`,
      currentStatus: isDistrict ? 'OFFICIAL' : 'MISSING',
      currentSource: 'IMD 0.25° Gridded Daily Rainfall Dataset',

      sevenDayAccumulationMm: last7Observed,
      sevenDayNormalMm: sevenDayNorm,
      sevenDayDeparturePercent: sevenDayDep,
      sevenDayStatus: sevenDayDep !== null ? (sevenDayDep > 19 ? 'excess' : sevenDayDep < -19 ? 'deficient' : 'normal') : 'missing',
      sevenDayDataStatus: isDistrict ? 'HISTORICAL' : 'MISSING',
      sevenDaySource: 'IMD Daily Accumulation',

      thirtyDayAccumulationMm: last30Observed,
      thirtyDayNormalMm: thirtyDayNorm,
      thirtyDayDeparturePercent: thirtyDayDep,
      thirtyDayStatus: thirtyDayDep !== null ? (thirtyDayDep > 19 ? 'excess' : thirtyDayDep < -19 ? 'deficient' : 'normal') : 'missing',
      thirtyDayDataStatus: isDistrict ? 'HISTORICAL' : 'MISSING',
      thirtyDaySource: 'IMD 30-Day Sum',

      seasonalRainfallMm: seasonalObserved,
      seasonalNormalMm: seasonalNormal,
      seasonalDeparturePercent: seasonalDep,
      seasonalCategory: seasonalCat as ImdDepartureCategory,
      seasonalDataStatus: isDistrict ? 'OFFICIAL' : 'MISSING',
      seasonalSource: 'IMD 1971-2020 LPA Comparison',

      rainfallAnomalyPercent: seasonalDep,
      rainfallAnomalyCategory: seasonalCat as ImdDepartureCategory,
      anomalyPeriod: 'June 1 – September 30, 2025',
      anomalyDataStatus: isDistrict ? 'HISTORICAL' : 'MISSING',
      anomalySource: 'IMD LPA Benchmark',

      historicalNormalMm: seasonalNormal,
      annualHistoricalNormalMm: isDistrict ? (KORAPUT_DISTRICT_ANNUAL_NORMAL.normalRainfallMm as number) : null,
      normalDataStatus: 'OFFICIAL',
      normalSource: 'IMD Pune Climatology (1971-2020)',

      rainyDaysCount: rainyDays,
      heavyRainDaysCount: heavyDays,
      lastUpdated: '2025-09-30 08:30 IST',
      blockId: locationId,
      blockName: isDistrict ? 'Koraput District' : `${locationId} Block`,
      isCurrentSimulated: false,
    };

    const provenanceSources = await provider.getDataSources();

    return {
      metrics,
      dailySeries,
      cumulativeSeries,
      monthlySeries,
      drySpellStats,
      intensityDistribution,
      historicalSeasons,
      blockComparisons,
      dataQuality,
      provenanceSources,
    };
  }
}

export const rainfallService = new RainfallService();
export default rainfallService;
