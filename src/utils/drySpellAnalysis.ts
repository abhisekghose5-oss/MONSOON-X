/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Dry Spell & Precipitation Mathematical Analytics Engine
 * 
 * Implements rigorous meteorology algorithms conforming to:
 * - IMD Technical Circulars on Agricultural Drought & Dry Spells
 * - WMO Dry Spell Duration & Break Monsoon Indicators
 */

import {
  DRY_DAY_RAINFALL_THRESHOLD_MM,
  DRY_SPELL_SEVERITY_THRESHOLDS,
  getDrySpellSeverity,
  IMD_RAINFALL_INTENSITIES,
} from '../config/meteorology';
import type {
  RainfallRecord,
  DrySpell,
  DrySpellMonitorStats,
  RainfallIntensityBand,
  RainfallDataQuality,
  ImdRainfallCategory,
} from '../types/rainfall';

/**
 * Evaluates whether a given daily rainfall amount represents an IMD dry day
 */
export function isDryDay(rainfallMm: number | null): boolean {
  if (rainfallMm === null || Number.isNaN(rainfallMm)) {
    return false; // Missing data cannot be assumed dry
  }
  return rainfallMm < DRY_DAY_RAINFALL_THRESHOLD_MM;
}

/**
 * Computes all contiguous dry spell episodes from a sorted sequence of daily records
 */
export function detectDrySpells(
  dailyRecords: RainfallRecord[],
  locationId: string = 'all',
  locationName: string = 'Koraput District'
): DrySpell[] {
  const spells: DrySpell[] = [];
  let currentStart: string | null = null;
  let currentEnd: string | null = null;
  let count = 0;
  let maxRainInSpell = 0;

  for (let i = 0; i < dailyRecords.length; i++) {
    const record = dailyRecords[i];
    const dry = isDryDay(record.rainfallMm);

    if (dry) {
      if (currentStart === null) {
        currentStart = record.date;
        count = 1;
        maxRainInSpell = record.rainfallMm ?? 0;
      } else {
        count++;
        if ((record.rainfallMm ?? 0) > maxRainInSpell) {
          maxRainInSpell = record.rainfallMm ?? 0;
        }
      }
      currentEnd = record.date;
    } else {
      // End of dry streak
      if (currentStart !== null && count >= DRY_SPELL_SEVERITY_THRESHOLDS.MIN_DRY_SPELL_DAYS) {
        spells.push({
          id: `dry-spell-${currentStart}-${currentEnd}`,
          startDate: currentStart,
          endDate: currentEnd || currentStart,
          durationDays: count,
          maxDailyRainfallMm: Math.round(maxRainInSpell * 10) / 10,
          severity: getDrySpellSeverity(count),
          status: 'CONCLUDED',
          locationId,
          locationName,
        });
      }
      currentStart = null;
      currentEnd = null;
      count = 0;
      maxRainInSpell = 0;
    }
  }

  // Handle active dry spell extending to the final observation
  if (currentStart !== null && count >= DRY_SPELL_SEVERITY_THRESHOLDS.MIN_DRY_SPELL_DAYS) {
    spells.push({
      id: `dry-spell-${currentStart}-${currentEnd}`,
      startDate: currentStart,
      endDate: currentEnd || currentStart,
      durationDays: count,
      maxDailyRainfallMm: Math.round(maxRainInSpell * 10) / 10,
      severity: getDrySpellSeverity(count),
      status: 'ACTIVE',
      locationId,
      locationName,
    });
  }

  return spells;
}

/**
 * Calculates summary metrics for the Dry Spell Monitor (Section 11)
 */
export function calculateDrySpellStats(
  dailyRecords: RainfallRecord[],
  locationId: string = 'all',
  locationName: string = 'Koraput District'
): DrySpellMonitorStats {
  if (!dailyRecords || dailyRecords.length === 0) {
    return {
      currentConsecutiveDryDays: 0,
      longestDrySpellDays: 0,
      averageDrySpellDays: 0,
      totalDrySpellsCount: 0,
      maxDrySpellCurrentMonsoon: 0,
      activeDrySpell: null,
      drySpellsList: [],
    };
  }

  // Calculate current consecutive dry days backward from the most recent observation
  let consecutiveDry = 0;
  for (let i = dailyRecords.length - 1; i >= 0; i--) {
    if (isDryDay(dailyRecords[i].rainfallMm)) {
      consecutiveDry++;
    } else {
      break;
    }
  }

  const allSpells = detectDrySpells(dailyRecords, locationId, locationName);
  const activeSpell = allSpells.find((s) => s.status === 'ACTIVE') || null;

  let longest = 0;
  let totalDays = 0;

  for (const s of allSpells) {
    if (s.durationDays > longest) {
      longest = s.durationDays;
    }
    totalDays += s.durationDays;
  }

  const avgDays = allSpells.length > 0 ? Math.round((totalDays / allSpells.length) * 10) / 10 : 0;

  return {
    currentConsecutiveDryDays: consecutiveDry,
    longestDrySpellDays: longest,
    averageDrySpellDays: avgDays,
    totalDrySpellsCount: allSpells.length,
    maxDrySpellCurrentMonsoon: longest,
    activeDrySpell: activeSpell,
    drySpellsList: allSpells,
  };
}

/**
 * Categorizes daily rainfall into IMD Intensity Bands (Section 13)
 */
export function calculateIntensityDistribution(
  dailyRecords: RainfallRecord[]
): RainfallIntensityBand[] {
  let seasonalTotal = 0;
  for (const r of dailyRecords) {
    if (r.rainfallMm !== null && !Number.isNaN(r.rainfallMm)) {
      seasonalTotal += r.rainfallMm;
    }
  }

  return IMD_RAINFALL_INTENSITIES.map((def) => {
    let daysCount = 0;
    let bandRainfall = 0;

    for (const r of dailyRecords) {
      const v = r.rainfallMm;
      if (v === null || Number.isNaN(v)) continue;

      let inBand = false;
      if (def.maxMm === 0.0) {
        inBand = v === 0.0;
      } else if (def.maxMm === null) {
        inBand = v >= def.minMm;
      } else {
        inBand = v >= def.minMm && v <= def.maxMm;
      }

      if (inBand) {
        daysCount++;
        bandRainfall += v;
      }
    }

    const pct = seasonalTotal > 0 ? Math.round((bandRainfall / seasonalTotal) * 1000) / 10 : 0;

    return {
      category: def.category as ImdRainfallCategory,
      minMm: def.minMm,
      maxMm: def.maxMm,
      daysCount,
      totalRainfallMm: Math.round(bandRainfall * 10) / 10,
      percentageOfSeasonalTotal: pct,
      color: def.color,
      description: def.description,
    };
  });
}

/**
 * Computes scientific Data Quality & Completeness telemetry (Section 19)
 */
export function calculateDataQuality(
  dailyRecords: RainfallRecord[],
  source: string = 'IMD 0.25° Gridded Dataset'
): RainfallDataQuality {
  const total = dailyRecords.length;
  if (total === 0) {
    return {
      totalExpectedDays: 0,
      recordsAvailable: 0,
      missingRecords: 0,
      coveragePercentage: 0,
      lastObservationDate: 'N/A',
      source,
      spatialResolution: '0.25° x 0.25° (approx 27km)',
      temporalResolution: 'Daily (08:30 IST accumulation)',
      status: 'MISSING',
    };
  }

  let available = 0;
  let missing = 0;
  let lastDate = '';

  for (const r of dailyRecords) {
    if (r.rainfallMm === null || Number.isNaN(r.rainfallMm) || r.qualityFlag === 'missing') {
      missing++;
    } else {
      available++;
      if (r.date > lastDate) {
        lastDate = r.date;
      }
    }
  }

  const coverage = Math.round((available / total) * 1000) / 10;

  return {
    totalExpectedDays: total,
    recordsAvailable: available,
    missingRecords: missing,
    coveragePercentage: coverage,
    lastObservationDate: lastDate || dailyRecords[dailyRecords.length - 1]?.date || 'N/A',
    source,
    spatialResolution: '0.25° x 0.25° (approx 27km)',
    temporalResolution: 'Daily (08:30 IST accumulation)',
    status: coverage >= 95 ? 'OFFICIAL' : coverage > 70 ? 'HISTORICAL' : 'MISSING',
  };
}
