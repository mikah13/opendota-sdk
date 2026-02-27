import { describe, it, expect } from "vitest";
import { OpenDota } from "../../src/index.js";

/**
 * These tests hit the real OpenDota API.
 * Only run with: OPENDOTA_LIVE_TEST=1 npm run test:live
 *
 * They validate that our types match reality.
 * Keep these minimal to avoid burning rate limit.
 */

const SHOULD_RUN = process.env["OPENDOTA_LIVE_TEST"] === "1";

describe.skipIf(!SHOULD_RUN)("Live API smoke tests", () => {
  const client = new OpenDota({
    apiKey: process.env["OPENDOTA_API_KEY"],
  });

  it("fetches a known match", async () => {
    const { data, rateLimit } = await client.matches.get(7000000000);
    expect(data.match_id).toBe(7000000000);
    expect(typeof data.duration).toBe("number");
    expect(rateLimit.remainingMinute).toBeTypeOf("number");
  });

  it("searches for a player", async () => {
    const { data } = await client.search.players({ q: "Dendi" });
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("fetches hero list", async () => {
    const { data } = await client.heroes.list();
    expect(data.length).toBeGreaterThan(100);
    expect(data[0]).toHaveProperty("id");
    expect(data[0]).toHaveProperty("localized_name");
  });

  it("runs an explorer query", async () => {
    const { data } = await client.explorer.query("SELECT NOW()");
    expect(data.rows.length).toBeGreaterThan(0);
    expect(data.err).toBeNull();
  });
});
