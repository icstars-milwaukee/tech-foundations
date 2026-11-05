// The "real" API for the sandbox (port 4000). You don't need to edit this.
//   npm run sandbox:api
//
//   GET /api/health          200
//   GET /api/events          live events
//   GET /api/secure/ping     needs x-api-key matching DEMO_API_KEY in .env

const http = require("http");
const path = require("path");
const { loadEnv } = require("../tools/env");
const log = require("../tools/logger");

loadEnv(path.join(__dirname, "..", ".env"));
const PORT = Number(process.env.API_PORT) || 4000;

const EVENTS = [
  { id: "evt-303", title: "Alumni Panel: First Year in Tech", date: "2026-10-22", going: 52 },
  { id: "evt-302", title: "Resume Lab", date: "2026-10-28", going: 20 },
  { id: "evt-305", title: "Team Lunch", date: "2026-10-30", going: 18 },
  { id: "evt-301", title: "Sprint 2 Demo Day", date: "2026-11-06", going: 44 },
];

http
  .createServer((req, res) => {
    const send = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
      log.info(`${req.method} ${req.url} -> ${status}`);
    };
    if (req.url === "/api/health") return send(200, { status: "ok" });
    if (req.url === "/api/events") return send(200, { events: EVENTS });
    if (req.url === "/api/secure/ping") {
      const key = process.env.DEMO_API_KEY;
      if (!key || key === "replace-me") return send(500, { error: "Server has no DEMO_API_KEY configured" });
      return req.headers["x-api-key"] === key ? send(200, { ok: true }) : send(403, { error: "Invalid API key" });
    }
    send(404, { error: "Not found" });
  })
  .listen(PORT, () => log.info(`Sandbox API on http://localhost:${PORT}`));
