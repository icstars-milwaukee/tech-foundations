# Data Cleaning Log

**Name:**  Cortez Hale
**Dataset:** `data/raw.csv` (community program sign-ups export)

A cleaning log lets someone else trust your numbers. For every problem, write **what** you found, **why** it matters, and **how** you fixed it. "Fixed the data" doesn't count.

## First look

Open `data/raw.csv` in VS Code **and** in a spreadsheet app. List what you notice before writing any code.

-The CSV has an extra blank column header after program, and several rows end with an extra comma. There is also a completely blank row. 
- Some values are inconsistent or missing, including different date formats, twelve in the sessions column, different ways of recording yes/no, missing names and locations, NULL, N/A, and a name that appears to have an encoding problem (Jos�).

## Problems found

| # | What (the problem) | Why it matters | How I fixed it (or flagged it) | Rows affected |
|---|---|---|---|---|
| 1 | The CSV has an empty column header after program, extra trailing commas, and a completely blank row. | Extra columns can cause records to be read incorrectly, and blank rows can inflate row counts. |Remove the empty column, ignore extra trailing empty fields, and remove the completely blank row.  |All rows have the extra formatting; one blank row  |
| 2 | Dates use different formats, such as 2026-09-08, 09/15/2026, Sep 22 2026, and 9/29/26 |Inconsistent dates can be sorted incorrectly or treated as text instead of dates.  |Convert dates that can be interpreted confidently to YYYY-MM-DD. Flag missing or unrecognized dates rather than guessing.  |P001–P014; P012 has a missing date  |
| 3 | sessions_attended contains text instead of numbers, including twelve, NULL, and a blank value. | Calculations such as totals and averages will fail or give incorrect results if the column mixes text and numbers. |Convert valid numeric values to numbers. Flag twelve for review and represent unknown session counts as null rather than zero.  | P002, P004, P006, P007 |
| 4 | The completed column uses inconsistent values such as yes, Y, TRUE, no, and N/A, with a blank value too. |Inconsistent values can cause incorrect completion counts and comparisons.  |Standardize clear yes values to true and clear no values to false. Use null for missing or unknown completion status.  |P001–P014; P006 and P012 need missing/unknown values handled  |
| 5 | Some participant information is missing, and one name appears corrupted (Jos�). |Missing names or locations make records harder to verify, while corrupted text can lead to incorrect participant names.  |Keep the records, flag missing fields, and preserve the corrupted name for review instead of guessing the intended spelling.  |P003, P008, P010, P012  |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?** I used null for values that were missing or unknown instead of using 0 because 0 would mean something specific. For example, a missing session count does not automatically mean the participant attended zero sessions. I kept the participant's record because the other information may still be useful.
- **One value I could NOT safely fix, and what I did with it:** The name `Jos�` appears to have an encoding problem. I could not safely determine the correct spelling from the CSV alone, so I kept the original value and flagged it for review instead of guessing.

## Result

- **Rows in → rows out:**  15 data rows → 14 participant records, assuming the raw CSV contains one blank row and 14 participant records
- **Anomalies logged by the pipeline:** To be filled in after running the pipeline. Use the actual number and types of anomalies reported by your script rather than guessing
