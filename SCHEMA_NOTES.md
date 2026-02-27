# Schema Notes

Known discrepancies between the OpenDota OpenAPI spec and actual API behavior.

## Known Issues

1. **Arrays missing `items` definitions** — Several array-type fields lack `items` specs.
   The generated types will be `unknown[]` for these. Override manually in `src/types/overrides.ts`.

2. **`number` vs `integer`** — Fields like `match_id` and `account_id` are sometimes
   typed as `number` (float) when they should be `integer`. Not a runtime problem in JS
   but worth noting for documentation accuracy.

3. **Nullable fields not marked nullable** — Many fields returned by parsed match data
   can be `null` (e.g., `buyback_log`, `gold_t`, `dn_t`) when replays haven't been parsed.
   The spec doesn't always reflect this. The SDK types should be treated as optimistic —
   consumers should handle `null` defensively for parsed-data fields.

4. **Response shape inconsistencies** — Some endpoints' actual responses include fields
   not in the spec, or omit fields the spec declares. The generated types are a best-effort
   starting point.
