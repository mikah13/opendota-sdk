import { describe, it, expect } from "vitest";
import { OpenDota } from "../../src/index.js";

describe("SearchResource", () => {
  const client = new OpenDota();

  it("players() sends q as query param and returns results", async () => {
    const { data, rateLimit } = await client.search.players({ q: "Dendi" });
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("account_id");
    expect(rateLimit.remainingMinute).toBeGreaterThanOrEqual(0);
  });
});
