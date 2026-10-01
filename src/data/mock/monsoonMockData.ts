import type {
  MonsoonDashboardData,
  OnsetProbabilityDensityPoint,
  TroughLatitudePoint,
  LowLevelJetPoint,
  MonsoonPhase,
} from '../../types/monsoon';
import type { KoraputBlockId } from '../../types/geo';
import { KORAPUT_BLOCKS } from '../koraputBlocks';

/**
 * Generates Bayesian Onset Probability Distribution Points
 * Models Gaussian / skewed normal probability density curve (PDF) and cumulative CDF
 * centered around June 12-13 with historical climatology comparison (June 11).
 */
function generateBayesianOnsetDistribution(blockId: KoraputBlockId | 'all'): OnsetProbabilityDensityPoint[] {
  // Southern/Eastern Ghat elevation adjustments:
  // Pottangi / Semiliguda (elevated highlands) experience earlier orographic triggers (~11 June)
  // Kotpad / Kundura (western plains) slightly later (~13-14 June)
  let peakDay = 12;
  if (blockId === 'pottangi' || blockId === 'semiliguda') peakDay = 11;
  if (blockId === 'kotpad' || blockId === 'kundura') peakDay = 13;

  const points: OnsetProbabilityDensityPoint[] = [];
  let cumulative = 0;

  for (let day = 1; day <= 24; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const date = `2026-06-${dayStr}`;
    const dayLabel = `${dayStr} Jun`;

    // Normal Gaussian formula for model PDF centered at peakDay (sigma = 2.4 days)
    const zModel = (day - peakDay) / 2.4;
    const rawPdf = Math.exp(-0.5 * zModel * zModel) * 16.5;
    const pdfProbability = Math.round(rawPdf * 10) / 10;

    // Historical normal climatological PDF centered at June 11 (sigma = 4.2 days)
    const zHist = (day - 11) / 4.2;
    const rawHist = Math.exp(-0.5 * zHist * zHist) * 10.8;
    const historicalNormalPdf = Math.round(rawHist * 10) / 10;

    cumulative = Math.min(100, Math.round((cumulative + pdfProbability * 0.42) * 10) / 10);
    // At the end ensure smooth finish to ~98-100%
    const cdfProbability = day >= 20 ? Math.min(100, 92 + (day - 20) * 2) : cumulative;

    points.push({
      date,
      dayLabel,
      pdfProbability,
      cdfProbability,
      historicalNormalPdf,
      isNormalDate: day === 11,
      isModelPeakDate: day === peakDay,
    });
  }

  return points;
}

/**
 * Generates 14-day synoptic monsoon trough latitudinal progression timeline
 * Normal axis: 22.5° N
 * Foothills break threshold: 27.0° N
 */
function generateTroughLatitudeTimeline(): TroughLatitudePoint[] {
  return [
    { date: '22 Sep', observedLat: 21.2, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '23 Sep', observedLat: 21.0, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '24 Sep', observedLat: 21.4, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '25 Sep', observedLat: 21.8, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '26 Sep', observedLat: 22.1, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '27 Sep', observedLat: 22.4, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '28 Sep', observedLat: 22.6, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '29 Sep', observedLat: 22.9, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '30 Sep', observedLat: 23.4, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '01 Oct', observedLat: 24.1, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '02 Oct', observedLat: 24.8, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '03 Oct', observedLat: 25.3, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '04 Oct', observedLat: 25.9, normalLat: 22.5, foothillsLat: 27.0 },
    { date: '05 Oct', observedLat: 26.2, normalLat: 22.5, foothillsLat: 27.0 },
  ];
}

/**
 * Generates 14-day 850 hPa Low-Level Jet (LLJ) wind speed timeline
 * Critical onset threshold: 15 knots
 */
function generateLowLevelJetTimeline(): LowLevelJetPoint[] {
  return [
    { date: '22 Sep', windSpeedKnots: 26.4, zonalComponentKnots: 23.8, thresholdKnots: 15.0 },
    { date: '23 Sep', windSpeedKnots: 28.1, zonalComponentKnots: 25.2, thresholdKnots: 15.0 },
    { date: '24 Sep', windSpeedKnots: 27.5, zonalComponentKnots: 24.9, thresholdKnots: 15.0 },
    { date: '25 Sep', windSpeedKnots: 25.0, zonalComponentKnots: 22.1, thresholdKnots: 15.0 },
    { date: '26 Sep', windSpeedKnots: 23.2, zonalComponentKnots: 20.4, thresholdKnots: 15.0 },
    { date: '27 Sep', windSpeedKnots: 21.0, zonalComponentKnots: 18.5, thresholdKnots: 15.0 },
    { date: '28 Sep', windSpeedKnots: 19.4, zonalComponentKnots: 16.8, thresholdKnots: 15.0 },
    { date: '29 Sep', windSpeedKnots: 17.8, zonalComponentKnots: 15.2, thresholdKnots: 15.0 },
    { date: '30 Sep', windSpeedKnots: 15.5, zonalComponentKnots: 13.1, thresholdKnots: 15.0 },
    { date: '01 Oct', windSpeedKnots: 14.2, zonalComponentKnots: 11.6, thresholdKnots: 15.0 },
    { date: '02 Oct', windSpeedKnots: 13.0, zonalComponentKnots: 10.2, thresholdKnots: 15.0 },
    { date: '03 Oct', windSpeedKnots: 12.1, zonalComponentKnots: 9.4, thresholdKnots: 15.0 },
    { date: '04 Oct', windSpeedKnots: 11.5, zonalComponentKnots: 8.7, thresholdKnots: 15.0 },
    { date: '05 Oct', windSpeedKnots: 11.0, zonalComponentKnots: 8.2, thresholdKnots: 15.0 },
  ];
}

/**
 * Returns mock monsoon dashboard data for any Koraput block or district aggregate
 */
export function getMockMonsoonData(blockId: KoraputBlockId | 'all' = 'all'): MonsoonDashboardData {
  const blockMeta = blockId !== 'all' ? KORAPUT_BLOCKS.find((b: { id: string }) => b.id === blockId) : null;
  const blockName = blockMeta ? `${blockMeta.name} Block` : 'Koraput District (All Blocks)';

  const currentPhase: MonsoonPhase = 'active';

  const onsetDistribution = generateBayesianOnsetDistribution(blockId);
  const troughTimeline = generateTroughLatitudeTimeline();
  const lljTimeline = generateLowLevelJetTimeline();

  // Peak mode point
  const peakPoint = onsetDistribution.find((p) => p.isModelPeakDate) || onsetDistribution[11];

  return {
    blockId,
    blockName,
    currentPhase,
    phaseLabel: 'Active Monsoon Phase (Post-Onset Transition)',
    onsetSummary: {
      predictedDate: `${peakPoint.dayLabel} 2026`,
      normalDate: '11 June',
      anomalyDays: peakPoint.isNormalDate ? 0 : 1,
      confidenceInterval50: ['10 Jun', '14 Jun'],
      confidenceInterval90: ['07 Jun', '17 Jun'],
      peakProbability: peakPoint.pdfProbability,
      confidenceScore: 84,
      atmosphericDriver:
        'ERA5 850 hPa westerly wind shear reversal combined with Bay of Bengal cyclonic circulation.',
    },
    onsetDistribution,
    troughState: {
      currentAxisLat: 22.9,
      normalAxisLat: 22.5,
      foothillsBreakLat: 27.0,
      troughStatus: 'normal',
      statusLabel: 'Active Near Normal Climatological Axis (Oscillating 21.0°N – 23.4°N)',
      activeLowPressureAreas: 1,
      synopticSystemName: 'Well-Marked Low Pressure System over North-West Bay of Bengal',
      breakHazardRisk: 'LOW',
      synopticSummary:
        'Monsoon trough extends southeastwards into North-West Bay of Bengal through coastal Odisha. Low-level cyclonic vorticity maintains continuous convective cloud bands across Koraput highlands.',
      latitudeTimeline: troughTimeline,
    },
    lljMetrics: {
      coreWindSpeedKnots: 17.8,
      normalWindSpeedKnots: 22.5,
      zonalWesterlyComponentKnots: 15.2,
      moistureFluxConvergence: 46.8, // g / (kg · m · s)
      windDirectionDeg: 250, // WSW
      status: 'weakening',
      statusLabel: 'Moderate Westerly Flow (Gradual Seasonal Weakening)',
      crossEquatorialSurgeVerified: true,
      timeline: lljTimeline,
      scientificAnalysis:
        'Findlater cross-equatorial Somali jet maintains stable moisture advection across peninsular India, but kinetic energy indicates secondary weakening trend towards early October.',
    },
    breakAlerts: [
      {
        id: 'ba-01',
        blockId: 'pottangi',
        phase: 'break-warning',
        severity: 'moderate',
        predictedStartDate: '2026-10-04',
        predictedDurationDays: 6,
        expectedRainfallDeficitPercent: -62,
        summary:
          'Elevated dry-spell probability as synoptic trough axis shows gradual northward displacement towards foothills.',
        agriculturalImpact:
          'Moisture deficit during finger millet panicle initiation; prepare farm pond supplemental irrigation.',
      },
      {
        id: 'ba-02',
        blockId: 'semiliguda',
        phase: 'break-warning',
        severity: 'moderate',
        predictedStartDate: '2026-10-05',
        predictedDurationDays: 5,
        expectedRainfallDeficitPercent: -55,
        summary:
          'Sub-surface soil moisture drying expected across upper slope red laterite soils.',
        agriculturalImpact:
          'Delay urea top dressing; apply in-situ straw mulching to conserve root zone moisture.',
      },
    ],
    dataSourceProvenance: {
      onsetModel: 'KMI Coupled Bayesian Model v2.2 (ERA5 + INSAT-3DR)',
      troughTracking: 'IMD Synoptic Weather Chart Analysis (00 UTC / 12 UTC)',
      lljReanalysis: 'ECMWF ERA5 850 hPa Zonal Wind Vector Diagnostic',
    },
    lastUpdated: new Date().toISOString(),
  };
}
