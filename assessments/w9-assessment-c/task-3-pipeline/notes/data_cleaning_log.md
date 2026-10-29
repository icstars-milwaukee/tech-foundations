# Data Cleaning Log

**Name:** Ventura Perez
**Dataset:** `data/raw.csv` (community program sign-ups export)

A cleaning log lets someone else trust your numbers. For every problem, write **what** you found, **why** it matters, and **how** you fixed it. "Fixed the data" doesn't count.

## First look

What I noticed in `data/raw.csv` before writing any code:

- 17 lines: a header, 14 participants (P001–P014), and 2 blank lines (line 7 is only commas, line 9 is empty).
- The header has two blank names. The 4th column holds neighborhoods (Washington Park, Bay View...). The 8th column comes from a trailing comma on every line and has no data at all.
- Every line ends in `\r\n` (Windows line endings).
- P003 shows as `Jos�` in VS Code. The file stores that `é` as one Latin-1 byte (`0xE9`), which isn't valid UTF-8. P005's `Zoë` *is* valid UTF-8, so reading the whole file as Latin-1 instead turns it into `ZoÃ«`. Whichever single encoding you pick, one name breaks.
- `sessions_attended` mixes numbers and text: `12`, `twelve`, blank, ` 7 ` (with spaces), `NULL`.
- `start_date` uses 5 formats (`2026-09-08`, `09/15/2026`, `Sep 22 2026`, `9/29/26`, `2026/10/06`), plus `N/A`.
- `completed` uses `yes`, `Y`, `TRUE`, `no`, `N/A`, and blank.
- Some text cells are just empty: P010 has no first name, and P008 has no neighborhood.

## Problems found

| # | What (the problem) | Why it matters | How I fixed it (or flagged it) | Rows affected |
|---|---|---|---|---|
| 1 | 4th column has no header | A column with no name can't be a JSON key, and nobody knows what it means | Named it `neighborhood`: it's the only expected column missing, and its values are neighborhoods. The code only does this when exactly one column is unnamed and exactly one is missing, so it never guesses between two. | All |
| 2 | 8th column has no header **and** no data (trailing comma) | Adds an empty `""` field to every record | Dropped. There was no data in it to lose. | All |
| 3 | Mixed encodings (P003 Latin-1, P005 UTF-8) | Names get corrupted, and a person's name is the one thing you must not mangle | Decode **each line** separately: strict UTF-8 first, Latin-1 if that fails. Both `José` and `Zoë` come through. The fallback is logged. | P003 (P005 kept correct) |
| 4 | Windows `\r\n` line endings | Splitting on `\n` leaves a hidden `\r` stuck to the last cell of every row | Trimmed the `\r` from every line | All |
| 5 | Blank rows (empty line, a line of only commas) | Would turn into all-null "participants" and inflate counts | Skipped and logged | Lines 7, 9 |
| 6 | `sessions_attended` mixes numbers, words, spaces, `NULL`, blank | You can't sum or average text; `"twelve"` would break any math | `toNumber`: trims spaces, reads digits and number words (zero–twenty). `NULL` and blank become `null`. Anything else (like `-3`) becomes `null` and is flagged. | P002, P004, P006, P007, P014 |
| 7 | `start_date` in 5 formats, plus `N/A` | Dates stored as text sort wrong (`"10/06"` sorts before `"9/29"`), and you can't filter by month | `toISODate`: everything becomes `YYYY-MM-DD`. Impossible dates (like Feb 30) become `null`. `N/A` becomes `null`. | P002, P003, P005, P006, P008, P011, P012, P014 |
| 8 | `completed` spelled 6 different ways | Counting `completed == "yes"` would miss `Y` and `TRUE`, which under-reports completions | `toBoolean`: `true` / `false`, or `null` when unknown (`N/A`, blank) | P003, P005, P006, P012, P014 |
| 9 | Blank text cells | `""` looks like a real value; `null` clearly means "unknown" | Blank text becomes `null` and is flagged | P008 (neighborhood), P010 (first_name) |
| 10 | `10/06/2026` could be Oct 6 **or** Jun 10 | A wrong guess puts someone in the wrong cohort | Read as US month/day, and flagged as ambiguous. Evidence: every other start date (Sep 8, 15, 22, 29, Oct 13) is a Tuesday, a weekly cohort start. Oct 6 is a Tuesday too, and Jun 10 would be a Wednesday. | P008 |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?** Because `0` is a real, different fact. "Attended 0 sessions" isn't the same as "we don't know," and a fake 0 would pull the average down. Deleting the row would throw away the rest of that person's good data (P004 still has a name, program, and start date). `null` says "unknown," and JSON, SQL, and spreadsheet tools all handle it that way.
- **One value I could NOT safely fix, and what I did with it:** P012's `start_date` is `N/A`. Nothing else in the row says when Kevin started, and picking a cohort date would be making up data. I left it `null` and the pipeline flags it, so it shows up in the log and as `missing: 1` in the quality report for someone to look up.
- **`NA` is not treated as a null placeholder**, only `N/A`, `NULL`, `none`, `-`, and blank are. Na is a real first name, and nulling it would erase a person.
- **`clean.csv` starts with a UTF-8 byte order mark.** Without it, Excel guesses the wrong encoding and shows `JosÃ©`. That would undo fix #3 for anyone who opens the file in a spreadsheet.

## Validation checks and quality summary

After cleaning, every row goes through 5 checks. Results print at the end of each run and are saved to `data/quality_report.json`.

| Check | Severity | What happens if it fails |
|---|---|---|
| `participant_id` is filled in | error | Row is left out of the outputs and listed under `rejected_rows` |
| `participant_id` is unique (first one kept) | error | Later copies are rejected the same way |
| `participant_id` looks like `P001` | warning | Row is kept and flagged |
| `program` is a known program | warning | Row is kept and flagged; catches typos and new programs |
| anyone marked completed attended at least 1 session | warning | Row is kept and flagged |

The quality report also gives, for each column, how many values are filled and missing, how many anomalies it had, value counts for categories (program, neighborhood, completed), and min/max/average or earliest/latest for numbers and dates. As a final step the pipeline reads its own outputs back and checks that `export.json` parses and that both files hold the same number of records.

`raw.csv` passes all 5 checks.

## Result

- **Rows in → rows out:** 17 lines in (1 header + 16 data lines). 2 blank rows skipped, 0 rejected, **14 rows out** in both `clean.csv` and `export.json`.
- **Anomalies logged by the pipeline:** 25 (1 encoding fallback, 2 header fixes, 2 blank rows, 20 value fixes or flags). All 5 validation checks pass.
