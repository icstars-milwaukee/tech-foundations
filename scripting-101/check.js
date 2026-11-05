// Scripting 101 checker — you don't need to edit this file.
//
//   node check.js 02     check one exercise
//   node check.js all    check everything
//
// It runs your script, then compares what it printed and the files it wrote
// against tests/expected/. Read the first mismatch it shows you and fix that.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert');

const ROOT = __dirname;
const DIR = process.env.EXERCISES_DIR || 'exercises';
const EXPECTED = path.join(ROOT, 'tests', 'expected');

const clean = s => s.replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();
const expected = name => fs.readFileSync(path.join(EXPECTED, name), 'utf8');

function run(file, args = [], cwd = ROOT) {
  const full = path.resolve(ROOT, DIR, file);
  if (!fs.existsSync(full)) throw new Error(`Can't find ${DIR}/${file}`);
  const r = spawnSync(process.execPath, [full, ...args], { cwd, encoding: 'utf8' });
  return { out: clean(r.stdout || ''), err: clean(r.stderr || ''), code: r.status };
}

function mustRun(file, args) {
  const r = run(file, args);
  if (r.code !== 0) throw new Error(`Your script crashed or exited with code ${r.code}.\n${r.err}`);
  return r;
}

function compareText(label, want, got) {
  const w = clean(want).split('\n');
  const g = clean(got).split('\n');
  for (let i = 0; i < Math.max(w.length, g.length); i++) {
    if (w[i] !== g[i]) {
      throw new Error(
        `${label} differs at line ${i + 1}\n` +
        `    expected: ${w[i] === undefined ? '(nothing — your output has extra lines)' : JSON.stringify(w[i])}\n` +
        `    got:      ${g[i] === undefined ? '(nothing — your output is missing lines)' : JSON.stringify(g[i])}`
      );
    }
  }
}

function readOutput(name) {
  const p = path.join(ROOT, 'output', name);
  if (!fs.existsSync(p)) throw new Error(`Your script didn't create output/${name}`);
  return fs.readFileSync(p, 'utf8');
}

function removeOutput(name) {
  fs.rmSync(path.join(ROOT, 'output', name), { force: true });
}

function compareJson(name) {
  const raw = readOutput(name);
  let got;
  try { got = JSON.parse(raw); }
  catch (e) { throw new Error(`output/${name} isn't valid JSON: ${e.message}`); }
  const want = JSON.parse(expected(fileFor(name)));
  if (!Array.isArray(got)) throw new Error(`output/${name} should be an array — yours is ${typeof got}`);
  if (got.length !== want.length) throw new Error(`Expected ${want.length} items in output/${name}, got ${got.length}`);
  want.forEach((w, i) => {
    try { assert.deepStrictEqual(got[i], w); }
    catch {
      throw new Error(
        `Item ${i + 1} in output/${name} doesn't match\n` +
        `    expected: ${JSON.stringify(w)}\n` +
        `    got:      ${JSON.stringify(got[i])}\n` +
        `    (check key names, spelling, and whether numbers are numbers, not strings)`
      );
    }
  });
}

const fileFor = name => ({ 'interns.json': '02-interns.json', 'attendees.json': '04-attendees.json' })[name];

const checks = {
  '01': () => {
    const r = mustRun('01-file-stats.js');
    compareText('Your printed output', expected('01-stdout.txt'), r.out);
  },
  '02': () => {
    removeOutput('interns.json');
    mustRun('02-csv-to-json.js');
    compareJson('interns.json');
  },
  '03': () => {
    removeOutput('events.csv');
    mustRun('03-json-to-csv.js');
    compareText('output/events.csv', expected('03-events.csv'), readOutput('events.csv'));
  },
  '04': () => {
    removeOutput('attendees.json');
    const r = mustRun('04-clean-signups.js');
    compareJson('attendees.json');
    compareText('Your printed summary', expected('04-stdout.txt'), r.out);
  },
  '05': () => {
    const r = mustRun('05-summarize-hours.js');
    compareText('Your printed output', expected('05-stdout.txt'), r.out);
  },
  '06': () => {
    const noArg = run('06-organize-files.js');
    if (noArg.code === 0) throw new Error('With no folder given, your script should print a usage message and exit with a non-zero code.');
    if (!/usage/i.test(noArg.out + noArg.err)) throw new Error('With no folder given, print a message that starts with "Usage:".');

    const missing = run('06-organize-files.js', ['data/does-not-exist']);
    if (missing.code === 0) throw new Error('With a folder that does not exist, your script should exit with a non-zero code.');

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scripting101-'));
    const target = path.join(tmp, 'messy-folder');
    fs.cpSync(path.join(ROOT, 'data', 'messy-folder'), target, { recursive: true });
    const before = fs.readdirSync(target).sort();

    const dry = mustRun('06-organize-files.js', [target, '--dry-run']);
    if (JSON.stringify(fs.readdirSync(target).sort()) !== JSON.stringify(before)) {
      throw new Error('--dry-run moved files. A dry run should only print what it WOULD do.');
    }
    if (!/would move 7 files/i.test(dry.out)) throw new Error('A dry run should end with "Would move 7 files".');

    const real = mustRun('06-organize-files.js', [target]);
    if (!/moved 7 files/i.test(real.out)) throw new Error('The real run should end with "Moved 7 files".');
    const want = { documents: ['notes.txt', 'resume.pdf', 'todo.txt'], images: ['headshot.png', 'photo.JPG'], spreadsheets: ['budget.xlsx'], other: ['README'] };
    for (const [folder, files] of Object.entries(want)) {
      const p = path.join(target, folder);
      if (!fs.existsSync(p)) throw new Error(`Expected a "${folder}" folder to be created.`);
      const got = fs.readdirSync(p).sort();
      if (JSON.stringify(got) !== JSON.stringify([...files].sort())) {
        throw new Error(`"${folder}" should contain ${files.join(', ')} — it has ${got.join(', ') || 'nothing'}.`);
      }
    }
    const leftover = fs.readdirSync(target).filter(n => !fs.statSync(path.join(target, n)).isDirectory());
    if (leftover.length) throw new Error(`These files weren't moved: ${leftover.join(', ')}`);
    fs.rmSync(tmp, { recursive: true, force: true });
  },
  '07': () => {
    removeOutput('report.md');
    const noArg = run('07-report.js');
    if (noArg.code === 0) throw new Error('With no file given, print a usage message and exit with a non-zero code.');
    mustRun('07-report.js', ['data/hours.csv']);
    compareText('output/report.md', expected('07-report.md'), readOutput('report.md'));
  },
};

const arg = (process.argv[2] || '').padStart(2, '0');
const ids = process.argv[2] === 'all' ? Object.keys(checks) : [arg];
if (!checks[ids[0]]) {
  console.log('Usage: node check.js <exercise number>   e.g.  node check.js 02');
  console.log('       node check.js all');
  process.exit(1);
}

let passed = 0;
for (const id of ids) {
  try {
    checks[id]();
    console.log(`✅ Exercise ${id} passed`);
    passed++;
  } catch (e) {
    console.log(`❌ Exercise ${id}\n   ${e.message.replace(/\n/g, '\n   ')}`);
  }
}
if (ids.length > 1) console.log(`\n${passed}/${ids.length} passing`);
process.exit(passed === ids.length ? 0 : 1);
