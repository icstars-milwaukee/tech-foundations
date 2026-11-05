# AI Evaluation Log

**Name:** Desmond Scott
**Dataset:** `data/dataset.csv`
**Provenance (where the data came from):** Fictional training data created by i.c.stars Tech Foundations staff, modeled on a weekly sign-in sheet export; counts only, no personal information.
**AI tool and date:** Copilot (AI assistant in VS Code), October 29, 2026

Compare `ai/ai_output.md` against `baseline.md`. Evidence means a number, a row, or a quote, not a feeling.
You need **at least 2 criteria** with evidence and **at least 1 gap or risk**.

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
| **Accuracy**: are the numbers right? | 22 usable sessions: 398/489, or 81.4%; Teen Coding Club 87.5%, Adult Digital Skills 70.8%. | Reports the same totals, overall rate, and program rates. | The output gives “398 people attended out of 489 registered seats” and the two program rates. The baseline counts 24 program-weeks after deduplication, then excludes the closure and blank rows, leaving 22 usable sessions. | No arithmetic discrepancy found in the cited figures; the 31/24 count still needs source verification. |
| **Completeness**: did it catch the data problems? | Identifies the duplicate Sept 22 Adult Digital Skills row, closure-related zero, missing Oct 6 count, 31 attendees against 24 registered, and “Rec Ctr” spelling variant. | Identifies all five issues. | The output names the Sept 22 duplicate, Sept 29 closure, Oct 6 missing count, Oct 13 31/24 count, and “Rec Ctr.” | It does not quantify the effect of excluding the questionable Teen count; the baseline gives 78.9% as the resulting overall rate. |
| **Bias / privacy risk**: any unfair framing, invented claims, or PII? | Counts only; no personal information. Notes data limitations without attributing causes beyond the recorded closure and missing sheet. | Uses neutral language, includes no PII, and does not infer a cause for the attendance trend. | The output describes attendance counts and recorded data issues only; it says the zero “reflects a site closure.” | Low risk. The trend should not be presented as evidence of why attendance changed. |
| **Time saved**: minutes with AI vs. writing it yourself | No time estimate is included in the baseline. | No measured time comparison is included in the output. | No start/end times or manual-writing comparison were recorded. | Time saved cannot be established from this exercise. |

## Decision

**Decision:** ☐ Accept  ☒ Edit  ☐ Reject

**Rationale (2–4 sentences):** The AI output matches the baseline’s core calculations and identifies the listed data-quality problems without adding unsupported explanations or personal information. I would edit it to show the baseline’s 78.9% sensitivity result if the questionable 31-attendee row is excluded, clearly labeling that as a check rather than a confirmed correction. I would accept it after that caveat is included and the source count is verified before using the summary for decisions.



**If you chose Edit, what you'd change:** 

- Add the 78.9% sensitivity result for excluding the Teen Coding Club Oct 13 count, with a clear note that the count needs verification.
- Confirm the duplicate row and the 31/24 count against the source records before relying on the totals.
