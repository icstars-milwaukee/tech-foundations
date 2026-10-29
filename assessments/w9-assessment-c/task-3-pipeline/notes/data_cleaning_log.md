# Data Cleaning Log

**Name:** Fernando Gamboa
**Dataset:** `data/raw.csv` (community program sign-ups export)

A cleaning log lets someone else trust your numbers. For every problem, write **what** you found, **why** it matters, and **how** you fixed it. "Fixed the data" doesn't count.

## First look

Open `data/raw.csv` in VS Code **and** in a spreadsheet app. List what you notice before writing any code.

- Two header cells are blank: column 4 (it holds neighborhoods) and the last column (it's empty in every row).
- Row P003 shows `Jos�` in VS Code, but `Zoë` in P005 looks fine. So the file mixes two text encodings.
- `start_date`, `sessions_attended` and `completed` are each written several different ways.
- There's a row of only commas and a fully empty line.
- Lines end with `\r\n` (Windows line endings).

## Problems found

| # | What (the problem) | Why it matters | How I fixed it (or flagged it) | Rows affected |
|---|---|---|---|---|
| 1 | Header column 4 is blank; last column is blank with no data | Code and people can't refer to a column with no name; an empty column is just noise | Renamed column 4 to `neighborhood`; dropped the empty last column | Header (all rows) |
| 2 | `José` saved as Latin-1 (byte `0xE9`) while the rest of the file is UTF-8 | Decoding the whole file one way breaks the other name (`Jos�` or `ZoÃ«`) | Decode each line as strict UTF-8; if that fails, decode that one line as Latin-1. Logged | P003 |
| 3 | `sessions_attended` mixes numbers, words and blanks: `12`, `twelve`, ` 7 `, `""`, `NULL` | You can't sum or average text; "twelve" would be lost or crash the math | Trim spaces, convert digits and number words to numbers; blank/`NULL` → `null` | P002, P004, P006, P007, P014 |
| 4 | `start_date` in 6 formats: `2026-09-08`, `09/15/2026`, `Sep 22 2026`, `9/29/26`, `2026/10/06`, `N/A` | Mixed formats can't be sorted or compared, and `09/15` vs `15/09` is ambiguous | Converted all to `YYYY-MM-DD` (assumed US month/day order); `N/A` → `null` | P002, P003, P005, P006, P008, P011, P012, P014 |
| 5 | `completed` written as `yes`, `Y`, `TRUE`, `no`, `N/A`, blank | You can't count completions when "yes" is spelled 3 ways | Converted to `true` / `false`; `N/A` and blank → `null` | All 14 rows (P006, P012 → null) |
| 6 | A row of only commas, and an empty line | They would become fake participants with every field empty | Skipped them, logged the line number | Lines 7 and 9 |
| 7 | Missing `first_name` (P010) and missing `neighborhood` (P008) | Blank text `""` looks like a real value; `null` clearly means "unknown" | Converted blank text to `null` and flagged it. Kept the row | P008, P010 |
| 8 | Windows line endings (`\r\n`) | A leftover `\r` sticks to the last value of each line | Stripped `\r` from the end of every line | All lines |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?** `0` is a real answer ("attended zero sessions"), so using it for "we don't know" would quietly make averages wrong. Deleting the row would throw away the good data in its other columns (P004 still has a valid program, date and completion). `null` keeps the row and is honest that the value is unknown.
- **One value I could NOT safely fix, and what I did with it:** P012's `start_date` is `N/A`. There's no way to guess the real date, so I set it to `null` and logged it instead of inventing one. (Same for P010's missing first name: I didn't guess a name.)

## Result

- **Rows in → rows out:** 16 data lines in (17 with the header) → 14 clean records out (2 blank rows removed).
- **Anomalies logged by the pipeline:** 34 (each one is printed as a `[WARN]` line when you run `npm run pipeline`).
