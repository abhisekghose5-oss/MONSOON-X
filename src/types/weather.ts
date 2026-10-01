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

export interface LiveWeatherCurrent {
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidityPercent: number;
  precipitationMm: number;
  weatherCode: number;
  weatherCondition: string;
  weatherIconName: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-lightning' | 'wind';
  windSpeedKmh: number;
  surfacePressureHpa: number;
  isDay: boolean;
  blockId: string;
  blockName: string;
  elevationMeters: number;
  timestamp: string;
  source: string;
}

export interface LiveDailyForecast {
  date: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationMm: number;
  precipitationProbabilityPercent: number;
  weatherCode: number;
  condition: string;
}
