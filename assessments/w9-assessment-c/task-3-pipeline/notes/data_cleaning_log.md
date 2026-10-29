# Data Cleaning Log

**Name:** Jose Romero
**Dataset:** `data/raw.csv` (community program sign-ups export)

A cleaning log lets someone else trust your numbers. For every problem, write **what** you found, **why** it matters, and **how** you fixed it. "Fixed the data" doesn't count.

## First look

Open `data/raw.csv` in VS Code **and** in a spreadsheet app. List what you notice before writing any code.

- The sessions_attended column has different data types in it (ints and strings).
- Completely different formats for the completed column (Y, Yes, TRUE, etc.)
- The start_date column has different date formats
- The fourth column (which is supposed to say "site", meaning the location of the event) is not labeled. 
- There are empty rows.
- The first_name is formatted oddly for someone named "ZoÃ«". It could be a typo.
- (Found while writing the code) The header row ends with a trailing comma, so there is an 8th column with no name and no data at all.
- (Found while writing the code) "ZoÃ«" is not a typo: it is what an editor shows when it reads UTF-8 bytes as Latin-1. Looking at the raw bytes, the file actually mixes two encodings: P005 "Zoë" is stored as UTF-8 (`c3 ab`), but P003 "José" is stored as a single Latin-1 byte (`e9`).

## Problems found

| # | What (the problem) | Why it matters | How I fixed it (or flagged it) | Rows affected |
|---|---|---|---|---|
| 1 | **Mixed text encodings in one file.** P003 "José" is Latin-1 (`e9`); P005 "Zoë" is UTF-8 (`c3 ab`). Editors that guess one encoding show garbage ("Jos�" or "ZoÃ«"). | Names are corrupted in the output, and a one-size-fits-all decode would fix one name and break the other. | Decode **line by line**: try strict UTF-8 first, and if that fails, treat the line as Latin-1. Logged as an anomaly. | 1 row fixed (P003); P005 was already valid UTF-8 |
| 2 | **Unnamed columns.** Column 4 has no header (it holds site names like "Washington Park"), and column 8 (from a trailing comma) has no header and no data. | Code and people can't refer to a column with no name, and an empty column is just noise. | Named column 4 `site`. Dropped column 8 because it has no data at all. Both logged. | 2 columns (all 14 rows have a `site` cell) |
| 3 | **Blank rows**: an empty line and a line of only commas (`,,,,,,,`). | They would become fake records with every field empty. | Skipped any line that is blank or only commas. | 2 lines |
| 4 | **Mixed types in `sessions_attended`**: `"12"`, `"twelve"`, `" 7 "`, `""`, `"NULL"`. | A number column holding words and blanks breaks sums and averages. | Trim and convert numerals; convert spelled-out numbers (`twelve` -> 12); anything else becomes `null`. Never `NaN`. | 5 rows (P002, P004, P006, P007, P014) |
| 5 | **Five date formats in `start_date`**: `2026-09-08`, `09/15/2026`, `Sep 22 2026`, `9/29/26`, `2026/10/06` (plus `N/A`). | Dates in different formats can't be sorted or compared. | Converted everything to `YYYY-MM-DD` (two-digit years read as 20xx). `N/A` becomes `null`. Each conversion is logged. | 8 rows (7 converted, 1 `null`); 6 were already correct |
| 6 | **Inconsistent yes/no in `completed`**: `yes`, `Y`, `TRUE`, `no`, `N/A`, blank. | Can't count completions reliably when the same answer is spelled `yes`, `Y`, or `TRUE`. | Mapped yes/y/true -> `true` and no/n/false -> `false`, ignoring case and spaces. `N/A` and blank become `null`. | 12 rows converted, 2 `null` (P006, P012) |
| 7 | **Missing text values**: P008 has no `site`, P010 has no `first_name`. | Blank text silently mixes with real values downstream. | Converted blanks to `null` (not `""`) and logged each one. | 2 rows |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?** `null` honestly means "we don't know". A `0` would claim that someone attended zero sessions (P004, P006), which is a real, different fact, and it would drag down any average. Deleting the row would throw away good data in the same row, such as P004's program and start date.
- **One value I could NOT safely fix, and what I did with it:** P008's missing `site`. Every other Teen Coding Club row is at Washington Park, so it is probably Washington Park, but that is a guess about a real record, so I left it `null` and logged it for a person to confirm. (Related judgment call: `10/06/2026` is read month-first. The file backs that up, because `09/15/2026` and `10/13/2026` can't be day-first, and 2026-10-06 is a Tuesday like every other date in the file.)

## Result

- **Rows in → rows out:** 16 data lines → 14 records (2 blank lines dropped); 8 columns → 7 columns
- **Anomalies logged by the pipeline:** 20 (every fix, drop, and `null` is printed as a `[WARN]` line when you run `npm run pipeline`)
