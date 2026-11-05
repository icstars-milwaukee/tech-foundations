// =====================================================================
// T8B STEP 1: Prepare the AI prompt (input guardrails)
// =====================================================================
//
//   npm run prepare:prompt
//
// 1. Loads the support tickets.
// 2. Sends ONLY what the AI needs (id + description). Names and emails
//    are never sent. That's called data minimization.
// 3. Runs redact() on every description.
// 4. Double-checks with an independent detector. If ANY personal data
//    is left, it refuses to write the prompt.
// 5. Writes out/prompt.txt (to paste into your AI tool) and
//    out/provenance.json (a record of what was sent and where it came from).
// =====================================================================

const fs = require("fs");
const path = require("path");
const log = require("../src/logger");
const { redact } = require("./redact");
const { findPersonalData } = require("../src/pii-detector");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "data", "support-tickets.json");
const OUT = path.join(ROOT, "out");

function main() {
  const data = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  log.info(`Loaded ${data.tickets.length} tickets from ${path.relative(ROOT, SOURCE)}`);

  let redactions = 0;
  const minimal = data.tickets.map((t) => {
    const clean = redact(t.description);
    redactions += (clean.match(/\[[A-Z_]+\]/g) || []).length;
    return { id: t.id, description: clean };
  });

  const leaks = minimal.flatMap((t) => findPersonalData(t.description).map((h) => `${t.id}: ${h.kind} "${h.value}"`));
  if (leaks.length) {
    log.error(`Personal data is still in ${leaks.length} place(s). Prompt NOT written.`);
    leaks.forEach((l) => log.error("  " + l));
    log.error("Fix redact() in prototype/redact.js, then run npm test and npm run prepare:prompt again.");
    process.exitCode = 1;
    return;
  }

  const template = fs.readFileSync(path.join(__dirname, "prompt-template.txt"), "utf8");
  const prompt = template.replace("{{TICKETS}}", JSON.stringify(minimal, null, 2));

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "prompt.txt"), prompt);

  const provenance = {
    preparedAt: new Date().toISOString(),
    source: data.source,
    sourceFile: path.relative(ROOT, SOURCE),
    exportedOn: data.exportedOn,
    recordCount: minimal.length,
    fieldsSent: ["id", "description (redacted)"],
    fieldsNeverSent: Object.keys(data.tickets[0]).filter((k) => !["id", "description"].includes(k)),
    redactionsMade: redactions,
    sentTo: "FILL IN: the approved AI tool you pasted this into",
  };
  fs.writeFileSync(path.join(OUT, "provenance.json"), JSON.stringify(provenance, null, 2) + "\n");

  log.info(`Redacted ${redactions} piece(s) of personal data. Independent check: clean.`);
  log.info("Wrote out/prompt.txt       -> paste it into your approved AI tool");
  log.info("Wrote out/provenance.json  -> fill in sentTo, and use it in your evaluation log");
  log.info("Save the AI's reply as ai/ai-triage.json, then run: npm run evaluate");
}

try {
  main();
} catch (err) {
  log.error("Could not prepare the prompt: " + err.message);
  process.exitCode = 1;
}
