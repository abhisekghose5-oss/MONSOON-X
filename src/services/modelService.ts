import type { IModelAdapter } from '../api/adapters/types';
import type {
  ModelPerformanceDashboardData,
  PerformanceTask,
  TaskPerformanceMetrics,
  CalibrationPoint,
  BacktestYearResult,
  ActualVsPredictedPoint,
  LeadTimeDecayPoint,
} from '../types/modelPerformance';
import { realAdapters } from '../api/adapters/realAdapters';
import { mockAdapters } from '../api/adapters/mockAdapters';
import { ApiClientError } from '../api/client';

/**
 * Model Performance & Evaluation Service
 * Endpoint: GET /api/v1/model/performance
 * 
 * Implements IModelAdapter with WMO-No. 485 verification metrics
 * and resilient FastAPI backend fallback.
 */
export class ModelService implements IModelAdapter {
  private realAdapter = realAdapters.model;
  private mockAdapter = mockAdapters.model;

  /**
   * Primary adapter method for GET /api/v1/model/performance
   */
  async getModelPerformance(): Promise<ModelPerformanceDashboardData> {
    const forceMock = import.meta.env.VITE_API_USE_MOCK === 'true';

    if (!forceMock) {
      try {
        const result = await this.realAdapter.getModelPerformance();
        if (result && result.taskMetrics && result.inputVariables) {
          return result;
        }
      } catch (err: unknown) {
        if (err instanceof ApiClientError) {
          console.warn(`[ModelService] Backend returned ${err.statusCode} (${err.code}). Using mock fallback.`, err.message);
        } else {
          console.warn('[ModelService] Backend unavailable. Using calibrated evaluation benchmarks.');
        }
      }
    }

    return this.mockAdapter.getModelPerformance();
  }

  /**
   * Task-specific metrics helper
   */
  async getTaskMetrics(task: PerformanceTask): Promise<TaskPerformanceMetrics> {
    const data = await this.getModelPerformance();
    return data.taskMetrics[task];
  }

  /**
   * Calibration curve points helper
   */
  async getCalibrationPoints(task: PerformanceTask): Promise<CalibrationPoint[]> {
    const data = await this.getModelPerformance();
    return data.calibrationPoints[task] || [];
  }

  /**
   * Backtest results helper
   */
  async getBacktestResults(): Promise<BacktestYearResult[]> {
    const data = await this.getModelPerformance();
    return data.backtestResults;
  }

  /**
   * Actual vs Predicted helper
   */
  async getActualVsPredicted(): Promise<ActualVsPredictedPoint[]> {
    const data = await this.getModelPerformance();
    return data.actualVsPredicted;
  }

  /**
   * Lead time decay helper
   */
  async getLeadTimeDecay(): Promise<LeadTimeDecayPoint[]> {
    const data = await this.getModelPerformance();
    return data.leadTimeDecay;
  }
}

const defaultModelService = new ModelService();

export const modelService = {
  getModelPerformance: defaultModelService.getModelPerformance.bind(defaultModelService),
  getTaskMetrics: defaultModelService.getTaskMetrics.bind(defaultModelService),
  getCalibrationPoints: defaultModelService.getCalibrationPoints.bind(defaultModelService),
  getBacktestResults: defaultModelService.getBacktestResults.bind(defaultModelService),
  getActualVsPredicted: defaultModelService.getActualVsPredicted.bind(defaultModelService),
  getLeadTimeDecay: defaultModelService.getLeadTimeDecay.bind(defaultModelService),
};

export default modelService;
