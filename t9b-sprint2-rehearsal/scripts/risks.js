// Sorts a risk register by score so you work on the worst risks first.
//
//   npm run risks              your RISK_REGISTER.md
//   npm run risks:example      the example register
//
// Score = Probability x Impact, where Low = 1, Medium = 2, High = 3.
//   7-9  act now          (High x High, High x Medium)
//   3-6  plan for it
//   1-2  watch it

const path = require("path");
const md = require("./lib/md");

const LEVELS = { low: 1, l: 1, medium: 2, med: 2, m: 2, high: 3, h: 3 };

function parseRegister(text) {
  const rows = md.tableRows(text).filter((cells) => cells.slice(1).some((c) => c.length > 0));
  return rows.map((c) => {
    const [id, risk, probability, impact, mitigation, owner, status, raisedBy] = c;
    const p = LEVELS[(probability || "").toLowerCase()];
    const i = LEVELS[(impact || "").toLowerCase()];
    return { id, risk, probability, impact, mitigation, owner, status, raisedBy, score: p && i ? p * i : null };
  });
}

function band(score) {
  if (score === null) return "??";
  if (score >= 7) return "ACT NOW";
  if (score >= 3) return "PLAN";
  return "WATCH";
}

if (require.main === module) {
  const file = process.argv[2] || "RISK_REGISTER.md";
  const risks = parseRegister(md.read(path.join(__dirname, ".."), file));
  if (risks.length === 0) {
    console.log(`\nNo risks found in ${file} yet. Fill in at least one row.\n`);
    process.exit(0);
  }
  risks.sort((a, b) => (b.score || 0) - (a.score || 0));
  console.log(`\nRisks in ${file}, worst first\n`);
  for (const r of risks) {
    console.log(`${String(r.score ?? "?").padStart(2)}  ${band(r.score).padEnd(7)}  ${r.id}  ${r.risk}`);
    const gaps = [];
    if (r.score === null) gaps.push("Probability and Impact must be Low, Medium, or High");
    if (!r.mitigation) gaps.push("no mitigation");
    if (!r.owner) gaps.push("no owner");
    else if (/^(team|everyone|all|us)$/i.test(r.owner)) gaps.push(`"${r.owner}" isn't one person`);
    if (gaps.length) console.log(`                 [TODO] ${gaps.join("; ")}`);
  }
  console.log("");
}

module.exports = { parseRegister, LEVELS };
