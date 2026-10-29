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

  // Build the URL, e.g. http://localhost:3001/api/item/101?fail=500
  let url = `${BASE_URL}/api/item/${ITEM_ID}`;
  if (fail) url += `?fail=${fail}`;

  try {
    const response = await fetch(url, {
      headers: { "x-api-key": API_KEY },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      let detail = "";
      try {
        const errorBody = await response.json();
        detail = errorBody.message ? `: ${errorBody.message}` : "";
      } catch {
        // The status code is enough if the server does not return JSON.
      }
      throw new Error(`API returned ${response.status} ${response.statusText}${detail}`);
    }

    const body = await response.json();
    console.log(body);
    console.log(`Title: ${body.data.title}`);
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      console.error("Could not reach the API: the request timed out.");
    } else if (error.message.startsWith("API returned")) {
      console.error(`API request failed: ${error.message}`);
    } else {
      console.error("Could not reach the API. Is the server running?");
    }
    process.exitCode = 1;
  }
}

main();
