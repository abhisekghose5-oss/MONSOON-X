export type PerformanceTask = 'onset' | 'break' | 'heavyRain';

export interface ModelInputVariable {
  name: string;
  category: 'climate' | 'regional' | 'historical' | 'spatial';
  source: string;
  resolution: string;
  description: string;
  importanceWeight: number; // percentage
  updateFrequency: string;
}

export interface TaskPerformanceMetrics {
  task: PerformanceTask;
  title: string;
  description: string;
  rocAuc: number | null;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  brierScore: number | null;
  calibrationError: number | null; // Expected Calibration Error (ECE)
  calibrationSlope: number | null;
  evaluationStatus: 'evaluated' | 'awaiting';
  sampleCount: number | null;
  testWindow: string;
  benchmarkBaseline: string;
  verifiedBy: string;
}

export interface CalibrationPoint {
  binLabel: string;
  forecastProbability: number; // 0 to 1
  observedFrequency: number | null; // 0 to 1, or null if awaiting
  perfectCalibration: number; // y = x line
  sampleCount: number;
}

export interface BacktestYearResult {
  year: number;
  observedOnsetDate: string | null;
  predictedOnsetDate: string | null;
  onsetDeltaDays: number | null;
  breakSpellsObserved: number | null;
  breakSpellsDetected: number | null;
  heavyRainObserved: number | null;
  heavyRainDetected: number | null;
  brierScore: number | null;
  evaluationStatus: 'evaluated' | 'awaiting';
  notes: string;
}

export interface ActualVsPredictedPoint {
  year: number;
  actualDOY: number | null; // Day of Year (e.g. 162 for June 11)
  predictedDOY: number | null;
  actualDate: string;
  predictedDate: string;
  errorDays: number | null;
  uncertaintyBandDays: number;
  status: 'evaluated' | 'awaiting';
}

export interface LeadTimeDecayPoint {
  leadDay: number;
  onsetRocAuc: number | null;
  breakRocAuc: number | null;
  heavyRainRocAuc: number | null;
}

export interface ModelPerformanceDashboardData {
  inputVariables: Record<'climate' | 'regional' | 'historical' | 'spatial', ModelInputVariable[]>;
  taskMetrics: Record<PerformanceTask, TaskPerformanceMetrics>;
  calibrationPoints: Record<PerformanceTask, CalibrationPoint[]>;
  backtestResults: BacktestYearResult[];
  actualVsPredicted: ActualVsPredictedPoint[];
  leadTimeDecay: LeadTimeDecayPoint[];
  evaluationStatus: 'evaluated' | 'awaiting';
  lastEvaluated: string;
}

