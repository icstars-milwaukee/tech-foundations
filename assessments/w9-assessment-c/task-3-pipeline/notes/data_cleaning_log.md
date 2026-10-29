# Data Cleaning Log

**Name:** 
**Dataset:** `data/raw.csv` (community program sign-ups export)

A cleaning log lets someone else trust your numbers. For every problem, write **what** you found, **why** it matters, and **how** you fixed it. "Fixed the data" doesn't count.

## First look

Open `data/raw.csv` in VS Code **and** in a spreadsheet app. List what you notice before writing any code.

- Some column headers are blank, and there is an extra empty column.
- Dates, session counts, and completion values use different formats. Some values are missing or invalid.

## Problems found

| # | What (the problem) | Why it matters | How I fixed it (or flagged it) | Rows affected |
|---|---|---|---|---|
| 1 |The site column has a blank header, and there is an extra empty column.  |The columns could be misunderstood or misaligned.  |Renamed the fourth column to site and removed the unused trailing column.  |Header and all records  |
| 2 |Dates use several formats, and some are missing.  |Dates need one consistent format to sort and compare them.  |Converted valid dates to YYYY-MM-DD; unknown or invalid dates become null.  |P002, P003, P005, P006, P011, P012, P014  |
| 3 |Session counts include text, whitespace, and missing values.  |These values cannot all be treated as numbers without cleaning.  |Trimmed whitespace, converted twelve to 12, and used null for unknown values.  |P002, P006, P007, P014  |
| 4 |Completion values use yes/no, Y, TRUE, and N/A.  |Mixed formats make filtering and counting harder.  |Converted recognized values to true or false and unknown values to null.  |Multiple records, including P002, P003, P006, and P012  |
| 5 |Some names or other fields are missing, and one name contains a corrupted character.  |Missing or corrupted values can affect reporting.  |Used null for missing text and flagged the corrupted name without guessing the intended spelling.  |P003, P008, P010, P012  |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?** Null means the value is unknown. Zero would mean we know nobody attended, and deleting the whole row would lose the other useful information.
- **One value I could NOT safely fix, and what I did with it:** The name Jos� appears corrupted. I kept the original value and flagged it instead of guessing the correct spelling.

## Result

- **Rows in → rows out:** 14 participant records retained; the blank row was skipped.
- **Anomalies logged by the pipeline:** Use the exact anomaly count printed in the terminal after running the pipeline.
