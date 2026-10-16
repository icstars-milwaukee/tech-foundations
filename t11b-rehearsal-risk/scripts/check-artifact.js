// Artifact self-check for T11B. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const path = require("path");
const md = require("./lib/md");

const ROOT = path.join(__dirname, "..");
const status = md.read(ROOT, "STATUS_UPDATE.md");
const riskLog = md.read(ROOT, "RISK_LOG.md");
const feedback = md.read(ROOT, "REHEARSAL_FEEDBACK.md");
const pressure = md.read(ROOT, "PRESSURE_PLAN.md");

const color = md.field(md.section(status, "Overall status"), "Status");
const colorOk = /^(green|yellow|red)\b/i.test(color);
const topRisks = md.filledRows(md.section(status, "Top risks"));
const riskRows = md.filledRows(riskLog, { skipFirst: true });
const LEVEL = /^(low|medium|high)$/i;
const validRisks = riskRows.filter((r) => LEVEL.test(r[2]) && LEVEL.test(r[3]));

const ISSUE = /(#\d+|github\.com\/\S+\/issues\/\d+)/;
const round = (name) => md.section(feedback, name);
const roundOk = (name) => md.allFieldsFilled(round(name)) && ISSUE.test(md.field(round(name), "Issues filed"));

const checks = [
  { label: "Status: color + a fact behind it", ok: colorOk && Boolean(md.field(md.section(status, "Overall status"), "Why")), detail: colorOk ? color : "Green, Yellow, or Red" },
  { label: "Status: done / not done / next", ok: md.allFieldsFilled(md.section(status, "Since last update")) && md.allFieldsFilled(md.section(status, "Next")), detail: "be specific" },
  { label: "Status: top 3 risks with mitigation + owner", ok: topRisks.length >= 3, detail: `${topRisks.length}/3 complete` },
  { label: "Status: a specific ask", ok: md.allFieldsFilled(md.section(status, "Asks")), detail: "who, what, by when" },
  {
    label: "Risk log: 5+ risks, updated since T9B",
    ok: validRisks.length >= 5,
    detail: riskRows.length !== validRisks.length ? "Probability and Impact must be Low, Medium, or High" : `${validRisks.length} complete row(s)`,
  },
  { label: "Rehearsal round 1 + issues filed", ok: roundOk("Round 1"), detail: "fill every line; issues like #12" },
  { label: "Changes between rounds", ok: md.allFieldsFilled(md.section(feedback, "Between rounds")), detail: "what you changed and which issue it closes" },
  { label: "Rehearsal round 2 + issues filed", ok: roundOk("Round 2"), detail: "fill every line; issues like #14" },
  { label: "Peer coaching (SBI)", ok: md.allFieldsFilled(md.section(feedback, "Peer coaching")), detail: "one given, one received" },
  {
    label: "Pressure plan filled in",
    ok: md.filledFields(pressure).length >= md.fields(pressure).length - 1 && md.fields(pressure).length > 0,
    detail: `${md.filledFields(pressure).length}/${md.fields(pressure).length} answers (it's yours: honest beats polished)`,
  },
];

md.report("T11B Artifact Self-Check", checks, "Artifact is complete. Read your status update one more time: would the client trust it?");
