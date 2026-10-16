// Loads settings from a .env file into process.env. You don't need to edit this.
//
// A .env file holds secrets (like API keys) and settings that change per machine:
//
//   API_KEY=tf-abc123
//   MOCK_BASE_URL=http://localhost:4000
//
// .env is listed in .gitignore, so git never commits it.
// .env.example IS committed: it shows teammates which keys they need, with no real values.
//
// This does what the popular "dotenv" package does, in a few lines.

const fs = require("fs");
const path = require("path");

function loadEnv(file = path.join(__dirname, "..", ".env")) {
  if (!fs.existsSync(file)) return false;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue; // skips blank lines and # comments
    const value = m[2].replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
  return true;
}

module.exports = { loadEnv };
