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

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

function isBlankRow(line) {
  return line.replace(/,/g, "").trim() === "";
}

function normalizeText(value) {
  return (value === null || value === undefined) ? "" : String(value).trim();
}

function formatCsvCell(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

// ---------------------------------------------------------------------
// STEP 1: READ
// ---------------------------------------------------------------------
function readRaw() {
  const content = fs.readFileSync(RAW, "utf8");
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\uFEFF/g, ""));
}

// ---------------------------------------------------------------------
// STEP 2: CLEAN
// ---------------------------------------------------------------------
function fixHeaders(headers) {
  return headers.map((header, index) => {
    const normalized = normalizeText(header).replace(/\s+/g, "_").toLowerCase();
    if (!normalized) {
      return `column_${index + 1}`;
    }
    return normalized;
  });
}

function toNumber(value) {
  const text = normalizeText(value);

  if (!text || ["null", "n/a", "na", "unknown", "none"].includes(text.toLowerCase())) {
    return null;
  }

  const cleaned = text.replace(/,/g, "").trim();
  const match = cleaned.match(/^[-+]?\d+(?:\.\d+)?$/);
  if (!match) {
    const words = {
      zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
      ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
      seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
    };

    if (words[cleaned.toLowerCase()] !== undefined) {
      return words[cleaned.toLowerCase()];
    }

    return null;
  }

  const number = Number(cleaned);
  if (!Number.isFinite(number)) {
    return null;
  }

  return (number >= 0 && number <= 110) ? number : null;
}

function toISODate(value) {
  const text = normalizeText(value);
  if (!text || ["null", "n/a", "na", "unknown"].includes(text.toLowerCase())) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const monthNames = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const slashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const [, month, day, yearRaw] = slashMatch;
    const year = yearRaw.length === 2 ? 2000 + Number(yearRaw) : Number(yearRaw);
    const date = new Date(year, Number(month) - 1, Number(day));
    if (!Number.isNaN(date.getTime())) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
  }

  const monthDayYearMatch = text.match(/^([A-Za-z]{3,9})\s+(\d{1,2})\s*,?\s*(\d{4})$/i);
  if (monthDayYearMatch) {
    const [, monthText, dayText, yearText] = monthDayYearMatch;
    const month = monthNames[monthText.slice(0, 1).toUpperCase() + monthText.slice(1).toLowerCase()] ?? 0;
    const date = new Date(Number(yearText), month, Number(dayText));
    if (!Number.isNaN(date.getTime())) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return null;
}

function toBoolean(value) {
  const text = normalizeText(value);

  if (!text || ["null", "n/a", "na", "unknown"].includes(text.toLowerCase())) {
    return null;
  }

  const lower = text.toLowerCase();
  if (["yes", "y", "true", "1"].includes(lower)) {
    return true;
  }
  if (["no", "n", "false", "0"].includes(lower)) {
    return false;
  }

  return null;
}

function toTitleCase(value) {
  const text = normalizeText(value);
  if (!text) {
    return null;
  }

  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeValue(fieldName, value) {
  const text = normalizeText(value);
  if (!text || ["null", "n/a", "na", "unknown", "none"].includes(text.toLowerCase())) {
    return null;
  }

  const lowerField = fieldName.toLowerCase();

  if (lowerField.includes("age") || lowerField.includes("attended") || lowerField.includes("sessions") || lowerField.includes("count")) {
    return toNumber(text);
  }

  if (lowerField.includes("date") || lowerField.includes("signup") || lowerField.includes("start")) {
    return toISODate(text);
  }

  if (lowerField.includes("completed") || lowerField.includes("done") || lowerField.includes("status") || lowerField.includes("active")) {
    return toBoolean(text);
  }

  if (lowerField.includes("program")) {
    return toTitleCase(text);
  }

  if (lowerField.includes("name")) {
    return toTitleCase(text);
  }

  if (lowerField.includes("email")) {
    return text.toLowerCase();
  }

  return text;
}

function recordChanged(field, originalValue, cleanedValue) {
  const originalText = normalizeText(originalValue);

  if (!originalText) {
    return false;
  }

  if (cleanedValue === null) {
    return true;
  }

  return originalText !== String(cleanedValue);
}

function cleanRows(lines) {
  if (!lines.length) {
    return [];
  }

  const workingLines = lines.filter((line) => !isBlankRow(line));
  if (!workingLines.length) {
    return [];
  }

  const firstCells = parseCsvLine(workingLines[0]);
  const firstHeaderGuess = firstCells.map((cell) => normalizeText(cell).toLowerCase());
  const defaultHeaders = ["id", "name", "signup_date", "age", "program_name", "email"];
  const headerIsPresent = firstHeaderGuess.some((value) =>
    ["id", "name", "signup_date", "age", "program_name", "email", "sessions_attended", "start_date", "completed"].includes(value),
  );

  const headers = headerIsPresent ? fixHeaders(firstCells) : defaultHeaders;
  const startIndex = headerIsPresent ? 1 : 0;
  const seenRows = new Set();
  const records = [];

  for (let index = startIndex; index < workingLines.length; index += 1) {
    const rawLine = workingLines[index];
    const cells = parseCsvLine(rawLine);
    const paddedCells = [...cells];

    while (paddedCells.length < headers.length) {
      paddedCells.push("");
    }

    const record = {};
    let hasContent = false;

    headers.forEach((header, headerIndex) => {
      const originalValue = paddedCells[headerIndex] ?? "";
      const normalizedValue = normalizeValue(header, originalValue);

      if (recordChanged(header, originalValue, normalizedValue)) {
        anomalies.push(`Row ${index + 1}: ${header} '${originalValue}' -> ${normalizedValue === null ? "null" : normalizedValue}`);
      }

      if (originalValue && originalValue.trim() !== "") {
        hasContent = true;
      }

      record[header] = normalizedValue === null ? null : normalizedValue;
    });

    if (!hasContent) {
      continue;
    }

    const signature = JSON.stringify(record);
    if (seenRows.has(signature)) {
      anomalies.push(`Row ${index + 1}: duplicate record removed`);
      continue;
    }

    seenRows.add(signature);
    records.push(record);
  }

  return records;
}

// ---------------------------------------------------------------------
// STEP 3 + 4: WRITE
// ---------------------------------------------------------------------
function writeCleanCsv(records) {
  const headers = records.length > 0 ? Object.keys(records[0]) : [];
  const content = [
    headers.join(","),
    ...records.map((record) => headers.map((header) => formatCsvCell(record[header])).join(",")),
  ].join("\n");

  fs.writeFileSync(CLEAN, `${content}${content ? "\n" : ""}`, "utf8");
}

function writeJson(records) {
  fs.writeFileSync(JSON_OUT, `${JSON.stringify(records, null, 2)}\n`, "utf8");
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
