# AI Evaluation Log

**Name: Dj,** 
**Dataset:** `data/dataset.csv`
**Provenance (where the data came from): Claude Opus 5.5 High** 
**AI tool and date: Claude Opus 5.5 High, 10-29-26, 11:20** 

Compare `ai/ai_output.md` against `baseline.md`. Evidence means a number, a row, or a quote, not a feeling.
You need **at least 2 criteria** with evidence and **at least 1 gap or risk**.

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
| **Accuracy**: are the numbers right? |398 / 489 correct  | 367 / 465 correct | 81.4% vs 78.9% | Different top program |
| **Completeness**: did it catch the data problems? | 5 / 5 problems | 5 / 5 problems | Duplicate, 0, blank, 31 / 24, Rec Ctr | Missed Adult Digital Skills & Dropped from 16 to 12 |
| **Bias / privacy risk**: any unfair framing, invented claims, or PII? | 31 / 24, needs checking | 31 / 24, "impossible" | Teen Coding Club 10/13 | Overclaim, no PII |
| **Time saved**: minutes with AI vs. writing it yourself | ~20 min by hand  | 12 min with ai | 2 min run + 10 min check | ~20 min saved |

## Decision
                            
**Decision:** ☐ Accept ☒ Edit  ☐ Reject

**Rationale (2–4 sentences):** Numbers are correct and all problems were caught, so no need ro reject, It starts with 78.9% instead of 81.4% and calls 31/24 "impossible, it's also 250 words and not 150



**If you chose Edit, what you'd change:** 

- Need to change leading number
- 31/24 "Impossible" When only needs checking
- 150 Words

