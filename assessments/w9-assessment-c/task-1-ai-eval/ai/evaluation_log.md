# AI Evaluation Log

**Name:** Jose
**Dataset:** `data/dataset.csv`
**Provenance (where the data came from):** Fictional training data created by i.c.stars Tech Foundations staff (per `baseline.md`), modeled on a weekly sign-in sheet export: attendance for four free community tech programs at Milwaukee sites, weeks of Sept 8 - Oct 13, 2026. Counts only, no personal information. My prompt told the AI it came from a program manager (the scaffold's wording).
**AI tool and date:** Claude, 10/29/2026 1:31 PM Central Time

Compare `ai/ai_output.md` against `baseline.md`. Evidence means a number, a row, or a quote, not a feeling.
You need **at least 2 criteria** with evidence and **at least 1 gap or risk**.

I recomputed every figure from `data/dataset.csv` before judging either summary. The baseline's numbers all check out (22 sessions, 398 of 489 = 81.4%; 367 of 465 = 78.9% without the Teen Coding Club 31; per-program rates). The AI's individual numbers are mostly real, but it chose different data treatments for its headline and ranked the programs inconsistently.

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
| **Accuracy**: are the numbers right? | 398 of 489 seats = **81.4%** across 22 sessions (duplicate, blank week, and outage week all excluded). Strongest: Teen Coding Club 87.5%. Weakest: Adult Digital Skills 70.8%. | Headline: "about 79% (398 attended of 504 registered)", and "about 81% if you exclude the power-outage week." Strongest is listed as Homework Help 82.7%, then Senior Tech Help 84.0%, then Teen Coding Club 87.5%. Weakest: Adult Digital Skills 70.8%, "lowest however the data is cut." | 504 = 534 total registered minus 30 for the blank Homework Help row. That keeps the Bay View outage row (0 attended, 15 registered) in the denominator: 398/504 = 79.0%, versus 398/489 = 81.4% when the outage is excluded. Per program: Teen 126/144 = 87.5%, Adult 85/120 = 70.8%, Homework 124/150 = 82.7%, Senior 63/75 = 84.0% (or 63/90 = 70.0% with the outage counted as 0). | (1) The **headline treats a closed site as zero turnout**, 2.4 points below the baseline, even though the AI itself says the outage is "a closure rather than low turnout." (2) **"Strongest" is wrong or at best muddled:** Homework Help (82.7%) is named first, but the AI's own numbers show Teen Coding Club (87.5%) and Senior Tech Help (84.0%) are higher. (3) **"Lowest however the data is cut" is false:** with the outage counted, Senior Tech Help is 70.0%, which is below Adult Digital Skills at 70.8%, and the AI printed that 70.0% itself. |
| **Completeness**: did it catch the data problems? | Five problems: duplicate Adult Digital Skills row (9/22), Senior Tech Help 0 on 9/29 (power outage), blank Homework Help count on 10/6, Teen Coding Club 31 attended vs 24 registered on 10/13, and "Rec Ctr" vs "Rec Center." | Caught the same five, including the duplicate, the 31 vs 24, the blank sign-in sheet, the outage zero, and the inconsistent site name. Asked me to confirm the 31 instead of deciding for me. | `dataset.csv` rows: 9/22 Mitchell Street (twice, identical), 9/29 Bay View ("site closed - power outage"), 10/6 Sherman Park (blank, "sign-in sheet not returned"), 10/13 Washington Park (31 vs 24), 9/22 "Sherman Park Rec Ctr." | Complete on problems, but not on method: it never says how many sessions the rate is based on (the baseline's 22) and gives the 79% and 81% side by side without saying which one the manager should use. It was also longer than asked: about 259 words against "about 200." |
| **Bias / privacy risk**: any unfair framing, invented claims, or PII? | No PII. No claims beyond the counts. | No PII. Two claims go beyond the data. "Homework Help ... with the steadiest numbers" shows no figures. "Likely a typo or walk-ins" for the 31 is a guess, though it is hedged ("I'm not sure whether the 31 is an error"). | The dataset has no personal data, my prompt added none, and the output contains only program and site names. For "steadiest": by raw attendance counts Senior Tech Help (11-14, a spread of 3) varies less than Homework Help (22-27, a spread of 5), and the AI never says which measure it used. | The risk is **confident-sounding claims a manager could repeat without checking**. The 79% headline also lands almost exactly on the baseline's separate "78.9% without the 31" figure, which could look like confirmation when it comes from different reasoning (outage counted as zero, not the 31 removed). |
| **Time saved**: minutes with AI vs. writing it yourself | About 15 min by hand (estimate: 25 rows, dedupe, two exclusions, per-program rates). | About 2 min to prompt and run, plus about 12 min to check its numbers against the CSV (estimate). | The 12 minutes were the real work: recomputing 398, 504, and the four program rates to find the 79% vs 81.4% split and the contradiction in "lowest however the data is cut." | **Net saving is roughly zero** once verification is counted. Without the check, the manager would have received a wrong headline and a wrong "strongest program." (Estimates: replace with your own timing if you tracked it.) |

## Notes on my prompt

- In the saved `prompt-scaffold.md`, the line `one more rule you think matters` is still the template placeholder. The AI answered it by proposing its own rule at the end of its reply ("If a row looks wrong, don't silently fix or drop it. Flag it and show the number both with and without it."). That is a good rule and I would keep it, but next time I should write my own rule before running the prompt, and tell the AI how to treat closures (exclude them from the rate, don't count as 0).
- The prompt never told the AI which treatment to use for the outage week, which likely explains why its headline and the baseline disagree.

## Decision

**Decision:** ☐ Accept  ☒ Edit  ☐ Reject

**Rationale (2-4 sentences):** The AI found all five data problems and its building-block numbers are real, so rejecting it would throw away a useful draft. But it cannot go to the program manager as-is: the headline rate counts a closed site as zero turnout (79.0% vs 81.4%), the strongest program is named wrongly, and "lowest however the data is cut" is contradicted by its own 70.0% for Senior Tech Help. I would accept it with a few fixes, and I would only fully accept a version whose headline number matches a rate I can reproduce from the CSV and which commits to one clear treatment of the outage and blank weeks.

**If you chose Edit, what you'd change:**

- Make the headline **81.4% (398 of 489 seats, 22 sessions)** and say plainly that the duplicate row, the blank 10/6 Homework Help week, and the 9/29 power-outage week were left out; mention 79.0% only as "if the outage week were counted as zero."
- Name **Teen Coding Club (87.5%)** as the strongest program, with the caveat that it drops to 79.2% if the 31 attended on 10/13 turns out to be a typo; Senior Tech Help (84.0%, outage excluded) is second.
- Change "lowest however the data is cut" to "Adult Digital Skills is lowest at 70.8% (Senior Tech Help only drops below it, to 70.0%, if the outage week is counted as zero)."
- Delete "steadiest numbers" or support it with a figure; keep "please confirm the 31" and the "flag, don't silently drop" rule.
- Trim to about 200 words.
