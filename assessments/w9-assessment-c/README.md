# Week 9: Performance Assessment C

**i.c.stars Tech Foundations · Week 9**

> Show you can build it, and show you can keep it from breaking.

At the end of Week 9 you'll put together what you've practiced in Weeks 7–9: data, AI, and APIs. This page shows what you'll be asked to do, what to turn in, and what good work looks like, so nothing is a surprise.

## Why it matters

- **You'll use these skills right away.** Sprint 2 and beyond need data handling, AI, and API calls working together.
- **Resilience counts as much as code.** Part of the work is planning for things to go wrong before they do.
- **It shows you're ready for more.** This checkpoint is about combining several skills at once while still delivering.

## What to expect

- **Three tasks**, about **20 minutes each**. They may be split across two sessions.
- **Show your work.** You're scored on what's visible: AI output with your evaluation log, an API script with parsed JSON, and a cleaned dataset with your notes, all with commits.
- **The goal is Proficient (4).** Each task below includes the rubric row it's scored on. If you land at Limited or Emerging, you'll join a clinic. That's practice, not punishment.
- **Finish with a short reflection** (see the end of this page).

## Skills you'll show (Weeks 7–9)

| Area | What you'll show |
|---|---|
| **Data Management (DM)** | Read and write CSV and JSON; clean and summarize structured data; model data with ERDs and SQL schemas. |
| **AI** | Use AI in a workflow, then evaluate its output against a baseline, responsibly. |
| **APIs** | Call endpoints, parse JSON, and handle errors and rate limits. |

---

## Task 1: AI Evaluation

**Your task:** Use AI to produce a summary of a dataset. Compare the AI output to a human-written baseline summary using at least two criteria (for example accuracy, completeness, bias, reliability). Then decide: **accept, edit, or reject**, and explain why.

**Rules:** No personal information (PII) in your prompts. Note where the data came from.

**Turn in:**

- The AI output, copied into `/ai/ai_output.md`
- `/ai/evaluation_log.md` covering accuracy, completeness, bias/privacy risk, time saved, and your decision

**Proficient looks like:** at least 2 criteria compared, at least one gap or risk identified, and a clear accept / edit / reject decision with your reasoning.

**Watch out for:** accepting the AI output without question · no comparison to the baseline · no criteria.

| Limited (1) | Emerging (2) | Developing (3) | Proficient (4) | Advanced (5) |
|---|---|---|---|---|
| No attempt. | Uses AI output without critique. | Baseline vs AI compared superficially. | Evaluates AI vs baseline on ≥2 criteria (e.g., accuracy, bias/privacy); makes accept/edit/reject decision with rationale; notes data provenance; no PII in prompts. | Proposes org-level guardrails; suggests prompt or workflow refinements; quantifies time/quality tradeoffs. |

---

## Task 2: API Call

**Your task:** Call a practice API endpoint, parse the JSON response, and pull out the `title` field. Handle one simulated error, such as a network failure.

**Turn in:** Your API script with parsed output and error handling, a `.env` file for the API key, and a `.gitignore` that keeps secrets out of the repo.

**Proficient looks like:**

- The call works, the JSON is parsed, and `title` is extracted.
- A friendly error message is logged if the API fails.
- The key lives in `.env`, and `.env` is **not** committed.

**Watch out for:** the call fails · no JSON parsing · hard-coded values · no error handling · secrets in your code.

| Limited (1) | Emerging (2) | Developing (3) | Proficient (4) | Advanced (5) |
|---|---|---|---|---|
| Cannot attempt call. | Attempts call but fails. | Successful call but no parsing/error handling. | Calls endpoint, parses JSON, extracts field, handles error; secrets managed in `.env` + `.gitignore`. | Adds structured logging, reusable function, or advanced error handling. |

---

## Task 3: Data Pipeline Build

**Your task:** You'll get a raw CSV with some problems on purpose (missing headers, mixed types, nulls, a row with odd encoding). Import it, clean it so the columns and data types make sense, and export both a cleaned CSV and a JSON version. Add brief notes on what you cleaned and why. You'll get a runner script to start from, or instructions for the command line.

**Turn in:**

- `/data/raw.csv` → `/data/clean.csv` → `/data/export.json`
- `/notes/data_cleaning_log.md` (what you cleaned, why, and how)
- Your runner script(s) and a `README` at the repo root

**Proficient looks like:**

- Missing headers handled; types and dates normalized; nulls removed or flagged.
- The JSON export is valid.
- Commits follow **scaffold → feature → refactor**.
- Logging for the key steps: start, rows processed, anomalies found.

**Watch out for:** stopping at the raw CSV · invalid JSON · no cleaning log · no README.

| Limited (1) | Emerging (2) | Developing (3) | Proficient (4) | Advanced (5) |
|---|---|---|---|---|
| No attempt, or stops at the raw CSV. | Imports the CSV but little or no cleaning; JSON missing or invalid. | Some cleaning and a valid export, but misses issues; no cleaning log or README. | Handles missing headers, normalizes types/dates, removes or flags nulls; valid JSON export; cleaning log + README; scaffold → feature → refactor commits; logs key steps. | Makes the pipeline reusable (e.g., works on a new file); adds validation checks or a data quality summary. |

---

## How to prepare

| Task | Review |
|---|---|
| AI Evaluation | [T8A: AI Fundamentals I](../../t8a-ai-fundamentals/README.md) and [T8B: AI Integration](../../t8b-ai-integration/README.md) |
| API Call | [T9A: APIs 101](../../t9a-apis-101/README.md) |
| Data Pipeline Build | [T9C: Data in the Real World: Files](../../t9c-data-files/README.md) |

---

## Reflection

When you finish, write a short reflection and turn it in with your other work:

- [ ] What worked?
- [ ] What could I improve next time?
- [ ] What professional habit will I keep practicing?
