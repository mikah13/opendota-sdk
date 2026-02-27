import { describe, it, expect } from "vitest";
import { OpenDota } from "../../src/index.js";

describe("HeroesResource", () => {
  const client = new OpenDota();

  it("list() fetches all heroes", async () => {
    const { data, rateLimit } = await client.heroes.list();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("id");
    expect(data[0]).toHaveProperty("localized_name");
    expect(typeof rateLimit.remainingMinute).toBe("number");
  });

  it("matchups() fetches matchup data for a hero", async () => {
    const { data } = await client.heroes.matchups(1);
    expect(Array.isArray(data)).toBe(true);
  });

  it("matches() fetches matches for a hero", async () => {
    const { data } = await client.heroes.matches(1);
    expect(Array.isArray(data)).toBe(true);
  });
});
