import { request } from './apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type { WeatherObservation, HyperlocalForecastDay } from '../types/weather';
import type { KoraputBlockId } from '../types/geo';

export const weatherService = {
  async getCurrentObservations(blockId?: KoraputBlockId): Promise<WeatherObservation[]> {
    const query = blockId ? `?blockId=${blockId}` : '';
    const res = await request<WeatherObservation[]>(`${API_ENDPOINTS.WEATHER_CURRENT}${query}`);
    return res.data;
  },

  async getHyperlocalForecast(
    blockId: KoraputBlockId,
    horizonDays: number = 7
  ): Promise<HyperlocalForecastDay[]> {
    const res = await request<HyperlocalForecastDay[]>(
      `${API_ENDPOINTS.WEATHER_FORECAST}?blockId=${blockId}&horizon=${horizonDays}`
    );
    return res.data;
  },
};
