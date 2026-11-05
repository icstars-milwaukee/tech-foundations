// =====================================================================
// W9 Assessment C, Task 2: Mock Item API. Facilitator runs this.
// =====================================================================
//
//   npm start          (from this folder) starts it on http://localhost:3001
//
// Zero dependencies. Reads MOCK_API_KEY from mock-server/.env.
//
// Endpoint
//   GET /api/item/:id                 the item as nested JSON (ids: 101, 102, 103)
//   GET /api/item/:id?fail=500        500 JSON error
//   GET /api/item/:id?fail=timeout    hangs ~10s, then 504 (client should time out first)
//
// Every request needs the header  x-api-key: <MOCK_API_KEY>, or it gets 401 JSON.
// To simulate a network failure, stop the server (Ctrl+C).
// =====================================================================

const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = Number(process.env.PORT) || 3001;
const HANG_MS = 10_000;

const ITEMS = {
  101: {
    id: 101,
    title: "Teen Coding Club",
    status: "active",
    details: {
      category: "youth",
      age_group: "13-17",
      location: { site: "Washington Park Library", neighborhood: "Washington Park", city: "Milwaukee" },
    },
    schedule: { day: "Tuesday", start: "16:00", end: "17:30" },
    stats: { registered: 24, avg_attended: 21.0 },
    tags: ["javascript", "games", "free"],
  },
  102: {
    id: 102,
    title: "Adult Digital Skills",
    status: "active",
    details: {
      category: "adult",
      age_group: "18+",
      location: { site: "Mitchell Street Library", neighborhood: "Historic Mitchell Street", city: "Milwaukee" },
    },
    schedule: { day: "Wednesday", start: "18:00", end: "19:30" },
    stats: { registered: 20, avg_attended: 14.2 },
    tags: ["email", "job search", "free"],
  },
  103: {
    id: 103,
    title: "Senior Tech Help",
    status: "paused",
    details: {
      category: "senior",
      age_group: "60+",
      location: { site: "Bay View Community Center", neighborhood: "Bay View", city: "Milwaukee" },
    },
    schedule: { day: "Friday", start: "10:00", end: "11:00" },
    stats: { registered: 15, avg_attended: 12.6 },
    tags: ["smartphones", "video calls", "free"],
  },
};

function loadApiKey() {
  const envFile = path.join(__dirname, ".env");
  if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
  return process.env.MOCK_API_KEY;
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function createServer(apiKey) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const started = Date.now();
    res.on("finish", () => {
      console.log(`[${new Date().toISOString()}] [INFO] ${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - started}ms)`);
    });

    if (req.method !== "GET") return send(res, 405, { error: "Only GET is supported" });

    const given = req.headers["x-api-key"];
    if (!given) return send(res, 401, { error: "Unauthorized", message: "Missing x-api-key header" });
    if (given !== apiKey) return send(res, 401, { error: "Unauthorized", message: "Invalid API key" });

    const match = url.pathname.match(/^\/api\/item\/([^/]+)$/);
    if (!match) return send(res, 404, { error: "Not Found", message: `No endpoint at ${url.pathname}` });

    const fail = url.searchParams.get("fail");
    if (fail === "500") return send(res, 500, { error: "Internal Server Error", message: "Simulated server failure" });
    if (fail === "timeout") {
      const timer = setTimeout(() => send(res, 504, { error: "Gateway Timeout", message: "Simulated slow response" }), HANG_MS);
      res.on("close", () => clearTimeout(timer)); // client gave up
      return;
    }

    const item = ITEMS[match[1]];
    if (!item) return send(res, 404, { error: "Not Found", message: `No item with id ${match[1]}` });
    return send(res, 200, { data: item, meta: { source: "W9C mock API", version: "1.0.0" } });
  });
}

if (require.main === module) {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error("MOCK_API_KEY is not set. Run `npm start` (it creates .env for you) or copy .env.example to .env.");
    process.exit(1);
  }
  createServer(apiKey).listen(PORT, () => {
    console.log("");
    console.log(`W9C Mock Item API running at http://localhost:${PORT}`);
    console.log(`Try: GET http://localhost:${PORT}/api/item/101`);
    console.log(`API key: ${apiKey}`);
    console.log("Press Ctrl+C to stop (that's also how you simulate a network failure).");
    console.log("");
  });
}

module.exports = { createServer, ITEMS };
