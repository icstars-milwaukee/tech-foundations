// Artifact self-check for T10A. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const fs = require("fs");
const path = require("path");
const md = require("./lib/md");
const { preflight } = require("../tools/preflight");

const ROOT = path.join(__dirname, "..");

const plan = md.read(ROOT, "RELEASE_PLAN.md");
const incident = md.read(ROOT, "INCIDENT_LOG.md");

const realCommands = (text) =>
  md.fencedBlocks(text).some((b) => b.split("\n").some((l) => l.trim() && !l.trim().startsWith("#")));

const criteriaRows = md.filledRows(md.section(plan, "4. Success criteria")).filter((r) => /\d/.test(r[1]) && !/___/.test(r[1]));
const preflightDone = md.checkboxes(md.section(plan, "2. Pre-flight")).filter((c) => c.checked).length;
const rollback = md.section(plan, "6. Rollback");
const trigger = md.field(rollback, "Rollback trigger");

const evidenceDir = path.join(ROOT, "evidence");
const evidence = fs.existsSync(evidenceDir) ? fs.readdirSync(evidenceDir).filter((f) => f.endsWith(".txt")) : [];
const verdicts = evidence.map((f) => md.read(evidenceDir, f));
const sawGo = verdicts.some((v) => /VERDICT: GO/.test(v));
const sawRollback = verdicts.some((v) => /VERDICT: ROLLBACK/.test(v));

const timelineRows = md.filledRows(md.section(incident, "Timeline"));
const followUps = md.filledRows(md.section(incident, "Follow-ups"));
const pf = preflight();

const checks = [
  { label: "Pre-flight passes (npm run preflight)", ok: pf.every((r) => r.ok), detail: pf.filter((r) => !r.ok).map((r) => r.label).join("; ") || "cleared" },
  { label: "Plan: release details", ok: md.allFieldsFilled(md.section(plan, "1. The release")), detail: "versions, owners, what's changing" },
  { label: "Plan: pre-flight checklist used", ok: preflightDone >= 5, detail: `${preflightDone} item(s) checked` },
  { label: "Plan: exact deployment commands", ok: realCommands(md.section(plan, "3. Deployment steps")), detail: "replace the TODO with real commands" },
  { label: "Plan: 3 success criteria with numbers", ok: criteriaRows.length >= 3, detail: `${criteriaRows.length}/3 complete` },
  { label: "Plan: monitoring (signals, alert threshold, who)", ok: md.allFieldsFilled(md.section(plan, "5. Monitoring")), detail: "section 5" },
  {
    label: "Plan: rollback trigger + exact rollback commands",
    ok: Boolean(trigger) && realCommands(rollback) && md.allFieldsFilled(rollback),
    detail: trigger ? "trigger set" : "a rule someone could apply without asking you",
  },
  { label: "Evidence: a GO and a ROLLBACK release check", ok: sawGo && sawRollback, detail: evidence.length ? evidence.join(", ") : "run `npm run release-check` on both versions" },
  {
    label: "Incident log: details, timeline, resolution",
    ok: md.allFieldsFilled(md.section(incident, "Incident:")) && timelineRows.length >= 3,
    detail: `${timelineRows.length} timeline row(s)`,
  },
  { label: "Incident log: 1+ follow-up guardrail with owner", ok: followUps.length >= 1, detail: `${followUps.length} follow-up(s)` },
];

md.report("T10A Artifact Self-Check", checks, "Artifact is complete. Now test it: could a teammate roll back using only your plan?");
