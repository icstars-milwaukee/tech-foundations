# Community Program Data Pipeline

**Author:** Cortez Hale · **Date:** October 29, 2026

## What this does

This pipeline takes a raw CSV file containing community program sign-ups and cleans the data so it is easier to read and analyze. It creates a cleaned CSV and a JSON file that community program staff can use for reporting and tracking participant information.

```text
data/raw.csv → data/clean.csv → data/export.json
```

## How to run it

Requires Node.js 18 or newer. No `npm install` is needed.

Run the pipeline from the project folder:

```bash
npm run pipeline
```

## What the pipeline cleans

- Removes blank rows and handles the extra empty column in the raw CSV.
- Standardizes date formats and converts valid session counts to numbers.
- Standardizes completion values, handles missing information, and flags values that cannot be safely corrected.

Full details are in `notes/data_cleaning_log.md`.

## Output

| File | What's in it |
|---|---|
| `data/clean.csv` | Cleaned participant records with participant IDs, names, programs, locations, standardized start dates, session counts, and completion statuses. |
| `data/export.json` | The cleaned records in valid JSON format, with each participant represented as an object containing the dataset's fields. |

## Known limitations

Some values cannot be safely corrected without more information. For example, the name `Jos�` appears to have an encoding problem, and the session count `twelve` needs to be checked before it can be converted confidently. Missing values are kept as unknown rather than automatically changed to zero. Dates are standardized only when they can be interpreted confidently. These issues are documented in the cleaning log.

---

## Setup

1. Copy this folder somewhere outside the course repository and open it in VS Code.
2. Initialize Git and commit the starter code: `git commit -m "scaffold: starter pipeline"`.
3. Clean and export the data, then commit: `git commit -m "feature: clean and export data"`.
4. Improve the code structure and validation, then commit with a message such as `git commit -m "refactor: improve pipeline and validation"`.
5. Run `npm run pipeline` one more time and confirm that `data/export.json` opens without errors.