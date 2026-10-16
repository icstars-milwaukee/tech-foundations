// Artifact self-check for T9B. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const path = require("path");
const md = require("./lib/md");
const { parseRegister } = require("./risks");

const ROOT = path.join(__dirname, "..");

const backlog = md.read(ROOT, "BACKLOG.md");
const register = md.read(ROOT, "RISK_REGISTER.md");
const rehearsal = md.read(ROOT, "REHEARSAL_NOTES.md");
const runbook = md.read(ROOT, "RUNBOOK.md");

// --- Backlog ---
const backlogRows = md.filledRows(backlog, { skipFirst: true });
const POINTS = ["1", "2", "3", "5", "8"];
const badEstimates = backlogRows.filter((r) => !POINTS.includes(r[2]));
const vagueOwners = backlogRows.filter((r) => /^(team|everyone|all|us|tbd)$/i.test(r[3]));
const refined = md.allFieldsFilled(md.section(backlog, "Refinement notes"));

// --- Risk register ---
const risks = parseRegister(register);
const completeRisks = risks.filter((r) => r.risk && r.score !== null && r.mitigation && r.owner && r.status && r.raisedBy);
const peerRisks = completeRisks.filter((r) => /peer/i.test(r.raisedBy));
const apiRisk = completeRisks.find((r) => /\bapi\b/i.test(r.risk) && /(mock|cache|cached|fallback|offline)/i.test(r.mitigation));

// --- Rehearsal ---
const flowRows = md.filledRows(md.section(rehearsal, "Demo flow"), { skipFirst: true });
const rolesDone = md.allFieldsFilled(md.section(rehearsal, "Roles"));
const runDone = md.allFieldsFilled(md.section(rehearsal, "Rehearsal run"));

// --- Runbook ---
const rollbackText = md.section(runbook, "Rollback");
const commands = md.fencedBlocks(rollbackText)[0] || "";
const commandsDone = commands.split("\n").some((l) => l.trim() && !l.trim().startsWith("#"));
const runbookDone = md.allFieldsFilled(md.section(runbook, "How we'll know")) && md.allFieldsFilled(rollbackText) && commandsDone;

const checks = [
  {
    label: "Backlog: 5+ refined tasks (estimate, owner, status)",
    ok: backlogRows.length >= 5 && badEstimates.length === 0 && vagueOwners.length === 0,
    detail:
      badEstimates.length
        ? `estimates must be 1, 2, 3, 5, or 8: fix ${badEstimates.map((r) => r[0]).join(", ")}`
        : vagueOwners.length
        ? `one person per owner: fix ${vagueOwners.map((r) => r[0]).join(", ")}`
        : `${backlogRows.length} complete row(s)`,
  },
  { label: "Backlog: refinement notes", ok: refined, detail: "what you split, what you cut, points left vs. capacity" },
  { label: "Risk register: 5+ complete risks", ok: completeRisks.length >= 5, detail: `${completeRisks.length} complete (run \`npm run risks\` to see gaps)` },
  { label: "Risk register: 1+ risk raised by a peer team", ok: peerRisks.length >= 1, detail: peerRisks.length ? peerRisks.map((r) => r.id).join(", ") : 'swap with another team; mark theirs "peer (team name)"' },
  {
    label: "Risk register: API-down risk with a mock/cached fallback",
    ok: Boolean(apiRisk),
    detail: apiRisk ? `${apiRisk.id}` : "add a risk about the API and mitigate it with mock or cached data",
  },
  { label: "Rehearsal: roles assigned", ok: rolesDone, detail: "driver, narrator, backup" },
  { label: "Rehearsal: 4+ demo steps, each with a fallback", ok: flowRows.length >= 4, detail: `${flowRows.length} complete step(s)` },
  { label: "Rehearsal: run notes (time, what broke, what changed)", ok: runDone, detail: "fill in after your first run" },
  { label: "Runbook: API-down rollback with exact commands", ok: runbookDone, detail: "signal, decision, steps, and the command block" },
];

md.report(
  "T9B Artifact Self-Check",
  checks,
  "Artifact is complete. Now test it: could your backup person run the API-down rollback without you?"
);
