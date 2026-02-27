export { OpenDota } from "./client.js";

export type { OpenDotaConfig, OpenDotaResponse, RequestOptions, RateLimitInfo } from "./types/common.js";

export {
  OpenDotaError,
  OpenDotaApiError,
  OpenDotaRateLimitError,
  OpenDotaNotFoundError,
  OpenDotaTimeoutError,
  OpenDotaNetworkError,
} from "./core/errors.js";

export type { paths, components } from "./generated/schema.js";
