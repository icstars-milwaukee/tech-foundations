// =====================================================================
// T9A: A reliable API client. YOUR MAIN CODE TODAY.
// =====================================================================
//
// fetchJson(url, options) calls an API and returns the parsed JSON.
// Right now it's naive: it trusts every response and never retries.
//
//   TODO 1  ERROR BRANCH. If the response is not ok (res.ok is false),
//           throw an Error whose message includes the status code,
//           e.g.  "GET http://... failed with 404".
//           Attach the status:  err.status = res.status
//
//   TODO 2  RETRY WITH BACKOFF. Some failures are temporary:
//             429 (rate limited), 500, 502, 503, 504, and network errors.
//           Retry those up to `retries` times. Wait longer each time:
//             baseDelayMs, then x2, then x4 ...  (500ms, 1000ms, 2000ms)
//           If a 429 response has a Retry-After header (seconds), wait
//           that long instead.
//           Do NOT retry other 4xx errors (401, 403, 404). Retrying
//           won't fix a wrong key or a wrong URL.
//
//   TODO 3  LOG IT. Use the Week 7 logging standard (src/logger.js):
//             log.warn  on each failed attempt, with the wait time
//             log.error when you finally give up
//           Example:
//             [WARN] GET /api/events?flaky=1 -> 503. Retrying in 500ms (attempt 1 of 3)
//
// Check your work:  npm test
// =====================================================================

const log = require("./logger");

const RETRYABLE = [429, 500, 502, 503, 504];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, options = {}) {
  const { headers = {}, retries = 3, baseDelayMs = 500 } = options;

  const res = await fetch(url, { headers });
  return res.json();
}

module.exports = { fetchJson, sleep, RETRYABLE };
