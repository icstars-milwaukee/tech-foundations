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

// Every problem found goes in here, e.g. "P002: sessions_attended "twelve" -> 12"
const anomalies = [];
const flag = (message) => anomalies.push(message);

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const TRUE_WORDS = ["yes", "y", "true"];
const FALSE_WORDS = ["no", "n", "false"];
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20,
};

// Splits one CSV line into cells. Handles "quoted, cells" in case a value has a comma.
function splitCsvLine(line) {
  const cells = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { cells.push(cell); cell = ""; }
    else cell += c;
  }
  cells.push(cell);
  return cells;
}

// ---------------------------------------------------------------------
// STEP 1: READ
// ---------------------------------------------------------------------
function readRaw() {
  // Reading as "latin1" keeps every byte as-is, so each line can be decoded on its own.
  // (The file mixes encodings: P003 "Jos\xE9" is Latin-1, P005 "Zo\xC3\xAB" is UTF-8.)
  const text = fs.readFileSync(RAW).toString("latin1").replace(/^\xEF\xBB\xBF/, "");
  const lines = text.split(/\r?\n/); // Windows files end lines with "\r\n"
  if (lines[lines.length - 1] === "") lines.pop(); // file ends with a newline

  return lines.map((line) => {
    try {
      // Strict UTF-8 first: correct for ASCII and for "Zoë" stored as UTF-8.
      return new TextDecoder("utf-8", { fatal: true }).decode(Buffer.from(line, "latin1"));
    } catch {
      // Not valid UTF-8, so these are single-byte Latin-1 characters (like "José").
      flag(`${line.split(",")[0]}: invalid UTF-8 bytes, decoded as Latin-1`);
      return line; // already one character per byte, which is what Latin-1 means
    }
  });
}

// ---------------------------------------------------------------------
// STEP 2: CLEAN
// ---------------------------------------------------------------------

// Names every column. A blank header with no data in its column is dropped (null).
// A blank header WITH data gets a name from BLANK_HEADER_NAMES, else "column_N".
const BLANK_HEADER_NAMES = { 3: "site" }; // column 4 holds place names like "Washington Park"
function fixHeaders(headers, rows) {
  return headers.map((header, i) => {
    const name = header.trim().toLowerCase();
    if (name) return name;
    const hasData = rows.some((row) => (row[i] || "").trim() !== "");
    if (!hasData) {
      flag(`Column ${i + 1} has no header and no data -> dropped`);
      return null;
    }
    const guess = BLANK_HEADER_NAMES[i] || `column_${i + 1}`;
    flag(`Column ${i + 1} has no header -> named "${guess}"`);
    return guess;
  });
}

// "12" -> 12, " 7 " -> 7, "twelve" -> 12, "", "NULL", "N/A" -> null
function toNumber(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  if (text in NUMBER_WORDS) return NUMBER_WORDS[text];
  return null;
}

// "2026-09-08", "2026/10/06", "09/15/2026", "9/29/26", "Sep 22 2026" -> "YYYY-MM-DD"; else null
function toISODate(value) {
  const text = String(value ?? "").trim();
  let year, month, day, m;
  if ((m = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/))) {
    [year, month, day] = [m[1], m[2], m[3]];
  } else if ((m = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/))) {
    // Month first (US style). The file proves it: 09/15/2026 and 10/13/2026 can't be day-first.
    [month, day, year] = [m[1], m[2], m[3].length === 2 ? "20" + m[3] : m[3]];
  } else if ((m = text.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/)) && MONTHS[m[1].toLowerCase()]) {
    [month, day, year] = [MONTHS[m[1].toLowerCase()], m[2], m[3]];
  } else {
    return null;
  }
  [year, month, day] = [Number(year), Number(month), Number(day)];
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  if (!isRealDate) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// "yes"/"Y"/"TRUE" -> true, "no"/"N"/"false" -> false, anything else ("N/A", "") -> null
function toBoolean(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (TRUE_WORDS.includes(text)) return true;
  if (FALSE_WORDS.includes(text)) return false;
  return null;
}

// A blank row is an empty line, or a line that is only commas (",,,,,,,").
const isBlankLine = (line) => line.replace(/,/g, "").trim() === "";

// Turns the cells of ONE raw row into ONE clean record, logging every fix or gap.
function cleanRow(cells, headers) {
  const raw = {};
  headers.forEach((header, i) => {
    if (header) raw[header] = cells[i] ?? "";
  });
  const id = raw.participant_id.trim();

  // Text columns: trim, and turn a blank into null.
  const text = (field) => {
    const value = raw[field].trim();
    if (value === "") flag(`${id}: ${field} is blank -> null`);
    return value === "" ? null : value;
  };

  // Typed columns: run the converter, and flag nulls (and changes, if reportChanges).
  const typed = (field, convert, reportChanges) => {
    const result = convert(raw[field]);
    const original = raw[field].trim();
    if (result === null) flag(`${id}: ${field} ${original === "" ? "is blank" : `"${original}" is not usable`} -> null`);
    else if (reportChanges && String(result) !== raw[field]) flag(`${id}: ${field} "${raw[field]}" -> ${result}`);
    return result;
  };

  return {
    participant_id: id,
    first_name: text("first_name"),
    program: text("program"),
    site: text("site"),
    start_date: typed("start_date", toISODate, true),
    sessions_attended: typed("sessions_attended", toNumber, true),
    completed: typed("completed", toBoolean, false), // yes/Y/TRUE are normal, so only nulls are flagged
  };
}

function cleanRows(lines) {
  const [headerLine, ...bodyLines] = lines;

  const rows = bodyLines.filter((line) => !isBlankLine(line)).map(splitCsvLine);
  log("INFO", `Skipped ${bodyLines.length - rows.length} blank row(s)`);

  const headers = fixHeaders(splitCsvLine(headerLine), rows);
  return rows.map((cells) => cleanRow(cells, headers));
}

// ---------------------------------------------------------------------
// STEP 3 + 4: WRITE
// ---------------------------------------------------------------------
const COLUMNS = ["participant_id", "first_name", "program", "site", "start_date", "sessions_attended", "completed"];

function csvCell(value) {
  if (value === null || value === undefined) return ""; // null -> empty cell
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCleanCsv(records) {
  const rows = records.map((record) => COLUMNS.map((column) => csvCell(record[column])).join(","));
  fs.writeFileSync(CLEAN, [COLUMNS.join(","), ...rows].join("\n") + "\n");
}

function writeJson(records) {
  fs.writeFileSync(JSON_OUT, JSON.stringify(records, null, 2) + "\n");
  JSON.parse(fs.readFileSync(JSON_OUT, "utf8")); // throws if the file is not valid JSON
  log("INFO", "export.json is valid JSON");
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

try {
  main();
} catch (err) {
  log("ERROR", `Pipeline failed: ${err.message}`);
  process.exitCode = 1;
}
