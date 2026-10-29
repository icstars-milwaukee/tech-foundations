const BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;
const ITEM_ID = process.env.ITEM_ID || "101";

// npm run try:500 adds "--fail=500" to the command. This reads it.
const failArg = process.argv.find((arg) => arg.startsWith("--fail="));
const fail = failArg ? failArg.split("=")[1] : null;

async function main() {
  console.log(`[${new Date().toISOString()}] [INFO] Starting API call`);

  // Build the URL
  let url = `${BASE_URL}/api/item/${ITEM_ID}`;
  if (fail) url += `?fail=${fail}`;

  try {
    // Timeout after 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 5000);

    // TODO 1: Call endpoint with fetch()
    const response = await fetch(url, {
      headers: {
        "x-api-key": API_KEY,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // TODO 2: Check response status
    if (!response.ok) {
      console.log(
        `Request failed. Server returned ${response.status} ${response.statusText}`
      );
      return;
    }

    // TODO 3: Parse JSON body
    const data = await response.json();

    // Optional: inspect response structure
    console.log("Response JSON:", data);

    // TODO 4: Extract and print title
    console.log("Title:", data.title);

    // If title is nested, use the correct path instead:
    // console.log("Title:", data.item.title);
  } catch (error) {
    // TODO 5: Friendly error handling
    if (error.name === "AbortError") {
      console.log("Request timed out. The server took too long to respond.");
    } else if (error instanceof TypeError) {
      console.log(
        "Could not reach the API. Is the server running? (Network failure)"
      );
    } else {
      console.log("An unexpected error occurred:", error.message);
    }
  }
}

main();