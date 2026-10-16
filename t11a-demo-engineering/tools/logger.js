// Logging standard (from T7A):  [timestamp] [LEVEL] message
//
// Use this instead of a bare console.log when you are DEBUGGING.
// Every log line tells you WHEN it happened, HOW serious it is, and WHAT happened.
//
//   const log = require("../src/logger");
//   log.info("Loaded 5 sales for Week 1");
//   log.debug("i = " + i + ", value = " + sales[i]);
//   log.warn("Week 2 has no sales data");
//   log.error("Could not read data file");
//
// Output looks like:
//   [2026-10-14T15:04:05.123Z] [INFO] Loaded 5 sales for Week 1

function timestamp() {
  return new Date().toISOString();
}

function write(level, message) {
  const line = `[${timestamp()}] [${level}] ${message}`;
  // Errors and warnings go to stderr, everything else to stdout.
  if (level === "ERROR" || level === "WARN") {
    console.error(line);
  } else {
    console.log(line);
  }
}

module.exports = {
  debug: (message) => write("DEBUG", message),
  info: (message) => write("INFO", message),
  warn: (message) => write("WARN", message),
  error: (message) => write("ERROR", message),
};
