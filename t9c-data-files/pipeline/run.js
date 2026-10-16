// =====================================================================
// T9C: The pipeline  raw CSV -> cleaned CSV -> JSON
// =====================================================================
//
//   npm run pipeline              run every step
//   npm run pipeline:validate     STRETCH: also validate each record against
//                                 schema/survey-record.schema.json before export
//
// You don't need to edit this file. Your work is in pipeline/clean.js and
// pipeline/summarize.js. Read it, though: this is what a pipeline looks like.
// =====================================================================

const fs = require("fs");
const path = require("path");
const log = require("../src/logger");
const { parseCSV, toCSV } = require("../src/csv");
const { validate } = require("../src/mini-schema");
const clean = require("./clean");
const { summarizeByTeam } = require("./summarize");

const ROOT = path.join(__dirname, "..");
const RAW = path.join(ROOT, "data", "raw", "pulse-survey.csv");
const CLEAN = path.join(ROOT, "data", "clean", "pulse-survey.clean.csv");
const JSON_OUT = path.join(ROOT, "data", "out", "pulse-survey.json");
const SCHEMA = path.join(ROOT, "schema", "survey-record.schema.json");
const COLUMNS = ["submitted_on", "full_name", "team", "hours_coding_this_week", "confidence_1_5", "laptop_ok", "comments"];

function run({ validateSchema = false } = {}) {
  // 1. READ (and strip the invisible byte-order mark some tools add)
  let text = fs.readFileSync(RAW, "utf8");
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
    log.info("Step 1  Read raw CSV (removed a byte-order mark)");
  } else {
    log.info("Step 1  Read raw CSV");
  }

  // 2. PARSE + drop blank rows
  const [rawHeaders, ...body] = parseCSV(text);
  const rows = body.filter((r) => r.some((cell) => cell.trim() !== ""));
  log.info(`Step 2  Parsed ${body.length} rows, dropped ${body.length - rows.length} blank row(s)`);

  // 3. HEADERS
  const headers = clean.fixHeaders(rawHeaders);
  log.info(`Step 3  Headers: ${headers.map((h) => JSON.stringify(h)).join(", ")}`);
  if (headers.some((h) => !h)) log.warn("        A header is still blank (TODO 1)");

  // 4. CLEAN each row
  const records = rows.map((cells) => {
    const raw = {};
    headers.forEach((h, i) => (raw[h] = cells[i]));
    return clean.cleanRecord(raw);
  });
  const nulls = records.reduce((n, r) => n + Object.values(r).filter((v) => v === null).length, 0);
  log.info(`Step 4  Cleaned ${records.length} records (${nulls} value(s) are null = unknown)`);

  // 5. DEDUPE
  const unique = clean.dedupeByName(records);
  log.info(`Step 5  Removed ${records.length - unique.length} duplicate(s), ${unique.length} records left`);

  // 6. WRITE cleaned CSV
  fs.mkdirSync(path.dirname(CLEAN), { recursive: true });
  fs.writeFileSync(CLEAN, toCSV(unique, COLUMNS));
  log.info(`Step 6  Wrote ${path.relative(ROOT, CLEAN)}`);

  // 7. VALIDATE (stretch)
  if (validateSchema) {
    const schema = JSON.parse(fs.readFileSync(SCHEMA, "utf8"));
    const bad = unique
      .map((r, i) => ({ name: r.full_name || `row ${i + 1}`, errors: validate(schema, r) }))
      .filter((x) => x.errors.length);
    if (bad.length) {
      log.error(`Step 7  ${bad.length} record(s) don't match the schema. JSON NOT exported.`);
      bad.forEach((b) => log.error(`        ${b.name}: ${b.errors[0]}`));
      process.exitCode = 1;
      return;
    }
    log.info(`Step 7  All ${unique.length} records match the schema`);
  }

  // 8. SUMMARIZE + export JSON
  const output = {
    source: path.relative(ROOT, RAW),
    generatedAt: new Date().toISOString(),
    recordCount: unique.length,
    summaryByTeam: summarizeByTeam(unique),
    records: unique,
  };
  fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(output, null, 2) + "\n");
  log.info(`Step 8  Wrote ${path.relative(ROOT, JSON_OUT)}`);
  console.table(output.summaryByTeam);
}

if (require.main === module) {
  try {
    run({ validateSchema: process.argv.includes("--validate") });
  } catch (err) {
    log.error("Pipeline failed: " + err.message);
    process.exitCode = 1;
  }
}

module.exports = { run };
