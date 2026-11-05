// =====================================================================
// CohortHub Events Service: the app you'll containerize.
// =====================================================================
//
// Run it WITHOUT Docker first, so you know what "working" looks like:
//   npm run app:local        then open http://localhost:8080
//
// Routes
//   GET /             a small web page listing events
//   GET /health       { status, version, uptimeSeconds }  (for checks + monitoring)
//   GET /api/events   the events as JSON
//
// Settings come from environment variables, never from hard-coded values:
//   PORT              default 8080
//   HOST              default 0.0.0.0  (inside a container, 127.0.0.1 would be
//                     unreachable from your laptop; see docs/RUNBOOK.md)
//   SUPPORT_API_KEY   a secret; the app only reports whether it's set
// =====================================================================

const http = require("http");
const { version } = require("./package.json");

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";
const started = Date.now();

const EVENTS = [
  { id: "evt-303", title: "Alumni Panel: First Year in Tech", date: "2026-10-22", room: "Main Hall" },
  { id: "evt-302", title: "Resume Lab", date: "2026-10-28", room: "Room 204" },
  { id: "evt-301", title: "Sprint 2 Demo Day", date: "2026-11-06", room: "Main Hall" },
];

function log(level, message) {
  // Containers log to stdout/stderr. `docker logs <name>` shows these lines.
  const line = `[${new Date().toISOString()}] [${level}] ${message}`;
  (level === "ERROR" || level === "WARN" ? console.error : console.log)(line);
}

function page() {
  const rows = EVENTS.map((e) => `<li><strong>${e.title}</strong>: ${e.date}, ${e.room}</li>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CohortHub Events</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem;line-height:1.5}
footer{color:#666;font-size:.85rem;margin-top:2rem}</style></head>
<body><h1>CohortHub Events</h1><ul>${rows}</ul>
<footer>Version ${version}</footer></body></html>`;
}

const server = http.createServer((req, res) => {
  const t0 = Date.now();
  const send = (status, type, body) => {
    res.writeHead(status, { "Content-Type": type, "X-App-Version": version });
    res.end(body);
    log(status >= 500 ? "ERROR" : "INFO", `${req.method} ${req.url} -> ${status} (${Date.now() - t0}ms)`);
  };

  if (req.url === "/health") {
    return send(200, "application/json", JSON.stringify({ status: "ok", version, uptimeSeconds: Math.round((Date.now() - started) / 1000) }));
  }
  if (req.url === "/api/events") return send(200, "application/json", JSON.stringify({ events: EVENTS }));
  if (req.url === "/") return send(200, "text/html; charset=utf-8", page());
  return send(404, "application/json", JSON.stringify({ error: "Not found" }));
});

// `docker stop` sends SIGTERM. Finish in-flight requests, then exit cleanly.
function shutdown(signal) {
  log("INFO", `${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

if (!process.env.SUPPORT_API_KEY || process.env.SUPPORT_API_KEY === "replace-me") {
  log("WARN", "SUPPORT_API_KEY is not set. Pass it with --env-file at run time.");
}

server.listen(PORT, HOST, () => log("INFO", `CohortHub Events v${version} listening on http://${HOST}:${PORT}`));
