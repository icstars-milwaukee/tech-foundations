// =====================================================================
// W9 Assessment C, Task 3: Data Pipeline
// =====================================================================
//
//   npm run pipeline                                 data/raw.csv -> data/
//   npm run pipeline -- <file.csv> [output folder]   a new export  -> out/<file>/
//
//   raw.csv  ->  clean.csv  ->  export.json   (+ quality_report.json)
//
// Reads a community program sign-ups export, gives every column a clear
// name and one data type, runs validation checks on the result, and writes
// a cleaned CSV, a JSON export, and a data quality report.
//
// Never edit the raw CSV by hand. The code does the cleaning, and every
// value it fixes or flags is logged as an anomaly. The reasons behind each
// rule are in notes/data_cleaning_log.md.
// =====================================================================

const fs = require("fs");
const path = require("path");

const DEFAULT_INPUT = path.join(__dirname, "data", "raw.csv");
const DEFAULT_OUT_DIR = path.join(__dirname, "data");

// Logging standard (from T7A):  [timestamp] [LEVEL] message
function log(level, message) {
  console.log(`[${new Date().toISOString()}] [${level}] ${message}`);
}

// ---------------------------------------------------------------------
// SETTINGS: what a sign-ups export should look like
// ---------------------------------------------------------------------

// The output columns, in order, and the function (STEP 2) that cleans each one.
// Every run writes exactly these columns, however the input names or orders them.
const CLEANERS = {
  participant_id: toId,
  first_name: toText,
  program: toText,
  neighborhood: toText,
  start_date: toISODate,
  sessions_attended: toNumber,
  completed: toBoolean,
};
const COLUMNS = Object.keys(CLEANERS);

// Other header spellings an export might use, after normalizeHeader() has
// lowercased them and turned spaces and punctuation into "_".
const HEADER_ALIASES = {
  id: "participant_id",
  participant: "participant_id",
  name: "first_name",
  first: "first_name",
  location: "neighborhood",
  neighbourhood: "neighborhood",
  site: "neighborhood",
  date: "start_date",
  start: "start_date",
  sessions: "sessions_attended",
  attended: "sessions_attended",
  complete: "completed",
};

// Text that means "unknown" in any column (compared trimmed and lowercase).
// "na" is left out on purpose: Na is a real first name.
const NULL_TOKENS = new Set(["", "null", "n/a", "none", "-"]);

const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const TRUE_WORDS = new Set(["yes", "y", "true", "t", "1"]);
const FALSE_WORDS = new Set(["no", "n", "false", "f", "0"]);

// Used by the validation checks (STEP 3). When a new program launches, add it here.
const KNOWN_PROGRAMS = ["Teen Coding Club", "Adult Digital Skills", "Homework Help", "Senior Tech Help"];
const ID_PATTERN = /^P\d{3,}$/;

// Every problem found goes in an `anomalies` list as { line, where, column, message }
// and is logged like: "Row P002 (line 3): sessions_attended 'twelve' -> 12"
function formatAnomaly(anomaly) {
  return `${anomaly.where}: ${anomaly.message}`;
}

// ---------------------------------------------------------------------
// STEP 1: READ
// ---------------------------------------------------------------------

// The raw file mixes encodings. Most lines are UTF-8 ("Zoë"), but P003 was
// saved as Latin-1 ("José" with the single byte 0xE9, which isn't valid
// UTF-8). Decoding the whole file one way breaks the other row, so each line
// is decoded on its own: strict UTF-8 first, Latin-1 if that fails.
// (Windows-1252 is Windows' superset of Latin-1; it also covers ’ and €.)
const utf8 = new TextDecoder("utf-8", { fatal: true });
const latin1 = new TextDecoder("windows-1252");

function readRaw(file, anomalies) {
  if (!fs.existsSync(file)) throw new Error(`Input file not found: ${file}`);
  const bytes = fs.readFileSync(file);
  const lines = [];
  let start = 0;
  while (start <= bytes.length) {
    const newline = bytes.indexOf(0x0a, start);
    const end = newline === -1 ? bytes.length : newline;
    lines.push(decodeLine(bytes.subarray(start, end), lines.length + 1, anomalies));
    start = end + 1;
  }
  if (lines[lines.length - 1] === "") lines.pop(); // the file ended with a newline
  if (lines.length === 0) throw new Error(`Input file is empty: ${file}`);
  return lines;
}

// Windows files end lines with "\r\n". Splitting on "\n" leaves a "\r" stuck
// to the last cell of every row, so it's trimmed here. A UTF-8 byte order
// mark (which Excel adds when it saves "CSV UTF-8") is removed too.
function decodeLine(bytes, line, anomalies) {
  let text;
  try {
    text = utf8.decode(bytes);
  } catch {
    text = latin1.decode(bytes);
    anomalies.push({ line, where: `Line ${line}`, column: null, message: `not valid UTF-8, decoded as Latin-1 -> "${text.trim()}"` });
  }
  return text.replace(/^﻿/, "").replace(/\r$/, "");
}

// Splits one CSV line into cells. Quoted cells are kept whole, so
// "Robotics, Grades 6-8" stays one cell, and "" inside quotes is a literal quote.
function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes && char === '"' && line[i + 1] === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
}

// ---------------------------------------------------------------------
// STEP 2: CLEAN
// ---------------------------------------------------------------------

// Gives every input column one of the names in COLUMNS, or null to drop it.
// Headers are matched loosely ("Participant ID", "participant_id"), so an
// export with renamed or re-ordered columns still lines up.
// A blank header is handled two ways:
//   - no data in the column at all -> dropped (raw.csv's trailing comma)
//   - has data, and exactly one expected column wasn't found -> it must be
//     that column (raw.csv's 4th column holds the neighborhood)
// Throws if an expected column still can't be found, because every row
// would come out wrong.
function fixHeaders(headers, rows, anomalies) {
  const names = headers.map(normalizeHeader);
  const hasData = (i) => rows.some((cells) => !isBlank(cells[i]));
  const notFound = COLUMNS.filter((column) => !names.includes(column));
  const unnamedWithData = names.filter((name, i) => name === "" && hasData(i));

  const fixed = names.map((name, i) => {
    const flag = (message) => anomalies.push({ line: 1, where: `Header column ${i + 1}`, column: null, message });
    const original = headers[i].trim();

    if (name === "" && !hasData(i)) {
      flag("no name and no data -> dropped");
      return null;
    }
    if (name === "") {
      if (unnamedWithData.length === 1 && notFound.length === 1) {
        flag(`no name -> named '${notFound[0]}' (the only expected column not found)`);
        return notFound[0];
      }
      flag("no name, and it can't be matched to an expected column -> dropped");
      return null;
    }
    if (!COLUMNS.includes(name)) {
      flag(`'${original}' is not an expected column -> dropped`);
      return null;
    }
    if (names.indexOf(name) !== i) {
      flag(`'${original}' repeats an earlier column -> dropped`);
      return null;
    }
    if (original !== name) flag(`'${original}' -> '${name}'`);
    return name;
  });

  const stillMissing = COLUMNS.filter((column) => !fixed.includes(column));
  if (stillMissing.length > 0) {
    throw new Error(`Missing expected column(s): ${stillMissing.join(", ")}. Check the header row of the input file.`);
  }
  return fixed;
}

// "Participant ID" -> "participant_id", "Completed?" -> "completed", "Sessions" -> "sessions_attended"
function normalizeHeader(header) {
  const key = header.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return Object.hasOwn(HEADER_ALIASES, key) ? HEADER_ALIASES[key] : key;
}

function isBlank(value) {
  return value === undefined || NULL_TOKENS.has(value.trim().toLowerCase());
}

// Blank text (like a missing name) becomes null, not "". Extra spaces are trimmed.
function toText(value) {
  return isBlank(value) ? null : value.trim();
}

// IDs are matched exactly (for duplicates), so "p016" is upper-cased to "P016".
function toId(value) {
  const text = toText(value);
  return text === null ? null : text.toUpperCase();
}

// sessions_attended is a count, so only whole numbers 0 or more are valid.
//   "12" -> 12, " 7 " -> 7, "twelve" -> 12, "" / "NULL" -> null
// Anything else ("-3", "4.5", "lots") becomes null and gets flagged.
function toNumber(value) {
  if (isBlank(value)) return null;
  const text = value.trim().toLowerCase();
  if (/^\d+(\.0+)?$/.test(text)) return Number(text);
  const word = NUMBER_WORDS.indexOf(text);
  return word === -1 ? null : word;
}

// Turns a start_date into YYYY-MM-DD, or null if unknown. Accepts:
//   2026-09-08, 2026/10/06     year first
//   09/15/2026, 9/29/26        US month/day/year (2-digit years are 20xx)
//   Sep 22 2026, Oct 13, 2026  month name
// Impossible dates like 02/30/2026 become null and get flagged.
function toISODate(value) {
  if (isBlank(value)) return null;
  const text = value.trim();
  const yearFirst = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  const usDate = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2}|\d{4})$/);
  const monthName = text.match(/^([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/i);

  let parts; // [year, month, day]
  if (yearFirst) parts = [yearFirst[1], yearFirst[2], yearFirst[3]];
  else if (usDate) parts = [usDate[3], usDate[1], usDate[2]];
  else if (monthName) parts = [monthName[3], MONTHS.indexOf(monthName[1].toLowerCase()) + 1, monthName[2]];
  else return null;

  let [year, month, day] = parts.map(Number);
  if (year < 100) year += 2000;
  // Date.UTC rolls bad dates over (Feb 30 -> Mar 2), so check nothing moved.
  const date = new Date(Date.UTC(year, month - 1, day));
  const isReal = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return isReal ? date.toISOString().slice(0, 10) : null;
}

// "10/06/2026" could be Oct 6 or Jun 10. This is a US export, so toISODate
// reads it as month/day, but the value is flagged so a person can double-check.
function isAmbiguousDate(value) {
  const match = value.trim().match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2}|\d{4})$/);
  if (!match) return false;
  const [first, second] = [Number(match[1]), Number(match[2])];
  return first !== second && first <= 12 && second <= 12;
}

// Turns completed into true / false, or null if unknown.
//   "yes" / "Y" / "TRUE" -> true, "no" -> false, "N/A" / "" -> null
// A word it doesn't recognize ("maybe") becomes null and gets flagged.
function toBoolean(value) {
  if (isBlank(value)) return null;
  const text = value.trim().toLowerCase();
  if (TRUE_WORDS.has(text)) return true;
  if (FALSE_WORDS.has(text)) return false;
  return null;
}

// Says what cleaning did to one value, or returns null if it was already clean.
// "yes" / "no" count as clean for completed: it's the export's own convention.
function describeFix(raw, value) {
  if (value === null) {
    if (raw.trim() === "") return "blank -> null";
    if (isBlank(raw)) return `'${raw}' -> null (placeholder for unknown)`;
    return `'${raw}' -> null (invalid value, flagged)`;
  }
  if (raw === String(value) || (raw === "yes" && value === true) || (raw === "no" && value === false)) return null;
  return `'${raw}' -> ${JSON.stringify(value)}`;
}

// Builds one clean object per row.
//   - Blank rows (empty lines, or lines that are only commas) are skipped.
//   - Each column goes through its function in CLEANERS.
//   - Every value that had to be fixed or flagged is pushed to `anomalies`.
// Returns { rows, skipped }, where each row is { line, where, record }.
function cleanRows(lines, anomalies) {
  const body = lines.slice(1).map((text, i) => ({ line: i + 2, cells: parseCsvLine(text) }));
  const names = fixHeaders(parseCsvLine(lines[0]), body.map((row) => row.cells), anomalies);

  const rows = [];
  let skipped = 0;
  for (const { line, cells } of body) {
    if (cells.every((cell) => isBlank(cell))) {
      anomalies.push({ line, where: `Line ${line}`, column: null, message: "blank row -> skipped" });
      skipped++;
      continue;
    }

    const raw = {};
    names.forEach((name, i) => {
      if (name) raw[name] = cells[i] ?? "";
    });
    const record = {};
    for (const column of COLUMNS) record[column] = CLEANERS[column](raw[column]);

    const where = record.participant_id ? `Row ${record.participant_id} (line ${line})` : `Line ${line}`;
    const extra = cells.slice(names.length).filter((cell) => !isBlank(cell));
    if (extra.length > 0) {
      anomalies.push({ line, where, column: null, message: `extra value(s) past the last column ignored: '${extra.join("', '")}'` });
    }
    for (const column of COLUMNS) {
      let fix = describeFix(raw[column], record[column]);
      if (fix && column === "start_date" && isAmbiguousDate(raw[column])) fix += " (ambiguous: read as US month/day)";
      if (fix) anomalies.push({ line, where, column, message: `${column} ${fix}` });
    }
    rows.push({ line, where, record });
  }
  return { rows, skipped };
}

// ---------------------------------------------------------------------
// STEP 3: VALIDATE
// ---------------------------------------------------------------------

// Rules every clean row should pass.
//   error   -> the row can't be trusted, so it's left out of clean.csv and
//              export.json and listed under rejected_rows in the quality report
//   warning -> the row is kept, but flagged for a person to look at
const CHECKS = [
  {
    name: "participant_id is filled in",
    severity: "error",
    fails: (record) => record.participant_id === null,
  },
  {
    name: "participant_id is unique (first one kept)",
    severity: "error",
    fails: (record, seenIds) => record.participant_id !== null && seenIds.has(record.participant_id),
  },
  {
    name: "participant_id looks like P001",
    severity: "warning",
    fails: (record) => record.participant_id !== null && !ID_PATTERN.test(record.participant_id),
  },
  {
    name: "program is a known program",
    severity: "warning",
    fails: (record) => !KNOWN_PROGRAMS.includes(record.program),
  },
  {
    name: "anyone marked completed attended at least 1 session",
    severity: "warning",
    fails: (record) => record.completed === true && record.sessions_attended === 0,
  },
];

function validateRecords(rows) {
  const results = CHECKS.map((check) => ({ check: check.name, severity: check.severity, failed: [] }));
  const kept = [];
  const rejected = [];
  const seenIds = new Set();

  for (const row of rows) {
    const reasons = [];
    CHECKS.forEach((check, i) => {
      if (!check.fails(row.record, seenIds)) return;
      results[i].failed.push(row.where);
      if (check.severity === "error") reasons.push(check.name);
    });
    if (row.record.participant_id !== null) seenIds.add(row.record.participant_id);
    if (reasons.length > 0) rejected.push({ ...row, reasons });
    else kept.push(row);
  }
  return { results, kept, rejected };
}

// The data quality summary: row counts, how complete each column is, how many
// anomalies each column had, a quick profile of the values, and the result of
// every check. Column stats describe the rows that were written out.
function buildQualityReport(inputFile, lineCount, skipped, anomalies, validation) {
  const records = validation.kept.map((row) => row.record);
  const keptLines = new Set(validation.kept.map((row) => row.line));
  const columns = {};
  for (const column of COLUMNS) {
    const values = records.map((record) => record[column]).filter((value) => value !== null);
    columns[column] = {
      filled: values.length,
      missing: records.length - values.length,
      anomalies: anomalies.filter((a) => a.column === column && keptLines.has(a.line)).length,
      ...profileValues(column, values),
    };
  }

  return {
    source_file: path.basename(inputFile),
    generated_at: new Date().toISOString(),
    rows: {
      lines_read: lineCount,
      blank_rows_skipped: skipped,
      rejected: validation.rejected.length,
      written: records.length,
    },
    columns,
    checks: validation.results.map(({ check, severity, failed }) => ({
      check,
      severity,
      status: failed.length === 0 ? "pass" : severity === "error" ? "fail" : "warn",
      failed_rows: failed,
    })),
    rejected_rows: validation.rejected.map(({ line, reasons, record }) => ({ line, reasons, record })),
    anomalies: anomalies.map(formatAnomaly),
  };
}

// Counts for categories, a range for numbers and dates. A typo like
// "Teen Coding club" would show up here as its own category.
function profileValues(column, values) {
  if (values.length === 0) return {};
  if (column === "sessions_attended") {
    const total = values.reduce((sum, value) => sum + value, 0);
    return {
      min: values.reduce((a, b) => Math.min(a, b)),
      max: values.reduce((a, b) => Math.max(a, b)),
      average: Math.round((total / values.length) * 10) / 10,
    };
  }
  if (column === "start_date") {
    const sorted = [...values].sort();
    return { earliest: sorted[0], latest: sorted[sorted.length - 1] };
  }
  if (["program", "neighborhood", "completed"].includes(column)) {
    const counts = {};
    for (const value of values) counts[value] = (counts[value] || 0) + 1;
    return { values: counts };
  }
  return {};
}

function logQualitySummary(report) {
  const { rows, columns, checks } = report;
  log("INFO", `Data quality summary: ${rows.written} rows written, ${rows.rejected} rejected, ${rows.blank_rows_skipped} blank rows skipped`);
  for (const [column, stats] of Object.entries(columns)) {
    log("INFO", `  ${column.padEnd(18)} ${stats.filled} filled, ${stats.missing} missing, ${stats.anomalies} anomalies`);
  }
  for (const check of checks) {
    const level = { pass: "INFO", warn: "WARN", fail: "ERROR" }[check.status];
    const failed = check.failed_rows.length > 0 ? ` -> ${check.failed_rows.join(", ")}` : "";
    log(level, `Check ${check.status.toUpperCase()}: ${check.check}${failed}`);
  }
}

// ---------------------------------------------------------------------
// STEP 4: WRITE
// ---------------------------------------------------------------------

// A header row, then one line per record. null becomes an empty cell, and a
// cell with a comma or quote is wrapped in quotes so the CSV stays valid.
// The file starts with a UTF-8 byte order mark so Excel shows "José" and
// "Zoë" correctly instead of guessing the wrong encoding.
function writeCleanCsv(records, file) {
  const lines = [COLUMNS.join(",")];
  for (const record of records) {
    lines.push(COLUMNS.map((column) => toCsvCell(record[column])).join(","));
  }
  fs.writeFileSync(file, "﻿" + lines.join("\n") + "\n", "utf8");
}

function toCsvCell(value) {
  if (value === null) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeJson(data, file) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// Reads the outputs back to prove they're usable: export.json has to parse,
// and both files have to hold every record that was cleaned.
function verifyOutputs(csvFile, jsonFile, expected) {
  const csvRows = readRaw(csvFile, []).length - 1;
  const jsonRows = JSON.parse(fs.readFileSync(jsonFile, "utf8")).length;
  if (csvRows !== expected || jsonRows !== expected) {
    throw new Error(`Output check failed: expected ${expected} records, clean.csv has ${csvRows}, export.json has ${jsonRows}`);
  }
  log("INFO", `Output check passed: export.json is valid JSON, and both files hold ${expected} records`);
}

// ---------------------------------------------------------------------
// RUN
// ---------------------------------------------------------------------

function runPipeline(inputFile = DEFAULT_INPUT, outDir = DEFAULT_OUT_DIR) {
  const anomalies = [];
  const show = (file) => path.relative(process.cwd(), file) || ".";
  log("INFO", "Pipeline start");

  const lines = readRaw(inputFile, anomalies);
  log("INFO", `Read ${lines.length} lines from ${show(inputFile)}`);

  const { rows, skipped } = cleanRows(lines, anomalies);
  log("INFO", `Rows processed: ${rows.length} (${skipped} blank rows skipped)`);

  log("INFO", `Anomalies found: ${anomalies.length}`);
  anomalies.forEach((anomaly) => log("WARN", formatAnomaly(anomaly)));

  const validation = validateRecords(rows);
  const report = buildQualityReport(inputFile, lines.length, skipped, anomalies, validation);
  logQualitySummary(report);

  const records = validation.kept.map((row) => row.record);
  const csvFile = path.join(outDir, "clean.csv");
  const jsonFile = path.join(outDir, "export.json");
  const reportFile = path.join(outDir, "quality_report.json");
  fs.mkdirSync(outDir, { recursive: true });
  writeCleanCsv(records, csvFile);
  writeJson(records, jsonFile);
  writeJson(report, reportFile);
  log("INFO", `Wrote ${show(csvFile)}, ${show(jsonFile)}, ${show(reportFile)}`);

  verifyOutputs(csvFile, jsonFile, records.length);
  log("INFO", "Pipeline done");
  return { records, report };
}

//   npm run pipeline                            data/raw.csv -> data/
//   npm run pipeline -- new.csv                 new.csv      -> out/new/
//   npm run pipeline -- new.csv some/folder     new.csv      -> some/folder/
// A new file gets its own output folder by default, so it never overwrites data/.
function main() {
  const [inputArg, outArg] = process.argv.slice(2);
  // npm runs scripts from this folder; INIT_CWD is the folder the command was typed in.
  const typedIn = process.env.INIT_CWD || process.cwd();
  const inputFile = inputArg ? path.resolve(typedIn, inputArg) : DEFAULT_INPUT;
  let outDir = DEFAULT_OUT_DIR;
  if (outArg) outDir = path.resolve(typedIn, outArg);
  else if (inputArg) outDir = path.join(__dirname, "out", path.parse(inputFile).name);

  try {
    runPipeline(inputFile, outDir);
  } catch (err) {
    log("ERROR", `Pipeline stopped: ${err.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

// Exported for test/pipeline.test.js, or for another script to reuse.
module.exports = { COLUMNS, readRaw, parseCsvLine, toText, toNumber, toISODate, toBoolean, runPipeline };
