// Small helpers the artifact self-checks use to read Markdown worksheets.
// You don't need to edit this file.

const fs = require("fs");
const path = require("path");

function read(root, rel) {
  try {
    return fs.readFileSync(path.join(root, rel), "utf8");
  } catch {
    return "";
  }
}

function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Text under a heading that starts with `name` (any level), up to the next
// heading of the same or higher level.
function section(md, name) {
  const re = new RegExp("^(#{1,6})\\s+(?:\\d+\\.\\s*)?" + escape(name) + ".*$", "im");
  const m = md.match(re);
  if (!m) return "";
  const level = m[1].length;
  const rest = md.slice(m.index + m[0].length);
  const end = rest.search(new RegExp("^#{1," + level + "}\\s", "m"));
  return end === -1 ? rest : rest.slice(0, end);
}

// Lines like:  - **Label:** value
function fields(text) {
  return [...text.matchAll(/^\s*- \*\*(.+?):\*\*[ \t]*(.*)$/gm)].map((m) => ({
    label: m[1].trim(),
    value: m[2].trim(),
  }));
}

function isBlank(value) {
  return value.length === 0 || /^_+$/.test(value) || /^TODO\b/i.test(value);
}

function filledFields(text) {
  return fields(text).filter((f) => !isBlank(f.value));
}

// True when every "- **Label:**" line in the text has an answer.
function allFieldsFilled(text) {
  const all = fields(text);
  return all.length > 0 && all.every((f) => !isBlank(f.value));
}

function field(text, label) {
  const f = fields(text).find((x) => x.label.toLowerCase().startsWith(label.toLowerCase()));
  return f && !isBlank(f.value) ? f.value : "";
}

// Lines like:  - [ ] something   or   - [x] something
function checkboxes(text) {
  return [...text.matchAll(/^\s*- \[( |x|X)\][ \t]*(.*)$/gm)].map((m) => ({
    checked: m[1] !== " ",
    text: m[2].trim(),
  }));
}

function fencedBlocks(text) {
  return [...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map((m) => m[1].trim());
}

function isPlaceholderBlock(body) {
  return body.length === 0 || /^(TODO|PASTE\b)/i.test(body);
}

// Table rows after the header + separator. Each row is an array of cells.
function tableRows(text) {
  return text
    .split("\n")
    .filter((l) => /^\s*\|/.test(l))
    .filter((l) => !/^\s*\|[\s:|-]+\|\s*$/.test(l))
    .slice(1)
    .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
}

// Rows where every cell (optionally skipping the first column) has text.
function filledRows(text, { skipFirst = false } = {}) {
  return tableRows(text).filter((cells) => {
    const cols = skipFirst ? cells.slice(1) : cells;
    return cols.length > 0 && cols.every((c) => c.length > 0 && !/^_+$/.test(c));
  });
}

// Spots data that looks personal. Placeholder domains (example.com) are fine.
function findPersonalData(text) {
  const hits = [];
  for (const m of text.matchAll(/[\w.+-]+@([\w-]+\.)+[a-z]{2,}/gi)) {
    if (!/@example\.(com|org|net)$/i.test(m[0])) hits.push(m[0]);
  }
  for (const m of text.matchAll(/\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g)) hits.push(m[0]);
  for (const m of text.matchAll(/\b\d{3}-\d{2}-\d{4}\b/g)) hits.push(m[0]);
  for (const m of text.matchAll(/\b\d{8}\b/g)) hits.push(m[0] + " (ID number?)");
  return [...new Set(hits)];
}

function report(title, checks, doneMessage) {
  console.log("");
  console.log(title);
  console.log("=".repeat(title.length));
  for (const c of checks) {
    console.log((c.ok ? "[DONE] " : "[TODO] ") + c.label);
    if (c.detail) console.log("       " + c.detail);
  }
  const done = checks.filter((c) => c.ok).length;
  console.log("");
  console.log(`${done}/${checks.length} done.`);
  console.log(done === checks.length ? doneMessage : "Keep going. Every [TODO] is a next step, not a failure.");
  console.log("");
}

module.exports = {
  read,
  section,
  fields,
  filledFields,
  allFieldsFilled,
  field,
  checkboxes,
  fencedBlocks,
  isPlaceholderBlock,
  tableRows,
  filledRows,
  findPersonalData,
  report,
};
