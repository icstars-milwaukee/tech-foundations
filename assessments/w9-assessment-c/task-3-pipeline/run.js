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
// Every fix is written down in notes/data_cleaning_log.md.
// =====================================================================

const fs = require("fs");
const path = require("path");

const RAW = path.join(__dirname, "data", "raw.csv");
const CLEAN = path.join(__dirname, "data", "clean.csv");
const JSON_OUT = path.join(__dirname, "data", "export.json");

// Logging standard (from T7A):  [timestamp] [LEVEL] message
function log(level, message) {
  console.log(`[${new Date().toISOString()}] [${level}] ${message}`);
}

// Every problem found goes in here, e.g. "Row P002: sessions_attended "twelve" -> 12"
const anomalies = [];

// Ways the export says "no value". Compared in lower case.
const MISSING = new Set(["", "null", "n/a", "na", "none", "-"]);

function isMissing(value) {
  return MISSING.has(value.trim().toLowerCase());
}

// ---------------------------------------------------------------------
// STEP 1: READ
// ---------------------------------------------------------------------

// Most lines are UTF-8, but some were saved as Latin-1 (P003's "José" is the
// single byte E9). A strict UTF-8 decoder throws on those bytes, so we know
// to read that line as Latin-1 instead.
function decodeLine(bytes, lineNo) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    anomalies.push(`Line ${lineNo}: not valid UTF-8, read as Latin-1`);
    return bytes.toString("latin1");
  }
}

function readRaw() {
  const bytes = fs.readFileSync(RAW);
  const lines = [];
  let start = 0;
  for (let i = 0; i <= bytes.length; i++) {
    if (i < bytes.length && bytes[i] !== 0x0a) continue; // 0x0a = "\n"
    if (i === bytes.length && start === i) break; // file ends with a newline
    const line = decodeLine(bytes.subarray(start, i), lines.length + 1);
    lines.push(line.replace(/\r$/, "")); // Windows line ends are "\r\n"
    start = i + 1;
  }
  return lines;
}

// ---------------------------------------------------------------------
// STEP 2: CLEAN
// ---------------------------------------------------------------------

// Column 4 has no header, but it holds the park or street each program meets at.
const BLANK_HEADER_NAMES = { 3: "location" };

// Give every column a clear name. A column with no data at all becomes null,
// which means "drop it".
function fixHeaders(headers, rows) {
  return headers.map((header, i) => {
    const name = header.trim();
    const hasData = rows.some((cells) => (cells[i] || "").trim() !== "");
    if (!hasData) {
      anomalies.push(`Column ${i + 1} ("${name}") has no data: dropped`);
      return null;
    }
    if (name) return name;
    const fixed = BLANK_HEADER_NAMES[i] || `column_${i + 1}`;
    anomalies.push(`Column ${i + 1}: blank header named "${fixed}"`);
    return fixed;
  });
}

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20,
};

// "12" -> 12, "twelve" -> 12, " 7 " -> 7, "" or "NULL" -> null
function toNumber(value) {
  const v = value.trim().toLowerCase();
  if (isMissing(v)) return null;
  if (/^\d+$/.test(v)) return Number(v);
  return v in NUMBER_WORDS ? NUMBER_WORDS[v] : null;
}

const MONTHS = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

// One format: YYYY-MM-DD. Slash dates are read US style (month first).
//   "2026-09-08", "2026/10/06", "09/15/2026", "9/29/26", "Sep 22 2026"
function toISODate(value) {
  const v = value.trim();
  if (isMissing(v)) return null;

  let y, m, d, match;
  if ((match = v.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/))) {
    [, y, m, d] = match;
  } else if ((match = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}|\d{2})$/))) {
    [, m, d, y] = match;
    if (y.length === 2) y = `20${y}`; // "26" -> 2026
  } else if ((match = v.match(/^([A-Za-z]{3})[a-z]*\.? (\d{1,2}),? (\d{4})$/))) {
    [, m, d, y] = match;
    m = MONTHS[m.toLowerCase()];
  } else {
    return null;
  }

  // Build the date, then check it didn't roll over (Feb 30 becomes Mar 2).
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (date.getUTCMonth() !== Number(m) - 1 || date.getUTCDate() !== Number(d)) return null;
  return date.toISOString().slice(0, 10);
}

// "yes", "Y", "TRUE" -> true; "no", "N", "FALSE" -> false; "N/A", "" -> null
function toBoolean(value) {
  const v = value.trim().toLowerCase();
  if (["yes", "y", "true"].includes(v)) return true;
  if (["no", "n", "false"].includes(v)) return false;
  return null;
}

// Text: trimmed, and a blank becomes null.
function toText(value) {
  return isMissing(value) ? null : value.trim();
}

const CONVERTERS = {
  sessions_attended: toNumber,
  start_date: toISODate,
  completed: toBoolean,
};

// Spellings that are already right and aren't worth a warning.
function isUsual(field, raw, value) {
  if (field === "completed") return ["yes", "no"].includes(raw);
  return raw === String(value);
}

// Explain what happened to one cell, if it needed fixing or flagging.
function noteCell(id, field, cell, value) {
  const raw = cell.trim();
  if (value === null && isMissing(raw)) {
    anomalies.push(`Row ${id}: ${field} is missing${raw ? ` ("${raw}")` : ""} -> null`);
  } else if (value === null) {
    anomalies.push(`Row ${id}: ${field} "${raw}" could not be read -> null`);
  } else if (cell !== raw || !isUsual(field, raw, value)) {
    anomalies.push(`Row ${id}: ${field} "${cell}" -> ${JSON.stringify(value)}`);
  }
}

// One clean object per row. Blank rows are skipped.
function cleanRows(lines) {
  const rows = lines.map((line) => line.split(","));
  const headers = fixHeaders(rows[0], rows.slice(1));
  const records = [];

  rows.slice(1).forEach((cells, i) => {
    const lineNo = i + 2;
    if (cells.every((cell) => cell.trim() === "")) {
      anomalies.push(`Line ${lineNo}: blank row skipped`);
      return;
    }
    const id = cells[0].trim() || `line ${lineNo}`;
    const record = {};
    headers.forEach((field, j) => {
      if (field === null) return; // dropped column
      const cell = cells[j] || "";
      const value = (CONVERTERS[field] || toText)(cell);
      noteCell(id, field, cell, value);
      record[field] = value;
    });
    records.push(record);
  });
  return records;
}

// ---------------------------------------------------------------------
// STEP 3 + 4: WRITE
// ---------------------------------------------------------------------

// Quote a cell only if it has a comma, quote, or line break in it.
function csvCell(value) {
  if (value === null) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCleanCsv(records) {
  const headers = Object.keys(records[0]);
  const lines = [headers.join(",")];
  for (const record of records) {
    lines.push(headers.map((h) => csvCell(record[h])).join(","));
  }
  fs.writeFileSync(CLEAN, lines.join("\n") + "\n", "utf8");
  log("INFO", `Wrote ${records.length} rows to data/clean.csv`);
}

function writeJson(records) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(records, null, 2) + "\n", "utf8");
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
