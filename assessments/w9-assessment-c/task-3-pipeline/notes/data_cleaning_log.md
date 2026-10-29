# Data Cleaning Log

**Name:** LaQuesha Bell
**Dataset:** `data/raw.csv` (community program sign-ups export)

## First look

- The source CSV contains messy header names and inconsistent spacing around values.
- Several rows use placeholder text such as `NULL`, `N/A`, or blank values that need to be normalized.
- Numeric and date fields are not yet in consistent formats for analysis.

## Problems found

| # | What (the problem) | Why it matters | How I fixed it (or flagged it) | Rows affected |
|---|---|---|---|---|
| 1 | Blank or uneven CSV headers | Headers are not consistent enough for reliable field access | Renamed blank headers to predictable names such as `column_1`, then normalized names to lowercase snake_case | All rows |
| 2 | Extra whitespace in text values | Values like ` Mary ` or `Y ` can break filtering and grouping | Trimmed whitespace before storing values | Many rows |
| 3 | Numeric text such as `NULL`, `N/A`, or empty values | Missing attendance counts should not be treated as real numbers | Converted unknown numbers to `null` | Variable |
| 4 | Date strings in different formats | Reporting and sorting by date become unreliable | Standardized valid dates to ISO `YYYY-MM-DD` | Variable |
| 5 | Boolean-like values with mixed conventions | A single field should have consistent true/false semantics | Converted `yes`, `true`, `y` to `true` and `no`, `false`, `n` to `false`; ambiguous values become `null` | Variable |
| 6 | Duplicate rows | Duplicate signups can inflate counts and distort analysis | Deduplicated repeated records while logging the anomaly | 1 row |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?**
  Null preserves the fact that a value is missing without creating fake data. It is safer for reporting and avoids biasing averages or totals.

- **One value I could NOT safely fix, and what I did with it:**
  Any value that could not be confidently interpreted was left as `null` and logged as an anomaly for review instead of guessed.

## Result

- **Rows in → rows out:** Input rows are processed through the pipeline, cleaned, and exported as consistent records.
- **Anomalies logged by the pipeline:** Pipeline anomalies are reported for every value that needed normalization or review.
