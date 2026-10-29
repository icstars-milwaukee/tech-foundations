# AI Evaluation Log

**Name:** LaQuesha Bell  
**Dataset:** `data/dataset.csv`  
**Provenance (where the data came from):** Fictional training data created by i.c.stars Tech Foundations staff, modeled on a weekly sign-in sheet export; counts only, no personal information.  
**AI tool and date:** Copilot (AI assistant in VS Code), October 29, 2026

Compare `ai/ai_output.md` against `baseline.md`. Evidence means a number, a row, or a quote, not a feeling.
You need **at least 2 criteria** with evidence and **at least 1 gap or risk**.

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
| **Accuracy**: are the numbers right? | 398 attendees out of 489 registered seats (81.4%). Teen Coding Club 87.5%, Adult Digital Skills 70.8%. | The AI identified attendance trends but did not include attendance calculations. | The baseline reports 398/489 (81.4%), Teen Coding Club 87.5%, and Adult Digital Skills 70.8%. | Attendance rates and totals are missing from the AI summary. |
| **Completeness**: did it catch the data problems? | Notes duplicate Sept. 22 Adult Digital Skills row, Sept. 29 power outage, missing Oct. 6 count, and Oct. 13 Teen Coding Club 31/24 mismatch. | The AI provided a general summary but did not mention these issues. | Sept. 22 duplicate row; Oct. 13 record shows 31 attendees and 24 registered. | Important data-quality issues were omitted. |
| **Bias / privacy risk**: any unfair framing, invented claims, or PII? | Uses attendance counts only and contains no personal information. | Uses neutral language and contains no personal information. | Dataset contains attendance counts only and no names. | Low risk; no privacy concerns identified. |
| **Time saved**: minutes with AI vs. writing it yourself | No time estimate is included in the baseline. | AI generated a summary quickly  | AI produced a draft summary in seconds. | Exact time savings were not measured.
