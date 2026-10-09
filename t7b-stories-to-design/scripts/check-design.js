// Design artifact self-check for T7B. Run:  npm run check
//
// Checks that every piece of the artifact exists. It does NOT judge quality.
// That conversation happens with your team, the team you swap with, and your trainer.
//
//   npm run check                      checks my-design/
//   node scripts/check-design.js <dir> checks another design folder

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const dirArg = process.argv[2] || "my-design";
const DIR = path.isAbsolute(dirArg) ? dirArg : path.join(ROOT, dirArg);

function read(file) {
  try {
    return fs.readFileSync(path.join(DIR, file), "utf8");
  } catch {
    return "";
  }
}

// Returns the text of a "## N. Heading" section (until the next "## ").
function section(md, name) {
  const re = new RegExp("^##\\s+(\\d+\\.\\s*)?" + name + "\\b.*$", "im");
  const m = md.match(re);
  if (!m) return "";
  const rest = md.slice(m.index + m[0].length);
  const end = rest.search(/^##\s/m);
  return end === -1 ? rest : rest.slice(0, end);
}

function mermaidBlocks(text) {
  return [...text.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)].map((m) => m[1]);
}

// Removes node labels and edge labels so only node ids and arrows remain.
function skeleton(mermaid) {
  return mermaid
    .split("\n")
    .filter((line) => !/^\s*(%%|flowchart|graph|subgraph|end\s*$|classDef|class\s|style\s|direction\s)/.test(line))
    .map((line) => {
      let s = line.replace(/"[^"]*"/g, "");
      let prev;
      do {
        prev = s;
        s = s
          .replace(/\[[^\[\]]*\]/g, "")
          .replace(/\([^()]*\)/g, "")
          .replace(/\{[^{}]*\}/g, "")
          .replace(/>[^\]\n]*\]/g, "")
          .replace(/\|[^|]*\|/g, "");
      } while (s !== prev);
      return s.replace(/--\s+[^\n]*?\s+-->/g, "-->").replace(/-\.\s+[^\n]*?\s+\.->/g, "-.->");
    })
    .join("\n");
}

function arrowCount(mermaid) {
  return (skeleton(mermaid).match(/(-->|-\.->|==>|---)/g) || []).length;
}

function nodeIds(mermaid) {
  const ids = new Set();
  for (const token of skeleton(mermaid).split(/-->|-\.->|==>|---|&|\s+/)) {
    const t = token.trim();
    if (/^[A-Za-z_][\w-]*$/.test(t)) ids.add(t);
  }
  return ids;
}

function diagramStatus(text, minArrows, minNodes) {
  const blocks = mermaidBlocks(text);
  const hasImage = /!\[[^\]]*\]\([^)]+\)/.test(text);
  if (blocks.length === 0) {
    return hasImage
      ? { ok: true, detail: "image of a sketch found (consider converting it to Mermaid for Advanced)" }
      : { ok: false, detail: "add a ```mermaid block (or a photo of your sketch)" };
  }
  const block = blocks[0];
  if (/TODO/.test(block)) return { ok: false, detail: "still has the TODO starter. Replace it with your diagram" };
  const arrows = arrowCount(block);
  const nodes = nodeIds(block).size;
  if (arrows < minArrows || nodes < minNodes) {
    return { ok: false, detail: `found ${nodes} boxes and ${arrows} arrows; aim for at least ${minNodes} boxes and ${minArrows} arrows` };
  }
  return { ok: true, detail: `${nodes} boxes, ${arrows} arrows` };
}

function tableRows(text) {
  return text
    .split("\n")
    .filter((l) => /^\s*\|/.test(l))
    .slice(2) // header + separator
    .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
}

function filledRows(text, skipFirstColumn) {
  return tableRows(text).filter((cells) => {
    const cols = skipFirstColumn ? cells.slice(1) : cells;
    return cols.length > 0 && cols.every((c) => c.length > 0 && !/^_+$/.test(c));
  });
}

const design = read("DESIGN.md");
const review = read("PEER_REVIEW.md");

const storyText = section(design, "User Story");
const storyLine = (storyText.match(/^>\s*(.+)$/m) || [])[1] || "";
const storyOk = /as an?\s+\S/i.test(storyLine) && /i want/i.test(storyLine) && /so that/i.test(storyLine) && !/___/.test(storyLine);

const checklistText = section(design, "Design Checklist");
const checklistItems = [...checklistText.matchAll(/^- \*\*(.+?):\*\*(.*)$/gm)];
const checklistFilled = checklistItems.filter((m) => m[2].trim().length > 0).length;

const workflow = diagramStatus(section(design, "Workflow"), 4, 5);
const components = diagramStatus(section(design, "Component"), 3, 4);

const interfaceRows = filledRows(section(design, "Interfaces"), true);

const contractDir = path.join(DIR, "contract");
const schemas = fs.existsSync(contractDir) ? fs.readdirSync(contractDir).filter((f) => f.endsWith(".schema.json")) : [];
const placeholderSchemas = schemas.filter((f) => f.startsWith("RENAME-ME"));
const validator = spawnSync(process.execPath, [path.join(__dirname, "validate-contract.js"), contractDir], {
  cwd: ROOT,
  encoding: "utf8",
});
const validExamples = fs.existsSync(path.join(contractDir, "examples"))
  ? fs.readdirSync(path.join(contractDir, "examples")).filter((f) => /\.valid.*\.json$/.test(f))
  : [];

const traceRows = filledRows(section(design, "Traceability"), false);

const reviewFilled = (review.match(/^- \*\*.+?:\*\*[ \t]*\S.*$/gm) || []).length;

const checks = [
  { label: "User story in the right format", ok: storyOk, detail: storyOk ? storyLine : "> As a [role], I want [feature], so that [benefit]." },
  { label: "Design Checklist filled in", ok: checklistItems.length > 0 && checklistFilled === checklistItems.length, detail: `${checklistFilled}/${checklistItems.length || 6} items` },
  { label: "Workflow diagram (steps, order, a failure path)", ok: workflow.ok, detail: workflow.detail },
  { label: "Component diagram (3-4+ parts, connected)", ok: components.ok, detail: components.detail },
  { label: "At least one interface named", ok: interfaceRows.length >= 1, detail: `${interfaceRows.length} interface row(s) filled` },
  {
    label: "Contract file(s) in contract/",
    ok: schemas.length > 0 && placeholderSchemas.length === 0,
    detail: placeholderSchemas.length ? "rename RENAME-ME.schema.json to describe your interface" : schemas.join(", ") || "none yet",
  },
  {
    label: "Contract passes npm run validate (with a valid example)",
    ok: validator.status === 0 && validExamples.length > 0 && schemas.length > placeholderSchemas.length,
    detail:
      schemas.length === placeholderSchemas.length
        ? "write your own contract first (the starter file doesn't count)"
        : validator.status === 0
        ? `${validExamples.length} valid example(s)`
        : "run `npm run validate` to see what to fix",
  },
  { label: "Traceability table: 3+ rows from story to field", ok: traceRows.length >= 3, detail: `${traceRows.length} complete row(s)` },
  { label: "Peer review feedback recorded (Application)", ok: reviewFilled >= 3, detail: reviewFilled >= 3 ? "recorded" : "fill in PEER_REVIEW.md after the swap" },
];

console.log("");
console.log(`T7B Design Artifact Self-Check (${path.relative(ROOT, DIR) || "."})`);
console.log("=".repeat(50));
for (const c of checks) {
  console.log((c.ok ? "[DONE] " : "[TODO] ") + c.label);
  console.log("       " + c.detail);
}
const done = checks.filter((c) => c.ok).length;
console.log("");
console.log(`${done}/${checks.length} done.`);
console.log(
  done === checks.length
    ? "Artifact is complete. Now push for clarity: could a developer build this without asking you a question?"
    : "Keep going. Every [TODO] is a next step, not a failure."
);
console.log("");
