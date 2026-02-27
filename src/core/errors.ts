export class OpenDotaError extends Error {
  name = "OpenDotaError";
  status?: number;
  url?: string;

  constructor(message: string, options?: { status?: number; url?: string; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.status = options?.status;
    this.url = options?.url;
    Error.captureStackTrace(this, OpenDotaError);
  }
}

export class OpenDotaApiError extends OpenDotaError {
  name = "OpenDotaApiError";
  status: number;
  responseBody: unknown;

  constructor(message: string, options: { status: number; url: string; responseBody?: unknown; cause?: unknown }) {
    super(message, { status: options.status, url: options.url, cause: options.cause });
    this.status = options.status;
    this.responseBody = options.responseBody ?? null;
    Error.captureStackTrace(this, OpenDotaApiError);
  }
}

export class OpenDotaRateLimitError extends OpenDotaError {
  name = "OpenDotaRateLimitError";
  status: number;
  retryAfterMs?: number;
  remainingMinute?: number;
  remainingDay?: number;

  constructor(message: string, options: {
    status: number;
    url: string;
    retryAfterMs?: number;
    remainingMinute?: number;
    remainingDay?: number;
    cause?: unknown;
  }) {
    super(message, { status: options.status, url: options.url, cause: options.cause });
    this.status = options.status;
    this.retryAfterMs = options.retryAfterMs;
    this.remainingMinute = options.remainingMinute;
    this.remainingDay = options.remainingDay;
    Error.captureStackTrace(this, OpenDotaRateLimitError);
  }
}

export class OpenDotaNotFoundError extends OpenDotaError {
  name = "OpenDotaNotFoundError";
  status = 404;

  constructor(message: string, options?: { url?: string; cause?: unknown }) {
    super(message, { status: 404, url: options?.url, cause: options?.cause });
    Error.captureStackTrace(this, OpenDotaNotFoundError);
  }
}

export class OpenDotaTimeoutError extends OpenDotaError {
  name = "OpenDotaTimeoutError";

  constructor(message: string, options?: { url?: string; cause?: unknown }) {
    super(message, { cause: options?.cause });
    Error.captureStackTrace(this, OpenDotaTimeoutError);
  }
}

export class OpenDotaNetworkError extends OpenDotaError {
  name = "OpenDotaNetworkError";

  constructor(message: string, options?: { url?: string; cause?: unknown }) {
    super(message, { cause: options?.cause });
    Error.captureStackTrace(this, OpenDotaNetworkError);
  }
}
