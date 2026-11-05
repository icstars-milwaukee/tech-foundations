// Artifact self-check for T9C. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const path = require("path");
const { spawnSync } = require("child_process");
const md = require("./lib/md");
const { parseCSV } = require("../src/csv");

const ROOT = path.join(__dirname, "..");

const tests = spawnSync(process.execPath, ["--test", path.join("test", "clean.test.js")], { cwd: ROOT, encoding: "utf8" });
const passing = Number(((tests.stdout || "").match(/^(?:# |ℹ )pass (\d+)/m) || [])[1] || 0);

const cleanCsv = md.read(ROOT, "data/clean/pulse-survey.clean.csv");
const cleanRows = cleanCsv.trim() ? parseCSV(cleanCsv.trim()).length - 1 : 0;

let out = null;
try {
  out = JSON.parse(md.read(ROOT, "data/out/pulse-survey.json"));
} catch {
  out = null;
}
const outOk = out && Array.isArray(out.records) && out.records.length > 0;
const summaryOk = out && out.summaryByTeam && Object.keys(out.summaryByTeam).length > 0;
const hasNaN = /\bNaN\b/.test(cleanCsv) || /mojibake|Ã/.test(cleanCsv);

const log = md.read(ROOT, "CLEANING_LOG.md");
const problemRows = md.filledRows(md.section(log, "Problems found"), { skipFirst: true });

let schemaFields = 0;
try {
  const schema = JSON.parse(md.read(ROOT, "schema/survey-record.schema.json"));
  schemaFields = Object.keys(schema.properties || {}).length;
} catch {
  schemaFields = 0;
}
const validated = schemaFields >= 7 ? spawnSync(process.execPath, ["pipeline/run.js", "--validate"], { cwd: ROOT, encoding: "utf8" }).status === 0 : false;

const checks = [
  { label: "Cleaning functions pass npm test", ok: tests.status === 0, detail: `${passing}/7 tests passing` },
  {
    label: "Clean CSV written (data/clean/pulse-survey.clean.csv)",
    ok: cleanRows > 0 && !hasNaN,
    detail: cleanRows ? (hasNaN ? "contains NaN or broken characters" : `${cleanRows} rows`) : "run `npm run pipeline`",
  },
  { label: "JSON written with records (data/out/pulse-survey.json)", ok: Boolean(outOk), detail: outOk ? `${out.records.length} records` : "run `npm run pipeline`" },
  { label: "JSON includes a summary by team", ok: Boolean(summaryOk), detail: summaryOk ? Object.keys(out.summaryByTeam).join(", ") : "finish TODO 6, then rerun" },
  { label: "Cleaning log: first look", ok: md.allFieldsFilled(md.section(log, "First look")), detail: "what the spreadsheet shows and hides" },
  { label: "Cleaning log: 5+ problems (what, why, how, rows)", ok: problemRows.length >= 5, detail: `${problemRows.length} complete row(s)` },
  { label: "Cleaning log: decisions + result", ok: md.allFieldsFilled(md.section(log, "Decisions")) && md.allFieldsFilled(md.section(log, "Result")), detail: "duplicates, nulls, an unfixable value, rows in/out" },
];

md.report("T9C Artifact Self-Check", checks, "Artifact is complete. Now ask: could a teammate rerun your pipeline on next week's export and trust the result?");
console.log((validated ? "[BONUS] " : "[STRETCH] ") + "Schema validation before export");
console.log("       " + (validated ? "every record matches your schema" : `schema describes ${schemaFields}/7 fields; finish it and run \`npm run pipeline:validate\``));
console.log("");
