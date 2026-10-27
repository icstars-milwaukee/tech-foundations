// =====================================================================
// T9C: Cleaning functions. YOUR MAIN CODE TODAY.
// =====================================================================
//
// The raw survey export (data/raw/pulse-survey.csv) is messy, like most
// real data. Each function below fixes one kind of mess. The pipeline
// (pipeline/run.js) calls them in order.
//
// Work through the TODOs. After each one, run `npm test`.
// Log every fix in CLEANING_LOG.md: WHAT you found, WHY it matters, HOW you fixed it.
// =====================================================================

// ---------------------------------------------------------------------
// TODO 1: fixHeaders(headers)  [missing + messy headers]
//   Turn every header into snake_case:
//     " Full Name "        -> "full_name"
//     "Confidence (1-5)"   -> "confidence_1_5"
//     "Laptop OK?"         -> "laptop_ok"
//   Steps: trim, lowercase, replace anything that isn't a-z or 0-9 with "_",
//   squash repeated "_" into one, remove "_" from the start and end.
//
//   One header is BLANK. Open the CSV in a spreadsheet and look at that
//   column's values. It's the team name. Name it "team".
// ---------------------------------------------------------------------
function fixHeaders(headers) {
  return headers.map((header) => {
    const normalized = String(header || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (normalized === "") return "team";
    return normalized === "team_name" ? "team" : normalized;
  });
}

// ---------------------------------------------------------------------
// TODO 2: fixEncoding(text)  [encoding issues]
//   "JosÃ© Ramos" should be "José Ramos". "ZoÃ« Hart" should be "Zoë Hart".
//   This happens when UTF-8 text gets read as a different encoding
//   (Latin-1) somewhere along the way. It's called "mojibake".
//
//   The fix is to reverse the mistake: turn the text back into bytes the way it
//   was misread (latin1), then read those bytes correctly (utf8):
//       Buffer.from(text, "latin1").toString("utf8")
//
//   BUT only do that when the text contains "Ã" or "Â". Running it on text
//   that was already fine would break it.
// ---------------------------------------------------------------------
function fixEncoding(text) {
  if (!/[ÃÂ]/.test(text)) return text;
  return Buffer.from(text, "latin1").toString("utf8");
}

// ---------------------------------------------------------------------
// TODO 3: toNumber(value)  [mixed types]
//   Pull the first number out of the text. If there isn't one, return null.
//     "12" -> 12      "10 hrs" -> 10     "8.5" -> 8.5     "6 " -> 6
//     "3/5" -> 3      "N/A" -> null      "" -> null       "four" -> null
//   Never return NaN. null means "we don't know", which is honest.
//   NaN quietly breaks every average it touches.
// ---------------------------------------------------------------------
function toNumber(value) {
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const number = Number(match[0]);
  return Number.isFinite(number) ? number : null;
}

// ---------------------------------------------------------------------
// TODO 4: toBoolean(value)  [mixed types]
//   yes / y / true  -> true      no / n / false -> false
//   Ignore upper/lower case and extra spaces. Anything else -> null.
// ---------------------------------------------------------------------
function toBoolean(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["yes", "y", "true"].includes(normalized)) return true;
  if (["no", "n", "false"].includes(normalized)) return false;
  return null;
}

// ---------------------------------------------------------------------
// TODO 5: dedupeByName(records)  [duplicates]
//   Some people submitted the survey twice. If full_name appears more than
//   once, keep only the LAST row for that name (their latest answer).
//   Keep the kept rows in the same order they appear in the file.
// ---------------------------------------------------------------------
function dedupeByName(records) {
  const lastIndexByName = new Map();
  records.forEach((record, index) => lastIndexByName.set(record.full_name, index));
  return records.filter((record, index) => lastIndexByName.get(record.full_name) === index);
}

// ---------------------------------------------------------------------
// Provided: you don't need to change these.
// ---------------------------------------------------------------------

// "andre simmons" -> "Andre Simmons", but "DeShawn" stays "DeShawn".
function capitalizeName(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

// "10/14/2026 9:05:12", "2026-10-14 09:15", "Oct 14 2026" -> "2026-10-14"
function toISODate(value) {
  const s = String(value || "").trim();
  const pad = (n) => String(n).padStart(2, "0");
  let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/))) return `${m[3]}-${pad(m[1])}-${pad(m[2])}`;
  if ((m = s.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/)) && MONTHS[m[1].toLowerCase()]) {
    return `${m[3]}-${pad(MONTHS[m[1].toLowerCase()])}-${pad(m[2])}`;
  }
  return null;
}

// Turns one raw record (with fixed headers) into one clean record.
function cleanRecord(raw) {
  const text = (v) => {
    const s = fixEncoding(String(v || "")).trim();
    return s === "" ? null : s;
  };
  return {
    submitted_on: toISODate(raw.timestamp),
    full_name: capitalizeName(fixEncoding(String(raw.full_name || ""))),
    team: text(raw.team),
    hours_coding_this_week: toNumber(raw.hours_coding_this_week),
    confidence_1_5: toNumber(raw.confidence_1_5),
    laptop_ok: toBoolean(raw.laptop_ok),
    comments: text(raw.comments),
  };
}

module.exports = {
  fixHeaders,
  fixEncoding,
  toNumber,
  toBoolean,
  dedupeByName,
  capitalizeName,
  toISODate,
  cleanRecord,
};
