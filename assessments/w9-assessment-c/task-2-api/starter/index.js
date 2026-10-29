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

  // TODO 1: Call the endpoint with fetch().
  //   - Send the API key in a header named "x-api-key".
  //   - Never type the key here. Use API_KEY (it comes from .env).


  // TODO 2: Check the response. If response.ok is false, the server sent an
  //   error (401, 404, 500...). Stop here and show a friendly message.


  // TODO 3: Parse the JSON body.


  // TODO 4: Extract the field "title" and print it.
  //   Hint: console.log the parsed JSON first. Where is title nested?

}

// TODO 5: Handle errors.
//   Right now a crash prints a scary stack trace. Catch the error and print
//   a friendly message instead, e.g. "Could not reach the API. Is the server running?"
//   Bonus: tell the user which kind of failure it was (network, 401, 500, timeout).
main();
