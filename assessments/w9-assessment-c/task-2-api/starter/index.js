async function main() {
  console.log(`[${new Date().toISOString()}] [INFO] Starting API call`);

  let url = `${BASE_URL}/api/item/${ITEM_ID}`;
  if (fail) url += `?fail=${fail}`;

  const response = await fetch(url, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    console.log(`Sorry! The server returned an error (${response.status}).`);
    return;
  }

  const data = await response.json();

  console.log("Full response:", data);

  console.log("Title:", data.title);
}

main().catch((error) => {
  console.log("Could not reach the API. Is the server running?");
});