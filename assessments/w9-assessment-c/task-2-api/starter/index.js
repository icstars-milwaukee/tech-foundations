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

  if (!BASE_URL || !API_KEY) {
    console.error("API_BASE_URL and API_KEY must be set in .env.");
    process.exitCode = 1;
    return;
  }

  const endpoint = new URL(
    `/api/item/${encodeURIComponent(ITEM_ID)}`,
    BASE_URL,
  );
  if (fail) endpoint.searchParams.set("fail", fail);

  try {
    const response = await fetch(endpoint, {
      headers: { "x-api-key": API_KEY },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`API request failed with HTTP ${response.status}.`);
      process.exitCode = 1;
      return;
    }

    const result = await response.json();
    const title = result.data?.title;

    if (typeof title !== "string") {
      console.error("API response did not include an item title.");
      process.exitCode = 1;
      return;
    }

    console.log(`Title: ${title}`);
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.error("The API request timed out. Please try again.");
    } else if (error instanceof SyntaxError) {
      console.error("The API returned an invalid JSON response.");
    } else if (error instanceof TypeError) {
      console.error("Could not reach the API. Is the server running?");
    } else {
      console.error(`The API request failed: ${error.message}`);
    }
    process.exitCode = 1;
  }

}

main();
