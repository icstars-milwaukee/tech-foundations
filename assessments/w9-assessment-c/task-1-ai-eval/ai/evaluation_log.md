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
| **Accuracy**: are the numbers right? | The dataset has 25 rows with 1 duplicate, leaving 24 program-weeks. After excluding the closure-related zero and the missing count, there are 22 usable sessions with 398 attendees out of 489 registered seats (81.4%). | The AI correctly identified the four programs and attendance trends but did not include the attendance totals or attendance-rate calculations. | The baseline reports 398 attendees out of 489 seats (81.4%), Teen Coding Club at 87.5%, and Adult Digital Skills at 70.8%. These values were not included in the AI summary. | Missing calculations could cause readers to miss the actual attendance rates and totals. |
| **Completeness**: did it catch the data problems? | The baseline identifies a duplicate Adult Digital Skills row on Sept. 22, a 
