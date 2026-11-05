// =====================================================================
// Release check: is the new release healthy?   npm run release-check
// =====================================================================
//
// Sends traffic to the running app and measures the release metrics
// defined in release.config.json:
//
//   health check   does /health return 200?
//   error rate     % of requests that returned 5xx or failed
//   p95 latency    95% of requests were faster than this
//
// Then it gives a verdict:  GO  or  ROLLBACK.
// It saves the result in evidence/ so your release plan can point to it.
//
// Why p95 and not the average? If 1 in 20 users waits 5 seconds, the
// average can still look fine. p95 shows what your slowest users feel.
// =====================================================================

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

async function timedGet(url) {
  const started = Date.now();
  try {
    const res = await fetch(url);
    await res.text();
    return { status: res.status, ms: Date.now() - started, version: res.headers.get("x-app-version") };
  } catch (err) {
    return { status: 0, ms: Date.now() - started, error: err.message };
  }
}

async function main() {
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "release.config.json"), "utf8"));
  const base = process.env.BASE_URL || cfg.baseUrl;
  const t = cfg.thresholds;

  const health = await timedGet(base + cfg.healthPath);
  if (health.status === 0) {
    console.error(`\nCan't reach ${base}. Is the app running? (npm run app)\n`);
    process.exitCode = 1;
    return;
  }

  const results = [];
  for (let i = 0; i < cfg.requests; i++) {
    results.push(await timedGet(base + cfg.endpoints[i % cfg.endpoints.length]));
  }
  const errors = results.filter((r) => r.status === 0 || r.status >= 500).length;
  const errorRate = Math.round((errors / results.length) * 1000) / 10;
  const p95 = percentile(results.map((r) => r.ms), 95);
  const version = health.version || results.find((r) => r.version)?.version || "unknown";

  const criteria = [
    { name: "Health check returns 200", actual: health.status, ok: health.status === 200, target: "200" },
    { name: "Error rate", actual: `${errorRate}%`, ok: errorRate < t.maxErrorRatePct, target: `< ${t.maxErrorRatePct}%` },
    { name: "p95 latency", actual: `${p95}ms`, ok: p95 < t.maxP95LatencyMs, target: `< ${t.maxP95LatencyMs}ms` },
  ];
  const go = criteria.every((c) => c.ok);

  const lines = [
    `Release check for v${version} at ${base}`,
    `Run at ${new Date().toISOString()} with ${results.length} requests`,
    "",
    ...criteria.map((c) => `${c.ok ? "[PASS]" : "[FAIL]"} ${c.name}: ${c.actual} (target ${c.target})`),
    "",
    go ? "VERDICT: GO. Release meets every success criterion." : "VERDICT: ROLLBACK. A success criterion failed. Follow your rollback steps.",
  ];
  const text = lines.join("\n") + "\n";
  console.log("\n" + text);

  const dir = path.join(ROOT, "evidence");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `release-check-v${version}.txt`);
  fs.writeFileSync(file, text);
  console.log(`Saved ${path.relative(ROOT, file)}\n`);
  process.exitCode = go ? 0 : 2;
}

main().catch((err) => {
  console.error("Release check failed to run: " + err.message);
  process.exitCode = 1;
});
