// Artifact self-check for T12A. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const path = require("path");
const md = require("./lib/md");

const ROOT = path.join(__dirname, "..");

const worksheet = md.read(ROOT, "CONTRAST_WORKSHEET.md");
const beforeAfter = md.read(ROOT, "BEFORE_AFTER.md");
const quickstart = md.read(ROOT, "QUICKSTART_VALIDATION.md");
const station = md.read(ROOT, "SHOWCASE_STATION_CHECKLIST.md");

const score = (label) => {
  const m = md.read(ROOT, `evidence/audit-${label}.txt`).match(/SCORE: (\d+)\/(\d+)/);
  return m ? { got: Number(m[1]), of: Number(m[2]) } : null;
};
const before = score("before");
const after = score("after");

const problems = md.filledRows(md.section(worksheet, "Spot the problems"));
const prUrl = md.field(beforeAfter, "Pull request URL");
const releaseField = md.field(beforeAfter, "Release tag");
const boxes = md.checkboxes(station);
const checked = boxes.filter((b) => b.checked).length;

const checks = [
  {
    label: "Contrast: 60-second test + 4 problems spotted",
    ok: md.allFieldsFilled(md.section(worksheet, "60-second employer test")) && problems.length >= 4,
    detail: `${problems.length}/4 problems`,
  },
  { label: "Your repo audited BEFORE changes", ok: Boolean(before), detail: before ? `${before.got}/${before.of}` : "npm run audit -- ../my-portfolio --label before" },
  { label: "Your repo audited AFTER changes", ok: Boolean(after), detail: after ? `${after.got}/${after.of}` : "npm run audit -- ../my-portfolio --label after" },
  {
    label: "Score went up",
    ok: Boolean(before && after && after.got > before.got),
    detail: before && after ? `${before.got} → ${after.got}` : "needs both audits",
  },
  { label: "Pull request showing the improvements", ok: /github\.com\/\S+\/pull\/\d+/.test(prUrl), detail: prUrl || "paste the PR URL in BEFORE_AFTER.md" },
  { label: "Tagged release", ok: /v?\d+\.\d+\.\d+/.test(releaseField), detail: releaseField || "git tag -a v1.0.0, then create a release" },
  { label: "Before/after: what changed + reviewer feedback", ok: md.allFieldsFilled(md.section(beforeAfter, "What changed")) && md.allFieldsFilled(md.section(beforeAfter, "Reviewer feedback")), detail: "BEFORE_AFTER.md" },
  { label: "Quickstart validated by a peer", ok: md.allFieldsFilled(md.section(quickstart, "Quickstart Validation").split("## After the fix")[0]), detail: "your peer fills this in" },
  { label: "Showcase station checklist", ok: boxes.length > 0 && checked === boxes.length, detail: `${checked}/${boxes.length} checked (finish the rest before the showcase)` },
];

md.report("T12A Artifact Self-Check", checks, "Artifact is complete. Last test: show your repo to someone for 60 seconds. What do they remember?");
