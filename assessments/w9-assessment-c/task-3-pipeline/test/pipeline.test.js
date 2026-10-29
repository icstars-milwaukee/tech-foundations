// Tests for run.js, using Node's built-in test runner (no npm install).
//
//   npm test
//
// Each full pipeline run writes into a temp folder, so data/ is never touched.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const pipeline = require("../run.js");

const RAW = path.join(__dirname, "..", "data", "raw.csv");
const NEW_FILE = path.join(__dirname, "..", "samples", "new_signups.csv");

const tempDirs = [];
test.after(() => tempDirs.forEach((dir) => fs.rmSync(dir, { recursive: true, force: true })));

// Runs the whole pipeline into a fresh temp folder with the console logs switched off.
function runQuietly(inputFile) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "w9c-pipeline-"));
  tempDirs.push(outDir);
  const consoleLog = console.log;
  console.log = () => {};
  try {
    return { outDir, ...pipeline.runPipeline(inputFile, outDir) };
  } finally {
    console.log = consoleLog;
  }
}

test("toNumber handles every sessions_attended format in the raw file", () => {
  assert.equal(pipeline.toNumber("12"), 12);
  assert.equal(pipeline.toNumber("twelve"), 12);
  assert.equal(pipeline.toNumber(" 7 "), 7);
  assert.equal(pipeline.toNumber(""), null);
  assert.equal(pipeline.toNumber("NULL"), null);
  assert.equal(pipeline.toNumber("-3"), null);
});

test("toISODate turns every date format into YYYY-MM-DD", () => {
  const cases = {
    "2026-09-08": "2026-09-08",
    "09/15/2026": "2026-09-15",
    "Sep 22 2026": "2026-09-22",
    "9/29/26": "2026-09-29",
    "2026/10/06": "2026-10-06",
    "N/A": null,
    "02/30/2026": null,
  };
  for (const [input, expected] of Object.entries(cases)) assert.equal(pipeline.toISODate(input), expected, input);
});

test("toBoolean handles every completed format in the raw file", () => {
  for (const value of ["yes", "Y", "TRUE"]) assert.equal(pipeline.toBoolean(value), true, value);
  assert.equal(pipeline.toBoolean("no"), false);
  for (const value of ["N/A", "", "maybe"]) assert.equal(pipeline.toBoolean(value), null, value);
});

test("toText turns blanks into null but keeps a real name like Na", () => {
  assert.equal(pipeline.toText("  "), null);
  assert.equal(pipeline.toText("N/A"), null);
  assert.equal(pipeline.toText(" Grace "), "Grace");
  assert.equal(pipeline.toText("Na"), "Na");
});

test("raw.csv: 14 clean rows, both encodings decoded, valid JSON export", () => {
  const { outDir, records, report } = runQuietly(RAW);
  const byId = Object.fromEntries(records.map((record) => [record.participant_id, record]));

  assert.equal(records.length, 14);
  assert.equal(report.rows.blank_rows_skipped, 2);
  assert.equal(byId.P003.first_name, "José"); // Latin-1 line
  assert.equal(byId.P005.first_name, "Zoë"); // UTF-8 line
  assert.equal(byId.P004.neighborhood, "Bay View"); // the column with no header
  assert.deepEqual(byId.P006, {
    participant_id: "P006",
    first_name: "Andre",
    program: "Adult Digital Skills",
    neighborhood: "Mitchell Street",
    start_date: "2026-10-06",
    sessions_attended: null,
    completed: null,
  });
  assert.ok(report.checks.every((check) => check.status === "pass"));

  const exported = JSON.parse(fs.readFileSync(path.join(outDir, "export.json"), "utf8"));
  assert.deepEqual(exported, records);
});

test("a new export with different headers, a BOM, quotes and bad rows still works", () => {
  const { outDir, records, report } = runQuietly(NEW_FILE);
  const statuses = Object.fromEntries(report.checks.map((check) => [check.check, check.status]));

  assert.deepEqual(
    records.map((record) => record.participant_id),
    ["P015", "P016", "P017", "P018", "P19"]
  );
  assert.equal(report.rows.rejected, 2); // the duplicate P015 and the row with no ID
  assert.equal(statuses["participant_id is unique (first one kept)"], "fail");
  assert.equal(statuses["program is a known program"], "warn");
  assert.equal(records[2].first_name, "Grace");
  assert.equal(records[2].sessions_attended, null); // was -3

  // The program with a comma in it survives the trip through clean.csv.
  const csvLines = pipeline.readRaw(path.join(outDir, "clean.csv"), []);
  assert.deepEqual(pipeline.parseCsvLine(csvLines[0]), pipeline.COLUMNS);
  assert.equal(pipeline.parseCsvLine(csvLines[4])[2], "Robotics, Grades 6-8");
});

test("a file missing an expected column stops with a clear error", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "w9c-pipeline-"));
  tempDirs.push(dir);
  const file = path.join(dir, "missing_columns.csv");
  fs.writeFileSync(file, "participant_id,first_name\nP001,Maya\n");
  assert.throws(() => runQuietly(file), /Missing expected column\(s\): program/);
});
