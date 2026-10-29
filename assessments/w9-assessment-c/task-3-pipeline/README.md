# Sign-Up Cleaner: Community Program Data Pipeline

**Author:** Jose Romero · **Date:** 10/29/2026

## What this does

Reads a messy export of community program sign-ups (mixed date formats, mixed encodings, words in number columns, blank rows), cleans it so every column has one consistent type, and writes a cleaned CSV and a JSON version. It is meant for a program manager who needs numbers they can trust.

```
data/raw.csv  →  data/clean.csv  →  data/export.json
```

## How to run it

Requires Node 18+. No `npm install`.

```
npm run pipeline
```

The pipeline prints a log of each step (`[INFO]`) and every fix or gap it found (`[WARN]`). It never changes `data/raw.csv`.

## What the pipeline cleans

Full details, with row counts and reasons, are in `notes/data_cleaning_log.md`.

- **Encoding:** the file mixes UTF-8 and Latin-1, so each line is decoded on its own ("José" and "Zoë" both come out right).
- **Headers and blank rows:** names the unlabeled `site` column, drops a column with no data, and skips blank rows.
- **Types:** numbers (`"twelve"` → 12), dates (five formats → `YYYY-MM-DD`), and yes/no values (`Y`, `TRUE`, `yes` → `true`); unknown values become `null`.

## Output

| File | What's in it |
|---|---|
| `data/clean.csv` | 14 rows, 7 columns: `participant_id`, `first_name`, `program`, `site`, `start_date` (YYYY-MM-DD), `sessions_attended` (number), `completed` (true/false). Unknown values are empty cells. |
| `data/export.json` | The same 14 records as a JSON array of objects. `sessions_attended` is a number, `completed` is a boolean, and unknown values are `null`. |

## Known limitations

- Dates like `10/06/2026` are read **month first** (US style). The file supports this, but a different file might not.
- Spelled-out numbers only work for zero through twenty.
- P008's missing `site` is left `null` (it is probably Washington Park, but that is a guess), and P010's `first_name` is also `null`.
- Written for this file's columns. A file with different column names would need the column list in `run.js` updated.
