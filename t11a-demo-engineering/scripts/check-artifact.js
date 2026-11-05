// Artifact self-check for T11A. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const path = require("path");
const md = require("./lib/md");
const { parseDefects } = require("../tools/burndown");

const ROOT = path.join(__dirname, "..");
const runbook = md.read(ROOT, "DEMO_RUNBOOK.md");
const burndown = md.read(ROOT, "DEFECT_BURNDOWN.md");

const realCommands = (text) => {
  const blocks = md.fencedBlocks(text);
  return blocks.length > 0 && blocks.every((b) => b.split("\n").some((l) => l.trim() && !l.trim().startsWith("#")));
};

const gate = md.checkboxes(md.section(runbook, "Quality gate"));
const scriptRows = md.filledRows(md.section(runbook, "Demo script"), { skipFirst: true });
const fallback = md.section(runbook, "Offline / mock data fallback");
const injection = md.section(runbook, "Failure injection results");
const reset = md.section(runbook, "Reset between runs");

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || "");
const defects = parseDefects(burndown);
const complete = defects.filter((d) => d.defect && /^S[123]$/i.test(d.severity) && isDate(d.found) && d.owner && d.status);
const openBlocking = defects.filter((d) => (d.blocking || /^S1$/i.test(d.severity)) && !isDate(d.fixed));
const fixedCount = defects.filter((d) => isDate(d.fixed)).length;

const checks = [
  { label: "Runbook: roles assigned", ok: md.allFieldsFilled(md.section(runbook, "Roles")), detail: "driver, narrator, backup" },
  { label: "Runbook: quality gate all green", ok: gate.length > 0 && gate.every((c) => c.checked), detail: `${gate.filter((c) => c.checked).length}/${gate.length} checked` },
  { label: "Runbook: 5+ script steps, each with a fallback", ok: scriptRows.length >= 5, detail: `${scriptRows.length} complete step(s)` },
  { label: "Runbook: offline/mock fallback with exact commands", ok: md.allFieldsFilled(fallback) && realCommands(fallback), detail: "how it switches, how the room can tell, the commands" },
  { label: "Runbook: failure injection results (twice)", ok: md.allFieldsFilled(injection), detail: "inject, change something, inject again" },
  { label: "Runbook: reset commands", ok: realCommands(reset), detail: "back to the starting state in under a minute" },
  { label: "Runbook: side-by-side feedback from another team", ok: md.allFieldsFilled(md.section(runbook, "Side-by-side")), detail: "the watching team fills this in" },
  {
    label: "Burndown: 3+ defects logged (severity, dates, owner, status)",
    ok: complete.length >= 3,
    detail: `${complete.length} complete, ${fixedCount} fixed (run \`npm run burndown\`)`,
  },
  {
    label: "Burndown: no open demo-blocking defects",
    ok: defects.length > 0 && openBlocking.length === 0,
    detail: openBlocking.length ? "still open: " + openBlocking.map((d) => d.id).join(", ") : defects.length ? "clear" : "log your defects first",
  },
  { label: "Burndown: decisions about accepted defects", ok: md.allFieldsFilled(md.section(burndown, "Decisions")), detail: "what you're accepting and how you'll route around it" },
];

md.report("T11A Artifact Self-Check", checks, "Artifact is complete. Run the gate one more time on presentation day.");
