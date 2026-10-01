import { getMockOverviewData } from '../data/mock/overviewMockData';
import type { OverviewDashboardData } from '../types/overview';
import { request } from './apiClient';

export const overviewService = {
  /**
   * Retrieves high-level situation and prediction outlook for Koraput
   * @param blockId - specific block ID or 'all' for entire district
   */
  async getOverviewData(blockId: string = 'all'): Promise<OverviewDashboardData> {
    // Attempt backend API fetch if connected, otherwise provide calibrated simulation dataset
    try {
      const endpoint = `/api/v1/overview?blockId=${encodeURIComponent(blockId)}`;
      const res = await request<OverviewDashboardData>(endpoint);
      return res.data;
    } catch {
      // Return realistic mock data service response with simulated network resolution
      return new Promise<OverviewDashboardData>((resolve) => {
        setTimeout(() => {
          resolve(getMockOverviewData(blockId));
        }, 120);
      });
    }
  },
};
