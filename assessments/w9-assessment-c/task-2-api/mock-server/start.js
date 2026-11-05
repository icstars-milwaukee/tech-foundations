// Facilitator start script:  npm start
// Creates .env from .env.example the first time, then starts the server.

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const envFile = path.join(__dirname, ".env");
if (!fs.existsSync(envFile)) {
  fs.copyFileSync(path.join(__dirname, ".env.example"), envFile);
  console.log("Created mock-server/.env from .env.example.");
}

spawn(process.execPath, [path.join(__dirname, "server.js")], { stdio: "inherit" }).on("exit", (code) => process.exit(code ?? 0));
