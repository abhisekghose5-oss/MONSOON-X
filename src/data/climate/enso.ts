/**
 * MONSOON-X (SIH26086)
 * Climate Signal: El Niño-Southern Oscillation (ENSO) (Step 5 - Section 4 & 18)
 * 
 * Source: NOAA Climate Prediction Center (CPC) / National Weather Service
 * Dataset: ERSSTv5 Sea Surface Temperature in Niño 3.4 Region (5°N–5°S, 170°W–120°W)
 * 
 * Teleconnection Dynamics for Koraput:
 * - Positive phase (El Niño, SST anomaly >= +0.5°C): Induces anomalous sinking motion over central/eastern India,
 *   frequently causing delayed monsoon onset, extended break spells, and cumulative rainfall deficits.
 * - Negative phase (La Niña, SST anomaly <= -0.5°C): Fosters anomalous low-level convergence and enhanced Bay of Bengal cyclogenesis,
 *   correlating with timely onset, persistent rainfall pulses, and reduced break risk.
 */

import type { ClimateIndex } from '../../types/dataArchitecture';

export const ENSO_DATA: ClimateIndex = {
  name: 'Niño 3.4 Sea Surface Temperature Anomaly',
  code: 'ENSO',
  value: -0.42,
  unit: '°C anomaly',
  anomaly: -0.42,
  phase: 'ENSO-Neutral (Cooling toward La Niña Watch)',
  source: 'NOAA Climate Prediction Center (CPC)',
  sourceUrl: 'https://www.cpc.ncep.noaa.gov/data/indices/sstoi.indices',
  observationDate: '2026-05-28',
  dataStatus: 'OFFICIAL',
  impactOnKoraput: 'Neutral-to-favorable condition. Reduced probability of severe mid-season break spells; typical onset flow expected over Southern Odisha.',
  description: 'Average equatorial Pacific SST departure from 1991-2020 base period in region 5°N-5°S, 170°W-120°W.',
};

export const HISTORICAL_ENSO_MONTHLY = [
  { month: '2026-01', anomaly: 0.18, phase: 'Neutral' },
  { month: '2026-02', anomaly: 0.05, phase: 'Neutral' },
  { month: '2026-03', anomaly: -0.12, phase: 'Neutral' },
  { month: '2026-04', anomaly: -0.28, phase: 'Neutral' },
  { month: '2026-05', anomaly: -0.42, phase: 'Neutral' },
];
