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

const REQUEST_TIMEOUT_MS = 5000;

// npm run try:500 adds "--fail=500" to the command. This reads it.
const failArg = process.argv.find((arg) => arg.startsWith("--fail="));
const fail = failArg ? failArg.split("=")[1] : null;

async function main() {
  console.log(`[${new Date().toISOString()}] [INFO] Starting API call`);

  // Validate configuration before making the request.
  if (!BASE_URL || !API_KEY) {
    console.error(
      "[ERROR] API configuration is missing. Check your .env file.",
    );
    process.exitCode = 1;
    return;
  }

  try {
    // Build the URL, e.g. http://localhost:3001/api/item/101?fail=500
    const url = new URL(`/api/item/${encodeURIComponent(ITEM_ID)}`, BASE_URL);
    if (fail) {
      url.searchParams.set("fail", fail);
    }

    // TODO 1: Call the endpoint with fetch().
    //   - Send the API key in a header named "x-api-key".
    //   - Never type the key here. Use API_KEY (it comes from .env).
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    // TODO 2: Check the response. If response.ok is false, the server sent an
    //   error (401, 404, 500...). Stop here and show a friendly message.
    if (!response.ok) {
      console.error(`[ERROR] API request failed with HTTP ${response.status}.`);
      process.exitCode = 1;
      return;
    }
    // TODO 3: Parse the JSON body.
    const result = await response.json();
    // TODO 4: Extract the field "title" and print it.
    //   Hint: console.log the parsed JSON first. Where is title nested?
    const title = result?.title ?? result?.item?.title ?? result?.data?.title;

    if (typeof title !== "string" || !title.trim()) {
      console.error("[ERROR] The API response does not contain a valid title.");
      process.exitCode = 1;
      return;
    }

    console.log(`[INFO] Item title: ${title}`);
  } catch (error) {
    // TODO 5: Handle errors.
    //   Right now a crash prints a scary stack trace. Catch the error and print
    //   a friendly message instead, e.g. "Could not reach the API. Is the server running?"
    //   Bonus: tell the user which kind of failure it was (network, 401, 500, timeout).
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      console.error("[ERROR] The API request timed out. Please try again.");
    } else if (error instanceof TypeError) {
      console.error("[ERROR] Could not reach the API. Is the server running?");
    } else {
      console.error("[ERROR] Something went wrong while calling the API.");
    }

    process.exitCode = 1;
  }
}

main();
