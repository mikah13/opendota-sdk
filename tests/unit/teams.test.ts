import { describe, it, expect } from "vitest";
import { OpenDota } from "../../src/index.js";

describe("TeamsResource", () => {
  const client = new OpenDota();

  it("list() fetches all teams", async () => {
    const { data, rateLimit } = await client.teams.list();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("team_id");
  });

  it("get() fetches a team by ID", async () => {
    const { data } = await client.teams.get(2);
    expect(data).toHaveProperty("team_id", 2);
    expect(data).toHaveProperty("name");
  });

  it("players() fetches players for a team", async () => {
    const { data } = await client.teams.players(1);
    expect(Array.isArray(data)).toBe(true);
  });
});
