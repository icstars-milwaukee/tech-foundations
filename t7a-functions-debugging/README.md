# T7A: Functions, Errors & Debugging

**i.c.stars Tech Foundations · Week 7 · JavaScript**

> Errors aren't failures. They're instructions.

Today you'll take a messy program, turn repeated code into **reusable functions**, and fix its bugs with the **Debug Ritual** instead of guessing. What you build today feeds straight into **Week 9's Performance Assessment C (Programming II)**.

**Standards:** PR.KU1 · PR.SK3 · PR.SK4 · PR.O1

---

## Setup (2 minutes)

You need Node.js 18 or newer and Git. Check in the VS Code terminal:

```bash
node -v
git --version
```

Open this folder in VS Code. If it isn't a git repo yet (you downloaded a zip), run:

```bash
git init
git add .
git commit -m "chore: T7A starter"
```

No `npm install` needed. This project has zero dependencies.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `demo/receipts.js` | Trainer's live demo: messy code to refactor | Concept + Modeling |
| `practice/sales-report.js` | **Your main work.** Messy, buggy, crashes on bad data | Guided Practice |
| `apply/my-function.js` | Write your own function and plant a bug for your partner | Application |
| `src/logger.js` | The logging standard: `[timestamp] [LEVEL] message` | All session |
| `data/` | Good data (`sales.json`) and a broken file (`sales-broken.json`) | Guided Practice |
| `test/` | Automated checks for the **Verify** step | Guided Practice |
| `DEBUG_LOG.md` | Where you document each bug, step by step | All session |

## Commands

| Command | Does |
|---|---|
| `npm run demo` | Runs the trainer demo |
| `npm start` | Runs the sales report with good data |
| `npm run start:broken` | Runs the sales report with a broken data file |
| `npm run start:missing` | Runs the sales report with a file that doesn't exist |
| `npm test` | **Verify:** checks the report's numbers and error handling |
| `npm run apply` | Runs your Application function |
| `npm run check` | Shows which parts of your artifact are done |

---

## The Debug Ritual

Every bug, every time, in this order:

1. **Reproduce.** Run the exact command again. Can you make it happen on purpose?
2. **Inspect logs.** Read the error. Find the file and line number. Read the *first* line, not just the scary part.
3. **Add logs.** Put `log.debug(...)` near the problem and print the values you're unsure about.
4. **Hypothesize.** "I think ___ because ___." One guess at a time.
5. **Fix.** Change one thing. Mark the line with `// FIX: what was wrong`.
6. **Verify.** `npm test`. Did it fix it? Did it break anything else?
7. **Commit.** `git commit -am "fix: root cause <what was actually wrong>"`

Write each step in `DEBUG_LOG.md` as you go.

### Using the logger

```js
const log = require("../src/logger");

log.info("Loaded the data file");
log.debug("i = " + i + ", value = " + sales[i]);
log.warn("Week 2 is empty");
log.error("Could not read data file");
```

```
[2026-10-14T15:04:05.123Z] [DEBUG] i = 6, value = undefined
```

### Functions in JavaScript

```js
// Define it once
function calculateTotal(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total = total + numbers[i];
  }
  return total;
}

// Call it as many times as you need
const week1Total = calculateTotal(data.week1);
const week2Total = calculateTotal(data.week2);
```

A function is a recipe: write it once, follow it every time.

### try / catch in JavaScript

```js
try {
  // code that might throw an error
} catch (err) {
  log.error("Something went wrong: " + err.message);
  process.exitCode = 1; // tell the terminal the program failed
}
```

---

## Guided Practice (pairs, 20 min)

Work in `practice/sales-report.js`. Run `npm start` and `npm test` first so you see the problems before you touch anything.

1. **Refactor.** Week 1 and Week 2 are the same code pasted twice. Pull the repeated work into **at least two functions** and call them for both weeks.
2. **Debug.** Week 2's numbers are wrong. Use the ritual. Heads up: **there's more than one bug**, and fixing the first one reveals the next.
3. **Handle errors.** `npm run start:broken` and `npm run start:missing` crash with stack traces. Add `try/catch` so the program logs an `[ERROR]` line with the logger and exits calmly.
4. **Commit** each bug fix with `fix: root cause ...`.

Keep the report labels (`Week 1 total:`, `Week 2 average:`, etc.) the same. The tests read them.

You're done when `npm test` shows **5 passing**.

## Application (on your own, then swap, 10 min)

Follow the instructions at the top of `apply/my-function.js`:

1. Write one new function of your own (`calculateAverage`, `filterPositiveNumbers`, `countSalesOver`, ...).
2. Plant one realistic bug in it and commit.
3. Swap seats. Debug your partner's bug with the ritual and fill in **Bug 2** in `DEBUG_LOG.md`.
4. Explain to your partner *how* you found it, using the ritual words.

## Before you leave

```bash
npm run check
```

It lists what's done and what's left. Your **artifact** is:

- [ ] Refactored code with **two or more functions**, defined and called
- [ ] **Error handling** (`try/catch`) and **comments** that explain your fixes (`// FIX:`)
- [ ] At least one bug fix captured in a commit: **`fix: root cause ...`**
- [ ] `DEBUG_LOG.md` filled in for at least one bug

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | Code runs with repeated blocks. Functions missing. Errors unresolved. No debugging notes or commits. |
| Emerging | At least one function, incomplete. Errors fixed inconsistently. Ritual not followed. Commit missing or vague. |
| Developing | Two functions written and called correctly. One error debugged with partial ritual. Generic commit message. Minimal comments. |
| **Proficient** | Two or more reusable functions. Error debugged systematically with the ritual. Clear `fix: root cause...` commit. Comments explain fixes. |
| Advanced | Well-structured, reusable functions. Ritual fully documented. Logging standard applied. Detailed commit messages. |

Limited or Emerging? You'll join a 30-minute debugging clinic later this week. That's support, not punishment.

---

**Treat every error as a gift. It's evidence of progress.**
