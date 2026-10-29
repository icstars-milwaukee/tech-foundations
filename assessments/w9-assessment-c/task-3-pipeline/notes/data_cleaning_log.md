# Data Cleaning Log

**Name:** Luke Vang

**Dataset:** `data/raw.csv` (community program sign-ups export)

A cleaning log lets someone else trust your numbers. For every problem, write **what** you found, **why** it matters, and **how** you fixed it. "Fixed the data" doesn't count.

## First look

Open `data/raw.csv` in VS Code **and** in a spreadsheet app. List what you notice before writing any code.

- There is a lot irregularities within the data such as "Yes and Y"
- Names are missing
- Spelling Errors

## Problems found

| # | What (the problem) | Why it matters | How I fixed it (or flagged it) | Rows affected |
|---|---|---|---|---|
| 1 | Spelling Errors | Make sure that the data is correct | fixed spelling errors |  |
| 2 | Names are missing | Names are not included which is essential data connected | NULL |  |
| 3 | There is a lot irregularities within the data such as "Yes and Y" | Data is not consistent | Changed the Y back to Yes | 4,6,17 |
| 4 | Open line with no data | Harder to look at data | Deleted opened lines |  |
| 5 | Missing Data points | Questions the Data, fill out with NULL | filled in with Null |  |

## Decisions

- **Unknown values: why null instead of 0 or deleting the row?** 
- **One value I could NOT safely fix, and what I did with it:** 

## Result

- **Rows in → rows out:** 
- **Anomalies logged by the pipeline:** 
