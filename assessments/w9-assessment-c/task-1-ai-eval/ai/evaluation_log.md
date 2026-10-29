# AI Evaluation Log

**Name:** Cortez
**Dataset:** `data/dataset.csv`
**Provenance (where the data came from):**Fictional training data created by i.c.stars Tech Foundations staff, modeled on a weekly sign-in sheet export. Counts only; no personal information. 
**AI tool and date:** ChatGPT (GPT-6), October 29, 2026

Compare `ai/ai_output.md` against `baseline.md`. Evidence means a number, a row, or a quote, not a feeling.
You need **at least 2 criteria** with evidence and **at least 1 gap or risk**.

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
# AI Evaluation Log

**Name:** Cortez Hale

**Dataset:** `data/dataset.csv`

**Provenance (where the data came from):** Copy the source information from the header of `baseline.md`.

**AI tool and date:** ChatGPT (GPT-6), October 29, 2026

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
| **Accuracy: are the numbers right?** | The dataset contains 25 records, including a duplicate, and one missing attendance value. | The AI says the overall attendance rate cannot be calculated precisely until the data issues are addressed. | The dataset has 554 registered participants across all rows. The duplicate adds 20 registrations and 16 attendees. The AI does not provide the requested attendance rate. | The AI could have provided a provisional calculation and explained its assumptions. It also identifies Homework Help as the strongest program, but Teen Coding Club has 126 recorded attendees compared with 124 for Homework Help, including the duplicate and excluding the missing value. |
| **Completeness: did it catch the data problems?** | The dataset contains a duplicate record, an inconsistent site name, a missing attendance value, and an attendance count greater than registrations. | The AI identifies all four issues and recommends checking them. | September 22 has two identical Mitchell Street Library records. "Sherman Park Rec Ctr" appears on September 22. October 6 has blank attendance. October 13 reports 31 attendees with only 24 registered. | The AI catches the main issues, but it does not provide the requested numerical attendance rate or fully compare the programs using verified totals. |
| **Bias / privacy risk: any unfair framing, invented claims, or PII?** | The dataset contains program and attendance information, with no personal information about individual participants. | The AI discusses program performance and recommends verification without including personal information. | The AI states that the October 13 count "should be verified" and recommends preserving the zero attendance recorded during the power outage. | No obvious privacy risk was found. However, describing a program as weakest before resolving missing or duplicate data could give the program manager a misleading impression. |
| **Time saved: minutes with AI vs. writing it yourself** | I would need to inspect the records, calculate totals, and write a summary manually. | The AI quickly produced a summary and identified several data quality issues. | The response identifies the duplicate, inconsistent site name, missing attendance, and unusually high attendance. | The AI saved time on the initial review, but its missing calculation and incorrect strongest-program conclusion require additional checking. Enter my actual estimated time saved after comparing the time spent with AI against the time I would have spent working alone. |

## Decision

**Decision:** ☑ Edit ☐ Accept ☐ Reject

**Rationale (2–4 sentences):**

I chose Edit because the AI identified the main data quality issues, but it did not calculate the overall attendance rate requested in the prompt. It also called Homework Help the strongest program, even though the recorded attendance totals show Teen Coding Club with 126 attendees and Homework Help with 124, with one Homework Help value missing. I would verify the duplicate and missing value before finalizing the calculations.

**If you chose Edit, what you'd change:**

- Add a provisional overall attendance rate, clearly explaining how the duplicate and missing value affect the calculation.
- Correct the strongest-program comparison and verify the totals before making final conclusions.




