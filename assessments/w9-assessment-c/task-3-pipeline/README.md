<!--
  INTERNS: this README is a template. Fill in every [bracket], then delete this comment.
  Copy this whole folder into its own repo first (see "Setup" below).
-->

# [Project name]: Community Program Data Pipeline

**Author:** Amir Husseini · **Date:** October 29, 2026

## What this does

This project reads a CSV of community program sign-ups, cleans inconsistent dates and values, and exports a cleaned CSV and JSON file. The files can be used for reporting or further data analysis.

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

- Renames the blank site header and removes the unused trailing column.
- Standardizes valid dates and converts session counts to numbers.
- Converts completion values to booleans and represents unknown values as null.
- Skips blank rows and logs data problems that need review.

## Output

| File | What's in it |
|---|---|
| `data/clean.csv` | One row per participant, with consistent column names, ISO-formatted dates, numeric session counts, boolean completion values, and empty cells for nulls. |
| `data/export.json` | An array of participant objects with the same seven fields, using JSON numbers, booleans, and null values. |

## Known limitations

The source data contains a corrupted name (Jos�), which cannot be safely corrected without checking the original source. The word twelve is interpreted as 12 sessions. Missing values remain unknown rather than being replaced with zero. The pipeline logs anomalies, but it does not verify the records against an external source.

---

## Setup (delete this section when you're done)

1. Copy this folder somewhere outside the course repo and open it in VS Code.
2. `git init`, then commit the starter: `git commit -m "scaffold: starter pipeline"`.
3. Make it work, then commit: `feature: clean and export data`.
4. Tidy your code (names, small functions, comments), then commit: `refactor: ...`.
5. Before you finish, run `npm run pipeline` one more time and check `data/export.json` opens without errors.

The task: *Import this CSV, clean it so the columns and data types make sense, and export a cleaned CSV and a JSON version. Add brief notes of what you cleaned and why.*
