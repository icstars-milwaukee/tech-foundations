// =====================================================================
// CohortHub Mock API (Stage 1 + Stage 3). You don't need to edit this.
// =====================================================================
//
//   npm run mock        starts it on http://localhost:4000
//
// A mock API is a fake server that always behaves the same way. Teams use
// mocks to build and demo while the real API is down, slow, or unfinished.
//
// Endpoints
//   GET /api/health               always 200
//   GET /api/events               CohortHub events (nested JSON to transform)
//   GET /api/events?flaky=1       fails with 503 twice, then works (retry practice)
//   GET /api/always-down          always 503 (practice giving up gracefully)
//   GET /api/secure/attendance    needs header  x-api-key: <key>  (Stage 3)
//
// Rate limit: 10 requests per 10 seconds per client. After that: 429 + Retry-After.
//
// The API key is printed when the server starts. Set MOCK_API_KEY to choose it
// (your trainer does this so the whole room shares one key).
// =====================================================================

const http = require("http");
const crypto = require("crypto");

const EVENTS = {
  data: {
    events: [
      {
        event_id: "evt-301",
        title: "Sprint 2 Demo Day",
        status: "scheduled",
        starts_at: "2026-11-06T13:00:00-06:00",
        location: { room: "Main Hall", building: "i.c.stars HQ" },
        capacity: 60,
        rsvp: { yes: 41, no: 3, maybe: 9 },
      },
      {
        event_id: "evt-302",
        title: "Resume Lab",
        status: "scheduled",
        starts_at: "2026-10-28T10:00:00-05:00",
        location: { room: "Room 204", building: "i.c.stars HQ" },
        capacity: 20,
        rsvp: { yes: 20, no: 1, maybe: 2 },
      },
      {
        event_id: "evt-303",
        title: "Alumni Panel: First Year in Tech",
        status: "scheduled",
        starts_at: "2026-10-22T17:30:00-05:00",
        location: { room: "Main Hall", building: "i.c.stars HQ" },
        capacity: 80,
        rsvp: { yes: 52, no: 4, maybe: 11 },
      },
      {
        event_id: "evt-304",
        title: "Mock Interviews",
        status: "cancelled",
        starts_at: "2026-10-26T09:00:00-05:00",
        location: { room: "Room 110", building: "i.c.stars HQ" },
        capacity: 12,
        rsvp: { yes: 9, no: 0, maybe: 1 },
      },
      {
        event_id: "evt-305",
        title: "Team Lunch",
        status: "scheduled",
        starts_at: "2026-10-30T12:00:00-05:00",
        location: { room: "Room 110", building: "i.c.stars HQ" },
        capacity: 25,
        rsvp: null,
      },
    ],
  },
  meta: { source: "CohortHub mock API", version: "1.0.0" },
};

const ATTENDANCE = {
  attendance: [
    { event_id: "evt-288", title: "Git for Teams Workshop", rsvp_yes: 30, checked_in: 26 },
    { event_id: "evt-291", title: "SQL Office Hours", rsvp_yes: 14, checked_in: 9 },
    { event_id: "evt-295", title: "Design Review Night", rsvp_yes: 22, checked_in: 22 },
  ],
};

function createServer({ apiKey, rateLimit = 10, windowMs = 10_000, quiet = false } = {}) {
  const key = apiKey || process.env.MOCK_API_KEY || "tf-" + crypto.randomBytes(6).toString("hex");
  const hits = new Map(); // client -> timestamps
  let flakyCount = 0;

  function send(res, status, body, headers = {}) {
    res.writeHead(status, { "Content-Type": "application/json", ...headers });
    res.end(JSON.stringify(body));
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const started = Date.now();
    res.on("finish", () => {
      if (!quiet) console.log(`[${new Date().toISOString()}] [INFO] ${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - started}ms)`);
    });

    if (req.method !== "GET") return send(res, 405, { error: "Only GET is supported" });
    if (url.pathname === "/api/health") return send(res, 200, { status: "ok" });

    // Rate limiting (everything except health)
    const client = req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const recent = (hits.get(client) || []).filter((t) => now - t < windowMs);
    if (recent.length >= rateLimit) {
      const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
      hits.set(client, recent);
      return send(res, 429, { error: "Too many requests. Slow down." }, { "Retry-After": String(retryAfter) });
    }
    recent.push(now);
    hits.set(client, recent);

    if (url.pathname === "/api/events") {
      if (url.searchParams.get("flaky")) {
        flakyCount++;
        if (flakyCount % 3 !== 0) return send(res, 503, { error: "Service temporarily unavailable. Try again." });
      }
      return send(res, 200, EVENTS);
    }
    if (url.pathname === "/api/always-down") return send(res, 503, { error: "This service is down." });
    if (url.pathname === "/api/secure/attendance") {
      const given = req.headers["x-api-key"];
      if (!given) return send(res, 401, { error: "Missing x-api-key header" });
      if (given !== key) return send(res, 403, { error: "Invalid API key" });
      return send(res, 200, ATTENDANCE);
    }
    return send(res, 404, { error: `No endpoint at ${url.pathname}` });
  });

  return { server, apiKey: key };
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 4000;
  const { server, apiKey } = createServer();
  server.listen(port, () => {
    console.log("");
    console.log(`CohortHub Mock API running at http://localhost:${port}`);
    console.log(`API key for Stage 3: ${apiKey}`);
    console.log("Put it in your .env file as API_KEY=... (never in your code).");
    console.log("Press Ctrl+C to stop.");
    console.log("");
  });
}

module.exports = { createServer, EVENTS, ATTENDANCE };
