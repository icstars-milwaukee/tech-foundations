# Week 9: Performance Assessment C

**i.c.stars Tech Foundations · Week 9**

> Show you can build it, and show you can keep it from breaking.

At the end of Week 9 you'll put together what you've practiced since Week 6: functions, AI, Agile, APIs, and data design. This page shows what you'll be asked to do, what to turn in, and what good work looks like, so nothing is a surprise.

## Why it matters

- **You'll use these skills right away.** Sprint 2 and beyond need functions, data queries, and API calls working together.
- **Resilience counts as much as code.** Part of the work is planning for things to go wrong before they do.
- **It shows you're ready for more.** This checkpoint is about combining several skills at once while still delivering.

## What to expect

- **Five tasks**, about **20 minutes each**. They may be split across two sessions.
- **Show your work.** You're scored on what's visible: working code with commits, AI output with your evaluation, an API script with parsed JSON, your ERD and SQL.
- **The goal is Proficient (4).** Each task below includes the rubric row it's scored on. If you land at Limited or Emerging, you'll join a clinic. That's practice, not punishment.
- **Finish with a short reflection** (see the end of this page).

## Skills you'll show (Weeks 6–9)

| Area | What you'll show |
|---|---|
| **Programming (PR)** | Write variables, loops, and conditionals; structure readable code; write and call reusable functions; handle errors and debug systematically. |
| **Data (DA)** | Describe tables, rows, and relationships; write JOIN and GROUP BY queries; spot data quality issues. |
| **AI** | Use AI in a workflow, then evaluate its output against a baseline, responsibly. |
| **APIs** | Call endpoints, parse JSON, and handle errors and rate limits. |

---

## Task 1: Write a Function

**Your task:** Write a function that takes a list of integers and returns a list of only the positive even numbers, doubled. Add at least one error-handling condition. You'll start from a partly written function.

**Turn in:** The function file in your repo, committed in three steps: **scaffold → feature → refactor**.

**Proficient looks like:**

- The function runs correctly, ignores negatives, and doubles positives.
- Clean variable names and a readable structure.
- At least 3 commits with meaningful messages.

**Watch out for:** wrong values from incorrect logic · no error handling · one big "test commit".

| Limited (1) | Emerging (2) | Developing (3) | Proficient (4) | Advanced (5) |
|---|---|---|---|---|
| Code does not run. | Runs but incorrect logic. | Handles some cases but misses conditions. | Runs correctly, ignores negatives, doubles positives; clean structure; ≥3 commits with meaningful messages. | Adds error handling, logging, comments, or scalability improvements; coaches peers in commit discipline. |

---

## Task 2: AI Evaluation

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

## Task 3: Agile Backlog Refinement

**Your task:** You'll get a few rough user stories (like "Login works" or "User can reset password"). Pick two and rewrite them as **"As a [role], I want [goal], so that [reason]."** Break each one into at least two tasks, estimate each task, and assign an owner.

**Turn in:** A refined backlog with sprint-ready stories and tasks.

**Proficient looks like:**

- Stories rewritten clearly, with acceptance criteria.
- At least 4–5 tasks, each with an owner and an estimate.

**Watch out for:** stories left vague ("Fix login") · missing acceptance criteria · no estimates.

| Limited (1) | Emerging (2) | Developing (3) | Proficient (4) | Advanced (5) |
|---|---|---|---|---|
| Cannot rewrite stories. | Rewrites 1 story vaguely. | Rewrites 2–3 stories with partial "As a …" format. | Refines 4–5 stories with clear format + acceptance criteria + estimates. | Anticipates dependencies; adds sprint-ready prioritization. |

---

## Task 4: API Call

**Your task:** Call a practice API endpoint, parse the JSON response, and pull out the `title` field. Handle one simulated error, such as a network failure.

**Turn in:** Your API script with parsed output and error handling, a `.env` file for the API key, and a `.gitignore` that keeps secrets out of the repo.

**Proficient looks like:**

- The call works, the JSON is parsed, and `title` is extracted.
- A friendly error message is logged if the API fails.
- The key lives in `.env`, and `.env` is **not** committed.

**Watch out for:** no JSON parsing · hard-coded values · no error handling · secrets in your code.

| Limited (1) | Emerging (2) | Developing (3) | Proficient (4) | Advanced (5) |
|---|---|---|---|---|
| Cannot attempt call. | Attempts call but fails. | Successful call but no parsing/error handling. | Calls endpoint, parses JSON, extracts field, handles error; secrets managed in `.env` + `.gitignore`. | Adds structured logging, reusable function, or advanced error handling. |

---

## Task 5: ERD + Schema

**Your task:** Given a small scenario (for example: users place orders that contain many products), create an ERD with entities, attributes, and relationships. Then write CREATE TABLE statements for at least three entities, with primary keys and foreign keys.

**Tip:** If you made a JSON schema or OpenAPI snippet in Week 7, reuse it.

**Turn in:**

- `/design/erd.png` (or `.pdf` / `.drawio`)
- `/sql/schema.sql` with your CREATE TABLE statements (PK/FK, types, NOT NULL)

**Proficient looks like:**

- Correct entities and relationships (one-to-many, and many-to-many through a join table).
- Valid SQL with PK/FK, appropriate types, and NOT NULLs.
- A short comment connecting your design choices to the scenario.

**Watch out for:** missing relationships · vague types · no constraints.

| Limited (1) | Emerging (2) | Developing (3) | Proficient (4) | Advanced (5) |
|---|---|---|---|---|
| No ERD. | Rough sketch; missing relationships. | Basic ERD; partial SQL. | ERD with correct entities/relationships + valid CREATE TABLEs (PK/FK, types, not null). | Normalizes schema (3NF), indexes critical lookups, check constraints; rationale notes. |

---

## How to prepare

| Task | Review |
|---|---|
| Write a Function | [T7A: Functions, Errors & Debugging](../../t7a-functions-debugging/README.md) |
| AI Evaluation | [T8A: AI Fundamentals I](../../t8a-ai-fundamentals/README.md) and [T8B: AI Integration](../../t8b-ai-integration/README.md) |
| Agile Backlog | [T9B: Sprint 2 Rehearsal & Risks](../../t9b-sprint2-rehearsal/README.md) |
| API Call | [T9A: APIs 101](../../t9a-apis-101/README.md) |
| ERD + Schema | [T7B: From Stories to Design](../../t7b-stories-to-design/README.md) |

---

## Reflection

When you finish, write a short reflection and turn it in with your other work:

- [ ] What worked?
- [ ] What could I improve next time?
- [ ] What professional habit will I keep practicing?
