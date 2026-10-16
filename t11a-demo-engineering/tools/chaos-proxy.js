// =====================================================================
// Chaos proxy: failure injection for demo rehearsals.
// =====================================================================
//
//   npm run chaos                                   proxy :4100 -> http://localhost:4000
//   npm run chaos -- --target https://api.example.com --port 4100
//
// Point your app at the proxy instead of the real API. Then:
//   press ENTER   -> the "network" dies for 15 seconds (connections are cut)
//   type 30 ENTER -> a 30-second outage
//   type q ENTER  -> quit
//
// Why not just turn off the wifi? Because the whole room shares it, and a
// proxy lets you break ONE app's connection on purpose, repeatably.
// =====================================================================

const http = require("http");
const https = require("https");
const readline = require("readline");
const log = require("./logger");

function arg(name, fallback) {
  const i = process.argv.indexOf("--" + name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const target = new URL(arg("target", "http://localhost:4000"));
const port = Number(arg("port", 4100));
const client = target.protocol === "https:" ? https : http;
let downUntil = 0;

const server = http.createServer((req, res) => {
  if (Date.now() < downUntil) {
    log.warn(`DROPPED ${req.method} ${req.url} (outage, ${Math.ceil((downUntil - Date.now()) / 1000)}s left)`);
    req.socket.destroy(); // like a network cable being pulled
    return;
  }
  const upstream = client.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === "https:" ? 443 : 80),
      method: req.method,
      path: req.url,
      headers: { ...req.headers, host: target.host },
    },
    (up) => {
      res.writeHead(up.statusCode, up.headers);
      up.pipe(res);
      log.info(`${req.method} ${req.url} -> ${up.statusCode}`);
    }
  );
  upstream.on("error", (err) => {
    log.error(`Upstream error: ${err.message}`);
    if (!res.headersSent) res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad gateway: upstream unreachable" }));
  });
  req.pipe(upstream);
});

server.listen(port, () => {
  log.info(`Chaos proxy on http://localhost:${port} -> ${target.origin}`);
  log.info("Press ENTER for a 15s outage, type a number + ENTER for a custom length, q + ENTER to quit.");
});

readline.createInterface({ input: process.stdin }).on("line", (line) => {
  const text = line.trim();
  if (text === "q") process.exit(0);
  const seconds = Number(text) || 15;
  downUntil = Date.now() + seconds * 1000;
  log.warn(`OUTAGE STARTED for ${seconds}s. Watch what your demo does.`);
  setTimeout(() => log.info("Outage over. Network restored."), seconds * 1000).unref();
});
