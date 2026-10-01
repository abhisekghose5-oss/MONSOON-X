/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Climate Signal: Indian Ocean Dipole (IOD) (Step 5 - Section 4 & 18)
 * 
 * Source: NOAA National Centers for Environmental Information (NCEI) / Bureau of Meteorology (BoM)
 * Parameter: Dipole Mode Index (DMI) — SST gradient between Western Equatorial Indian Ocean
 * (50°E–70°E, 10°S–10°N) and South-Eastern Equatorial Indian Ocean (90°E–110°E, 10°S–0°N).
 * 
 * Teleconnection Dynamics for Koraput:
 * - Positive IOD (DMI > +0.4°C): Strongly enhances cross-equatorial monsoon flow, boosts Bay of Bengal
 *   depression frequency, and can mitigate or overcome negative El Niño impacts on Koraput Kharif crops.
 * - Negative IOD (DMI < -0.4°C): Inhibits convective cloud formation over the Bay of Bengal and increases
 *   probability of monsoon lulls and dry spells in Southern Odisha.
 */

import type { ClimateIndex } from '../../types/dataArchitecture';

export const IOD_DATA: ClimateIndex = {
  name: 'Dipole Mode Index (DMI)',
  code: 'IOD',
  value: 0.28,
  unit: '°C anomaly',
  anomaly: 0.28,
  phase: 'Neutral-Positive',
  source: 'NOAA NCEI / Australian Bureau of Meteorology (BoM)',
  sourceUrl: 'https://www.stateoftheocean.osmc.noaa.gov/sur/ind/dmi.php',
  observationDate: '2026-05-31',
  dataStatus: 'OFFICIAL',
  impactOnKoraput: 'Mildly positive anomaly enhances low-level monsoon wind shear into Eastern Ghats; supports timely moisture delivery for Kharif nursery preparation.',
  description: 'Zonal gradient in sea surface temperature anomalies across the tropical Indian Ocean.',
};

export const HISTORICAL_IOD_WEEKLY = [
  { week: '2026-W18', dmi: 0.12, status: 'Neutral' },
  { week: '2026-W19', dmi: 0.19, status: 'Neutral' },
  { week: '2026-W20', dmi: 0.24, status: 'Neutral' },
  { week: '2026-W21', dmi: 0.28, status: 'Neutral-Positive' },
];
