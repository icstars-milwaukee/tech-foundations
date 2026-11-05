# Scripting 101

**i.c.stars Tech Foundations · Practice project**

> If you do it twice by hand, script it the third time.

Seven small JavaScript scripts that do real, boring work for you: counting, converting, cleaning, summarizing, and organizing files.

Each exercise file in `exercises/` tells you **what** to do, step by step. It does **not** tell you **how**. Finding the how — reading docs, searching well, trying things — is the skill you're building.

Everything uses only what comes with Node.js. No npm packages.

## Setup

1. Check Node is installed. In the VS Code terminal, run `node -v`. You need version 18 or newer.
2. Open **this folder** (`scripting-101/`) in VS Code — not the whole tech-foundations repo. No `npm install` needed.
3. Run every command from this folder. If you get `ENOENT: no such file or directory`, you're probably in the wrong folder — `cd scripting-101` and try again.

## How to work an exercise

1. Open the exercise file, e.g. `exercises/02-csv-to-json.js`.
2. Read the whole header: the goal, the input, the expected output.
3. Open the input file in `data/` and look at it.
4. Write the code for **one step**, right under that step's comment.
5. Run it: `node exercises/02-csv-to-json.js`. Use `console.log` to see what you have.
6. Repeat until every step is done.
7. Check it: `node check.js 02`

The checker tells you exactly where your output differs from what's expected. Fix the **first** mismatch, then run it again.

```
node check.js 02      check one exercise
node check.js all     check everything (same as: npm run check)
```

## Exercises

| # | File | You'll learn | Hints |
| --- | --- | --- | --- |
| 1 | `01-file-stats.js` | Reading files, splitting strings, counting | Named |
| 2 | `02-csv-to-json.js` | Turning rows into objects, writing JSON | Named |
| 3 | `03-json-to-csv.js` | Parsing JSON, building CSV, escaping commas | Search phrase |
| 4 | `04-clean-signups.js` | Cleaning messy input, skipping bad rows, de-duplicating | Search phrase |
| 5 | `05-summarize-hours.js` | Grouping, totals, sorting, formatting numbers | Concept only |
| 6 | `06-organize-files.js` | Command-line arguments, folders, moving files | Concept only |
| 7 | `07-report.js` | **Capstone** — all of the above, no hints | None |

Hints fade on purpose:

- **Named** — the exact built-in to look up, like `String.prototype.split`
- **Search phrase** — words to type into a search engine
- **Concept only** — the idea in plain words; you choose what to search
- **None** — just the goal

## How to look things up

Two sites answer almost everything here:

- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) — strings, arrays, objects, JSON
- [Node.js API docs](https://nodejs.org/api/) — files (`fs`), paths (`path`), the command line (`process`)

**Good searches name the language, the type of thing, and what you want to do.**

| Weak | Strong |
| --- | --- |
| how to split | javascript split string into array |
| read file | node read file as text |
| make object | javascript create object from key value pairs |
| remove spaces | javascript remove whitespace from start and end of string |

**Reading a doc page in 60 seconds:**

1. Read the one-line summary. Is this the right tool?
2. Read the **Syntax** box. What goes in?
3. Read the **Return value**. What comes out? Many bugs are a wrong guess here.
4. Copy the smallest example into the REPL and run it. Change one thing. Run it again.

**The REPL:** type `node` in the terminal with no file name. You get a `>` prompt where you can try one line at a time. Type `.exit` to leave.

## Rules

- **No npm packages.** If you think you need one, there's a built-in that does it.
- **Look up functions, not finished answers.** Searching "javascript string split" is the job. Pasting the whole exercise into AI and copying the result is not — you'll hit the capstone with no hints and nothing to show for it.
- **Run after every step.** Small steps, lots of `console.log`.
- **Stuck for 15 minutes?** Write down what you tried and what happened, then ask a neighbor. "I tried X, expected Y, got Z" gets you help fast.
- **Don't edit `check.js` or `tests/`.**

## Troubleshooting

| You see | It usually means |
| --- | --- |
| `ENOENT: no such file or directory` | You're running from the wrong folder, or the path is misspelled |
| `Cannot find module` | Typo in the file name, or you're not in the scripting-101 folder |
| `undefined` where you expected a value | Wrong key name, wrong index, or the variable isn't set yet — `console.log` it |
| `[object Object]` printed | You printed an object inside a string — use `JSON.stringify` or log it on its own |
| A value ends in `\r` | Windows line endings. This repo forces Unix endings, but if you made your own file in Notepad, that's why |
| `"88"` instead of `88` in your JSON | Everything read from a file is text until you convert it |

Moved the files in Exercise 6 for real and want them back?

```
git restore data/messy-folder
git clean -fd data/messy-folder
```
