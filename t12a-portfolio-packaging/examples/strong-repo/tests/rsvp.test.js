const test = require("node:test");
const assert = require("node:assert");
const { countByEvent } = require("../src/rsvp");

test("counts answers per event, ignoring case and spaces", () => {
  const out = countByEvent([
    { event: "Demo Day", answer: "Yes" },
    { event: "Demo Day", answer: "yes " },
    { event: "Demo Day", answer: "no" },
  ]);
  assert.deepStrictEqual(out, { "Demo Day": { yes: 2, no: 1, maybe: 0 } });
});
