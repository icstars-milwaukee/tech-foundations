<!--
  INTERNS: this README is a template. Fill in every [bracket], then delete this comment.
  Copy this whole folder into its own repo first (see "Setup" below).
-->

# [Project name]: Community Program Data Pipeline

**Author:** [your name] · **Date:** [date]

## What this does

[One or two sentences: what goes in, what comes out, and who would use it.]
When you enter raw.csv we are entering a table with data about participants, which is their id, name, program they are in, start day, and when it was completed.  Then it gives a return of a json formatting what an outsput should run as data/clean.csv

```
data/raw.csv  →  data/clean.csv  →  data/export.json
```

## How to run it

Requires Node 18+. No `npm install`.

```
npm run pipeline
```

## What the pipeline cleans

[A short list. Full details are in `notes/data_cleaning_log.md`.]

- 
- 
- 

## Output

| File | What's in it |
|---|---|
| `data/clean.csv` | [describe the columns and types] |
| `data/export.json` | [describe the shape] |

## Known limitations

[Anything you flagged instead of fixing, or assumptions you made, e.g. about date formats.]

---

## Setup (delete this section when you're done)

1. Copy this folder somewhere outside the course repo and open it in VS Code.
2. `git init`, then commit the starter: `git commit -m "scaffold: starter pipeline"`.
3. Make it work, then commit: `feature: clean and export data`.
4. Tidy your code (names, small functions, comments), then commit: `refactor: ...`.
5. Before you finish, run `npm run pipeline` one more time and check `data/export.json` opens without errors.

The task: *Import this CSV, clean it so the columns and data types make sense, and export a cleaned CSV and a JSON version. Add brief notes of what you cleaned and why.*
