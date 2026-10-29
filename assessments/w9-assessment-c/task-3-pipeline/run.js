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

const anomalies = [];
const COLUMNS = [
  "participant_id",
  "first_name",
  "program",
  "site",
  "start_date",
  "sessions_attended",
  "completed",
];

function log(level, message) {
  console.log(`[${new Date().toISOString()}] [${level}] ${message}`);
}

// Parse one CSV record, including quoted values and escaped quotes.
function parseCsvLine(line) {
  const fields = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      fields.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  if (quoted) {
    throw new Error("Malformed CSV: an unclosed quoted field was found.");
  }

  fields.push(value);
  return fields;
}

function readRaw() {
  const content = fs.readFileSync(RAW, "utf8").replace(/^\uFEFF/, "");
  return content.split(/\r?\n/).filter((line) => line.trim() !== "");
}

function fixHeaders(headers) {
  const fixed = headers.map((header) => header.trim());

  // The fourth header is blank, but its data contains the site.
  if (!fixed[3]) {
    fixed[3] = "site";
    anomalies.push('Header column 4: blank header renamed to "site".');
  }

  // Ignore unnamed trailing columns; they contain no useful data here.
  return fixed.slice(0, COLUMNS.length);
}

function toNumber(value, rowId) {
  const original = value.trim();
  if (!original || /^(null|n\/a)$/i.test(original)) return null;

  const numberWords = { twelve: 12 };
  if (Object.hasOwn(numberWords, original.toLowerCase())) {
    const number = numberWords[original.toLowerCase()];
    anomalies.push(`Row ${rowId}: sessions_attended "${original}" converted to ${number}.`);
    return number;
  }

  if (/^\d+$/.test(original)) {
    const number = Number(original);
    if (Number.isSafeInteger(number)) {
      if (original !== String(number)) {
        anomalies.push(`Row ${rowId}: sessions_attended whitespace/format normalized.`);
      }
      return number;
    }
  }

  anomalies.push(`Row ${rowId}: invalid sessions_attended "${original}" set to null.`);
  return null;
}

function toISODate(value, rowId) {
  const original = value.trim();
  if (!original || /^(null|n\/a)$/i.test(original)) return null;

  let year;
  let month;
  let day;
  let match;

  if ((match = original.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) {
    [, year, month, day] = match;
  } else if ((match = original.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/))) {
    [, month, day, year] = match;
    if (year.length === 2) year = `20${year}`;
  } else if (
    (match = original.match(/^([A-Za-z]{3,9})\s+(\d{1,2})\s+(\d{4})$/))
  ) {
    const months = {
      jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
      jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
    };
    month = months[match[1].slice(0, 3).toLowerCase()];
    day = match[2];
    year = match[3];
  } else if ((match = original.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/))) {
    [, year, month, day] = match;
  }

  if (!year || !month || !day) {
    anomalies.push(`Row ${rowId}: unrecognized start_date "${original}" set to null.`);
    return null;
  }

  year = Number(year);
  month = Number(month);
  day = Number(day);

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    !Number.isFinite(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    anomalies.push(`Row ${rowId}: invalid start_date "${original}" set to null.`);
    return null;
  }

  const normalized = date.toISOString().slice(0, 10);
  if (normalized !== original) {
    anomalies.push(`Row ${rowId}: start_date "${original}" normalized to ${normalized}.`);
  }

  return normalized;
}

function toBoolean(value, rowId) {
  const original = value.trim().toLowerCase();

  if (!original || ["null", "n/a"].includes(original)) return null;

  if (["yes", "y", "true"].includes(original)) {
    if (original !== "true") {
      anomalies.push(`Row ${rowId}: completed "${value.trim()}" normalized to true.`);
    }
    return true;
  }

  if (["no", "n", "false"].includes(original)) {
    if (original !== "false") {
      anomalies.push(`Row ${rowId}: completed "${value.trim()}" normalized to false.`);
    }
    return false;
  }

  anomalies.push(`Row ${rowId}: unknown completed value "${value.trim()}" set to null.`);
  return null;
}

function cleanRows(lines) {
  if (lines.length === 0) throw new Error("The input CSV is empty.");

  const headers = fixHeaders(parseCsvLine(lines[0]));
  const records = [];

  for (const line of lines.slice(1)) {
    const values = parseCsvLine(line);

    if (values.every((value) => !value.trim())) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    const rowId = row.participant_id.trim() || "unknown ID";
    const record = {
      participant_id: row.participant_id.trim() || null,
      first_name: row.first_name.trim() || null,
      program: row.program.trim() || null,
      site: row.site.trim() || null,
      start_date: toISODate(row.start_date, rowId),
      sessions_attended: toNumber(row.sessions_attended, rowId),
      completed: toBoolean(row.completed, rowId),
    };

    for (const field of ["participant_id", "first_name", "program", "site"]) {
      if (record[field] === null) {
        anomalies.push(`Row ${rowId}: missing ${field}; retained as null.`);
      }
    }

    if (record.first_name && record.first_name.includes("\uFFFD")) {
      anomalies.push(
        `Row ${rowId}: first_name contains a replacement character; original value preserved for review.`
      );
    }

    records.push(record);
  }

  return records;
}

function escapeCsv(value) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "boolean" ? String(value) : String(value);

  return /[",\r\n]/.test(text)
    ? `"${text.replace(/"/g, '""')}"`
    : text;
}

function writeCleanCsv(records) {
  const lines = [
    COLUMNS.join(","),
    ...records.map((record) =>
      COLUMNS.map((column) => escapeCsv(record[column])).join(",")
    ),
  ];

  fs.writeFileSync(CLEAN, `${lines.join("\n")}\n`, "utf8");
}

function writeJson(records) {
  fs.writeFileSync(JSON_OUT, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

function main() {
  try {
    log("INFO", "Pipeline start");

    const lines = readRaw();
    log("INFO", `Read ${lines.length} nonblank lines from data/raw.csv`);

    const records = cleanRows(lines);
    log("INFO", `Rows processed: ${records.length}`);
    log("INFO", `Anomalies found: ${anomalies.length}`);

    anomalies.forEach((message) => log("WARN", message));

    writeCleanCsv(records);
    writeJson(records);

    log("INFO", "Wrote data/clean.csv and data/export.json");
    log("INFO", "Pipeline done");
  } catch (error) {
    log("ERROR", `Pipeline failed: ${error.message}`);
    process.exitCode = 1;
  }
}

main();