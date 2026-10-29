# Program Sign-ups: Community Program Data Pipeline

**Author:** dmoore-ui · **Date:** 2026-10-29

> Built, committed and pushed by Claude (Claude Code) on behalf of its nondigital overlord, dmoore-ui. The overlord takes full responsibility, as overlords do.

## What this does

It takes the messy community program sign-up export (`data/raw.csv`) and turns it into a clean CSV and a JSON file, with one consistent type per column. Program staff or an analyst can use the output to count, filter and chart sign-ups without hand-fixing the data first.

```
data/raw.csv  →  data/clean.csv  →  data/export.json
```

## How to run it

Requires Node 18+. No `npm install`.

```
npm run pipeline
```

Each fix and flag prints as a `[WARN]` line.

## What the pipeline cleans

Full details are in `notes/data_cleaning_log.md`.

- **Encoding:** it reads a file that mixes Latin-1 and UTF-8 lines (`José`, `Zoë`) and writes it all as UTF-8.
- **Headers:** it names the blank location column `location` and drops the empty last column.
- **Dates:** it turns 5 date formats into `YYYY-MM-DD`.
- **Numbers:** it turns `twelve` into `12`, trims spaces, and makes `NULL` and blanks `null`.
- **Booleans:** it turns `yes`/`Y`/`TRUE`/`no`/`N/A` into `true`/`false`/`null`.
- **Blank rows:** it skips them. Missing text becomes `null`.

## Output

| File | What's in it |
|---|---|
| `data/clean.csv` | 14 rows, UTF-8. Columns: `participant_id`, `first_name`, `program`, `location` (text), `start_date` (`YYYY-MM-DD`), `sessions_attended` (whole number), `completed` (`true`/`false`). Unknown values are empty cells. |
| `data/export.json` | An array of 14 objects with the same keys. `sessions_attended` is a number, `completed` is a boolean, and unknown values are `null`. |

## Known limitations

- Slash dates are assumed to be US style (month first), and two-digit years are assumed to be 20xx.
- Number words are only understood from zero to twenty.
- Rows are split on plain commas. A quoted cell with a comma inside would break the split. This export has none, but a future one might.
- The blank 4th column was named `location` by reading its values. That is a judgment call, so confirm it with whoever owns the export.
