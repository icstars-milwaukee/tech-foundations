// Artifact self-check for T9A. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there, and checks that no secret leaked into git.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const md = require("./lib/md");
const { loadEnv } = require("../src/env");

const ROOT = path.join(__dirname, "..");

function readJson(rel) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  } catch {
    return null;
  }
}

function git(args) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  return { ok: r.status === 0, out: (r.stdout || "").trim() };
}

const tests = spawnSync(process.execPath, ["--test", path.join("test", "api.test.js")], { cwd: ROOT, encoding: "utf8" });

const events = readJson("output/events.json");
const eventsOk = Array.isArray(events) && events.length > 0 && events.every((e) => e.id && e.date && "seatsLeft" in e);
const weather = readJson("output/weather.json");
const weatherOk = weather && typeof weather.temperatureF === "number";
const attendance = readJson("output/attendance.json");
const attendanceOk = Array.isArray(attendance) && attendance.length > 0 && attendance.every((r) => r.showRate);

// --- Secrets ---
const inRepo = git(["rev-parse", "--is-inside-work-tree"]).ok;
const envTracked = inRepo && git(["ls-files", "--", ".env"]).out.length > 0;
const envInHistory = inRepo && git(["log", "--all", "--format=%h", "--", ".env"]).out.length > 0;
const envIgnored = inRepo ? git(["check-ignore", "-q", ".env"]).ok : /^\.env$/m.test(md.read(ROOT, ".gitignore"));

loadEnv();
const key = process.env.API_KEY && !process.env.API_KEY.startsWith("paste-") ? process.env.API_KEY : "";
let keyLeaks = [];
if (key && inRepo) {
  const grep = spawnSync("git", ["grep", "-l", "-F", key], { cwd: ROOT, encoding: "utf8" });
  keyLeaks = (grep.stdout || "").split("\n").filter(Boolean);
}

const notes = md.read(ROOT, "API_NOTES.md");
const notesFilled = md.filledFields(notes).length;
const notesTotal = md.fields(notes).length;

const checks = [
  {
    label: "Client + transform pass npm test",
    ok: tests.status === 0,
    detail: tests.status === 0 ? "all tests pass" : "run `npm test` to see which ones fail",
  },
  { label: "Stage 1: output/events.json is a clean dataset", ok: eventsOk, detail: eventsOk ? `${events.length} events` : "run `npm run stage1`" },
  { label: "Stage 2: output/weather.json", ok: Boolean(weatherOk), detail: weatherOk ? `${weather.temperatureF}°F` : "finish transformWeather(), run `npm run stage2`" },
  { label: "Stage 3: output/attendance.json", ok: attendanceOk, detail: attendanceOk ? `${attendance.length} rows` : "finish transformAttendance(), run `npm run stage3`" },
  { label: "Secrets: .env is ignored by git", ok: envIgnored, detail: envIgnored ? "ignored" : "add .env to .gitignore" },
  {
    label: "Secrets: .env was never committed",
    ok: !envTracked && !envInHistory,
    detail: envTracked || envInHistory ? "STOP: .env is in git. Tell your trainer and rotate the key." : inRepo ? "clean" : "not a git repo yet (git init)",
  },
  {
    label: "Secrets: your API key doesn't appear in any committed file",
    ok: keyLeaks.length === 0,
    detail: keyLeaks.length ? "found in: " + keyLeaks.join(", ") : key ? "clean" : "no key in .env yet",
  },
  { label: "API_NOTES.md filled in", ok: notesTotal > 0 && notesFilled === notesTotal, detail: `${notesFilled}/${notesTotal} answers` },
];

md.report(
  "T9A Artifact Self-Check",
  checks,
  "Artifact is complete. Now ask: if the API went down during your demo, what would your program do?"
);
