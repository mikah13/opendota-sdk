import { describe, it, expect, vi } from "vitest";
import { OpenDota } from "../../src/index.js";
import { OpenDotaConfig } from "../../src/types/common.js";

describe("MatchesResource", () => {
  it("should fetch match data by ID", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ match_id: 12345, duration: 2400 }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "59",
          "X-Rate-Limit-Remaining-Day": "1999",
        },
      })
    );

    const config: OpenDotaConfig = { fetch: mockFetch };
    const client = new OpenDota(config);

    const { data, rateLimit } = await client.matches.get(12345);

    expect(data.match_id).toBe(12345);
    expect(data.duration).toBe(2400);
    expect(rateLimit.remainingMinute).toBe(59);
    expect(rateLimit.remainingDay).toBe(1999);
  });
});
