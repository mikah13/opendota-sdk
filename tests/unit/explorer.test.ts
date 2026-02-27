import { describe, it, expect, vi } from "vitest";
import { OpenDota } from "../../src/index.js";
import { OpenDotaConfig } from "../../src/types/common.js";

describe("ExplorerResource", () => {
  it("should execute SQL query", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        command: "SELECT NOW()",
        rowCount: 1,
        rows: [{ now: "2024-01-01" }],
        fields: [],
        err: null,
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Rate-Limit-Remaining-Minute": "54",
          "X-Rate-Limit-Remaining-Day": "1994",
        },
      })
    );

    const config: OpenDotaConfig = { fetch: mockFetch };
    const client = new OpenDota(config);

    const { data, rateLimit } = await client.explorer.query("SELECT NOW()");

    expect(data.command).toBe("SELECT NOW()");
    expect(data.rowCount).toBe(1);
    expect(data.rows).toHaveLength(1);
    expect(data.err).toBeNull();
    expect(rateLimit.remainingMinute).toBe(54);
  });
});
