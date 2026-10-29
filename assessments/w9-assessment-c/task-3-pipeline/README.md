<!--
  INTERNS: this README is a template. Fill in every [bracket], then delete this comment.
  Copy this whole folder into its own repo first (see "Setup" below).
-->

# Community Program Data Pipeline

**Author:** LaQuesha Bell · **Date:** 2026-10-29

## What this does

This pipeline imports a community signup export, normalizes messy field values, and exports a clean dataset for analysis. It is designed for program staff who need reliable records for reporting and follow-up.

```
data/raw.csv  →  data/clean.csv  →  data/export.json
```

## How to run it

Requires Node 18+. No `npm install`.

```
npm run pipeline
```

## What the pipeline cleans

Full details are in `notes/data_cleaning_log.md`.

- Missing or blank CSV headers are renamed consistently.
- Numeric fields are converted to integers or `null` when unknown.
- Date fields are standardized to ISO `YYYY-MM-DD`.
- Boolean-like values are normalized to `true` / `false` / `null`.
- Blank values are preserved as `null`, while duplicate rows are skipped.

## Output

| File | What's in it |
|---|---|
| `data/clean.csv` | A cleaned CSV with standardized column names and consistent values. |
| `data/export.json` | An array of cleaned objects in JSON format for downstream tools and dashboards. |

## Known limitations

- Date parsing assumes common U.S. formats such as `MM/DD/YYYY` and month-name strings.
- Unknown values become `null` rather than guessed, so manual review is still recommended when the source data is ambiguous.
