import { describe, it, expect } from "vitest";
import {
  OpenDotaError,
  OpenDotaApiError,
  OpenDotaRateLimitError,
  OpenDotaNotFoundError,
  OpenDotaTimeoutError,
  OpenDotaNetworkError,
} from "../../src/core/errors.js";

describe("Error classes", () => {
  it("OpenDotaError should have correct name", () => {
    const error = new OpenDotaError("Test error");
    expect(error.name).toBe("OpenDotaError");
    expect(error.message).toBe("Test error");
  });

  it("OpenDotaApiError should have correct properties", () => {
    const error = new OpenDotaApiError("API error", {
      status: 500,
      url: "https://api.example.com/test",
      responseBody: { message: "Internal error" },
    });
    expect(error.name).toBe("OpenDotaApiError");
    expect(error.status).toBe(500);
    expect(error.url).toBe("https://api.example.com/test");
    expect(error.responseBody).toEqual({ message: "Internal error" });
  });

  it("OpenDotaApiError should be instanceof OpenDotaError", () => {
    const error = new OpenDotaApiError("API error", {
      status: 500,
      url: "https://api.example.com/test",
    });
    expect(error).toBeInstanceOf(OpenDotaError);
  });

  it("OpenDotaRateLimitError should have correct properties", () => {
    const error = new OpenDotaRateLimitError("Rate limited", {
      status: 429,
      url: "https://api.example.com/test",
      retryAfterMs: 60000,
      remainingMinute: 0,
      remainingDay: 1000,
    });
    expect(error.name).toBe("OpenDotaRateLimitError");
    expect(error.status).toBe(429);
    expect(error.retryAfterMs).toBe(60000);
    expect(error.remainingMinute).toBe(0);
    expect(error.remainingDay).toBe(1000);
  });

  it("OpenDotaRateLimitError should be instanceof OpenDotaError", () => {
    const error = new OpenDotaRateLimitError("Rate limited", {
      status: 429,
      url: "https://api.example.com/test",
    });
    expect(error).toBeInstanceOf(OpenDotaError);
  });

  it("OpenDotaNotFoundError should have status 404", () => {
    const error = new OpenDotaNotFoundError("Not found", {
      url: "https://api.example.com/test/999",
    });
    expect(error.name).toBe("OpenDotaNotFoundError");
    expect(error.status).toBe(404);
    expect(error.url).toBe("https://api.example.com/test/999");
  });

  it("OpenDotaNotFoundError should be instanceof OpenDotaError", () => {
    const error = new OpenDotaNotFoundError("Not found");
    expect(error).toBeInstanceOf(OpenDotaError);
  });

  it("OpenDotaTimeoutError should have correct name", () => {
    const error = new OpenDotaTimeoutError("Request timed out", {
      url: "https://api.example.com/test",
    });
    expect(error.name).toBe("OpenDotaTimeoutError");
    expect(error).toBeInstanceOf(OpenDotaError);
  });

  it("OpenDotaNetworkError should have correct name", () => {
    const error = new OpenDotaNetworkError("Network error", {
      url: "https://api.example.com/test",
    });
    expect(error.name).toBe("OpenDotaNetworkError");
    expect(error).toBeInstanceOf(OpenDotaError);
  });
});
