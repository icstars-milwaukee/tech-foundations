# AI Evaluation Log

**Name:** Fernando Gamboa
**Dataset:** `data/dataset.csv`
**Provenance:** Fictional training data created by i.c.stars Tech Foundations staff, modeled on a weekly sign-in sheet export. Counts only; no personal information. 
**AI tool and date:** Claude, 10/29/2026 1:40PM.

Compare `ai/ai_output.md` against `baseline.md`. Evidence means a number, a row, or a quote, not a feeling.
You need **at least 2 criteria** with evidence and **at least 1 gap or risk**.

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
| **Accuracy**: are the numbers right? |81.4% overall (398/489). Teen Coding Club is strongest at 87.5%.  |  78.9% overall (367/465). Senior Tech Help is strongest at 84.0%. | The AI removed the Teen Coding Club Oct 13 row (31 attended, 24 registered). The baseline kept it but flagged it. | this changed the overall rate wich program looks strongest. |
| **Completeness**: did it catch the data problems? | Listed all 5: duplicate, outage 0, blank count, 31 > 24, Rec Ctr. |  listed all 5. | it caught 5 out of 5. | None Missed. |
| **Bias / privacy risk**: any unfair framing, invented claims, or PII? | Teen Coding Club is top and Adult Digital Skills is lowest. | Senior Tech Help is top, and Teen Coding Club is only at 79.2%. | A manager who only reads the first line would think teen coding club is doing badly. | this is unfair because, the AI dropped their best week without knowing it was really wrong. no PII risk: the dataset is counts only. |
| **Time saved**: minutes with AI vs. writing it yourself | a human wrote it by hand in 40 min|about 5 min to promp, 10-15 minutes to check  | i started at 1:40 and by a minute later i was filling in what AI gave me. |Checking took longer than [prompting, because I had to find why the numbers didn't match. Without checking I would have shared the wrong strongest program.  |

## Decision

**Decision:** ☐ Accept  ☒ Edit  ☐ Reject

**Rationale (2–4 sentences):** Why this decision? What would have to change for a different one? 
the AI got the math right and caught all 5 problems, but it made its own call on the 31 row, and that changed the headline. this could use human output a person should check the sign in sheet before the summary is shared.



**If you chose Edit, what you'd change:** 

- show the overall rate both ways: with and without the oct 13 row.
- you cant call any program "strongest" until the 31 row is checked or out the data problems at the top so the manager see's them first. 
