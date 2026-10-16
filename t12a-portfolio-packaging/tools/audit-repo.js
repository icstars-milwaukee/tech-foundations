// =====================================================================
// Portfolio repo audit.   npm run audit -- <path-to-your-repo> [--label before|after]
// =====================================================================
//
// Scores a repo the way an employer skims it in 60 seconds:
// Can I tell what it is? Can I run it? Is it organized? Is it safe?
//
//   npm run audit -- ../my-project --label before     saves evidence/audit-before.txt
//   npm run audit -- ../my-project --label after      saves evidence/audit-after.txt
//   npm run audit:examples                            weak vs strong example repos
//
// It's a checklist, not a judge. A high score with a confusing README is
// still a confusing README. Read the results, then read your repo.
// =====================================================================

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

function git(dir, args) {
  const r = spawnSync("git", args, { cwd: dir, encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : null;
}

function listFiles(dir) {
  const tracked = git(dir, ["ls-files"]);
  // Only trust the git file list when this folder is the repo's root.
  const top = git(dir, ["rev-parse", "--show-toplevel"]);
  if (tracked !== null && top && path.resolve(top) === path.resolve(dir)) {
    return { files: tracked.split("\n").filter(Boolean), isRepo: true };
  }
  const out = [];
  (function walk(rel) {
    for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      if (entry.name === ".git") continue;
      const p = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(p);
      else out.push(p);
    }
  })("");
  return { files: out, isRepo: false };
}

function audit(dir) {
  const { files, isRepo } = listFiles(dir);
  const readmeName = files.find((f) => /^readme\.md$/i.test(f));
  const readme = readmeName ? fs.readFileSync(path.join(dir, readmeName), "utf8") : "";
  const heading = (re) => new RegExp("^#{1,3}\\s+.*(" + re + ")", "im").test(readme);
  const results = [];
  const add = (area, label, ok, detail) => results.push({ area, label, ok, detail });

  // --- Communicates (README) ---
  const firstPara = readme.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("!["))[0] || "";
  add("README", "README.md exists", Boolean(readmeName), readmeName || "add a README.md at the root");
  add("README", "Says what it is in the first lines", firstPara.split(/\s+/).length >= 8, firstPara ? `"${firstPara.slice(0, 70)}${firstPara.length > 70 ? "..." : ""}"` : "add a one-sentence pitch under the title");
  const imgs = [...readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
  const imgOk = imgs.some((src) => /^https?:/.test(src) || fs.existsSync(path.join(dir, src)));
  add("README", "Screenshot or GIF that loads", imgOk, imgs.length ? (imgOk ? imgs[0] : `image not found: ${imgs[0]}`) : "show, don't tell: add a screenshot");
  add("README", "Quickstart / setup section with commands", heading("quick ?start|getting started|setup|install|run") && /```/.test(readme), "a heading + a code block someone can copy");
  add("README", "Tech stack named", heading("tech|stack|built with|tools"), "what you used, so recruiters can match keywords");
  add("README", "Decisions documented", heading("decision|why|trade-?off") || files.some((f) => /decision|adr/i.test(f)), "why you chose what you chose (docs/DECISIONS.md)");
  add("README", "Your role / what you learned", heading("role|contribut|learned|lessons"), "especially for team projects");

  // --- Packaged (structure) ---
  const rootFiles = files.filter((f) => !f.includes("/"));
  const codeAtRoot = rootFiles.filter((f) => /\.(js|ts|py|java|cs|sql|csv)$/i.test(f) && !/config|setup|index\.js$/i.test(f));
  add("Package", "Code, data, and SQL in folders (not dumped at the root)", codeAtRoot.length <= 1, codeAtRoot.length ? `at root: ${codeAtRoot.slice(0, 4).join(", ")}` : "organized");
  add("Package", "SQL packaged (schema / seed / queries)", files.some((f) => /\.sql$/i.test(f)), files.filter((f) => /\.sql$/i.test(f)).slice(0, 3).join(", ") || "no .sql files (fine if your project has no database; say so in the README)");
  add("Package", "Sample data included (small, made-up)", files.some((f) => /(^|\/)(data|seed|samples?)\//i.test(f) || /\.(csv|json)$/i.test(f) && /sample|seed|data/i.test(f)), "a small sample so the quickstart works");
  add("Package", "Tests included", files.some((f) => /(^|\/)(tests?|__tests__|spec)\/|\.(test|spec)\.\w+$/i.test(f)), "even a few tests show discipline");
  add("Package", "Messy names avoided (final, v2, copy, untitled)", !files.some((f) => /(final|_v\d|copy|untitled|new\s?folder|asdf)/i.test(path.basename(f))), files.filter((f) => /(final|_v\d|copy|untitled|asdf)/i.test(path.basename(f))).slice(0, 3).join(", ") || "clean");

  // --- Safe ---
  add("Safe", ".gitignore present", files.includes(".gitignore"), "ignore node_modules, .env, OS junk");
  const envFiles = files.filter((f) => /(^|\/)\.env(\.[\w-]+)?$/.test(f) && !/example|sample/i.test(f));
  add("Safe", "No .env or secrets files committed", envFiles.length === 0, envFiles.join(", ") || "clean");
  add("Safe", "No node_modules committed", !files.some((f) => f.includes("node_modules/")), "add node_modules/ to .gitignore and remove it from git");
  const big = files.filter((f) => {
    try {
      return fs.statSync(path.join(dir, f)).size > 5 * 1024 * 1024;
    } catch {
      return false;
    }
  });
  add("Safe", "No files over 5 MB", big.length === 0, big.join(", ") || "clean");
  add("Safe", "LICENSE file", files.some((f) => /^licen[cs]e/i.test(f)), "tells others what they may do with your code");

  // --- History (git only) ---
  if (isRepo) {
    const tags = git(dir, ["tag"]) || "";
    add("History", "Tagged release (e.g. v1.0.0)", tags.trim().length > 0, tags.trim().split("\n").filter(Boolean).slice(-3).join(", ") || "git tag -a v1.0.0 -m \"Showcase release\"");
    const subjects = (git(dir, ["log", "-20", "--format=%s"]) || "").split("\n").filter(Boolean);
    const vague = subjects.filter((s) => s.trim().split(/\s+/).length < 3 || /^(update|fix|changes|stuff|wip|asdf|commit|test)\.?$/i.test(s.trim()));
    add("History", "Clear commit messages (last 20)", subjects.length > 0 && vague.length / subjects.length <= 0.25, `${subjects.length - vague.length}/${subjects.length} descriptive`);
  } else {
    add("History", "Tagged release (e.g. v1.0.0)", false, "not a git repo (n/a for the examples)");
    add("History", "Clear commit messages (last 20)", false, "not a git repo (n/a for the examples)");
  }
  return results;
}

function render(dir, results) {
  const score = results.filter((r) => r.ok).length;
  const lines = [`Portfolio audit: ${path.resolve(dir)}`, `Run at ${new Date().toISOString()}`, ""];
  let area = "";
  for (const r of results) {
    if (r.area !== area) lines.push((area = r.area));
    lines.push(`  ${r.ok ? "[x]" : "[ ]"} ${r.label}`);
    if (!r.ok || r.detail) lines.push(`      ${r.detail}`);
  }
  lines.push("", `SCORE: ${score}/${results.length}`);
  return { text: lines.join("\n") + "\n", score, total: results.length };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const labelIdx = args.indexOf("--label");
  const label = labelIdx > -1 ? args[labelIdx + 1] : null;
  const dirs = args.filter((a, i) => !a.startsWith("--") && !(labelIdx > -1 && i === labelIdx + 1));
  if (!dirs.length) {
    console.log("\nUsage: npm run audit -- <path-to-your-repo> [--label before|after]\n");
    process.exitCode = 1;
  }
  for (const d of dirs) {
    const dir = path.resolve(d);
    if (!fs.existsSync(dir)) {
      console.error(`\nNo folder at ${dir}\n`);
      process.exitCode = 1;
      continue;
    }
    const { text } = render(dir, audit(dir));
    console.log("\n" + text);
    if (label) {
      fs.mkdirSync(path.join(ROOT, "evidence"), { recursive: true });
      fs.writeFileSync(path.join(ROOT, "evidence", `audit-${label}.txt`), text);
      console.log(`Saved evidence/audit-${label}.txt\n`);
    }
  }
}

module.exports = { audit, render };
