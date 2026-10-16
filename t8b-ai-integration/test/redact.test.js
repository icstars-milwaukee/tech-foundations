// VERIFY step for the input guardrail. Run:  npm test
// You don't need to edit this file.

const test = require("node:test");
const assert = require("node:assert");
const path = require("node:path");
const { redact } = require("../prototype/redact");
const { findPersonalData } = require("../src/pii-detector");

test("emails become [EMAIL]", () => {
  assert.strictEqual(redact("Email me at dana.k.mke@cohorthub.test please"), "Email me at [EMAIL] please");
});

test("phone numbers become [PHONE] (three common formats)", () => {
  assert.strictEqual(redact("txt me 414-555-0199"), "txt me [PHONE]");
  assert.strictEqual(redact("Call (414) 555-0142 today"), "Call [PHONE] today");
  assert.strictEqual(redact("or 414.555.0199"), "or [PHONE]");
});

test("8-digit student IDs become [STUDENT_ID]", () => {
  assert.strictEqual(redact("My student ID is 20261187."), "My student ID is [STUDENT_ID].");
});

test("doesn't over-redact numbers the AI needs", () => {
  const text = "Demo is in 2 hours, room 204, need Node 18, battery at 10%, 3 wrong passwords";
  assert.strictEqual(redact(text), text);
});

test("every real ticket is clean after redact()", () => {
  const { tickets } = require(path.join(__dirname, "..", "data", "support-tickets.json"));
  for (const t of tickets) {
    const leaks = findPersonalData(redact(t.description));
    assert.deepStrictEqual(leaks, [], `${t.id} still contains personal data after redact()`);
  }
});
