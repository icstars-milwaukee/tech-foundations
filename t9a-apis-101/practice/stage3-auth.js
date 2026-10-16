// =====================================================================
// STAGE 3: Authenticated endpoint (needs an API key)
// =====================================================================
//
//   1. cp .env.example .env
//   2. Paste the key from the mock server's terminal (or your trainer) into .env
//   3. npm run stage3
//
// The key is read from process.env. It is NEVER typed into this file.
// Check that git ignores it:  git status   (.env must NOT appear)
//
// TODO: finish transformAttendance() so each row looks like:
//   { "title": "Git for Teams Workshop", "rsvpYes": 30, "checkedIn": 26, "showRate": "87%" }
//   showRate = checked_in / rsvp_yes, as a whole-number percent.
// =====================================================================

const fs = require("fs");
const path = require("path");
const { loadEnv } = require("../src/env");
const { fetchJson } = require("../src/client");
const log = require("../src/logger");

loadEnv();
const BASE = process.env.MOCK_BASE_URL || "http://localhost:4000";
const API_KEY = process.env.API_KEY;

function transformAttendance(raw) {
  // TODO: map raw.attendance into the shape above
  return [];
}

async function main() {
  if (!API_KEY || API_KEY.startsWith("paste-")) {
    log.error("No API_KEY found. Copy .env.example to .env and paste your key into it.");
    process.exitCode = 1;
    return;
  }
  const url = `${BASE}/api/secure/attendance`;
  log.info(`GET ${url} (with x-api-key header)`);
  const raw = await fetchJson(url, { headers: { "x-api-key": API_KEY } });
  const rows = transformAttendance(raw);

  const outFile = path.join(__dirname, "..", "output", "attendance.json");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(rows, null, 2) + "\n");
  log.info("Saved output/attendance.json");
  console.table(rows);
}

main().catch((err) => {
  log.error(`Stage 3 failed: ${err.message}`);
  if (err.status === 401 || err.status === 403) log.error("Check the key in your .env file. Did the mock server restart with a new key?");
  process.exitCode = 1;
});
