// =====================================================================
// STAGE 1: Mock endpoint (always up)
// =====================================================================
//
//   Terminal 1:  npm run mock
//   Terminal 2:  npm run stage1          normal call
//                npm run stage1:flaky    fails twice first: does your retry work?
//
// Calls /api/events, transforms it, and saves output/events.json.
// This file is done. Your work is in src/client.js and src/transform.js.
// =====================================================================

const fs = require("fs");
const path = require("path");
const { loadEnv } = require("../src/env");
const { fetchJson } = require("../src/client");
const { transformEvents } = require("../src/transform");
const log = require("../src/logger");

loadEnv();
const BASE = process.env.MOCK_BASE_URL || "http://localhost:4000";
const flaky = process.argv.includes("--flaky");

async function main() {
  const url = `${BASE}/api/events${flaky ? "?flaky=1" : ""}`;
  log.info(`GET ${url}`);
  const raw = await fetchJson(url);
  const events = transformEvents(raw);
  log.info(`Transformed ${events.length} event(s)`);

  const outFile = path.join(__dirname, "..", "output", "events.json");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(events, null, 2) + "\n");
  log.info("Saved output/events.json");
  console.table(events);
}

main().catch((err) => {
  log.error(`Stage 1 failed: ${err.message}`);
  if (/ECONNREFUSED|fetch failed/i.test(err.message)) log.error("Is the mock server running? Start it with: npm run mock");
  process.exitCode = 1;
});
