# Task 2: API Call

**About 20 minutes**

> Call this API endpoint, parse the JSON response, and extract the field `title`. Handle one simulated error (e.g., network failure).

Your trainer runs a practice API at `http://localhost:3001` and gives you an API key.

## Setup (2 minutes)

1. Open the `starter/` folder in VS Code. Node 20.6+ is all you need. No `npm install`.
2. Make your `.env`:
   - PowerShell: `Copy-Item .env.example .env`
   - Git Bash: `cp .env.example .env`
3. Put the key from the board in `.env` as `API_KEY=...`.
4. Run `git init`, check that `git status` does **not** list `.env`, and commit the starter.

## Commands (run inside `starter/`)

| Command | Does |
|---|---|
| `npm start` | Calls `GET /api/item/101` |
| `npm run try:500` | Same call, but the server answers with a 500 error |
| `npm run try:timeout` | Same call, but the server hangs for 10 seconds |

**Network failure:** ask your trainer to stop the server, or point `API_BASE_URL` at a port nothing is listening on (e.g. `http://localhost:3999`), then run `npm start`.

## Done looks like

- `npm start` prints the item's `title`.
- At least one failure prints a **friendly** message, not a stack trace.
- The key is only in `.env`, and `.env` is not committed.

`mock-server/` is for your trainer. You don't need to open it.
