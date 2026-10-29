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

async function main() {
  console.log(`[${new Date().toISOString()}] [INFO] Starting API call`);

  if (!BASE_URL) throw new Error("API_BASE_URL is missing. Check your .env file.");
  if (!API_KEY) throw new Error("API_KEY is missing. Check your .env file.");

  const url = new URL(`/api/item/${encodeURIComponent(ITEM_ID)}`, BASE_URL);
  if (fail) url.searchParams.set("fail", fail);

  const response = await fetch(url, {
    headers: { "x-api-key": API_KEY },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`The API returned HTTP ${response.status} (${response.statusText}).`);
  }

  const result = await response.json();
  const title = result?.data?.title;
  if (typeof title !== "string") {
    throw new Error("The API response did not contain an item title.");
  }

  console.log(`Title: ${title}`);
}

main().catch((error) => {
  if (error?.name === "TimeoutError" || error?.name === "AbortError") {
    console.error("[ERROR] The API request timed out. Please try again.");
  } else if (error instanceof TypeError) {
    console.error("[ERROR] Could not reach the API. Is the server running?");
  } else {
    console.error(`[ERROR] ${error instanceof Error ? error.message : String(error)}`);
  }
  process.exitCode = 1;
});
