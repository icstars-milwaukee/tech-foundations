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
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |
| 4 |  |  |  |  |
| 5 |  |  |  |  |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?** 
- **One value I could NOT safely fix, and what I did with it:** 

## Result

- **Rows in → rows out:** 
- **Anomalies logged by the pipeline:** 
