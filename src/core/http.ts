import type { OpenDotaConfig, OpenDotaResponse, RequestOptions, RateLimitInfo } from "../types/common.js";
import {
  OpenDotaError,
  OpenDotaApiError,
  OpenDotaRateLimitError,
  OpenDotaNotFoundError,
  OpenDotaTimeoutError,
  OpenDotaNetworkError,
} from "./errors.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRateLimitHeaders(headers: Headers): RateLimitInfo {
  const remainingMinute = headers.get("X-Rate-Limit-Remaining-Minute");
  const remainingDay = headers.get("X-Rate-Limit-Remaining-Day");

  return {
    remainingMinute: remainingMinute !== null ? parseInt(remainingMinute, 10) : null,
    remainingDay: remainingDay !== null ? parseInt(remainingDay, 10) : null,
  };
}

class HttpClient {
  private baseUrl: string;
  private apiKey: string | undefined;
  private maxRetries: number;
  private retryBaseDelay: number;
  private timeout: number;
  private fetchFn: typeof globalThis.fetch;

  constructor(config: OpenDotaConfig) {
    this.baseUrl = (config.baseUrl ?? "https://api.opendota.com/api").replace(/\/$/, "");
    this.apiKey = config.apiKey;
    this.maxRetries = config.maxRetries ?? 3;
    this.retryBaseDelay = config.retryBaseDelay ?? 1000;
    this.timeout = config.timeout ?? 30000;
    this.fetchFn = config.fetch ?? globalThis.fetch;
  }

  async request<T>(
    method: "GET" | "POST",
    path: string,
    options?: {
      query?: object;
      body?: unknown;
      signal?: AbortSignal;
      timeout?: number;
    }
  ): Promise<OpenDotaResponse<T>> {
    const query = options?.query
      ? Object.fromEntries(
          Object.entries(options.query as Record<string, unknown>).filter(([, v]) => v !== undefined)
        )
      : undefined;
    const url = this.buildUrl(path, query);

    const headers = new Headers();
    headers.set("Accept", "application/json");

    if (this.apiKey) {
      headers.set("Authorization", `Bearer ${this.apiKey}`);
    }

    if (options?.body) {
      headers.set("Content-Type", "application/json");
    }

    const effectiveTimeout = options?.timeout ?? this.timeout;
    let signal: AbortSignal | undefined = options?.signal;

    if (effectiveTimeout > 0) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

      if (signal) {
        signal = this.combineSignals(signal, controller.signal);
      } else {
        signal = controller.signal;
      }

      try {
        return await this.executeWithRetry<T>(method, url, headers, options?.body, signal, options?.timeout);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return this.executeWithRetry<T>(method, url, headers, options?.body, signal, undefined);
  }

  private combineSignals(signal1: AbortSignal, signal2: AbortSignal): AbortSignal {
    if (typeof AbortSignal.any === "function") {
      return AbortSignal.any([signal1, signal2]);
    }

    const controller = new AbortController();
    const abort = () => controller.abort();

    signal1.addEventListener("abort", abort);
    signal2.addEventListener("abort", abort);

    if (signal1.aborted || signal2.aborted) {
      controller.abort();
    }

    return controller.signal;
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async executeWithRetry<T>(
    method: "GET" | "POST",
    url: string,
    headers: Headers,
    body: unknown,
    signal: AbortSignal | undefined,
    timeoutId: number | undefined
  ): Promise<OpenDotaResponse<T>> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const fetchOptions: RequestInit = {
          method,
          headers,
          signal,
        };

        if (body) {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await this.fetchFn(url, fetchOptions);
        const rateLimit = parseRateLimitHeaders(response.headers);

        if (response.ok) {
          const data = (await response.json()) as T;
          return { data, rateLimit, raw: response };
        }

        const responseBody = await response.json().catch(() => null);

        if (response.status === 404) {
          throw new OpenDotaNotFoundError(`Not found: ${url}`, { url, cause: responseBody });
        }

        if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
          if (attempt === this.maxRetries) {
            const retryAfter = response.headers.get("Retry-After");
            const retryAfterMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : undefined;

            if (response.status === 429) {
              throw new OpenDotaRateLimitError(`Rate limited: ${url}`, {
                status: response.status,
                url,
                retryAfterMs,
                remainingMinute: rateLimit.remainingMinute ?? undefined,
                remainingDay: rateLimit.remainingDay ?? undefined,
              });
            }
            throw new OpenDotaApiError(`Server error: ${response.status}`, {
              status: response.status,
              url,
              responseBody,
            });
          }

          const delay = this.retryBaseDelay * Math.pow(2, attempt) + Math.random() * 500;
          await sleep(delay);
          continue;
        }

        throw new OpenDotaApiError(`API error: ${response.status}`, {
          status: response.status,
          url,
          responseBody,
        });
      } catch (error) {
        if (error instanceof OpenDotaError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            if (timeoutId) {
              throw new OpenDotaTimeoutError(`Request timed out after ${this.timeout}ms`, { url });
            }
            throw new OpenDotaTimeoutError("Request was aborted", { url, cause: error });
          }

          if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new OpenDotaNetworkError(`Network error: ${error.message}`, { url, cause: error });
          }
        }

        throw error;
      }
    }

    throw new OpenDotaError("Unexpected error in retry loop");
  }

  async get<T>(
    path: string,
    query?: object,
    options?: RequestOptions
  ): Promise<OpenDotaResponse<T>> {
    return this.request<T>("GET", path, { query, ...options });
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<OpenDotaResponse<T>> {
    return this.request<T>("POST", path, { body, ...options });
  }
}

export { HttpClient };
