// VERIFY step for the cleaning pipeline. Run:  npm test
// You don't need to edit this file. A failing test is a clue, not a grade.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { parseCSV } = require("../src/csv");
const clean = require("../pipeline/clean");
const { summarizeByTeam } = require("../pipeline/summarize");

const RAW = path.join(__dirname, "..", "data", "raw", "pulse-survey.csv");

function cleanAll() {
  const text = fs.readFileSync(RAW, "utf8").replace(/^﻿/, "");
  const [headers, ...body] = parseCSV(text);
  const fixed = clean.fixHeaders(headers);
  const records = body
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((cells) => {
      const raw = {};
      fixed.forEach((h, i) => (raw[h] = cells[i]));
      return clean.cleanRecord(raw);
    });
  return clean.dedupeByName(records);
}

test("TODO 1: fixHeaders makes snake_case and names the blank column", () => {
  assert.deepStrictEqual(
    clean.fixHeaders(["Timestamp", " Full Name ", "", "Hours Coding This Week", "Confidence (1-5)", "Laptop OK?", "Comments"]),
    ["timestamp", "full_name", "team", "hours_coding_this_week", "confidence_1_5", "laptop_ok", "comments"]
  );
});

test("TODO 2: fixEncoding repairs mojibake and leaves good text alone", () => {
  assert.strictEqual(clean.fixEncoding("JosÃ© Ramos"), "José Ramos");
  assert.strictEqual(clean.fixEncoding("ZoÃ« Hart"), "Zoë Hart");
  assert.strictEqual(clean.fixEncoding("José Ramos"), "José Ramos", "Text that was already fine must not change.");
  assert.strictEqual(clean.fixEncoding("Maya Brooks"), "Maya Brooks");
});

test("TODO 3: toNumber pulls out numbers, and returns null (never NaN) when there isn't one", () => {
  const cases = { "12": 12, "10 hrs": 10, "8.5": 8.5, "6 ": 6, "3/5": 3, "N/A": null, "": null, four: null };
  for (const [input, expected] of Object.entries(cases)) {
    assert.strictEqual(clean.toNumber(input), expected, `toNumber(${JSON.stringify(input)})`);
  }
  assert.strictEqual(clean.toNumber(undefined), null, "toNumber(undefined)");
});

test("TODO 4: toBoolean understands yes/no in many spellings", () => {
  const cases = { Yes: true, yes: true, Y: true, TRUE: true, " yes ": true, No: false, n: false, no: false, FALSE: false, "": null, maybe: null };
  for (const [input, expected] of Object.entries(cases)) {
    assert.strictEqual(clean.toBoolean(input), expected, `toBoolean(${JSON.stringify(input)})`);
  }
});

test("TODO 5: dedupeByName keeps each person's LAST row, in file order", () => {
  const out = clean.dedupeByName([
    { full_name: "A", v: 1 },
    { full_name: "B", v: 1 },
    { full_name: "A", v: 2 },
    { full_name: "C", v: 1 },
  ]);
  assert.deepStrictEqual(out, [
    { full_name: "B", v: 1 },
    { full_name: "A", v: 2 },
    { full_name: "C", v: 1 },
  ]);
});

test("Pipeline: the real file cleans to 10 people with correct values", () => {
  const records = cleanAll();
  assert.strictEqual(records.length, 10, "12 data rows, minus 2 duplicates = 10 people");
  const byName = Object.fromEntries(records.map((r) => [r.full_name, r]));
  assert.ok(byName["José Ramos"], "José Ramos (encoding fixed)");
  assert.ok(byName["Andre Simmons"], "Andre Simmons (capitalized)");
  assert.strictEqual(byName["Maya Brooks"].hours_coding_this_week, 14, "Maya's LATER answer (14) wins");
  assert.strictEqual(byName["Keisha Owens"].hours_coding_this_week, null, "N/A becomes null");
  assert.strictEqual(byName["Andre Simmons"].submitted_on, "2026-10-14");
  assert.strictEqual(byName["Luis Ortega"].comments.includes("async"), true, "multi-line comment kept");
  for (const r of records) {
    for (const [k, v] of Object.entries(r)) {
      assert.ok(!(typeof v === "number" && Number.isNaN(v)), `${r.full_name}.${k} is NaN`);
    }
  }
});

test("TODO 6: summarizeByTeam averages skip nulls and round to 2 places", () => {
  assert.deepStrictEqual(summarizeByTeam(cleanAll()), {
    Atlas: { responses: 3, avgHours: 11.5, avgConfidence: 4.33, laptopIssues: 0 },
    Beacon: { responses: 3, avgHours: 12, avgConfidence: 4, laptopIssues: 1 },
    Comet: { responses: 3, avgHours: 7.25, avgConfidence: 2.67, laptopIssues: 2 },
    unassigned: { responses: 1, avgHours: 7, avgConfidence: 4, laptopIssues: 0 },
  });
});
