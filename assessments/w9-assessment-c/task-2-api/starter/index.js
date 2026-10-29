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

// npm run try:500 adds "--fail=500" to the command. This reads it.
const failArg = process.argv.find((arg) => arg.startsWith("--fail="));
const fail = failArg ? failArg.split("=")[1] : null;

const TIMEOUT_MS = 5000; // give up if the server has not answered in 5 seconds

function log(level, message) {
  console.log(`[${new Date().toISOString()}] [${level}] ${message}`);
}

async function main() {
  log("INFO", "Starting API call");

  // Fail early (and clearly) if .env is missing or incomplete.
  if (!BASE_URL || !API_KEY) {
    throw new Error("CONFIG: API_BASE_URL or API_KEY is missing. Did you copy .env.example to .env?");
  }

  // Build the URL, e.g. http://localhost:3001/api/item/101?fail=500
  let url = `${BASE_URL}/api/item/${ITEM_ID}`;
  if (fail) url += `?fail=${fail}`;

  // TODO 1: Call the endpoint with fetch(), sending the key from .env in the
  //   x-api-key header. AbortSignal.timeout makes fetch give up on a hung server.
  const response = await fetch(url, {
    headers: { "x-api-key": API_KEY },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  // TODO 2: Check the response. A non-2xx status means the server sent an error.
  if (!response.ok) {
    const err = new Error(`HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }

  // TODO 3: Parse the JSON body.
  const body = await response.json();

  // TODO 4: Extract "title". It is nested one level down: body.data.title
  const title = body?.data?.title;
  if (!title) {
    throw new Error("PARSE: the response had no data.title field");
  }
  log("INFO", `Success (HTTP ${response.status}). title = "${title}"`);
  console.log(title);
}

// TODO 5: Handle errors. Turn each kind of failure into a friendly message
// (no stack trace) and exit with code 1 so scripts can tell it failed.
function describeError(err) {
  if (err.name === "TimeoutError") {
    return `Timeout: the API did not answer within ${TIMEOUT_MS / 1000} seconds. Try again in a moment.`;
  }
  if (err.status === 401) return "401 Unauthorized: the API key is missing or wrong. Check API_KEY in your .env file.";
  if (err.status === 404) return "404 Not Found: that item or URL does not exist. Check ITEM_ID and API_BASE_URL.";
  if (err.status >= 500) return `Server error (${err.status}): the API had a problem. Try again later.`;
  if (err.status) return `The API answered with an unexpected status (${err.status}).`;
  if (err.message.startsWith("CONFIG:") || err.message.startsWith("PARSE:")) return err.message;
  if (err instanceof SyntaxError) return "The API answered, but not with valid JSON.";
  return "Network failure: could not reach the API. Is the server running, and is API_BASE_URL correct?";
}

main().catch((err) => {
  log("ERROR", describeError(err));
  process.exitCode = 1;
});
