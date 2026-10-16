// Artifact self-check for T8B. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const md = require("./lib/md");

const ROOT = path.join(__dirname, "..");
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

const tests = spawnSync(process.execPath, ["--test", path.join("test", "redact.test.js")], { cwd: ROOT, encoding: "utf8" });

let provenance = {};
try {
  provenance = JSON.parse(md.read(ROOT, "out/provenance.json") || "{}");
} catch {
  provenance = {};
}
const sentToFilled = provenance.sentTo && !/^FILL IN/.test(provenance.sentTo);

let aiParses = false;
if (exists("ai/ai-triage.json")) {
  try {
    const text = md.read(ROOT, "ai/ai-triage.json").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    aiParses = Array.isArray(JSON.parse(text));
  } catch {
    aiParses = false;
  }
}

const log = md.read(ROOT, "EVALUATION_LOG.md");
const rubricRows = md.filledRows(md.section(log, "3. Comparison rubric"));
const decisionRows = md.filledRows(md.section(log, "4. Decisions"));
const decisionsValid = decisionRows.filter((r) => /\b(accept|edit|reject)\b/i.test(r[3] || ""));

const checks = [
  {
    label: "Input guardrail: redact() passes npm test",
    ok: tests.status === 0,
    detail: tests.status === 0 ? "all tests pass" : "run `npm test` to see which ones fail",
  },
  {
    label: "Prompt prepared (out/prompt.txt + out/provenance.json)",
    ok: exists("out/prompt.txt") && Boolean(provenance.preparedAt),
    detail: "run `npm run prepare:prompt`",
  },
  { label: "Provenance: sentTo filled in", ok: Boolean(sentToFilled), detail: sentToFilled ? provenance.sentTo : 'edit "sentTo" in out/provenance.json' },
  {
    label: "Your real AI output saved as ai/ai-triage.json",
    ok: aiParses,
    detail: exists("ai/ai-triage.json") ? (aiParses ? "valid JSON array" : "not a valid JSON array yet") : "file not found",
  },
  { label: "Evaluation report generated", ok: exists("out/evaluation-report.md"), detail: "run `npm run evaluate`" },
  { label: "Log: workflow described", ok: md.allFieldsFilled(md.section(log, "1. The workflow")), detail: "section 1" },
  { label: "Log: guardrails + provenance", ok: md.allFieldsFilled(md.section(log, "2. Guardrails")), detail: "section 2" },
  { label: "Log: rubric scored with evidence (5 criteria)", ok: rubricRows.length >= 5, detail: `${rubricRows.length}/5 rows complete` },
  {
    label: "Log: 5+ ticket decisions (accept / edit / reject)",
    ok: decisionsValid.length >= 5,
    detail: `${decisionsValid.length} complete row(s) with a decision`,
  },
  { label: "Log: overall decision", ok: md.allFieldsFilled(md.section(log, "5. Overall decision")), detail: "section 5" },
  { label: "Log: peer share", ok: md.allFieldsFilled(md.section(log, "6. Peer share")), detail: "section 6" },
];

md.report(
  "T8B Artifact Self-Check",
  checks,
  "Artifact is complete. Now push for judgment: is every decision backed by evidence a reviewer could check?"
);
