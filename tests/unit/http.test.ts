import { describe, it, expect, vi, beforeEach } from "vitest";
import { HttpClient } from "../../src/core/http.js";
import { OpenDotaConfig } from "../../src/types/common.js";
import {
  OpenDotaRateLimitError,
  OpenDotaApiError,
  OpenDotaNotFoundError,
  OpenDotaTimeoutError,
  OpenDotaNetworkError,
} from "../../src/core/errors.js";

describe("HttpClient", () => {
  let client: HttpClient;

  beforeEach(() => {
    const config: OpenDotaConfig = {
      baseUrl: "https://api.opendota.com/api",
    };
    client = new HttpClient(config);
  });

  it("should construct URLs correctly with query params", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ test: "data" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "59",
          "X-Rate-Limit-Remaining-Day": "1999",
        },
      })
    );

    const config: OpenDotaConfig = {
      baseUrl: "https://api.opendota.com/api",
      fetch: mockFetch,
    };
    const testClient = new HttpClient(config);

    await testClient.get("/test", { foo: "bar", limit: 10 });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.opendota.com/api/test?foo=bar&limit=10",
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  it("should strip undefined query params", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ test: "data" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "59",
          "X-Rate-Limit-Remaining-Day": "1999",
        },
      })
    );

    const config: OpenDotaConfig = {
      baseUrl: "https://api.opendota.com/api",
      fetch: mockFetch,
    };
    const testClient = new HttpClient(config);

    await testClient.get("/test", { foo: "bar", limit: undefined } as { foo: string; limit?: number });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.opendota.com/api/test?foo=bar",
      expect.any(Object)
    );
  });

  it("should send Authorization header when API key is provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ test: "data" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "59",
          "X-Rate-Limit-Remaining-Day": "1999",
        },
      })
    );

    const config: OpenDotaConfig = {
      apiKey: "test-api-key",
      fetch: mockFetch,
    };
    const testClient = new HttpClient(config);

    await testClient.get("/test");

    const [, callOptions] = mockFetch.mock.calls[0];
    const headers = callOptions.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer test-api-key");
  });

  it("should parse rate limit headers correctly", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ test: "data" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "45",
          "X-Rate-Limit-Remaining-Day": "1500",
        },
      })
    );

    const config: OpenDotaConfig = {
      fetch: mockFetch,
    };
    const testClient = new HttpClient(config);

    const response = await testClient.get("/test");

    expect(response.rateLimit.remainingMinute).toBe(45);
    expect(response.rateLimit.remainingDay).toBe(1500);
  });

  it("should return null for missing rate limit headers", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ test: "data" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const config: OpenDotaConfig = {
      fetch: mockFetch,
    };
    const testClient = new HttpClient(config);

    const response = await testClient.get("/test");

    expect(response.rateLimit.remainingMinute).toBeNull();
    expect(response.rateLimit.remainingDay).toBeNull();
  });

  it("should not send Authorization header when no API key provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const testClient = new HttpClient({ fetch: mockFetch });

    await testClient.get("/test");

    const [, callOptions] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = callOptions.headers as Headers;
    expect(headers.get("Authorization")).toBeNull();
  });

  it("should respect custom baseUrl", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const testClient = new HttpClient({
      baseUrl: "https://custom.example.com/api",
      fetch: mockFetch,
    });

    await testClient.get("/heroes");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://custom.example.com/api/heroes",
      expect.any(Object)
    );
  });

  it("should throw OpenDotaNotFoundError on 404 without retrying", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );
    const testClient = new HttpClient({ fetch: mockFetch, maxRetries: 3 });

    await expect(testClient.get("/matches/999")).rejects.toThrow(OpenDotaNotFoundError);
    // Should only be called once — no retries on 404
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should throw OpenDotaApiError on 400 without retrying", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "bad request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    );
    const testClient = new HttpClient({ fetch: mockFetch, maxRetries: 3 });

    await expect(testClient.get("/test")).rejects.toThrow(OpenDotaApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should retry on 429 and throw OpenDotaRateLimitError after exhausting retries", async () => {
    vi.useFakeTimers();

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "rate limited" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      })
    );
    const testClient = new HttpClient({
      fetch: mockFetch,
      maxRetries: 2,
      retryBaseDelay: 100,
    });

    // Run timers and await the rejection together to avoid unhandled rejection
    await expect(
      Promise.all([testClient.get("/test"), vi.runAllTimersAsync()])
    ).rejects.toThrow(OpenDotaRateLimitError);

    // Initial attempt + 2 retries = 3 total calls
    expect(mockFetch).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  it("should retry on 500 and throw OpenDotaApiError after exhausting retries", async () => {
    vi.useFakeTimers();

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
    const testClient = new HttpClient({
      fetch: mockFetch,
      maxRetries: 2,
      retryBaseDelay: 100,
    });

    await expect(
      Promise.all([testClient.get("/test"), vi.runAllTimersAsync()])
    ).rejects.toThrow(OpenDotaApiError);

    expect(mockFetch).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  it("should succeed on retry after transient 500", async () => {
    vi.useFakeTimers();

    const successResponse = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({}), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(successResponse);

    const testClient = new HttpClient({
      fetch: mockFetch,
      maxRetries: 2,
      retryBaseDelay: 100,
    });

    const [result] = await Promise.all([testClient.get("/test"), vi.runAllTimersAsync()]);
    expect((result as Awaited<ReturnType<typeof testClient.get>>).data).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("should throw OpenDotaTimeoutError when AbortSignal fires", async () => {
    const controller = new AbortController();
    const abortError = new DOMException("aborted", "AbortError");
    const mockFetch = vi.fn().mockImplementation(() => {
      controller.abort();
      return Promise.reject(abortError);
    });
    const testClient = new HttpClient({ fetch: mockFetch, maxRetries: 0 });

    await expect(
      testClient.get("/test", undefined, { signal: controller.signal })
    ).rejects.toThrow(OpenDotaTimeoutError);
  });

  it("should throw OpenDotaNetworkError when fetch throws TypeError", async () => {
    const mockFetch = vi.fn().mockRejectedValue(
      new TypeError("fetch failed: network error")
    );
    const testClient = new HttpClient({ fetch: mockFetch, maxRetries: 0 });

    await expect(testClient.get("/test")).rejects.toThrow(OpenDotaNetworkError);
  });
});
