// =====================================================================
// Pre-flight check: run BEFORE every release.   npm run preflight
// =====================================================================
//
// Pilots run a checklist before every flight, even after 10,000 flights.
// This is the same idea. It checks:
//   - .env exists and has every key listed in .env.example
//   - no value is still a placeholder ("replace-me", "paste-...", empty)
//   - .env is ignored by git and was never committed
//   - release.config.json is valid and has thresholds
//
// Exit code 0 = cleared for release. Anything else = fix it first.
// =====================================================================

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

function parseEnvFile(file) {
  if (!fs.existsSync(file)) return null;
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function git(args) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  return { ok: r.status === 0, out: (r.stdout || "").trim() };
}

function preflight() {
  const results = [];
  const add = (label, ok, detail) => results.push({ label, ok, detail });

  const example = parseEnvFile(path.join(ROOT, ".env.example")) || {};
  const env = parseEnvFile(path.join(ROOT, ".env"));
  add(".env exists", Boolean(env), env ? "found" : "cp .env.example .env, then fill it in");

  if (env) {
    const missing = Object.keys(example).filter((k) => !(k in env));
    add("every key from .env.example is in .env", missing.length === 0, missing.length ? "missing: " + missing.join(", ") : `${Object.keys(example).length} keys`);
    const placeholders = Object.entries(env)
      .filter(([, v]) => v.trim() === "" || /^(replace-me|paste-|changeme|todo)/i.test(v.trim()))
      .map(([k]) => k);
    add("no placeholder values", placeholders.length === 0, placeholders.length ? "still placeholder: " + placeholders.join(", ") : "all set");
  }

  const inRepo = git(["rev-parse", "--is-inside-work-tree"]).ok;
  if (inRepo) {
    add(".env is ignored by git", git(["check-ignore", "-q", ".env"]).ok, "add .env to .gitignore");
    const leaked = git(["log", "--all", "--format=%h", "--", ".env"]).out;
    add(".env never committed", !leaked && !git(["ls-files", "--", ".env"]).out, leaked ? "STOP: .env is in git history. Rotate every secret in it." : "clean");
  } else {
    add("inside a git repo", false, "run git init (you can't release what isn't versioned)");
  }

  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "release.config.json"), "utf8"));
    const t = cfg.thresholds || {};
    const ok = typeof t.maxErrorRatePct === "number" && typeof t.maxP95LatencyMs === "number" && cfg.healthPath;
    add("release.config.json has health path + thresholds", Boolean(ok), ok ? `error rate < ${t.maxErrorRatePct}%, p95 < ${t.maxP95LatencyMs}ms` : "set healthPath and thresholds");
  } catch (err) {
    add("release.config.json is valid JSON", false, err.message);
  }
  return results;
}

if (require.main === module) {
  const results = preflight();
  console.log("\nPre-flight check");
  console.log("================");
  for (const r of results) console.log(`${r.ok ? "[ OK ]" : "[FAIL]"} ${r.label}\n       ${r.detail}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `\nNOT CLEARED: ${failed} item(s) to fix before release.\n` : "\nCLEARED FOR RELEASE\n");
  process.exitCode = failed ? 1 : 0;
}

module.exports = { preflight };
