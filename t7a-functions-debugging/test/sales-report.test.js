// VERIFY step: these tests run your report and check the output.
// You don't need to edit this file. Run it with:  npm test
//
// A failing test is not a grade. It's a clue. Read which line it expected
// and compare it to what your program actually printed.

const test = require("node:test");
const assert = require("node:assert");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const REPORT = path.join(ROOT, "practice", "sales-report.js");

function runReport(dataFile) {
  const args = [REPORT];
  if (dataFile) args.push(path.join(ROOT, dataFile));
  const result = spawnSync(process.execPath, args, { cwd: ROOT, encoding: "utf8" });
  return {
    code: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    all: (result.stdout || "") + (result.stderr || ""),
  };
}

function expectLine(output, label, amount) {
  const pattern = new RegExp(label.replace(/ /g, "\\s+") + ":\\s*\\$" + amount.replace(".", "\\."));
  assert.match(
    output,
    pattern,
    `Expected the report to print "${label}: $${amount}". Look at what it printed above.`
  );
}

test("Week 1 numbers are correct", () => {
  const { stdout } = runReport();
  expectLine(stdout, "Week 1 total", "201.75");
  expectLine(stdout, "Week 1 average", "40.35");
  expectLine(stdout, "Week 1 best day", "63.25");
});

test("Week 2 numbers are correct", () => {
  const { stdout } = runReport();
  expectLine(stdout, "Week 2 total", "291.50");
  expectLine(stdout, "Week 2 average", "48.58");
  expectLine(stdout, "Week 2 best day", "70.00");
});

test("Two-week total is correct", () => {
  const { stdout } = runReport();
  expectLine(stdout, "Two-week total", "493.25");
});

test("Broken data file: logs an [ERROR] instead of crashing", () => {
  const { code, all } = runReport("data/sales-broken.json");
  assert.match(all, /\[ERROR\]/, "Expected an [ERROR] log line from src/logger.js.");
  assert.doesNotMatch(all, /\n\s+at\s/, "The program still printed a raw stack trace. Catch the error.");
  assert.notStrictEqual(code, 0, "When the data is bad, the program should exit with a non-zero code (process.exitCode = 1).");
});

test("Missing data file: logs an [ERROR] instead of crashing", () => {
  const { code, all } = runReport("data/does-not-exist.json");
  assert.match(all, /\[ERROR\]/, "Expected an [ERROR] log line from src/logger.js.");
  assert.doesNotMatch(all, /\n\s+at\s/, "The program still printed a raw stack trace. Catch the error.");
  assert.notStrictEqual(code, 0, "When the file is missing, the program should exit with a non-zero code (process.exitCode = 1).");
});
