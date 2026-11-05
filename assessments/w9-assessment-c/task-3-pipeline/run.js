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

// Logging standard (from T7A):  [timestamp] [LEVEL] message
function log(level, message) {
  console.log(`[${new Date().toISOString()}] [${level}] ${message}`);
}

// Every problem you find goes in here, e.g. "Row P002: sessions 'twelve' -> 12"
const anomalies = [];

// ---------------------------------------------------------------------
// STEP 1: READ
// ---------------------------------------------------------------------
function readRaw() {
  // TODO 1: Read data/raw.csv and split it into lines.
  //   - Open the file in VS Code first. What do you notice? Look at row P003.
  //   - Windows files end lines with "\r\n", not just "\n".
  return [];
}

// ---------------------------------------------------------------------
// STEP 2: CLEAN
// ---------------------------------------------------------------------

// TODO 2: Some header cells are blank. Give every column a clear name,
//   and decide what to do with a column that has no data at all.
function fixHeaders(headers) {
  return headers;
}

// TODO 3: Turn a sessions_attended value into a number, or null if unknown.
//   Examples in the data: "12", "twelve", "", " 7 ", "NULL"
function toNumber(value) {
  return value;
}

// TODO 4: Turn a start_date into one format: YYYY-MM-DD, or null if unknown.
//   Examples in the data: "2026-09-08", "09/15/2026", "Sep 22 2026", "9/29/26"
function toISODate(value) {
  return value;
}

// TODO 5: Turn completed into true / false, or null if unknown.
//   Examples in the data: "yes", "Y", "TRUE", "no", "N/A", ""
function toBoolean(value) {
  return value;
}

// TODO 6: Build one clean object per row.
//   - Skip blank rows (empty lines, or lines that are only commas).
//   - Use the functions above for each column.
//   - Blank text (like a missing name) should become null, not "".
//   - Push a message to `anomalies` for every value you had to fix or flag.
function cleanRows(lines) {
  return [];
}

// ---------------------------------------------------------------------
// STEP 3 + 4: WRITE
// ---------------------------------------------------------------------

// TODO 7: Write the records to data/clean.csv (a header row, then one line per record).
//   Write null as an empty cell.
function writeCleanCsv(records) {}

// TODO 8: Write the records to data/export.json.
//   Hint: JSON.stringify(records, null, 2) makes it readable.
function writeJson(records) {}

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
