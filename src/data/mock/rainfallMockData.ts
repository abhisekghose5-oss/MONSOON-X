import type {
  RainfallDashboardData,
  DailyRainfallPoint,
  CumulativeRainfallPoint,
  MonthlyAnomalyPoint,
  BlockRainfallComparison,
  RainfallSummaryMetrics,
  ImdRainfallCategory,
  ImdDepartureCategory,
} from '../../types/rainfall';
import type { KoraputBlockId } from '../../types/geo';
import { KORAPUT_BLOCKS } from '../koraputBlocks';

function getImdRainfallCategory(mm: number): ImdRainfallCategory {
  if (mm === 0) return 'No Rain';
  if (mm <= 2.4) return 'Very Light Rain';
  if (mm <= 15.5) return 'Light Rain';
  if (mm <= 64.4) return 'Moderate Rain';
  if (mm <= 115.5) return 'Heavy Rain';
  if (mm <= 204.4) return 'Very Heavy Rain';
  return 'Extremely Heavy Rain';
}

function getImdDepartureCategory(depPercent: number): ImdDepartureCategory {
  if (depPercent >= 60) return 'Large Excess';
  if (depPercent >= 20) return 'Excess';
  if (depPercent >= -19) return 'Normal';
  if (depPercent >= -59) return 'Deficient';
  return 'Large Deficient';
}

// Elevation multiplier for block-level downscaling
const BLOCK_FACTORS: Record<string, number> = {
  all: 1.0,
  koraput: 1.04,
  jeypore: 0.94,
  semiliguda: 1.10,
  pottangi: 1.16,
  nandapur: 1.06,
  lamtaput: 1.02,
  dasamantapur: 1.05,
  laxmipur: 1.08,
  narayanpatna: 1.12,
  bandhugaon: 1.14,
  borigumma: 0.92,
  kotpad: 0.88,
  kundra: 0.90,
  boipariguda: 0.95,
};

// Generate realistic daily time series for 45 observed days + 15 forecast days
function generateDailySeries(factor: number): {
  dailySeries: DailyRainfallPoint[];
  cumulativeSeries: CumulativeRainfallPoint[];
} {
  const dailySeries: DailyRainfallPoint[] = [];
  const cumulativeSeries: CumulativeRainfallPoint[] = [];

  // Anchor date: 2026-09-29
  const baseDate = new Date(2026, 8, 29); // 29 Sept 2026

  // Historical observed sequence (past 45 days: Aug 15 to Sept 29)
  const pastRainfallRaw = [
    12.4, 28.6, 64.2, 85.4, 42.1, 18.0, 5.4, 2.0, 0.0, 0.0,
    14.2, 38.5, 52.0, 31.4, 8.6, 4.2, 0.0, 1.2, 16.5, 34.2,
    72.0, 48.6, 22.4, 9.8, 4.0, 0.0, 0.0, 0.0, 8.4, 24.6,
    58.2, 36.4, 18.2, 12.0, 6.4, 2.8, 14.6, 32.0, 48.5, 26.2,
    18.4, 9.2, 14.8, 22.6, 16.4, // Sept 29 today = 16.4mm
  ];

  // Daily climatological normal profile for late monsoon (mm/day)
  const baseDailyNormal = 11.2;

  let runningObservedCum = 520.0 * factor; // starting cumulative baseline at Aug 15
  let runningNormalCum = 495.0 * factor;

  // Process past 45 days
  for (let i = 0; i < pastRainfallRaw.length; i++) {
    const daysAgo = pastRainfallRaw.length - 1 - i;
    const d = new Date(baseDate);
    d.setDate(d.getDate() - daysAgo);

    const rawMm = pastRainfallRaw[i] * factor;
    const rainfallMm = Math.round(rawMm * 10) / 10;
    const normalMm = Math.round((baseDailyNormal + Math.sin(i / 5) * 2.2) * factor * 10) / 10;

    runningObservedCum += rainfallMm;
    runningNormalCum += normalMm;

    // Calculate 7-day rolling
    const sliceStart = Math.max(0, i - 6);
    const rollingSum = pastRainfallRaw.slice(sliceStart, i + 1).reduce((a, b) => a + b, 0) * factor;
    const rollingNormal = normalMm * 7;

    const dateStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const dayOfWeek = d.toLocaleDateString('en-IN', { weekday: 'short' });

    dailySeries.push({
      date: dateStr,
      displayDate,
      dayOfWeek,
      dataType: 'OBSERVED',
      rainfallMm,
      normalMm,
      sevenDayRollingMm: Math.round(rollingSum * 10) / 10,
      rollingNormalMm: Math.round(rollingNormal * 10) / 10,
      anomalyMm: Math.round((rainfallMm - normalMm) * 10) / 10,
      imdCategory: getImdRainfallCategory(rainfallMm),
      isSimulated: true,
    });

    cumulativeSeries.push({
      date: dateStr,
      displayDate,
      dayIndex: i + 1,
      dataType: 'OBSERVED',
      cumulativeObservedMm: Math.round(runningObservedCum * 10) / 10,
      cumulativeForecastMm: null,
      cumulativeNormalMm: Math.round(runningNormalCum * 10) / 10,
    });
  }

  // Future 14 forecast days (Sept 30 to Oct 13)
  const forecastRainfallRaw = [
    24.2, 42.6, 68.4, 52.0, 31.5, 18.2, 8.4, 4.2, 2.0, 1.0, 0.0, 4.5, 12.0, 18.5,
  ];

  let runningForecastCum = runningObservedCum;

  for (let j = 0; j < forecastRainfallRaw.length; j++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + (j + 1));

    const meanMm = Math.round(forecastRainfallRaw[j] * factor * 10) / 10;
    const normalMm = Math.round((9.5 - j * 0.3) * factor * 10) / 10; // normal declining in Oct

    runningForecastCum += meanMm;
    runningNormalCum += normalMm;

    // Uncertainty spread
    const spreadMin = Math.max(0, Math.round((meanMm * 0.65) * 10) / 10);
    const spreadMax = Math.round((meanMm * 1.45) * 10) / 10;

    // Rolling sum including previous days
    const recentObservedCount = Math.max(0, 6 - j);
    const recentObserved = pastRainfallRaw.slice(pastRainfallRaw.length - recentObservedCount).reduce((a, b) => a + b, 0) * factor;
    const recentForecast = forecastRainfallRaw.slice(0, j + 1).reduce((a, b) => a + b, 0) * factor;
    const rollingSum = recentObserved + recentForecast;
    const rollingNormal = normalMm * 7;

    const dateStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const dayOfWeek = d.toLocaleDateString('en-IN', { weekday: 'short' });

    dailySeries.push({
      date: dateStr,
      displayDate,
      dayOfWeek,
      dataType: 'FORECAST',
      rainfallMm: meanMm,
      normalMm,
      sevenDayRollingMm: Math.round(rollingSum * 10) / 10,
      rollingNormalMm: Math.round(rollingNormal * 10) / 10,
      anomalyMm: Math.round((meanMm - normalMm) * 10) / 10,
      forecastConfidencePercent: Math.max(50, 92 - j * 3), // decay confidence with horizon
      forecastSpreadMinMm: spreadMin,
      forecastSpreadMaxMm: spreadMax,
      imdCategory: getImdRainfallCategory(meanMm),
      isSimulated: true,
    });

    cumulativeSeries.push({
      date: dateStr,
      displayDate,
      dayIndex: pastRainfallRaw.length + j + 1,
      dataType: 'FORECAST',
      cumulativeObservedMm: null,
      cumulativeForecastMm: Math.round(runningForecastCum * 10) / 10,
      cumulativeNormalMm: Math.round(runningNormalCum * 10) / 10,
      forecastSpreadUpperMm: Math.round((runningForecastCum + (j + 1) * 6 * factor) * 10) / 10,
      forecastSpreadLowerMm: Math.round((runningForecastCum - (j + 1) * 4 * factor) * 10) / 10,
    });
  }

  return { dailySeries, cumulativeSeries };
}

// Monthly departure data across Kharif monsoon
function generateMonthlySeries(factor: number): MonthlyAnomalyPoint[] {
  const baseMonthly = [
    { month: 'Jun', monthFull: 'June 2026', year: 2026, obs: 204.2, norm: 218.0, dt: 'OBSERVED' as const },
    { month: 'Jul', monthFull: 'July 2026', year: 2026, obs: 395.4, norm: 372.5, dt: 'OBSERVED' as const },
    { month: 'Aug', monthFull: 'August 2026', year: 2026, obs: 428.6, norm: 405.0, dt: 'OBSERVED' as const },
    { month: 'Sep', monthFull: 'September 2026', year: 2026, obs: 288.4, norm: 268.2, dt: 'OBSERVED' as const },
    { month: 'Oct', monthFull: 'October 2026', year: 2026, obs: 114.2, norm: 130.5, dt: 'MODEL_OUTPUT' as const, notes: 'Ensemble NWP Projection' },
  ];

  return baseMonthly.map((m) => {
    const observedMm = Math.round(m.obs * factor * 10) / 10;
    const normalMm = Math.round(m.norm * factor * 10) / 10;
    const departurePercent = Math.round(((observedMm - normalMm) / normalMm) * 1000) / 10;

    return {
      month: m.month,
      monthFull: m.monthFull,
      year: m.year,
      observedMm,
      normalMm,
      departurePercent,
      category: getImdDepartureCategory(departurePercent),
      dataType: m.dt,
      notes: m.notes,
    };
  });
}

// Block comparisons for all 14 Koraput blocks
function generateBlockComparisons(): BlockRainfallComparison[] {
  return KORAPUT_BLOCKS.map((block) => {
    const factor = BLOCK_FACTORS[block.id] || 1.0;
    const currentMm = Math.round(16.4 * factor * 10) / 10;
    const sevenDayMm = Math.round(98.2 * factor * 10) / 10;
    const seasonalMm = Math.round(1316.6 * factor * 10) / 10;
    const seasonalNormalMm = Math.round(1263.7 * factor * 10) / 10;
    const departurePercent = Math.round(((seasonalMm - seasonalNormalMm) / seasonalNormalMm) * 1000) / 10;

    let soilMoistureStatus: BlockRainfallComparison['soilMoistureStatus'] = 'Adequate';
    if (departurePercent > 18) soilMoistureStatus = 'Excess Saturated';
    else if (departurePercent < -15) soilMoistureStatus = 'Moisture Stress';
    else if (sevenDayMm > 80) soilMoistureStatus = 'Optimal';

    return {
      blockId: block.id,
      blockName: block.name,
      elevationMeters: block.elevationMeters,
      currentMm,
      sevenDayMm,
      seasonalMm,
      seasonalNormalMm,
      departurePercent,
      category: getImdDepartureCategory(departurePercent),
      soilMoistureStatus,
    };
  });
}

export function getMockRainfallData(blockId: KoraputBlockId | 'all' = 'all'): RainfallDashboardData {
  const factor = BLOCK_FACTORS[blockId] || 1.0;
  const { dailySeries, cumulativeSeries } = generateDailySeries(factor);
  const monthlySeries = generateMonthlySeries(factor);
  const blockComparisons = generateBlockComparisons();

  const blockInfo = blockId === 'all'
    ? { name: 'All 14 Blocks (District Average)', id: 'all' as const }
    : KORAPUT_BLOCKS.find((b) => b.id === blockId) || { name: 'Koraput', id: 'koraput' as const };

  const currentRainfallMm = Math.round(16.4 * factor * 10) / 10;
  const sevenDayAccumulationMm = Math.round(98.2 * factor * 10) / 10;
  const sevenDayNormalMm = Math.round(82.5 * factor * 10) / 10;
  const sevenDayDeparturePercent = Math.round(((sevenDayAccumulationMm - sevenDayNormalMm) / sevenDayNormalMm) * 1000) / 10;

  const thirtyDayAccumulationMm = Math.round(342.6 * factor * 10) / 10;
  const thirtyDayNormalMm = Math.round(310.2 * factor * 10) / 10;
  const thirtyDayDeparturePercent = Math.round(((thirtyDayAccumulationMm - thirtyDayNormalMm) / thirtyDayNormalMm) * 1000) / 10;

  const seasonalRainfallMm = Math.round(1316.6 * factor * 10) / 10;
  const seasonalNormalMm = Math.round(1263.7 * factor * 10) / 10;
  const seasonalDeparturePercent = Math.round(((seasonalRainfallMm - seasonalNormalMm) / seasonalNormalMm) * 1000) / 10;

  const annualHistoricalNormalMm = Math.round(1522.6 * factor * 10) / 10;

  const metrics: RainfallSummaryMetrics = {
    currentRainfallMm,
    currentRainfallCategory: getImdRainfallCategory(currentRainfallMm),
    currentObservationTime: 'Today, 08:30 IST (24h Accumulation)',
    currentStationName: blockId === 'all' ? 'Koraput Agro-AWS Network Average' : `${blockInfo.name} IMD Station`,
    isCurrentSimulated: true,

    sevenDayAccumulationMm,
    sevenDayNormalMm,
    sevenDayDeparturePercent,
    sevenDayStatus: sevenDayDeparturePercent >= 19 ? 'excess' : sevenDayDeparturePercent <= -19 ? 'deficient' : 'normal',

    thirtyDayAccumulationMm,
    thirtyDayNormalMm,
    thirtyDayDeparturePercent,
    thirtyDayStatus: thirtyDayDeparturePercent >= 19 ? 'excess' : thirtyDayDeparturePercent <= -19 ? 'deficient' : 'normal',

    seasonalRainfallMm,
    seasonalNormalMm,
    seasonalDeparturePercent,
    seasonalCategory: getImdDepartureCategory(seasonalDeparturePercent),

    rainfallAnomalyPercent: seasonalDeparturePercent,
    rainfallAnomalyCategory: getImdDepartureCategory(seasonalDeparturePercent),

    historicalNormalMm: seasonalNormalMm,
    annualHistoricalNormalMm,

    rainyDaysCount: Math.round(62 * Math.min(1.15, Math.max(0.88, factor))),
    heavyRainDaysCount: Math.round(9 * Math.min(1.25, Math.max(0.75, factor))),
    lastUpdated: '2026-09-29T08:30:00+05:30',
    blockId,
    blockName: blockInfo.name,
  };

  return {
    metrics,
    dailySeries,
    cumulativeSeries,
    monthlySeries,
    blockComparisons,
    drySpellStats: {
      currentConsecutiveDryDays: 1,
      longestDrySpellDays: 9,
      averageDrySpellDays: 4.8,
      totalDrySpellsCount: 4,
      maxDrySpellCurrentMonsoon: 9,
      activeDrySpell: null,
      drySpellsList: [],
    },
    intensityDistribution: [],
    historicalSeasons: [],
    dataQuality: {
      totalExpectedDays: 122,
      recordsAvailable: 120,
      missingRecords: 2,
      coveragePercentage: 98.4,
      lastObservationDate: '2026-09-29',
      source: 'IMD AWS Network (Simulated)',
      spatialResolution: '0.25° x 0.25°',
      temporalResolution: 'Daily',
      status: 'DEMO',
    },
    provenanceSources: [],
    metadata: {
      sourceStations: [
        'IMD Koraput Observatory (Station ID 43057)',
        'Jeypore Agromet AWS (OUAT-RRTTS)',
        'Semiliguda Hill Agriculture Research Station',
        'Pottangi High Altitude Research Station',
      ],
      radarIntegration: 'DWR Visakhapatnam Doppler Weather Radar (Range 250km covering Koraput)',
      satelliteModel: 'INSAT-3DR TIR Hydro-Estimator Precipitation Product (HEM)',
      nwpEnsemble: 'ECMWF IFS 0.1° + IMD GFS-T1534 Downscaled Multi-Model Ensemble',
      climatologyBaseline: 'IMD Pune 1971–2020 Long Period Average (50-Year Gridded Climatology)',
      lastTelemetryFetch: '29 Sep 2026, 08:30 IST',
      simulationNotice:
        'DEMO / SIMULATION MODE: Telemetry values and forecast spreads represent downscaled hydrological simulations calibrated against Koraput micro-relief.',
    },
  };
}
