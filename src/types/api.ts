export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  timestamp: string;
  source: string;
  latencyMs?: number;
  metadata?: Record<string, unknown>;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
