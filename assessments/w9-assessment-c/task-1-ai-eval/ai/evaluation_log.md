# AI Evaluation Log

**Name:** Amir Husseini
**Dataset:** `data/dataset.csv`
**Provenance (where the data came from):** Fictional training data created by i.c.stars Tech Foundations staff, based on a weekly sign-in sheet export.
**AI tool and date:** ChatGPT, October 29, 2026

Compare `ai/ai_output.md` against `baseline.md`. Evidence means a number, a row, or a quote, not a feeling.
You need **at least 2 criteria** with evidence and **at least 1 gap or risk**.

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
| **Accuracy**: are the numbers right? |Overall attendance was 81.4%, with Teen Coding Club highest and Adult Digital Skills lowest.  |Reports the same attendance rate and program rankings.  |398 attended out of 489 registered seats. Teen Coding Club is 87.5%, and Adult Digital Skills is 70.8%.  |The numbers match, but the 31 attendees recorded against 24 registered needs to be checked.  |
| **Completeness**: did it catch the data problems? |Identifies the duplicate row, missing count, site closure, unusual attendance, and site name difference.  |Mentions all these data issues.  |Adult Digital Skills appears twice on Sept. 22. Homework Help is blank on Oct. 6, and Teen Coding Club has 31 attendees on Oct. 13.  |The AI does not explain that the overall attendance rate would be 78.9% if the unusual Teen Coding Club row were removed.  |
| **Bias / privacy risk**: any unfair framing, invented claims, or PII? |Uses attendance figures and explains the data limitations without personal information.  |Also focuses on the data and does not include personal information.  |The dataset contains program names, dates, and attendance counts, with no personal details.  |The summary should not be used to judge program performance until the unusual count and missing data are checked.  |
| **Time saved**: minutes with AI vs. writing it yourself |A human-written summary provides the baseline for comparison.  |The AI produced a summary quickly.  |It took only a few minutes to generate the summary, compared with writing and checking it manually.  |The time saved is useful, but the numbers still need to be checked.  |

## Decision

**Decision:** ☐ Accept  x Edit  ☐ Reject

**Rationale (2–4 sentences):** Why this decision? What would have to change for a different one?
I would edit the AI output instead of using it exactly as it is. Most of the numbers are correct, and it identifies the main data problems. However, it leaves out how the unusual attendance count affects the overall rate, so I would add that before sharing the summary.


**If you chose Edit, what you'd change:** 

- Add that the overall attendance rate would be 78.9% without the Teen Coding Club row showing 31 attendees.
- Check the unusual attendance count and make sure the duplicate row is not counted twice before using the results.

