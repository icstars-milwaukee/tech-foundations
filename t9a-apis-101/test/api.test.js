// VERIFY step: tests for your API client and transform. Run:  npm test
// You don't need to edit this file. It starts its own copy of the mock
// server, so you don't need `npm run mock` running.

const test = require("node:test");
const assert = require("node:assert");
const { createServer, EVENTS } = require("../mock-server/server");
const { fetchJson } = require("../src/client");
const { transformEvents } = require("../src/transform");

const FAST = { baseDelayMs: 5 };
let base;
let server;
let apiKey;

test.before(async () => {
  ({ server, apiKey } = createServer({ apiKey: "test-key", rateLimit: 1000, quiet: true }));
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});

test.after(() => server.close());

test("fetchJson returns parsed JSON", async () => {
  const body = await fetchJson(`${base}/api/health`, FAST);
  assert.deepStrictEqual(body, { status: "ok" });
});

test("error branch: a 404 throws an error that includes the status", async () => {
  await assert.rejects(fetchJson(`${base}/api/nope`, FAST), (err) => {
    assert.match(String(err.message), /404/, "The error message should include 404.");
    return true;
  });
});

test("retry: a flaky endpoint (503, 503, then 200) eventually succeeds", async () => {
  const body = await fetchJson(`${base}/api/events?flaky=1`, { ...FAST, retries: 3 });
  assert.ok(body.data, "Expected the events data after retrying.");
});

test("give up: an endpoint that's always down rejects after retries", async () => {
  await assert.rejects(fetchJson(`${base}/api/always-down`, { ...FAST, retries: 2 }), /503/);
});

test("headers: the API key is sent and accepted", async () => {
  const body = await fetchJson(`${base}/api/secure/attendance`, { ...FAST, headers: { "x-api-key": apiKey } });
  assert.ok(Array.isArray(body.attendance));
});

test("no pointless retries: a wrong key (403) fails fast", async () => {
  const started = Date.now();
  await assert.rejects(
    fetchJson(`${base}/api/secure/attendance`, { headers: { "x-api-key": "wrong" }, retries: 3, baseDelayMs: 200 }),
    /403/
  );
  assert.ok(Date.now() - started < 200, "A 403 should not be retried. A wrong key won't fix itself.");
});

test("transformEvents: flat, sorted, cancelled skipped, missing rsvp handled", () => {
  const out = transformEvents(JSON.parse(JSON.stringify(EVENTS)));
  assert.deepStrictEqual(out, [
    { id: "evt-303", title: "Alumni Panel: First Year in Tech", date: "2026-10-22", time: "17:30", location: "Main Hall, i.c.stars HQ", going: 52, seatsLeft: 28 },
    { id: "evt-302", title: "Resume Lab", date: "2026-10-28", time: "10:00", location: "Room 204, i.c.stars HQ", going: 20, seatsLeft: 0 },
    { id: "evt-305", title: "Team Lunch", date: "2026-10-30", time: "12:00", location: "Room 110, i.c.stars HQ", going: 0, seatsLeft: 25 },
    { id: "evt-301", title: "Sprint 2 Demo Day", date: "2026-11-06", time: "13:00", location: "Main Hall, i.c.stars HQ", going: 41, seatsLeft: 19 },
  ]);
});
