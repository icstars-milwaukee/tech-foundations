// =====================================================================
// CohortHub Events Service (sample app for T10A). You don't need to edit this.
// =====================================================================
//
//   npm run app
//
// Reads PORT, APP_VERSION, and SUPPORT_API_KEY from .env.
//
//   APP_VERSION=1.4.0   current stable release
//   APP_VERSION=1.5.0   the new release you're about to ship...
//
// "Deploying" here means: change APP_VERSION in .env, stop the app (Ctrl+C),
// start it again. "Rolling back" means: put the old version back and restart.
// Real deployments are more complex, but the idea is the same: know exactly
// which version is running, and know how to get back to the last good one.
// =====================================================================

const http = require("http");
const path = require("path");
const { loadEnv } = require("../tools/env");
const log = require("../tools/logger");

loadEnv(path.join(__dirname, "..", ".env"));

const PORT = Number(process.env.PORT) || 5000;
const VERSION = process.env.APP_VERSION || "1.4.0";
const KNOWN = ["1.4.0", "1.5.0"];

const EVENTS = [
  { id: "evt-303", title: "Alumni Panel: First Year in Tech", date: "2026-10-22" },
  { id: "evt-302", title: "Resume Lab", date: "2026-10-28" },
  { id: "evt-301", title: "Sprint 2 Demo Day", date: "2026-11-06" },
];

let requestCount = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Version 1.5.0 added a new RSVP feature with a slow database query and a bug
// that fails on some requests. Its health check still says "ok".
async function simulateRelease(req) {
  if (VERSION !== "1.5.0") return { delay: 20 + (requestCount % 5) * 10, fail: false };
  const slow = req.url.startsWith("/api/rsvps");
  return {
    delay: slow ? 250 + (requestCount % 7) * 60 : 40,
    fail: slow && requestCount % 5 === 0,
  };
}

const server = http.createServer(async (req, res) => {
  requestCount++;
  const started = Date.now();
  const send = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json", "X-App-Version": VERSION });
    res.end(JSON.stringify(body));
    const level = status >= 500 ? "error" : "info";
    log[level](`${req.method} ${req.url} -> ${status} (${Date.now() - started}ms) v${VERSION}`);
  };

  if (req.url === "/health") return send(200, { status: "ok", version: VERSION });

  const { delay, fail } = await simulateRelease(req);
  await sleep(delay);
  if (fail) return send(500, { error: "Internal error" });

  if (req.url.startsWith("/api/events")) return send(200, { events: EVENTS });
  if (req.url.startsWith("/api/rsvps")) return send(200, { rsvps: { "evt-301": { yes: 41, no: 3, maybe: 9 } } });
  return send(404, { error: "Not found" });
});

if (!KNOWN.includes(VERSION)) {
  log.error(`Unknown APP_VERSION "${VERSION}". Known versions: ${KNOWN.join(", ")}`);
  process.exit(1);
}
if (!process.env.SUPPORT_API_KEY || process.env.SUPPORT_API_KEY === "replace-me") {
  log.warn("SUPPORT_API_KEY is not set. Run `npm run preflight` to see what's missing.");
}

server.listen(PORT, () => log.info(`CohortHub Events Service v${VERSION} listening on http://localhost:${PORT}`));
