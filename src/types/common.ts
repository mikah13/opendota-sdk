/**
 * SDK-level types that don't come from the schema.
 */

export interface OpenDotaConfig {
  apiKey?: string;
  baseUrl?: string;
  maxRetries?: number;
  retryBaseDelay?: number;
  timeout?: number;
  fetch?: typeof globalThis.fetch;
}

export interface OpenDotaResponse<T> {
  data: T;
  rateLimit: RateLimitInfo;
  raw: Response;
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
}

export interface RateLimitInfo {
  remainingMinute: number | null;
  remainingDay: number | null;
}
