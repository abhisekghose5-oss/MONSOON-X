/**
 * KORAPUT MAUSAM INTELLIGENCE (SIH26086)
 * Climate Signal: Madden-Julian Oscillation (MJO) (Step 5 - Section 4 & 18)
 * 
 * Source: Australian Bureau of Meteorology (BoM) / Wheeler-Hendon Real-time Multivariate MJO (RMM)
 * Parameters: RMM1, RMM2, Phase (1 through 8), Amplitude
 * 
 * Teleconnection Dynamics for Koraput:
 * - Phases 2 & 3 (Indian Ocean): Major convective enhancement; optimal for monsoon onset surges and intense rain.
 * - Phase 4 (Maritime Continent): Fosters monsoon low-pressure systems drifting from northern Bay of Bengal into Koraput.
 * - Phases 6, 7 & 8 (Western Pacific / Western Hemisphere): Convective suppression over South Asia; highly correlated
 *   with dry breaks and monsoon troughs shifting north toward the Himalayan foothills.
 */

import type { ClimateIndex } from '../../types/dataArchitecture';

export const MJO_DATA: ClimateIndex = {
  name: 'Madden-Julian Oscillation (Wheeler-Hendon RMM)',
  code: 'MJO',
  value: 'Phase 3 (Amplitude: 1.42)',
  unit: 'RMM Phase & Amp',
  anomaly: 1.42,
  phase: 'Phase 3 (Eastern Indian Ocean Active Convection)',
  source: 'Australian Bureau of Meteorology (BoM) / Wheeler & Hendon',
  sourceUrl: 'http://www.bom.gov.au/climate/mjo/',
  observationDate: '2026-06-02',
  dataStatus: 'OFFICIAL',
  impactOnKoraput: 'Active Phase 3 with amplitude > 1.0 indicates strong planetary wave forcing favorable for active rainfall spells across Southern Odisha during the next 7-10 days.',
  description: 'First two principal components (RMM1, RMM2) of combined EOF of near-equatorially averaged 850-hPa zonal wind, 200-hPa zonal wind, and satellite OLR.',
};
