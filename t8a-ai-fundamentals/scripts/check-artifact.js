// Artifact self-check for T8A. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there, and warns you if personal data slipped in.

const path = require("path");
const md = require("./lib/md");

const ROOT = path.join(__dirname, "..");

const cookbook = md.read(ROOT, "cookbook/PROMPT_COOKBOOK.md");
const checklist = md.read(ROOT, "checklist/RESPONSIBLE_USE.md");
const baseline = md.read(ROOT, "baseline/BASELINE_VS_AI.md");
const caseNotes = md.read(ROOT, "case-studies/CASE_NOTES.md");

// --- Cookbook: Recipe 1..N (the example recipe doesn't count) ---
const recipeHeadings = [...cookbook.matchAll(/^## (Recipe \d+.*)$/gm)].map((m) => m[1]);
const completeRecipes = recipeHeadings.filter((h) => {
  const text = md.section(cookbook, h);
  const prompt = md.fencedBlocks(text)[0] || "";
  const required = ["Name", "Goal", "Sample result", "What I checked", "Risks to watch"];
  return !md.isPlaceholderBlock(prompt) && required.every((label) => md.field(text, label));
});
const peerTested = recipeHeadings.filter((h) => md.field(md.section(cookbook, h), "Peer test"));

// --- Checklist: items the learner added ---
const additions = md.checkboxes(md.section(checklist, "Our additions")).filter((c) => c.text.length > 0);

// --- Baseline vs AI ---
const baselineRows = md.filledRows(md.section(baseline, "1. Baseline"));
const cleaned = md.field(md.section(baseline, "2. Clean"), "Private details I removed");
const aiBlocks = md.fencedBlocks(md.section(baseline, "3. AI version"));
const aiDone = aiBlocks.length >= 2 && aiBlocks.every((b) => !md.isPlaceholderBlock(b));
const compareText = md.section(baseline, "4. Compare");
const compareRows = md.filledRows(compareText, { skipFirst: false });
const compareDone = compareRows.length >= 4 && md.field(compareText, "My decision");

// --- Case notes ---
const caseDone = md.allFieldsFilled(md.section(caseNotes, "Case Study Notes").split("## Notes from")[0]);

// --- Personal data scan over everything the learner writes ---
const pii = md.findPersonalData([cookbook, checklist, baseline.split("## 1. Baseline")[1] || "", caseNotes].join("\n"));

const checks = [
  {
    label: "Cookbook: 3+ complete recipes (prompt, result, what you checked, risks)",
    ok: completeRecipes.length >= 3,
    detail: `${completeRecipes.length} complete: ${completeRecipes.join(", ") || "none yet"}`,
  },
  {
    label: "Cookbook: at least one recipe peer-tested",
    ok: peerTested.length >= 1,
    detail: peerTested.length ? peerTested.join(", ") : "swap with a partner and fill in a Peer test line",
  },
  {
    label: "Checklist: 2+ items you added",
    ok: additions.length >= 2,
    detail: `${additions.length} added under "Our additions"`,
  },
  {
    label: "Baseline: your own version first (no AI)",
    ok: baselineRows.length >= 2 && Boolean(md.field(md.section(baseline, "1. Baseline"), "Time taken")),
    detail: `${baselineRows.length} action item row(s); record your time too`,
  },
  {
    label: "Baseline: private details removed before prompting",
    ok: Boolean(cleaned),
    detail: cleaned ? cleaned : "list what you removed in section 2",
  },
  { label: "Baseline: AI prompt + output pasted", ok: aiDone, detail: "both code blocks in section 3" },
  { label: "Baseline: comparison table + decision", ok: Boolean(compareDone), detail: "fill every row and your accept / edit / reject decision" },
  { label: "Case study notes filled in", ok: caseDone, detail: "case-studies/CASE_NOTES.md" },
  {
    label: "No personal data in your files",
    ok: pii.length === 0,
    detail: pii.length ? "remove or replace: " + pii.join(", ") : "none found",
  },
];

md.report(
  "T8A Artifact Self-Check",
  checks,
  "Artifact is complete. Now sharpen it: would a classmate get a good result from your recipes without asking you anything?"
);
