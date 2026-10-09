// Artifact self-check for T7A. Run:  npm run check
//
// This does NOT grade you. It tells you whether the pieces of the
// artifact are there so you and your trainer can talk about quality.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

function read(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return "";
  }
}

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

// Finds names of functions declared as `function name(` or `const name = (...) =>` / `= function`.
function functionNames(src) {
  const code = stripComments(src);
  const names = new Set();
  const patterns = [
    /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g,
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(code))) names.add(m[1]);
  }
  return [...names];
}

function isCalled(src, name) {
  const code = stripComments(src);
  const safe = name.replace(/\$/g, "\\$");
  const uses = (code.match(new RegExp("(?<![\\w$.])" + safe + "\\s*\\(", "g")) || []).length;
  // `function name(` matches once for the declaration itself; that isn't a call.
  const declarations = (code.match(new RegExp("\\bfunction\\s+" + safe + "\\s*\\(", "g")) || []).length;
  return uses - declarations >= 1;
}

function debugLogSectionFilled(md, heading) {
  const start = md.indexOf(heading);
  if (start === -1) return false;
  const rest = md.slice(start + heading.length);
  const end = rest.search(/\n## /);
  const section = end === -1 ? rest : rest.slice(0, end);
  const steps = ["Reproduce", "Inspect logs", "Add logs", "Hypothesize", "Fix", "Verify", "Commit"];
  return steps.every((step) => {
    const m = section.match(new RegExp("\\*\\*" + step + ":\\*\\*(.*)"));
    return m && m[1].trim().length > 0;
  });
}

const practice = read("practice/sales-report.js");
const apply = read("apply/my-function.js");
const debugLog = read("DEBUG_LOG.md");

const practiceFns = functionNames(practice);
const calledFns = practiceFns.filter((n) => isCalled(practice, n));
const applyFns = functionNames(apply);

const tests = spawnSync(process.execPath, ["--test", path.join("test", "sales-report.test.js")], {
  cwd: ROOT,
  encoding: "utf8",
});

const git = spawnSync("git", ["log", "--format=%s"], { cwd: ROOT, encoding: "utf8" });
const gitOk = git.status === 0;
const commits = gitOk ? git.stdout.split("\n").filter(Boolean) : [];
const fixCommits = commits.filter((s) => /^fix:\s*root cause\b/i.test(s));

const checks = [
  {
    label: "Practice: at least 2 reusable functions",
    ok: practiceFns.length >= 2,
    detail: practiceFns.length ? "found: " + practiceFns.join(", ") : "no functions found yet",
  },
  {
    label: "Practice: functions are actually called",
    ok: calledFns.length >= 2,
    detail: calledFns.length ? "called: " + calledFns.join(", ") : "define them, then call them",
  },
  {
    label: "Practice: error handling with try/catch",
    ok: /\btry\s*\{/.test(stripComments(practice)) && /\bcatch\s*(\(|\{)/.test(stripComments(practice)),
    detail: "wrap the risky part (reading/parsing the file)",
  },
  {
    label: "Practice: uses the logging standard (src/logger.js)",
    ok: /require\(\s*["'`][^"'`]*logger["'`]\s*\)/.test(practice),
    detail: 'const log = require("../src/logger");',
  },
  {
    label: "Practice: fixes are explained with // FIX: comments",
    ok: /\/\/\s*FIX:[ \t]*\S/.test(practice),
    detail: "mark each fixed line, e.g. // FIX: loop ran one past the end",
  },
  {
    label: "Verify: npm test passes",
    ok: tests.status === 0,
    detail: tests.status === 0 ? "all tests pass" : "run `npm test` to see which ones fail",
  },
  {
    label: "Application: your own function in apply/my-function.js",
    ok: applyFns.length >= 1,
    detail: applyFns.length ? "found: " + applyFns.join(", ") : "no function found yet",
  },
  {
    label: "DEBUG_LOG.md: Bug 1 has all 7 ritual steps filled in",
    ok: debugLogSectionFilled(debugLog, "## Bug 1"),
    detail: "Reproduce, Inspect logs, Add logs, Hypothesize, Fix, Verify, Commit",
  },
  {
    label: 'Git: at least one "fix: root cause ..." commit',
    ok: fixCommits.length >= 1,
    detail: !gitOk
      ? "couldn't read git history. Is this folder a git repo? (git init)"
      : fixCommits.length
      ? fixCommits.map((s) => '"' + s + '"').join(", ")
      : 'commit a fix with: git commit -m "fix: root cause ..."',
  },
];

console.log("");
console.log("T7A Artifact Self-Check");
console.log("=======================");
for (const c of checks) {
  console.log((c.ok ? "[DONE] " : "[TODO] ") + c.label);
  console.log("       " + c.detail);
}
const done = checks.filter((c) => c.ok).length;
console.log("");
console.log(`${done}/${checks.length} done.`);
if (done === checks.length) {
  console.log("Artifact is complete. Now make it good: clear names, clear comments, detailed commits.");
} else {
  console.log("Keep going. Every [TODO] is a next step, not a failure.");
}
console.log("");
