/**
 * Central API Client for FastAPI Backend
 * SIH26086 - MONSOON-X
 * 
 * Configured with VITE_API_BASE_URL with graceful fallback, timeout management,
 * offline awareness, and standardized error normalization.
 */

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export class ApiClientError extends Error {
  statusCode: number;
  statusText: string;
  code: string;
  data?: unknown;
  isNetworkError: boolean;
  isTimeout: boolean;
  isOffline: boolean;

  constructor(params: {
    message: string;
    statusCode?: number;
    statusText?: string;
    code?: string;
    data?: unknown;
    isNetworkError?: boolean;
    isTimeout?: boolean;
    isOffline?: boolean;
  }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.statusCode = params.statusCode ?? 0;
    this.statusText = params.statusText ?? 'Unknown Error';
    this.code = params.code ?? 'UNKNOWN_ERROR';
    this.data = params.data;
    this.isNetworkError = params.isNetworkError ?? false;
    this.isTimeout = params.isTimeout ?? false;
    this.isOffline = params.isOffline ?? false;
  }
}

/**
 * Normalizes API Base URL from Vite Environment Variable
 */
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || envUrl === '/') {
    return '';
  }
  // Trim trailing slash for consistent concatenation
  return envUrl.replace(/\/+$/, '');
}

/**
 * Checks if the browser environment is currently offline
 */
export function isBrowserOffline(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' && !navigator.onLine;
}

/**
 * Builds full URL with optional query parameters
 */
export function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let fullUrl = `${baseUrl}${cleanEndpoint}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += fullUrl.includes('?') ? `&${queryString}` : `?${queryString}`;
    }
  }

  return fullUrl;
}

/**
 * Core Request Dispatcher
 */
export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 6000, params, headers = {}, ...fetchOptions } = options;

  // Immediate offline check
  if (isBrowserOffline()) {
    throw new ApiClientError({
      message: 'Network offline. Using local cached telemetry.',
      statusCode: 0,
      statusText: 'Offline',
      code: 'OFFLINE',
      isOffline: true,
      isNetworkError: true,
    });
  }

  const url = buildUrl(endpoint, params);

  // Setup abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const mergedHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: mergedHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    let bodyData: unknown = null;
    if (isJson) {
      try {
        bodyData = await response.json();
      } catch {
        bodyData = null;
      }
    } else {
      try {
        bodyData = await response.text();
      } catch {
        bodyData = null;
      }
    }

    if (!response.ok) {
      const errorMsg =
        bodyData && typeof bodyData === 'object' && 'message' in bodyData
          ? String((bodyData as { message: unknown }).message)
          : bodyData && typeof bodyData === 'object' && 'detail' in bodyData
          ? String((bodyData as { detail: unknown }).detail)
          : `HTTP ${response.status}: ${response.statusText}`;

      throw new ApiClientError({
        message: errorMsg,
        statusCode: response.status,
        statusText: response.statusText,
        code: `HTTP_${response.status}`,
        data: bodyData,
      });
    }

    // Handle both direct payloads and standard FastAPI { status: "success", data: T } wrappers
    if (
      bodyData &&
      typeof bodyData === 'object' &&
      'data' in bodyData &&
      ('status' in bodyData || 'success' in bodyData)
    ) {
      return (bodyData as { data: T }).data;
    }

    return bodyData as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiClientError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiClientError({
        message: `Request timed out after ${timeoutMs}ms.`,
        statusCode: 408,
        statusText: 'Request Timeout',
        code: 'TIMEOUT',
        isTimeout: true,
        isNetworkError: true,
      });
    }

    const message = err instanceof Error ? err.message : 'Unknown network failure';
    throw new ApiClientError({
      message: `Failed to connect to backend: ${message}`,
      statusCode: 0,
      statusText: 'Network Failure',
      code: 'NETWORK_FAILURE',
      isNetworkError: true,
      isOffline: isBrowserOffline(),
    });
  }
}

/**
 * Convenience HTTP Methods
 */
export const client = {
  request,
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET', params }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
  getBaseUrl: getApiBaseUrl,
  isOffline: isBrowserOffline,
};

export default client;
