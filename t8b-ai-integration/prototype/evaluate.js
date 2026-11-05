// =====================================================================
// T8B STEP 2: Evaluate the AI output (output guardrails + baseline)
// =====================================================================
//
//   npm run evaluate            checks ai/ai-triage.json (your real AI run)
//   npm run evaluate:sample     checks ai/ai-triage.sample.json (trainer demo)
//
// 1. Output guardrails: is it valid JSON? Every ticket exactly once?
//    Only allowed categories and priorities? Any personal data in it?
// 2. Baseline comparison: where does the AI agree or disagree with the
//    IT lead's human triage?
// 3. Writes out/evaluation-report.md to use in EVALUATION_LOG.md.
//
// Disagreeing with the baseline doesn't automatically mean AI is wrong.
// That's your call to make, ticket by ticket.
// =====================================================================

const fs = require("fs");
const path = require("path");
const log = require("../src/logger");
const { findPersonalData } = require("../src/pii-detector");

const ROOT = path.join(__dirname, "..");
const CATEGORIES = ["hardware", "software", "account", "network"];
const PRIORITIES = ["low", "normal", "urgent"];

function loadAiOutput(file) {
  let text = fs.readFileSync(file, "utf8").trim();
  // AI tools often wrap JSON in ```json fences. Strip them.
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(text);
}

function guardrails(aiRows, ticketIds) {
  const problems = [];
  if (!Array.isArray(aiRows)) return ["Output is not a JSON array."];

  const seen = new Map();
  for (const row of aiRows) {
    const id = row && row.id;
    if (!ticketIds.includes(id)) problems.push(`Invented or unknown ticket id: ${JSON.stringify(id)}`);
    seen.set(id, (seen.get(id) || 0) + 1);
    if (!CATEGORIES.includes(row.category)) problems.push(`${id}: category "${row.category}" is not allowed (${CATEGORIES.join(", ")})`);
    if (!PRIORITIES.includes(row.priority)) problems.push(`${id}: priority "${row.priority}" is not allowed (${PRIORITIES.join(", ")})`);
    for (const hit of findPersonalData(row.summary || "")) problems.push(`${id}: PRIVACY: summary contains a ${hit.kind}: "${hit.value}"`);
  }
  for (const id of ticketIds) {
    if (!seen.has(id)) problems.push(`${id}: missing from the AI output`);
    else if (seen.get(id) > 1) problems.push(`${id}: appears ${seen.get(id)} times`);
  }
  return problems;
}

function compare(aiRows, baseline) {
  const byId = new Map((Array.isArray(aiRows) ? aiRows : []).map((r) => [r.id, r]));
  return baseline.tickets.map((b) => {
    const ai = byId.get(b.id);
    return {
      id: b.id,
      baseline: `${b.category} / ${b.priority}`,
      ai: ai ? `${ai.category} / ${ai.priority}` : "(missing)",
      categoryMatch: Boolean(ai && ai.category === b.category),
      priorityMatch: Boolean(ai && ai.priority === b.priority),
      needsHuman: Boolean(ai && ai.needsHuman),
    };
  });
}

function main() {
  const useSample = process.argv.includes("--sample");
  const aiFile = path.join(ROOT, "ai", useSample ? "ai-triage.sample.json" : "ai-triage.json");
  if (!fs.existsSync(aiFile)) {
    log.error(`No AI output found at ${path.relative(ROOT, aiFile)}.`);
    log.error("Run npm run prepare:prompt, paste out/prompt.txt into your AI tool, and save its reply there.");
    process.exitCode = 1;
    return;
  }

  const tickets = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "support-tickets.json"), "utf8")).tickets;
  const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "it-lead-triage.json"), "utf8"));

  let aiRows;
  try {
    aiRows = loadAiOutput(aiFile);
  } catch (err) {
    log.error(`The AI output isn't valid JSON: ${err.message}`);
    log.error("That's a real-world failure too. Re-prompt, or fix it by hand and note it in your log.");
    process.exitCode = 1;
    return;
  }

  const problems = guardrails(aiRows, tickets.map((t) => t.id));
  const rows = compare(aiRows, baseline);
  const catAgree = rows.filter((r) => r.categoryMatch).length;
  const priAgree = rows.filter((r) => r.priorityMatch).length;

  const lines = [];
  lines.push(`# Evaluation report (${path.relative(ROOT, aiFile)})`);
  lines.push("");
  lines.push(`Generated ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Output guardrails");
  lines.push("");
  lines.push(problems.length ? problems.map((p) => "- " + p).join("\n") : "- All passed.");
  lines.push("");
  lines.push("## AI vs baseline (IT lead)");
  lines.push("");
  lines.push("| Ticket | Baseline | AI | Category | Priority | AI flagged for human |");
  lines.push("|---|---|---|---|---|---|");
  for (const r of rows) {
    lines.push(`| ${r.id} | ${r.baseline} | ${r.ai} | ${r.categoryMatch ? "same" : "DIFFERENT"} | ${r.priorityMatch ? "same" : "DIFFERENT"} | ${r.needsHuman ? "yes" : ""} |`);
  }
  lines.push("");
  lines.push(`Category agreement: ${catAgree}/${rows.length}. Priority agreement: ${priAgree}/${rows.length}.`);
  lines.push(`Baseline took ${baseline.minutesSpent} minutes by hand.`);
  const report = lines.join("\n") + "\n";

  fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
  const reportName = useSample ? "evaluation-report.sample.md" : "evaluation-report.md";
  fs.writeFileSync(path.join(ROOT, "out", reportName), report);

  console.log(report);
  if (problems.length) {
    log.warn(`${problems.length} guardrail problem(s). Each one is a reason to EDIT or REJECT, not to ship as-is.`);
  } else {
    log.info("Guardrails passed. Now judge the disagreements one by one in EVALUATION_LOG.md.");
  }
  log.info(`Saved out/${reportName}`);
}

try {
  main();
} catch (err) {
  log.error("Evaluation failed: " + err.message);
  process.exitCode = 1;
}
