import type {
  AgricultureDashboardData,
  CropDefinition,
  CropRiskDetail,
  CropRiskMatrixRow,
  StructuredAdvisory,
} from '../types/agriculture';

/**
 * Agricultural Decision Support Service
 * 
 * Provides dynamic backend-configured crop lists, risk matrices,
 * and modular OUAT/GKMS structured agronomic advisories.
 */
export class AgricultureService {
  /**
   * Fetches complete agricultural dashboard data for a given administrative block
   */
  public static async getDashboardData(
    blockId: string = 'all'
  ): Promise<AgricultureDashboardData> {
    const { advisoryService } = await import('./advisoryService');
    return advisoryService.getAdvisory(blockId);
  }

  /**
   * Dynamically loads crop list configured by backend
   */
  public static async getCropList(): Promise<CropDefinition[]> {
    const data = await this.getDashboardData('all');
    return data.availableCrops;
  }

  /**
   * Retrieves specific crop risk evaluation
   */
  public static async getCropRiskDetail(
    cropId: string,
    blockId: string = 'all'
  ): Promise<CropRiskDetail | null> {
    const data = await this.getDashboardData(blockId);
    return data.cropDetails[cropId] || null;
  }

  /**
   * Retrieves comparative multi-crop risk matrix
   */
  public static async getCropRiskMatrix(
    blockId: string = 'all'
  ): Promise<CropRiskMatrixRow[]> {
    const data = await this.getDashboardData(blockId);
    return data.riskMatrix;
  }

  /**
   * Retrieves OUAT 5-part structured advisory for a crop
   */
  public static async getStructuredAdvisory(
    cropId: string,
    blockId: string = 'all'
  ): Promise<StructuredAdvisory | null> {
    const data = await this.getDashboardData(blockId);
    return data.advisories[cropId] || null;
  }
}

export const agricultureService = {
  getDashboardData: AgricultureService.getDashboardData,
  getCropList: AgricultureService.getCropList,
  getCropRiskDetail: AgricultureService.getCropRiskDetail,
  getCropRiskMatrix: AgricultureService.getCropRiskMatrix,
  getStructuredAdvisory: AgricultureService.getStructuredAdvisory,
};
