// =====================================================================
// Defect burndown.   npm run burndown
// =====================================================================
//
// Reads the defect table in DEFECT_BURNDOWN.md and draws how many defects
// were open on each day, from the Found and Fixed dates. A healthy
// burndown trends toward zero demo-blocking defects before you present.
// =====================================================================

const path = require("path");
const md = require("../scripts/lib/md");

function parseDefects(text) {
  return md
    .tableRows(md.section(text, "Defects"))
    .filter((c) => c.slice(1).some((x) => x))
    .map(([id, defect, severity, blocking, found, fixed, owner, status]) => ({
      id, defect, severity, blocking: /^y/i.test(blocking || ""), found, fixed, owner, status,
    }));
}

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || "");

function burndown(defects) {
  const dates = [...new Set(defects.flatMap((d) => [d.found, d.fixed]).filter(isDate))].sort();
  return dates.map((day) => {
    const open = defects.filter((d) => isDate(d.found) && d.found <= day && !(isDate(d.fixed) && d.fixed <= day));
    return { day, open: open.length, blocking: open.filter((d) => d.blocking).length };
  });
}

if (require.main === module) {
  const text = md.read(path.join(__dirname, ".."), "DEFECT_BURNDOWN.md");
  const defects = parseDefects(text);
  if (!defects.length) {
    console.log("\nNo defects in DEFECT_BURNDOWN.md yet. Log every bug you find in rehearsal.\n");
    process.exit(0);
  }
  console.log("\nDefect burndown   # = open   ! = demo-blocking\n");
  for (const row of burndown(defects)) {
    const bar = "!".repeat(row.blocking) + "#".repeat(row.open - row.blocking);
    console.log(`${row.day}  ${bar.padEnd(20)} ${row.open} open, ${row.blocking} blocking`);
  }
  const openBlocking = defects.filter((d) => d.blocking && !isDate(d.fixed));
  console.log(
    openBlocking.length
      ? `\nNOT READY: open demo-blocking defects: ${openBlocking.map((d) => d.id).join(", ")}\n`
      : "\nNo open demo-blocking defects.\n"
  );
}

module.exports = { parseDefects, burndown };
