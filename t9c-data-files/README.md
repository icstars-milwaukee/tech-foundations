# T9C: Data in the Real World: Working with Files

**i.c.stars Tech Foundations · Week 9**

> Garbage in, garbage out. Cleaning is where trust in the numbers comes from.

You've seen spreadsheets where a column has numbers, words, and blanks all mixed together. Real data is always like that. Today you build a **pipeline** that takes a messy CSV export and produces a clean CSV and a JSON summary, and you keep a log so anyone can trust what you did. This builds directly toward **Week 12 Assessment D** (*build + clean a dataset, CSV → JSON, with a cleaning log*).

**Standards:** DM.KU1 · DM.SK1 · DM.SK2 · DM.O1

---

## Setup (2 minutes)

- Open this folder in VS Code. Node 18+ is all you need. No `npm install`.
- Have a spreadsheet app ready: Excel, Google Sheets (File → Import → Upload), or Numbers.
- If this folder isn't a git repo yet, run `git init` and commit the starter files.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `data/raw/pulse-survey.csv` | The messy survey export. **Never edit it by hand.** | All session |
| `pipeline/clean.js` | **Your code.** One function per kind of mess (TODOs 1–5) | Guided Practice |
| `pipeline/summarize.js` | **Your code.** Summarize by team (TODO 6) | Application |
| `pipeline/run.js` | The pipeline: read → parse → clean → dedupe → write CSV → JSON | Read it |
| `src/csv.js` | A CSV reader/writer that handles quotes and commas | Reference |
| `schema/survey-record.schema.json` | **Stretch:** validate records before export | Stretch |
| `CLEANING_LOG.md` | **Your cleaning log**: what, why, how | All session |
| `data/clean/` and `data/out/` | Where the pipeline writes its results | All session |

## Commands

| Command | Does |
|---|---|
| `npm test` | Checks each cleaning function and the full pipeline |
| `npm run pipeline` | Runs the pipeline: writes the clean CSV and the JSON |
| `npm run pipeline:validate` | **Stretch:** same, but checks every record against the schema first |
| `npm run check` | Shows which parts of your artifact are done |

---

## CSV and JSON, side by side

The same data, two formats:

```csv
full_name,team,hours_coding_this_week,laptop_ok
Maya Brooks,Atlas,14,true
Keisha Owens,Atlas,,true
```

```json
[
  { "full_name": "Maya Brooks", "team": "Atlas", "hours_coding_this_week": 14, "laptop_ok": true },
  { "full_name": "Keisha Owens", "team": "Atlas", "hours_coding_this_week": null, "laptop_ok": true }
]
```

| | CSV | JSON |
|---|---|---|
| Looks like | A spreadsheet | Nested objects and arrays |
| Types | **Everything is text.** `14`, `"14"`, and `fourteen` look the same. | Numbers, booleans, `null`, strings are all different |
| Good for | Spreadsheets, exports, data people edit by hand | APIs (like T9A), apps, nested data |

That's why cleaning happens **between** them: CSV has no types, so you have to decide what each value really is.

## The kinds of mess in this file

| Mess | Example in this file | Where you fix it |
|---|---|---|
| **Missing / messy headers** | A column with no name; `" Full Name "` with spaces | TODO 1 `fixHeaders` |
| **Encoding issues** | `JosÃ©` instead of `José`; an invisible byte-order mark | TODO 2 `fixEncoding` (BOM: `run.js`) |
| **Mixed types** | `10 hrs`, `N/A`, `3/5`, `four`; `Yes`, `y`, `TRUE`, `n` | TODO 3 `toNumber`, TODO 4 `toBoolean` |
| **Duplicates** | Someone submitted twice | TODO 5 `dedupeByName` |
| **Mixed date formats** | `10/14/2026 9:05`, `2026-10-14`, `Oct 14 2026` | Provided: `toISODate` |
| **Blank rows, line breaks inside a value** | A comment that spans two lines | Provided: `src/csv.js` |

**The spreadsheet connection.** These are the same things you'd fix in Excel with Find & Replace, `TRIM()`, `VALUE()`, and Remove Duplicates. Code does it the same way every time, for 10 rows or 10 million, and the log shows exactly what changed.

---

## Guided Practice (pairs, 25 min)

1. **Look first (5 min).** Open `data/raw/pulse-survey.csv` in a spreadsheet **and** in VS Code. Fill in "First look" in `CLEANING_LOG.md`. What's wrong? What does the spreadsheet hide?
2. **Run it broken (1 min).** `npm run pipeline`, then `npm test`. See what's wrong before you touch anything.
3. **Clean (19 min).** Work through TODOs 1–5 in `pipeline/clean.js`. After **each** one:
   - `npm test`. The matching test should pass.
   - Add a row to the cleaning log: what, why, how, rows affected.
   - Commit: `git commit -am "clean: fix encoding in names"`.

## Application (on your own, 10 min)

1. Do TODO 6 in `pipeline/summarize.js`. `npm test` should show **7 passing**.
2. `npm run pipeline`. Open `data/clean/pulse-survey.clean.csv` in your spreadsheet. Compare it to the raw file. Open `data/out/pulse-survey.json`.
3. Finish the **Decisions** and **Result** sections of the log.
4. Commit everything: `git add . && git commit -m "feat: survey pipeline raw CSV to clean CSV to JSON"`.

**Stretch: schema validation.** Real pipelines check data before they publish it. Finish `schema/survey-record.schema.json` so it describes **every** field (types, allowed ranges like confidence 1–5, `null` where a value can be unknown, e.g. `"type": ["number", "null"]`). Set `"additionalProperties": false`. Then run `npm run pipeline:validate`. Break a value on purpose and confirm the export stops.

## Before you leave

```bash
npm run check
```

Your **artifact** is:

- [ ] A pipeline: raw CSV → `data/clean/pulse-survey.clean.csv` → `data/out/pulse-survey.json`
- [ ] Cleaning functions passing `npm test`
- [ ] `CLEANING_LOG.md`: 5+ problems with what, why, how, and rows affected
- [ ] *(Stretch)* A schema that validates every record before export

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | Raw file edited by hand, or no output. No log. |
| Emerging | Some fixes work. Output has NaN or broken names. Log is vague ("cleaned the data"). |
| Developing | Clean CSV and JSON produced. Most tests pass. Log lists problems but not why or how many rows. |
| **Proficient** | All tests pass. Clean CSV and JSON with correct types and nulls. Log covers what, why, how, rows affected, and decisions. |
| Advanced | Schema validation stops bad data before export. Decisions explained with trade-offs. Could rerun on next week's export without changes. |

Limited or Emerging? You'll join a 30-minute data clinic before Week 12. That's practice, not punishment.

---

**Never clean the raw file. Clean a copy, with code, and log it.**
