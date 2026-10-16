// Artifact self-check for T10B. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const md = require("./lib/md");

const ROOT = path.join(__dirname, "..");

// --- Dockerfile ---
const dockerfile = md.read(ROOT, "app/Dockerfile");
const instructions = dockerfile
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));
const has = (word) => instructions.some((l) => l.toUpperCase().startsWith(word + " "));
const from = instructions.find((l) => /^FROM\s/i.test(l)) || "";
const image = from.split(/\s+/)[1] || "";
const pinned = image.includes(":") && !/:latest$/i.test(image);
const userLine = instructions.find((l) => /^USER\s/i.test(l)) || "";
const nonRoot = userLine && !/^USER\s+(root|0)\s*$/i.test(userLine);
const copiesEnv = instructions.some((l) => /^(COPY|ADD)\s.*\.env\b/i.test(l));

// --- .dockerignore ---
const ignoreLines = md
  .read(ROOT, "app/.dockerignore")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));
const ignores = (re) => ignoreLines.some((l) => re.test(l));
const missingIgnores = [
  [".env", /^\/?\.env(\*|\..*)?$/],
  ["node_modules", /^\/?node_modules\/?$/],
  [".git", /^\/?\.git\/?$/],
]
  .filter(([, re]) => !ignores(re))
  .map(([name]) => name);

// --- Version + evidence ---
let appVersion = "?";
try {
  appVersion = JSON.parse(md.read(ROOT, "app/package.json")).version;
} catch {
  appVersion = "?";
}
const verified = (v) => /RESULT: VERIFIED/.test(md.read(ROOT, `evidence/verify-v${v}.txt`));

// --- Docs ---
const realCommands = (text) => {
  const blocks = md.fencedBlocks(text);
  return blocks.length > 0 && blocks.every((b) => b.split("\n").some((l) => l.trim() && !l.trim().startsWith("#")));
};
const guide = md.read(ROOT, "docs/DEPLOYMENT_GUIDE.md");
const rollback = md.read(ROOT, "docs/ROLLBACK_PROCEDURE.md");
const runbook = md.read(ROOT, "docs/RUNBOOK.md");
const checklist = md.read(ROOT, "docs/DEPLOYMENT_CHECKLIST.md");

const guideOk = md.allFieldsFilled(guide) && realCommands(guide) && md.filledRows(md.section(guide, "Command log")).length >= 2;
const rollbackOk = md.allFieldsFilled(rollback) && realCommands(rollback) && md.filledRows(md.section(rollback, "Rollback test record")).length >= 1;
const monitoringOk = md.allFieldsFilled(md.section(runbook, "Monitoring"));
const scenarios = md.filledRows(md.section(runbook, "Failure scenarios"));
const boxes = md.checkboxes(checklist);
const checked = boxes.filter((b) => b.checked).length;
const peerOk = md.allFieldsFilled(md.section(checklist, "Peer validation"));

const checks = [
  {
    label: "Dockerfile: FROM, WORKDIR, COPY, EXPOSE, CMD all present",
    ok: ["FROM", "WORKDIR", "COPY", "EXPOSE", "CMD"].every(has),
    detail: ["FROM", "WORKDIR", "COPY", "EXPOSE", "CMD"].filter((w) => !has(w)).map((w) => "missing " + w).join(", ") || "complete",
  },
  { label: "Dockerfile: base image version is pinned", ok: pinned, detail: image ? image : "no FROM line yet" },
  { label: "Dockerfile: runs as a non-root user", ok: Boolean(nonRoot), detail: userLine || "add USER node" },
  { label: "Dockerfile: never copies .env into the image", ok: !copiesEnv, detail: copiesEnv ? "remove the COPY of .env; use --env-file" : "good" },
  { label: ".dockerignore: keeps out .env, node_modules, .git", ok: missingIgnores.length === 0, detail: missingIgnores.length ? "missing: " + missingIgnores.join(", ") : "good" },
  { label: "Deployed + verified v1.0.0", ok: verified("1.0.0"), detail: "npm run verify -- 1.0.0" },
  {
    label: "Released + verified a new version",
    ok: appVersion !== "1.0.0" && verified(appVersion),
    detail: appVersion === "1.0.0" ? "bump app/package.json to 1.1.0, build, deploy, verify" : `v${appVersion}`,
  },
  { label: "Deployment guide: every step + real commands + command log", ok: guideOk, detail: "docs/DEPLOYMENT_GUIDE.md" },
  { label: "Rollback procedure: steps + a tested rollback", ok: rollbackOk, detail: "docs/ROLLBACK_PROCEDURE.md" },
  { label: "Runbook: monitoring", ok: monitoringOk, detail: "docs/RUNBOOK.md, Monitoring" },
  { label: "Runbook: 1+ failure scenario with a recovery step", ok: scenarios.length >= 1, detail: `${scenarios.length} scenario(s)` },
  { label: "Checklist worked through", ok: boxes.length > 0 && checked === boxes.length, detail: `${checked}/${boxes.length} checked` },
  { label: "Peer validation recorded", ok: peerOk, detail: "your partner fills this in after following your docs" },
];

md.report("T10B Artifact Self-Check", checks, "Artifact is complete. Clean up: docker stop cohorthub-events && docker rm cohorthub-events");

const healthcheck = has("HEALTHCHECK");
console.log((healthcheck ? "[BONUS] " : "[ADVANCED] ") + "HEALTHCHECK in the Dockerfile");
console.log("       " + (healthcheck ? "docker ps will show (healthy) or (unhealthy)" : "optional: add TODO 6"));
const docker = spawnSync("docker", ["images", "cohorthub-events", "--format", "{{.Tag}}"], { encoding: "utf8" });
if (docker.status === 0) {
  const tags = docker.stdout.split("\n").filter(Boolean);
  console.log("[INFO]  Images built: " + (tags.length ? tags.map((t) => "cohorthub-events:" + t).join(", ") : "none yet"));
}
console.log("");
