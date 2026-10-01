import type { KoraputBlockId } from './geo';

export interface WeatherObservation {
  blockId: KoraputBlockId;
  timestamp: string;
  rainfallMm: number;
  tempMaxC: number;
  tempMinC: number;
  relativeHumidityPercent: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  atmosphericPressureHpa: number;
  cloudCoverPercent: number;
}

export interface HyperlocalForecastDay {
  date: string;
  expectedRainfallMm: number;
  rainfallProbabilityPercent: number;
  convectiveRisk: 'none' | 'moderate' | 'high' | 'severe';
  tempMaxC: number;
  tempMinC: number;
  relativeHumidity: number;
}
