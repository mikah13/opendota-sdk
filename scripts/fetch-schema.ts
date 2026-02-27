/**
 * Downloads the latest OpenDota OpenAPI spec and writes it to schemas/.
 * Usage: npx tsx scripts/fetch-schema.ts
 *
 * If schemas/opendota-v2.json already exists, prints a diff summary
 * so the developer can review changes before committing.
 */

import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

const SCHEMA_URL = "https://api.opendota.com/api";
const SCHEMA_PATH = "schemas/opendota-v2.json";

async function fetchSchema(): Promise<unknown> {
  const response = await fetch(SCHEMA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function compareSchemas(oldSchema: unknown, newSchema: unknown): void {
  const oldPaths = oldSchema && typeof oldSchema === "object" ? Object.keys((oldSchema as Record<string, unknown>).paths || {}) : [];
  const newPaths = newSchema && typeof newSchema === "object" ? Object.keys((newSchema as Record<string, unknown>).paths || {}) : [];

  const addedPaths = newPaths.filter(p => !oldPaths.includes(p));
  const removedPaths = oldPaths.filter(p => !newPaths.includes(p));

  const oldInfo = oldSchema && typeof oldSchema === "object" ? (oldSchema as Record<string, unknown>).info : null;
  const newInfo = newSchema && typeof newSchema === "object" ? (newSchema as Record<string, unknown>).info : null;

  const oldVersion = oldInfo && typeof oldInfo === "object" ? (oldInfo as Record<string, unknown>).version : null;
  const newVersion = newInfo && typeof newInfo === "object" ? (newInfo as Record<string, unknown>).version : null;

  console.log(`\nSchema version: ${oldVersion} → ${newVersion}`);

  if (addedPaths.length > 0) {
    console.log(`\nAdded endpoints (${addedPaths.length}):`);
    addedPaths.forEach(p => console.log(`  + ${p}`));
  }

  if (removedPaths.length > 0) {
    console.log(`\nRemoved endpoints (${removedPaths.length}):`);
    removedPaths.forEach(p => console.log(`  - ${p}`));
  }

  if (addedPaths.length === 0 && removedPaths.length === 0) {
    console.log("\nNo endpoint changes detected.");
  }
}

async function main() {
  console.log("Fetching latest OpenDota schema...");

  const newSchema = await fetchSchema();
  const newSchemaStr = JSON.stringify(newSchema, null, 2);

  if (existsSync(SCHEMA_PATH)) {
    const oldSchemaStr = await readFile(SCHEMA_PATH, "utf-8");
    const oldSchema = JSON.parse(oldSchemaStr);
    compareSchemas(oldSchema, newSchema);
  } else {
    console.log("No existing schema found. Creating new file.");
  }

  await writeFile(SCHEMA_PATH, newSchemaStr, "utf-8");
  console.log(`\nSchema written to ${SCHEMA_PATH}`);

  if (existsSync(SCHEMA_PATH)) {
    const oldSchemaStr = await readFile(SCHEMA_PATH, "utf-8");
    if (oldSchemaStr === newSchemaStr) {
      console.log("Schema unchanged.");
      process.exit(0);
    } else {
      console.log("Schema updated.");
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
