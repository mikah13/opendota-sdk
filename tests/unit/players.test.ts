import { describe, it, expect, vi } from "vitest";
import { OpenDota } from "../../src/index.js";
import { OpenDotaConfig } from "../../src/types/common.js";

describe("PlayersResource", () => {
  it("should fetch player data by account ID", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ profile: { account_id: 12345678, personaname: "TestPlayer" } }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "58",
          "X-Rate-Limit-Remaining-Day": "1998",
        },
      })
    );

    const config: OpenDotaConfig = { fetch: mockFetch };
    const client = new OpenDota(config);

    const { data, rateLimit } = await client.players.get(12345678);

    expect(data.profile.account_id).toBe(12345678);
    expect(data.profile.personaname).toBe("TestPlayer");
    expect(rateLimit.remainingMinute).toBe(58);
  });

  it("should fetch player win/loss data", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ win: 100, lose: 50 }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "57",
          "X-Rate-Limit-Remaining-Day": "1997",
        },
      })
    );

    const config: OpenDotaConfig = { fetch: mockFetch };
    const client = new OpenDota(config);

    const { data, rateLimit } = await client.players.winLoss(12345678);

    expect(data.win).toBe(100);
    expect(data.lose).toBe(50);
    expect(rateLimit.remainingMinute).toBe(57);
  });

  it("should make POST request for refresh", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ account_id: 12345678 }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "55",
          "X-Rate-Limit-Remaining-Day": "1995",
        },
      })
    );

    const config: OpenDotaConfig = { fetch: mockFetch };
    const client = new OpenDota(config);

    const { data, rateLimit } = await client.players.refresh(12345678);

    expect(data.account_id).toBe(12345678);
    expect(rateLimit.remainingMinute).toBe(55);
  });
});
