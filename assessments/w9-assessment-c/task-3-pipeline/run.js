// =====================================================================
// W9 Assessment C, Task 3: Data Pipeline
// =====================================================================
//
//   npm run pipeline
//
//   data/raw.csv  ->  data/clean.csv  ->  data/export.json
//
// "Import this CSV, clean it so the columns and data types make sense, and
//  export a cleaned CSV and a JSON version. Add brief notes of what you
//  cleaned and why."
//
// Never edit data/raw.csv by hand. Your code does the cleaning.
// Write down every fix in notes/data_cleaning_log.md as you go.
// =====================================================================

const fs = require("fs");
const path = require("path");

const RAW = path.join(__dirname, "data", "raw.csv");
const CLEAN = path.join(__dirname, "data", "clean.csv");
const JSON_OUT = path.join(__dirname, "data", "export.json");

// The columns we output, in order, and the type of each one.
const COLUMNS = [
  "participant_id",
  "first_name",
  "program",
  "neighborhood",
  "start_date",
  "sessions_attended",
  "completed",
];

// Logging standard (from T7A):  [timestamp] [LEVEL] message
function log(level, message) {
  console.log(`[${new Date().toISOString()}] [${level}] ${message}`);
}

// Every problem you find goes in here, e.g. "Row P002: sessions 'twelve' -> 12"
const anomalies = [];

// ---------------------------------------------------------------------
// STEP 1: READ
// ---------------------------------------------------------------------

// Most lines are UTF-8, but one (José) was saved as Latin-1. Decoding the
// whole file one way breaks the other row, so we decode line by line:
// try strict UTF-8 first, and fall back to Latin-1 if the bytes are invalid.
const utf8 = new TextDecoder("utf-8", { fatal: true });

function decodeLine(bytes, lineNumber) {
  try {
    return utf8.decode(bytes);
  } catch {
    const text = bytes.toString("latin1");
    anomalies.push(`Line ${lineNumber}: not valid UTF-8, decoded as Latin-1 -> "${text}"`);
    return text;
  }
}

function readRaw() {
  const buffer = fs.readFileSync(RAW);
  // "latin1" maps every byte to one character, so splitting is safe here.
  const rawLines = buffer.toString("latin1").split("\n");
  if (rawLines[rawLines.length - 1] === "") rawLines.pop(); // trailing newline

  return rawLines.map((line, i) => {
    const bytes = Buffer.from(line.replace(/\r$/, ""), "latin1"); // drop Windows \r
    return decodeLine(bytes, i + 1);
  });
}

// ---------------------------------------------------------------------
// STEP 2: CLEAN
// ---------------------------------------------------------------------

// Column 4 has no name but holds neighborhoods. The last column has no
// name and no data, so we drop it (only the columns in COLUMNS are kept).
function fixHeaders(headers) {
  return headers.map((name, i) => {
    const trimmed = name.trim();
    if (trimmed !== "") return trimmed;
    if (i === 3) {
      anomalies.push(`Header: column 4 had no name, renamed to "neighborhood"`);
      return "neighborhood";
    }
    anomalies.push(`Header: column ${i + 1} had no name and no data, dropped`);
    return null; // null = drop this column
  });
}

// Words that mean "we don't know".
function isUnknown(value) {
  return ["", "null", "n/a", "na", "none"].includes(String(value).trim().toLowerCase());
}

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};

// Turn a sessions_attended value into a number, or null if unknown.
function toNumber(value) {
  if (isUnknown(value)) return null;
  const text = value.trim().toLowerCase();
  if (/^\d+$/.test(text)) return Number(text);
  if (text in NUMBER_WORDS) return NUMBER_WORDS[text];
  return null;
}

const MONTHS = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function pad(n) {
  return String(n).padStart(2, "0");
}

// Turn a start_date into YYYY-MM-DD, or null if unknown.
// We build the string by hand (no Date object) so time zones can't shift the day.
function toISODate(value) {
  if (isUnknown(value)) return null;
  const text = value.trim();
  let m;

  // 2026-09-08 or 2026/10/06
  if ((m = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/))) {
    return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  }
  // 09/15/2026 or 9/29/26  (US order: month/day/year)
  if ((m = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/))) {
    const year = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${year}-${pad(m[1])}-${pad(m[2])}`;
  }
  // Sep 22 2026
  if ((m = text.match(/^([A-Za-z]{3})[a-z]*\.? (\d{1,2}),? (\d{4})$/))) {
    const month = MONTHS[m[1].toLowerCase()];
    if (month) return `${m[3]}-${pad(month)}-${pad(m[2])}`;
  }
  return null;
}

// Turn completed into true / false, or null if unknown.
function toBoolean(value) {
  if (isUnknown(value)) return null;
  const text = value.trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(text)) return true;
  if (["no", "n", "false", "0"].includes(text)) return false;
  return null;
}

// Blank text becomes null, not "".
function toText(value) {
  const text = (value ?? "").trim();
  return text === "" ? null : text;
}

// Run one cleaner on one value and log it if the value changed or went null.
function cleanField(id, column, raw, cleaner) {
  const value = cleaner(raw);
  const original = raw ?? "";
  if (value === null) {
    anomalies.push(`Row ${id}: ${column} '${raw}' is missing or unknown -> null`);
  } else if (String(value) !== original) {
    anomalies.push(`Row ${id}: ${column} '${raw}' -> ${value}`);
  }
  return value;
}

const CLEANERS = {
  participant_id: toText,
  first_name: toText,
  program: toText,
  neighborhood: toText,
  start_date: toISODate,
  sessions_attended: toNumber,
  completed: toBoolean,
};

function cleanRows(lines) {
  const headers = fixHeaders(lines[0].split(","));
  const records = [];

  lines.slice(1).forEach((line, i) => {
    const lineNumber = i + 2;
    // Skip blank rows: empty lines, or lines that are only commas.
    if (line.replace(/,/g, "").trim() === "") {
      anomalies.push(`Line ${lineNumber}: blank row, skipped`);
      return;
    }

    const cells = line.split(",");
    const raw = {};
    headers.forEach((name, col) => {
      if (name) raw[name] = cells[col];
    });

    const id = toText(raw.participant_id) ?? `line ${lineNumber}`;
    const record = {};
    for (const column of COLUMNS) {
      record[column] = cleanField(id, column, raw[column], CLEANERS[column]);
    }
    records.push(record);
  });

  return records;
}

// ---------------------------------------------------------------------
// STEP 3 + 4: WRITE
// ---------------------------------------------------------------------

// Quote a cell if it contains a comma, quote or newline.
function csvCell(value) {
  if (value === null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCleanCsv(records) {
  const lines = [COLUMNS.join(",")];
  for (const record of records) {
    lines.push(COLUMNS.map((c) => csvCell(record[c])).join(","));
  }
  fs.writeFileSync(CLEAN, lines.join("\n") + "\n", "utf8");
  log("INFO", `Wrote ${records.length} rows to data/clean.csv`);
}

function writeJson(records) {
  const json = JSON.stringify(records, null, 2);
  JSON.parse(json); // validation check: throws if the JSON is somehow invalid
  fs.writeFileSync(JSON_OUT, json + "\n", "utf8");
  log("INFO", `Wrote ${records.length} records to data/export.json`);
}

// ---------------------------------------------------------------------
function main() {
  log("INFO", "Pipeline start");

  const lines = readRaw();
  log("INFO", `Read ${lines.length} lines from data/raw.csv`);

  const records = cleanRows(lines);
  log("INFO", `Rows processed: ${records.length}`);

  log("INFO", `Anomalies found: ${anomalies.length}`);
  anomalies.forEach((a) => log("WARN", a));

  writeCleanCsv(records);
  writeJson(records);
  log("INFO", "Pipeline done");
}

main();
