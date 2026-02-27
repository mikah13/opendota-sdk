import { describe, it, expect, vi } from "vitest";
import { OpenDota } from "../../src/index.js";
import { OpenDotaConfig } from "../../src/types/common.js";

describe("RequestResource", () => {
  it("should submit parse request", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ job: { match_id: 12345 } }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "53",
          "X-Rate-Limit-Remaining-Day": "1993",
        },
      })
    );

    const config: OpenDotaConfig = { fetch: mockFetch };
    const client = new OpenDota(config);

    const { data, rateLimit } = await client.request.submit(12345);

    expect(data.job.match_id).toBe(12345);
    expect(rateLimit.remainingMinute).toBe(53);
  });
});
