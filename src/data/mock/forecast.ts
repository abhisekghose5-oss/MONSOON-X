/**
 * MONSOON-X (SIH26086)
 * Demo Forecast Mock Fallback (Step 5 - Section 18 & 20)
 * 
 * DISCLAIMER & SCIENTIFIC TRANSPARENCY:
 * This file provides structured fallback data for the forecast interface.
 * The production machine learning / numerical weather prediction forecast engine
 * is NOT CONNECTED at this stage.
 * 
 * Status: DEMO MODEL OUTPUT
 * Operational Model Status: "Forecast model: Not connected"
 */

import type { HyperlocalForecastResponse } from '../../types/forecast';
import { generateMockForecast } from './forecastMockData';

export const FORECAST_MODEL_STATUS = 'Forecast model: Not connected' as const;
export const FORECAST_DATA_STATUS = 'DEMO MODEL OUTPUT' as const;

/**
 * Accessor for mock forecast responses with explicit DEMO labelling
 */
export function getDemoForecast(
  locationId: string = 'all',
  horizon: '7d' | '14d' | '21d' | '30d' = '14d'
): HyperlocalForecastResponse {
  const result = generateMockForecast(locationId, horizon);

  // Enforce explicit demo labelling
  result.metadata.isDemoModelOutput = true;
  result.metadata.modelVersion = 'Simulation Engine (Model Not Connected)';
  result.metadata.cycleName = 'Simulated Cycle (Demo)';

  return result;
}

export { generateMockForecast };
