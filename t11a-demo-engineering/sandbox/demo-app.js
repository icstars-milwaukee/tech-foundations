// =====================================================================
// Demo app with an offline fallback (port 3000). READ THIS ONE.
// =====================================================================
//   npm run sandbox:app      then open http://localhost:3000
//
// This is the pattern to copy into your own project:
//
//   1. Try the live API, but with a SHORT timeout. During a demo, a request
//      that hangs for 30 seconds is worse than one that fails fast.
//   2. On success, save a copy (the cache).
//   3. On failure, show the last saved copy, or the seed data if there's
//      no cache yet. Never a blank screen, never a stack trace.
//   4. Tell the audience honestly: a banner says "offline, saved data".
//   5. DEMO_MODE=offline in .env forces the fallback: your emergency switch.
// =====================================================================

const fs = require("fs");
const http = require("http");
const path = require("path");
const { loadEnv } = require("../tools/env");
const log = require("../tools/logger");

const ROOT = path.join(__dirname, "..");
loadEnv(path.join(ROOT, ".env"));

const PORT = Number(process.env.APP_PORT) || 3000;
const API = process.env.API_BASE_URL || "http://localhost:4100";
const CACHE = path.join(ROOT, "data", "cache", "events.json");
const SEED = path.join(ROOT, "data", "seed", "events.json");
const TIMEOUT_MS = 2000;

async function getEvents() {
  if (process.env.DEMO_MODE !== "offline") {
    try {
      const res = await fetch(`${API}/api/events`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const { events } = await res.json();
      fs.mkdirSync(path.dirname(CACHE), { recursive: true });
      fs.writeFileSync(CACHE, JSON.stringify({ savedAt: new Date().toISOString(), events }, null, 2));
      return { source: "live", events };
    } catch (err) {
      log.warn(`Live API failed (${err.name === "TimeoutError" ? "timeout" : err.message}). Using fallback.`);
    }
  }
  const file = fs.existsSync(CACHE) ? CACHE : SEED;
  const saved = JSON.parse(fs.readFileSync(file, "utf8"));
  return { source: file === CACHE ? "cache" : "seed", savedAt: saved.savedAt, events: saved.events };
}

function page({ source, savedAt, events }) {
  const banner =
    source === "live"
      ? `<p class="badge live">Live data</p>`
      : `<p class="badge offline">Offline: showing saved data from ${new Date(savedAt).toLocaleString()}</p>`;
  const rows = events.map((e) => `<tr><td>${e.title}</td><td>${e.date}</td><td>${e.going}</td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CohortHub RSVPs</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:system-ui,sans-serif;max-width:42rem;margin:2rem auto;padding:0 1rem}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:.5rem;text-align:left}
.badge{display:inline-block;padding:.25rem .6rem;border-radius:1rem;font-size:.85rem}
.live{background:#dcfce7;color:#14532d}.offline{background:#fef3c7;color:#78350f}</style></head>
<body><h1>CohortHub RSVPs</h1>${banner}
<table><thead><tr><th>Event</th><th>Date</th><th>Going</th></tr></thead><tbody>${rows}</tbody></table>
<p><a href="/">Refresh</a></p></body></html>`;
}

http
  .createServer(async (req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ok", mode: process.env.DEMO_MODE || "live" }));
    }
    try {
      const data = await getEvents();
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(page(data));
      log.info(`GET ${req.url} -> 200 (${data.source})`);
    } catch (err) {
      log.error(`Even the fallback failed: ${err.message}`);
      res.writeHead(503, { "Content-Type": "text/plain" });
      res.end("Demo data unavailable. Switch to backup slides.");
    }
  })
  .listen(PORT, () => log.info(`Demo app on http://localhost:${PORT} (mode: ${process.env.DEMO_MODE || "live"}, API: ${API})`));
