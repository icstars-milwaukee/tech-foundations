# Sign-Up Cleaner: Community Program Data Pipeline

**Author:** Ventura Perez · **Date:** October 29, 2026

## What this does

It takes the raw community program sign-ups export, which has blank headers, mixed encodings, and the same data written several ways, and turns it into a clean CSV and a JSON file. Program staff can report from them, and an app can load them. Each run also writes a data quality report. It works on any new export with the same kind of columns, not just this one file.

```
data/raw.csv  →  data/clean.csv  →  data/export.json
                 (+ data/quality_report.json)
```

## How to run it

Requires Node 18+. No `npm install`.

```
npm run pipeline
```

### On a new file

```
npm run pipeline -- path/to/new_export.csv               # writes to out/new_export/
npm run pipeline -- path/to/new_export.csv some/folder   # writes to some/folder/
```

To try it, run `npm run pipeline -- samples/new_signups.csv`. That sample is a made-up second export with renamed and reordered headers and some bad rows. A new file gets its own output folder, so it never overwrites `data/`.

Headers can come in any order and with looser spellings (`Participant ID`, `Start Date`, `Sessions`, `Completed?`). If an expected column is missing completely, the pipeline stops with an error and exit code 1 instead of writing bad data.

### Tests

```
npm test
```

7 tests, using Node's built-in test runner. They cover each cleaning function, a full run on `data/raw.csv`, a full run on the sample new file, and the missing-column error.

## What the pipeline cleans

Full details, including why each fix was made, are in [`notes/data_cleaning_log.md`](notes/data_cleaning_log.md).

- **Headers:** names the blank 4th column `neighborhood`, drops the empty trailing column, and matches loosely spelled headers.
- **Encoding:** decodes each line as UTF-8, or as Latin-1 if that fails, so both `José` (Latin-1) and `Zoë` (UTF-8) come through. Also strips Windows `\r\n` endings.
- **Blank rows:** skipped.
- **`sessions_attended`:** becomes a whole number or `null` (`"twelve"` → 12, `" 7 "` → 7, `NULL` → `null`).
- **`start_date`:** 5 formats become `YYYY-MM-DD`, or `null` if unknown or impossible.
- **`completed`:** `yes` / `Y` / `TRUE` / `no` become `true` / `false`, and `N/A` or blank becomes `null`.
- **Blank text and placeholders** (`N/A`, `NULL`) become `null`, never `""`.

Every fix is logged as a `WARN` line, like `Row P002 (line 3): sessions_attended 'twelve' -> 12`.

## Validation and data quality summary

After cleaning, each row goes through these checks:

| Check | If it fails |
|---|---|
| `participant_id` is filled in | **error:** row is left out of the outputs and listed in the report |
| `participant_id` is unique (first one kept) | **error:** same |
| `participant_id` looks like `P001` | warning: row kept and flagged |
| `program` is a known program | warning: row kept and flagged |
| anyone marked completed attended at least 1 session | warning: row kept and flagged |

At the end of each run the pipeline prints a summary and saves it to `quality_report.json`. The summary has row counts in and out, filled/missing/anomaly counts per column, value counts for programs and neighborhoods, ranges for dates and sessions, each check's result, the rejected rows, and every anomaly. Last, the pipeline reads its own outputs back to confirm `export.json` is valid JSON and both files have the same number of records.

## Output

| File | What's in it |
|---|---|
| `data/clean.csv` | 14 rows, 7 columns: `participant_id` (text, e.g. `P001`), `first_name` (text), `program` (text), `neighborhood` (text), `start_date` (date, `YYYY-MM-DD`), `sessions_attended` (whole number), `completed` (`true` / `false`). An empty cell means unknown. Saved as UTF-8 with a byte order mark so Excel shows accented names correctly. |
| `data/export.json` | An array of 14 objects with the same 7 keys. Unknown values are `null`, `sessions_attended` is a JSON number, and `completed` is a JSON boolean. |
| `data/quality_report.json` | The data quality summary described above. |

One record from `export.json`:

```json
{
  "participant_id": "P003",
  "first_name": "José",
  "program": "Homework Help",
  "neighborhood": "Sherman Park",
  "start_date": "2026-09-22",
  "sessions_attended": 10,
  "completed": true
}
```

## Known limitations

- **Slash dates are read as US month/day.** When both numbers are 12 or less (P008's `10/06/2026`), the value is flagged as ambiguous for a person to confirm.
- **Unknowns stay unknown.** P012's start date, P004 and P006's sessions, and P006 and P012's completion status are `null` and flagged. The pipeline doesn't guess them.
- **Number words only go from zero to twenty.** Anything else written out in words becomes `null` and is flagged.
- **`KNOWN_PROGRAMS` in `run.js` has to be updated** when a new program launches. Until then, its rows get a warning (they're still kept).
- **Duplicate IDs keep the first row.** Later copies are rejected, not merged, so a person should check which row is right.
- **Columns the pipeline doesn't expect are dropped** (and logged), so the output always has the same 7 columns.
- **Quoted cells with a line break inside them aren't supported,** because the file is split into lines before it's parsed. Commas and quotes inside quoted cells work fine.
- **The whole file is read into memory.** That's fine for thousands of rows, not millions.
