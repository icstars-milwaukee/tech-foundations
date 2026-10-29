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
function readRaw() {
  const text = fs.readFileSync("data/raw.csv", "utf8");
  return text.split(/\r?\n/);
}
function fixHeaders(headers) {
  return headers.map((h, i) => {
    const name = h.trim();
    return name === "" ? `column_${i + 1}` : name;
  });
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
const WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20,
};

function toNumber(value) {
  const text = String(value ?? "").trim();
  if (text === "" || text.toUpperCase() === "NULL") return null;
  if (!isNaN(Number(text))) return Number(text);
  const fromWord = WORDS[text.toLowerCase()];
  return fromWord !== undefined ? fromWord : null;
}
// TODO 4: Turn a start_date into one format: YYYY-MM-DD, or null if unknown.
//   Examples in the data: "2026-09-08", "09/15/2026", "Sep 22 2026", "9/29/26"
function toISODate(value) {
  return value;
}
const MONTHS = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
function toISODate(value) {
  const text = String(value ?? "").trim();
  if (text === "") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  let match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) match = text.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (match) {
    const [, first, second, third] = match;
    const year = first.length === 4 ? first : third;
    const month = first.length === 4 ? second : first;
    const day = first.length === 4 ? third : second;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const named = text.match(/^([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})$/);
  if (named) {
    const month = MONTHS[named[1].toLowerCase()];
    if (month) {
      return `${named[3]}-${String(month).padStart(2, "0")}-${named[2].padStart(2, "0")}`;
    }
  }

  return null;
}
// TODO 5: Turn completed into true / false, or null if unknown.
//   Examples in the data: "yes", "Y", "TRUE", "no", "N/A", ""
function toBoolean(value) {
  return value;
}
function toBoolean(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(text)) return true;
  if (["no", "n", "false", "0"].includes(text)) return false;
  return null; // "N/A", "", or anything unknown
}
// TODO 6: Build one clean object per row.
//   - Skip blank rows (empty lines, or lines that are only commas).
//   - Use the functions above for each column.
//   - Blank text (like a missing name) should become null, not "".
//   - Push a message to `anomalies` for every value you had to fix or flag.
function cleanRows(lines) {
  return [];
}
// Helper: log a message if cleaning changed the value
function flag(id, field, rawValue, result) {
  if (rawValue !== String(result)) {
    anomalies.push(`Row ${id}: ${field} '${rawValue}' -> ${result}`);
  }
}

function cleanRows(lines) {
  const allHeaders = fixHeaders(lines[0].split(","));

  // 1. Collect non-blank rows
  const rows = [];
  lines.slice(1).forEach((line, i) => {
    if (line.replace(/,/g, "").trim() === "") {
      if (line.trim() !== "") {
        anomalies.push(`Line ${i + 2}: row had only commas, skipped`);
      }
      return; // skip blank rows
    }
    rows.push(line.split(","));
  });

  // 2. Find columns that have no data at all
  const keepCol = allHeaders.map((_, c) =>
    rows.some((r) => (r[c] ?? "").trim() !== "")
  );
  allHeaders.forEach((h, c) => {
    if (!keepCol[c]) anomalies.push(`Column '${h}' has no data -> dropped`);
  });

  // 3. Build one clean object per row
  return rows.map((cells) => {
    const raw = {};
    allHeaders.forEach((h, c) => {
      if (keepCol[c]) raw[h] = (cells[c] ?? "").trim();
    });

    const id = raw.participant_id || "(no id)";

    const record = {
      participant_id: raw.participant_id || null,
      first_name: raw.first_name || null,
      start_date: toISODate(raw.start_date),
      sessions_attended: toNumber(raw.sessions_attended),
      completed: toBoolean(raw.completed),
    };

    if (!raw.first_name) anomalies.push(`Row ${id}: first_name missing -> null`);
    flag(id, "start_date", raw.start_date, record.start_date);
    flag(id, "sessions", raw.sessions_attended, record.sessions_attended);
    flag(id, "completed", raw.completed, record.completed);

    return record;
  });
}
// ---------------------------------------------------------------------
// STEP 3 + 4: WRITE
// ---------------------------------------------------------------------

// TODO 7: Write the records to data/clean.csv (a header row, then one line per record).
//   Write null as an empty cell.
function writeCleanCsv(records) {}
function writeCleanCsv(records) {
  if (records.length === 0) return;
  const headers = Object.keys(records[0]);
  const lines = [headers.join(",")];
  records.forEach((r) => {
    lines.push(headers.map((h) => (r[h] === null ? "" : r[h])).join(","));
  });
  fs.writeFileSync("data/clean.csv", lines.join("\n") + "\n");
}
// TODO 8: Write the records to data/export.json.
//   Hint: JSON.stringify(records, null, 2) makes it readable.
function writeJson(records) {}
function writeJson(records) {
  fs.writeFileSync("data/export.json", JSON.stringify(records, null, 2));
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
