import { describe, it, expect, vi } from "vitest";
import { OpenDota } from "../../src/index.js";
import { OpenDotaConfig } from "../../src/types/common.js";

describe("SearchResource", () => {
  it("players() sends q as query param and returns results", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          { account_id: 70388657, personaname: "Dendi", avatarfull: "" },
        ]),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "X-Rate-Limit-Remaining-Minute": "59",
            "X-Rate-Limit-Remaining-Day": "1999",
          },
        }
      )
    );

    const config: OpenDotaConfig = { fetch: mockFetch };
    const client = new OpenDota(config);

    const { data, rateLimit } = await client.search.players({ q: "Dendi" });

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("account_id");
    expect(rateLimit.remainingMinute).toBe(59);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("q=Dendi");
  });
});
