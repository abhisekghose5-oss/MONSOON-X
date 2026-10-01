import type {
  HyperlocalForecastResponse,
  ForecastHorizon,
  ForecastTimelinePoint,
  MonsoonPhaseInfo,
  ForecastConfidenceIndicator,
  ForecastSummaryNarrative,
  ForecastMetadata,
} from '../../types/forecast';
import { KORAPUT_BLOCKS } from '../koraputBlocks';

/**
 * Generates realistic downscaled ensemble forecast vectors for Koraput
 */
export function generateMockForecast(
  locationId: string = 'all',
  horizon: ForecastHorizon | number = '14d'
): HyperlocalForecastResponse {
  const horizonDays =
    typeof horizon === 'number'
      ? horizon
      : horizon === '7d'
      ? 7
      : horizon === '14d'
      ? 14
      : horizon === '21d'
      ? 21
      : 30;

  const horizonStr: ForecastHorizon =
    horizonDays === 7 ? '7d' : horizonDays === 14 ? '14d' : horizonDays === 21 ? '21d' : '30d';

  const block =
    locationId !== 'all'
      ? KORAPUT_BLOCKS.find((b) => b.id === locationId)
      : null;

  const locationName = block ? `${block.name} Block` : 'Koraput District (All Blocks)';
  const elevation = block ? block.elevationMeters : 870;

  // Elevation multiplier (+10% orographic convection in high altitude)
  const orographicFactor = elevation > 900 ? 1.15 : elevation < 700 ? 0.92 : 1.0;

  const baseDate = new Date(2026, 8, 30); // 30 Sept 2026

  const timeline: ForecastTimelinePoint[] = [];

  for (let d = 1; d <= horizonDays; d++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + (d - 1));

    const dateStr = curDate.toISOString().split('T')[0];
    const displayDate = curDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const dayOfWeek = curDate.toLocaleDateString('en-IN', { weekday: 'short' });

    // Weather pattern simulation:
    // Days 1-4: Bay of Bengal low-pressure remnant (High rain, low break)
    // Days 5-11: Dry spell trough shift northward (High break probability, low rain)
    // Days 12-21: Easterly wave / revival pulse
    // Days 22-30: Climatological reversion / transition
    let rawHeavyRain: number;
    let rawBreak: number;
    let rawOnset: number;
    let expectedRainMm: number;

    if (d <= 4) {
      rawHeavyRain = (72 - d * 8) * orographicFactor;
      rawBreak = 12 + d * 3;
      rawOnset = 5;
      expectedRainMm = Math.max(8, (48 - d * 9) * orographicFactor);
    } else if (d <= 11) {
      rawHeavyRain = Math.max(10, 28 - (d - 4) * 3);
      rawBreak = Math.min(84, 30 + (d - 4) * 9);
      rawOnset = 4;
      expectedRainMm = Math.max(1.2, 14 - (d - 4) * 2.2);
    } else if (d <= 20) {
      rawHeavyRain = 35 + Math.sin(d) * 15;
      rawBreak = 45 - (d - 11) * 3.5;
      rawOnset = 12 + Math.sin(d) * 8; // Secondary surge / NE pulse indicator
      expectedRainMm = 12 + Math.sin(d) * 8;
    } else {
      rawHeavyRain = 25 + Math.cos(d) * 8;
      rawBreak = 40 + Math.sin(d) * 10;
      rawOnset = 18 + Math.cos(d) * 6;
      expectedRainMm = 6.5 + Math.cos(d) * 4;
    }

    const heavyRainProb = Math.min(95, Math.max(5, Math.round(rawHeavyRain)));
    const breakProb = Math.min(95, Math.max(5, Math.round(rawBreak)));
    const onsetProb = Math.min(95, Math.max(2, Math.round(rawOnset)));

    // Uncertainty spread increases with lead time (Laplace/Gaussian ensemble dispersion)
    const dispersion = Math.round(4 + d * 0.95);
    const dominantProb = Math.max(heavyRainProb, breakProb, onsetProb);
    const lowerBound = Math.max(0, dominantProb - dispersion);
    const upperBound = Math.min(100, dominantProb + dispersion);

    // Confidence decays monotonically with forecast horizon
    const confidenceScore = Math.max(45, Math.round(94 - d * 1.5));

    timeline.push({
      day: d,
      date: dateStr,
      displayDate,
      dayOfWeek,
      onsetProbability: onsetProb,
      breakProbability: breakProb,
      heavyRainProbability: heavyRainProb,
      uncertaintyBand: {
        lowerBound,
        upperBound,
        spreadMm: Math.round(dispersion * 0.4 * 10) / 10,
      },
      expectedRainfallMm: Math.round(expectedRainMm * 10) / 10,
      rainfallProbabilityPercent: Math.min(98, Math.max(15, Math.round(expectedRainMm * 2.2 + 25))),
      confidenceScore,
      convectiveRisk:
        heavyRainProb >= 65
          ? 'High'
          : heavyRainProb >= 40
          ? 'Moderate'
          : heavyRainProb >= 80
          ? 'Severe'
          : 'Nominal',
    });
  }

  // Monsoon Phase (Explicitly provided by model run)
  const monsoonPhase: MonsoonPhaseInfo = {
    currentPhase: 'Active',
    phaseCode: 'SWM-ACT-04',
    confidenceScore: 84,
    synopticBasis:
      'Well-marked cyclonic circulation over West-Central Bay of Bengal inducing vigorous south-westerly moisture flux (28–34 knots at 850 hPa) across the Eastern Ghats escarpment.',
    transitionRisk:
      'High probability of shifting into "Break Watch" between Day 6 and Day 10 as the monsoon trough drifts northward toward the Himalayan foothills.',
    agriculturalAdvisory:
      'Maintain surface field drainage for standing Kharif paddy to prevent submergence. Complete fertilizer top-dressing before Day 4 prior to heavy runoff events.',
    phaseSinceDate: '2026-09-24',
    expectedNextPhase: 'Break Watch',
    phaseTrajectory: [
      { phase: 'Active', probability: 92, horizonDays: 4 },
      { phase: 'Break Watch', probability: 68, horizonDays: 8 },
      { phase: 'Break', probability: 54, horizonDays: 14 },
      { phase: 'Revival', probability: 42, horizonDays: 21 },
    ],
  };

  const confidence: ForecastConfidenceIndicator = {
    overallScore: horizonDays <= 7 ? 88 : horizonDays <= 14 ? 76 : horizonDays <= 21 ? 64 : 54,
    tier: horizonDays <= 7 ? 'High' : horizonDays <= 14 ? 'Moderate' : 'Low',
    decayFactorPerWeek: 11.5,
    assessmentText:
      horizonDays <= 7
        ? 'High confidence synoptic consensus across ECMWF IFS and NCMRWF NCUM members.'
        : horizonDays <= 14
        ? 'Moderate confidence: Synoptic trough axis placement spread expands beyond 168 hours.'
        : 'Extended outlook: Trajectories indicate climatological tendency with higher ensemble variance.',
    satelliteValidation: 'Verified',
  };

  const summary: ForecastSummaryNarrative = {
    headline:
      horizonDays <= 7
        ? 'Active Phase Peak followed by Early October Dry Spell Transition'
        : 'Multi-Week Monsoon Dynamics: Convective Surge transitioning into Mid-Range Break Interval',
    synopticDynamics:
      'Synoptic steering by low-tropospheric shear zone over 18°N–20°N latitude belt. Orographic precipitation enhancement active along Pottangi and Semiliguda high-altitude ridgelines.',
    primaryHazardWindow: '30 Sep – 03 Oct (Days 1–4): Heavy rainfall alert (> 50mm / 24h risk in 4 blocks)',
    agriculturalImpact:
      'Optimal soil moisture recharge for mid-stage paddy tillering; harvest window for early upland millets (Mandia/Ragi) should be deferred until Day 6 dry window.',
    convectiveOutlook: 'Frequent afternoon convective thunderstorms with cloud-to-ground lightning risk.',
  };

  const metadata: ForecastMetadata = {
    modelVersion: 'KMI-Downscaled Ensemble v2.4 (ECMWF IFS 0.1° + IMD GFS-T1534)',
    generatedTimestamp: '2026-09-29T06:00:00Z',
    cycleName: '06:00 UTC Synoptic Cycle (11:30 IST Initialization)',
    gridResolutionKm: 1.2,
    ensembleMembers: 51,
    isDemoModelOutput: true,
    dataSources: [
      'ECMWF IFS Integrated Forecasting System (0.1° resolution)',
      'IMD Global Forecast System (GFS-T1534)',
      'NCMRWF NCUM-Global 12km Assimilation',
      'INSAT-3DR Rapid-Scan Radiometer Water Vapor Winds',
      'SRTM 30m Digital Elevation Model (Topographic Correction)',
    ],
  };

  return {
    locationId,
    locationName,
    elevationMeters: elevation,
    horizon: horizonStr,
    horizonDays,
    timeline,
    monsoonPhase,
    confidence,
    summary,
    metadata,
  };
}
