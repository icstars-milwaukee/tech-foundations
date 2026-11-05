// =====================================================================
// Quality gate: GREEN before you present.   npm run gate
// =====================================================================
//
//   npm run gate                                 uses gate.config.json
//   node tools/gate.js path/to/your/gate.config.json
//
// Checks the four things that break demos most often:
//   1. ENV READY      .env exists, every required key set, no placeholders
//   2. DATA SEEDED    the demo data file exists and has enough records
//   3. CREDS VERIFIED the API key actually works (a real call, not a guess)
//   4. HEALTH OK      every service answers its health check
//
// Copy gate.config.json into your project and point it at your app.
// All file paths in the config are relative to the config file.
// =====================================================================

const fs = require("fs");
const path = require("path");

function parseEnv(file) {
  if (!fs.existsSync(file)) return null;
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return out;
}

const placeholder = (v) => !v || /^(replace-me|paste-|changeme|todo|xxx)/i.test(v.trim());

async function probe(url, headers = {}) {
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(3000) });
    return { status: res.status };
  } catch (err) {
    return { status: 0, error: err.name === "TimeoutError" ? "timed out" : (err.cause && err.cause.code) || err.message };
  }
}

async function runGate(configPath) {
  const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const dir = path.dirname(configPath);
  const results = [];
  const add = (group, label, ok, detail) => results.push({ group, label, ok, detail });

  // 1. ENV
  const env = cfg.env ? parseEnv(path.join(dir, cfg.env.file)) : {};
  if (cfg.env) {
    if (!env) add("ENV READY", `${cfg.env.file} exists`, false, `missing: create it from .env.example`);
    else {
      const bad = cfg.env.required.filter((k) => placeholder(env[k]));
      add("ENV READY", "required keys set", bad.length === 0, bad.length ? "missing or placeholder: " + bad.join(", ") : cfg.env.required.join(", "));
    }
  }

  // 2. DATA
  if (cfg.data) {
    try {
      let data = JSON.parse(fs.readFileSync(path.join(dir, cfg.data.file), "utf8"));
      if (cfg.data.arrayPath) data = cfg.data.arrayPath.split(".").reduce((o, k) => (o ? o[k] : undefined), data);
      const n = Array.isArray(data) ? data.length : 0;
      add("DATA SEEDED", cfg.data.file, n >= cfg.data.minRecords, `${n} record(s), need ${cfg.data.minRecords}`);
    } catch (err) {
      add("DATA SEEDED", cfg.data.file, false, err.code === "ENOENT" ? "file not found" : err.message);
    }
  }

  // 3. CREDENTIALS
  if (cfg.credentials) {
    const c = cfg.credentials;
    const key = (env || {})[c.envVar] || process.env[c.envVar];
    if (placeholder(key)) add("CREDS VERIFIED", c.envVar, false, "no real value in .env");
    else {
      const r = await probe(c.url, { [c.header]: key });
      add("CREDS VERIFIED", `${c.envVar} accepted by ${c.url}`, r.status >= 200 && r.status < 300, r.status ? `status ${r.status}` : r.error);
    }
  }

  // 4. HEALTH
  for (const h of cfg.health || []) {
    const r = await probe(h.url);
    add("HEALTH OK", h.name, r.status === 200, r.status ? `${h.url} -> ${r.status}` : `${h.url} -> ${r.error}`);
  }
  return results;
}

if (require.main === module) {
  const configPath = path.resolve(process.argv[2] || path.join(__dirname, "..", "gate.config.json"));
  runGate(configPath)
    .then((results) => {
      console.log("\nDemo Quality Gate");
      console.log("=================");
      let group = "";
      for (const r of results) {
        if (r.group !== group) console.log("\n" + (group = r.group));
        console.log(`  ${r.ok ? "[GREEN]" : "[ RED ]"} ${r.label}\n          ${r.detail}`);
      }
      const red = results.filter((r) => !r.ok).length;
      console.log(red ? `\nRED: ${red} item(s). Do NOT start the demo until the gate is green.\n` : "\nALL GREEN. You're cleared to present.\n");
      process.exitCode = red ? 1 : 0;
    })
    .catch((err) => {
      console.error("Gate could not run: " + err.message);
      process.exitCode = 1;
    });
}

module.exports = { runGate };
