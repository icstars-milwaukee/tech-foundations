// =====================================================================
// Verify a deployment.   npm run verify -- 1.0.0
// =====================================================================
//
// Checks that the deployed app is actually working, from the OUTSIDE,
// the way a user would reach it:
//   1. the home page loads (200, HTML)
//   2. /health says "ok" AND reports the version you meant to deploy
//   3. /api/events returns a list
//
// "The container is running" is not the same as "the app works".
// Saves the result to evidence/ so your deployment guide can point to it.
//
//   npm run verify -- 1.1.0                     expects version 1.1.0
//   BASE_URL=http://localhost:9090 npm run verify -- 1.1.0
// =====================================================================

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BASE = process.env.BASE_URL || "http://localhost:8080";
const expected = process.argv[2];

async function get(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return { status: res.status, type: res.headers.get("content-type") || "", body: await res.text() };
  } catch (err) {
    return { status: 0, error: err.cause ? err.cause.code || err.message : err.message };
  }
}

async function main() {
  if (!expected) {
    console.error("\nTell me which version you deployed:  npm run verify -- 1.0.0\n");
    process.exitCode = 1;
    return;
  }
  const results = [];
  const add = (label, ok, detail) => results.push({ label, ok, detail });

  const home = await get(BASE + "/");
  if (home.status === 0) {
    console.error(`\nCan't reach ${BASE} (${home.error}).`);
    console.error("Is the container running (docker ps)? Did you publish the port (-p 8080:8080)? See docs/RUNBOOK.md.\n");
    process.exitCode = 1;
    return;
  }
  add("Home page loads", home.status === 200 && home.type.includes("text/html"), `status ${home.status}`);

  const health = await get(BASE + "/health");
  let h = {};
  try {
    h = JSON.parse(health.body);
  } catch {
    h = {};
  }
  add("Health check says ok", health.status === 200 && h.status === "ok", `status ${health.status}, ${JSON.stringify(h)}`);
  add(`Running version is ${expected}`, h.version === expected, `running ${h.version || "unknown"}`);

  const api = await get(BASE + "/api/events");
  let events = null;
  try {
    events = JSON.parse(api.body).events;
  } catch {
    events = null;
  }
  add("API returns events", api.status === 200 && Array.isArray(events) && events.length > 0, `${Array.isArray(events) ? events.length : 0} events`);

  const ok = results.every((r) => r.ok);
  const text = [
    `Deployment verification for v${expected} at ${BASE}`,
    `Run at ${new Date().toISOString()}`,
    "",
    ...results.map((r) => `${r.ok ? "[PASS]" : "[FAIL]"} ${r.label} (${r.detail})`),
    "",
    ok ? "RESULT: VERIFIED" : "RESULT: NOT VERIFIED. Check docs/RUNBOOK.md, or roll back.",
  ].join("\n") + "\n";
  console.log("\n" + text);

  fs.mkdirSync(path.join(ROOT, "evidence"), { recursive: true });
  const file = path.join(ROOT, "evidence", `verify-v${expected}.txt`);
  fs.writeFileSync(file, text);
  console.log(`Saved ${path.relative(ROOT, file)}\n`);
  process.exitCode = ok ? 0 : 2;
}

main();
