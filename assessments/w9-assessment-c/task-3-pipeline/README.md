# Program Sign-ups: Community Program Data Pipeline

**Author:** Fernando Gamboa · **Date:** 2026-10-29

## What this does

Reads a messy community program sign-up export (`data/raw.csv`), fixes its headers, types and dates, and writes a clean CSV and a JSON file that program staff can use for reports or load into an app.

```
data/raw.csv  →  data/clean.csv  →  data/export.json
```

## How to run it

Requires Node 18+. No `npm install`.

```
npm run pipeline
```

It logs each key step (start, lines read, rows processed, anomalies found) as `[timestamp] [LEVEL] message`.

## What the pipeline cleans

Full details are in `notes/data_cleaning_log.md`.

- Names the blank `neighborhood` header and drops the empty last column
- Fixes mixed text encoding (`José` was Latin-1, the rest UTF-8) line by line
- Converts `sessions_attended` to numbers (`"twelve"` → `12`, `" 7 "` → `7`)
- Converts every `start_date` to `YYYY-MM-DD`
- Converts `completed` to `true` / `false`
- Turns unknown values (`""`, `NULL`, `N/A`) into `null`
- Skips blank rows and strips Windows line endings

## Output

| File | What's in it |
|---|---|
| `data/clean.csv` | Header row + 14 rows. Columns: `participant_id` (text), `first_name` (text), `program` (text), `neighborhood` (text), `start_date` (YYYY-MM-DD), `sessions_attended` (whole number), `completed` (true/false). Unknown values are empty cells. |
| `data/export.json` | An array of 14 objects, one per participant, with the same 7 keys. Numbers are numbers, booleans are `true`/`false`, unknowns are `null`. |

## Known limitations

- Slash dates are assumed to be US order (month/day/year). `09/15/2026` is unambiguous, but `10/06/2026` could mean June 10 in other countries.
- Two-digit years (`9/29/26`) are assumed to be 20xx.
- Only number words up to "twelve" are recognized; anything else becomes `null` and is logged.
- Values that can't be known (P012's start date, P010's first name, some sessions/completed values) are left as `null`, not guessed.
- The CSV reader splits on commas, so it doesn't handle quoted values that contain commas (none in this file).
