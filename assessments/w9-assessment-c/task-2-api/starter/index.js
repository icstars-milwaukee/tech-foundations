// =====================================================================
// W9 Assessment C, Task 2: API Call
// =====================================================================
//
// "Call this API endpoint, parse the JSON response, and extract the field
//  title. Handle one simulated error (e.g., network failure)."
//
//   npm start               normal call
//   npm run try:500         the server answers with a 500 error
//   npm run try:timeout     the server hangs: your code should give up
//   (stop the mock server)  network failure: run npm start again
//
// Settings come from .env (copy .env.example to .env first).
// Node loads it for you with the --env-file flag in package.json.
// =====================================================================

const BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;
const ITEM_ID = process.env.ITEM_ID || "101";
const TIMEOUT_MS = numberSetting("REQUEST_TIMEOUT_MS", 3000);
const MAX_RETRIES = numberSetting("MAX_RETRIES", 2);
const LOG_JSON = process.env.LOG_FORMAT === "json";

// npm run try:500 adds "--fail=500" to the command. This reads it.
const failArg = process.argv.find((arg) => arg.startsWith("--fail="));
const fail = failArg ? failArg.split("=")[1] : null;

// Network errors, rate limits, and 5xx are often temporary, so they get retried.
// A timeout is not: the server is already too slow, and every retry would make
// the user wait another full timeout for nothing.
const RETRYABLE = new Set(["network", "rate_limited", "server"]);

// What the user sees for each kind of failure.
const FRIENDLY = {
  config: "The script isn't set up yet. Copy .env.example to .env and check API_BASE_URL and API_KEY.",
  network: "Could not reach the API. Is the server running, and is API_BASE_URL right?",
  timeout: "The API took too long to answer, so the script gave up. Try again in a minute.",
  auth: "The API didn't accept the key. Check API_KEY in .env.",
  not_found: "The API has no item with that id. Check ITEM_ID in .env.",
  rate_limited: "The API says we've sent too many requests. Wait a minute and try again.",
  server: "The API had a problem on its end. Try again later, or tell your trainer.",
  bad_response: "The API answered, but not with the data the script expected.",
  unknown: "Something unexpected went wrong.",
};

// One error type for every way the call can fail. `kind` picks the friendly
// message and decides whether to retry; `details` goes into the log.
class ApiError extends Error {
  constructor(kind, message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.details = details;
  }
}

const toApiError = (err) => (err instanceof ApiError ? err : new ApiError("unknown", err.message));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Structured log line: time, level, message, plus named fields.
// Set LOG_FORMAT=json in .env to get one JSON object per line instead.
function log(level, message, fields = {}) {
  const time = new Date().toISOString();
  const data = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
  const write = level === "INFO" ? console.log : console.error;
  if (LOG_JSON) return write(JSON.stringify({ time, level, message, ...data }));
  const extra = Object.keys(data).length ? ` ${JSON.stringify(data)}` : "";
  write(`[${time}] [${level}] ${message}${extra}`);
}

function numberSetting(name, fallback) {
  const value = Number(process.env[name]);
  return process.env[name] && Number.isInteger(value) && value >= 0 ? value : fallback;
}

function checkConfig() {
  const missing = ["API_BASE_URL", "API_KEY"].filter((name) => !process.env[name]);
  if (missing.length) throw new ApiError("config", `Missing in .env: ${missing.join(", ")}`);
  // "localhost:3001" parses as a URL with the scheme "localhost:", so check for http(s) too.
  if (!/^https?:\/\//i.test(BASE_URL) || !URL.canParse(BASE_URL)) {
    throw new ApiError("config", `API_BASE_URL must be a full URL starting with http:// or https:// (got "${BASE_URL}")`);
  }
}

function kindForStatus(status) {
  if (status === 401 || status === 403) return "auth";
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return "unknown";
}

// One GET request. Returns the parsed JSON body, or throws an ApiError.
async function requestJson(url, headers, timeoutMs) {
  let response, text;
  try {
    // A fresh connection for every try: a retry shouldn't reuse the socket that just
    // failed, and reusing an idle one stalled each retry by ~2.5s on Node 26 / Windows.
    const options = { headers: { ...headers, connection: "close" }, signal: AbortSignal.timeout(timeoutMs) };
    response = await fetch(url, options);
    text = await response.text();
  } catch (err) {
    if (err.name === "TimeoutError") throw new ApiError("timeout", `No answer after ${timeoutMs}ms`, { timeout_ms: timeoutMs });
    const code = err.cause?.code ?? err.cause?.errors?.[0]?.code; // e.g. ECONNREFUSED
    throw new ApiError("network", code ? `${err.message} (${code})` : err.message);
  }

  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    // Only a problem when the call worked; an error page might not be JSON.
    if (response.ok) throw new ApiError("bad_response", "Response body is not valid JSON", { status: response.status });
  }

  if (!response.ok) {
    const retryAfter = Number(response.headers.get("retry-after"));
    throw new ApiError(kindForStatus(response.status), body?.message ?? response.statusText, {
      status: response.status,
      retry_after_ms: retryAfter > 0 ? Math.min(retryAfter * 1000, 10_000) : undefined,
    });
  }
  return body;
}

// Reusable: GET any JSON endpoint with a timeout and retries.
// Waits 0.5s, then 1s, then 2s... between tries, or what Retry-After asks for.
async function fetchJson(url, { headers = {}, timeoutMs = TIMEOUT_MS, retries = MAX_RETRIES } = {}) {
  for (let attempt = 1; ; attempt++) {
    const started = Date.now();
    log("INFO", "Sending request", { method: "GET", url, attempt });
    try {
      const body = await requestJson(url, headers, timeoutMs);
      log("INFO", "Response OK", { attempt, ms: Date.now() - started });
      return body;
    } catch (err) {
      const error = toApiError(err);
      error.details.attempts = attempt;
      if (!RETRYABLE.has(error.kind) || attempt > retries) throw error;
      const waitMs = error.details.retry_after_ms ?? 500 * 2 ** (attempt - 1);
      log("WARN", "Request failed, retrying", { kind: error.kind, status: error.details.status, attempt, wait_ms: waitMs });
      await sleep(waitMs);
    }
  }
}

// Reusable: fetch one item by id and return it.
// The API wraps the item: { data: { id, title, ... }, meta: { ... } }
async function getItem(id, { baseUrl = BASE_URL, apiKey = API_KEY, fail } = {}) {
  // e.g. http://localhost:3001/api/item/101?fail=500
  let url = `${baseUrl.replace(/\/+$/, "")}/api/item/${encodeURIComponent(id)}`;
  if (fail) url += `?fail=${encodeURIComponent(fail)}`;

  const body = await fetchJson(url, { headers: { "x-api-key": apiKey } });
  if (typeof body?.data?.title !== "string") {
    throw new ApiError("bad_response", "No data.title in the response", { keys: Object.keys(body ?? {}) });
  }
  return body.data;
}

async function main() {
  log("INFO", "Starting API call", { item_id: ITEM_ID, fail: fail ?? undefined, timeout_ms: TIMEOUT_MS, max_retries: MAX_RETRIES });
  try {
    checkConfig();
    const item = await getItem(ITEM_ID, { fail });
    log("INFO", "Title extracted", { item_id: item.id, title: item.title });
    if (!LOG_JSON) console.log(`\nTitle: ${item.title}`);
  } catch (err) {
    // A friendly message for people, the kind and details for whoever reads the log. No stack trace.
    const error = toApiError(err);
    log("ERROR", FRIENDLY[error.kind], { kind: error.kind, reason: error.message, ...error.details });
    process.exitCode = 1;
  }
}

// npm start runs main(). Other scripts can require() the functions instead.
if (require.main === module) main();

module.exports = { fetchJson, getItem, ApiError };
