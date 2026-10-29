# Data Cleaning Log

**Name:** dmoore-ui (pipeline and log written by Claude, Claude Code)
**Dataset:** `data/raw.csv` (community program sign-ups export)

A cleaning log lets someone else trust your numbers. For every problem, write **what** you found, **why** it matters, and **how** you fixed it. "Fixed the data" doesn't count.

## First look

- P003's name shows as `Jos�`: that line was saved as Latin-1, while P005's `Zoë` is UTF-8. The file mixes two encodings.
- The 4th column has no header, though it holds locations (Washington Park, Bay View…). The 8th column has no header and no data.
- `start_date` is written five different ways: `2026-09-08`, `09/15/2026`, `Sep 22 2026`, `9/29/26`, `2026/10/06`.
- `sessions_attended` has `twelve` written as a word, plus `NULL`, blanks, and ` 7 ` with spaces.
- `completed` says yes six different ways: `yes`, `Y`, `TRUE`, `no`, `N/A`, blank.
- There are two blank rows: one completely empty, one that is only commas.
- Line endings are Windows `\r\n`.

## Problems found

| # | What (the problem) | Why it matters | How I fixed it (or flagged it) | Rows affected |
|---|---|---|---|---|
| 1 | Mixed encoding: P003 is Latin-1, the rest is UTF-8 | Read as UTF-8, `José` becomes `Jos�` and the name is lost | Decode each line as strict UTF-8, and fall back to Latin-1 when that fails. The fallback is logged. Output is all UTF-8. | P003 |
| 2 | Blank headers; column 8 is completely empty | Data needs named columns to be used as JSON keys, and an empty column is noise | Named column 4 `location`, because it holds parks and streets. Dropped column 8. Both are logged. | All |
| 3 | `start_date` in 5 formats | Dates in mixed formats can't be sorted or compared | All converted to ISO `YYYY-MM-DD`. Slash dates are read US style (month first), `26` is read as `2026`, and impossible dates like Feb 30 become null. | P002, P003, P005, P006, P008, P011, P014 |
| 4 | `sessions_attended` has words, spaces, `NULL` and blanks | The column must be numeric to total or average it | Trimmed spaces, turned `twelve` into `12`, and made `NULL` and blanks `null` | P002, P004, P006, P007, P014 |
| 5 | `completed` uses `yes`/`Y`/`TRUE`/`no`/`N/A`/blank | Six spellings of yes and no break filtering and counting | `yes`/`y`/`true` → `true`, `no`/`n`/`false` → `false`, `N/A` and blank → `null` | P003, P005, P006, P012, P014 |
| 6 | Blank rows (empty, or only commas) | They would show up as fake participants with all-null fields | Skipped, and logged by line number | Lines 7, 9 |
| 7 | Missing text (no first name, no location) | `""` looks like a real value, while `null` says "unknown" | Blank text → `null`, flagged in the log | P008 (location), P010 (first_name) |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?** A `0` for sessions would claim the person attended nothing, which is a false fact that drags averages down. Deleting the row would lose the rest of their real data (name, program, date). `null` says "we don't know", and a reader can choose to filter on it.
- **One value I could NOT safely fix, and what I did with it:** P010 has no `first_name`, and nothing else in the file tells us who it is. I left it as `null` and flagged it in the log for someone with the original sign-up sheet to fill in. P012's `start_date` (`N/A`) is the same case.

## Result

- **Rows in → rows out:** 16 data lines in → 14 records out (2 blank rows skipped).
- **Anomalies logged by the pipeline:** 25 (run `npm run pipeline` to see each one as a `[WARN]` line).
