# AI Evaluation Log

**Name:** Ventura Perez
**Dataset:** `data/dataset.csv`
**Provenance (where the data came from):** Fictional training data made by i.c.stars Tech Foundations staff, modeled on a weekly sign-in sheet export. It covers Fall 2026 weekly attendance for four free community tech programs at Milwaukee sites, weeks of Sept 8 – Oct 13, 2026. Counts only, no personal information. The prompt states this same provenance.
**AI tool and date:** Claude Code CLI 2.1.305 (Claude Opus 5.5), 2026-10-29 at 1:19 PM CDT. Every tool was turned off and it ran from an empty folder, so it saw only the prompt and never `baseline.md`.

**How I checked:** I recomputed every figure from `data/dataset.csv` with a short Node script, then matched each number in the AI output against it. "Line" means a line in `dataset.csv`: the header is line 1, so the data runs from line 2 to line 26.

## Comparison

| Criterion | What the baseline says | What the AI says | Evidence (number, row, or quote) | Gap or risk found |
|---|---|---|---|---|
| **Accuracy**: are the numbers right? | 398 / 489 = **81.4%** over 22 sessions. Teen Coding Club is highest (87.5%), Adult Digital Skills lowest (70.8%). 78.9% if line 23 is left out. | Headline is **78.9%** (367 / 465) over 21 sessions. **Senior Tech Help** is strongest (84.0%), Adult Digital Skills weakest (70.8%). It gives 81.4% and Teen Coding Club's 87.5% only as "if it's included." | **32 of 32 numbers are correct; none are invented.** Teen Coding Club, lines 2, 6, 10, 15, 19, 23: 18+20+17+21+19+31 = 126 / 144 = 87.5%; without line 23 it's 95 / 120 = 79.2%. Senior Tech Help, lines 5, 9, 14, 22, 26: 63 / 75 = 84.0%. | The math is right, but the headline is not the baseline's. The AI dropped line 23 (31 attended, 24 registered) because it *looks* wrong, not because anything says it is. That one row decides the strongest program and moves the overall rate by 2.5 points. Someone who reads only the first three lines gets the opposite answer from the baseline. |
| **Completeness**: did it catch the data problems? | Five problems: duplicate (lines 11–12), 0 for a closed site (line 18), blank count (line 21), 31 attended for 24 seats (line 23), "Rec Ctr" spelling (line 13). Also notes Adult Digital Skills slipping to 12 by Oct 13. | **Caught all five** and said how it handled each one. Also gave rates for all four programs; the baseline gives two. | "Bay View shows 0 attended on Sept 29 because of a power outage. I left this row out because no session took place." / "I left the row out instead of counting it as zero." It matched **7 of 12** baseline points (scorecard below). | **Missed the Adult Digital Skills decline.** Lines 3, 7, 11, 16, 20, 24 read 15, 14, 16, 13, 15, 12, so the last week is its lowest. That's the point a program manager can most easily act on. It also never says there are 24 program-weeks, and it ran 211 words when I asked for about 150. |
| **Bias / privacy risk**: any unfair framing, invented claims, or PII? | Neutral. Counts only, no PII. | No PII, no claims beyond the data, no loaded language about any age group. | It used only dates, sites, programs, counts, and notes. The prompt had no PII (the dataset has none and I added none). Every number traces to the CSV, so the "only use numbers in the data" rule held. | **Lopsided exclusion.** The one row it dropped on suspicion alone is the row that makes Teen Coding Club look best. If 31 is real (walk-ins), the summary undersells the teen program and names a different program "strongest," which matters in a funding conversation. On privacy: this is fine for fictional data, but a real sign-in sheet (names of kids 8–17 and adults 60+) must never go into a cloud AI tool. |
| **Time saved**: minutes with AI vs. writing it yourself | Doing it by hand (estimate): 25–30 min to tally 24 program-weeks, spot five problems, work out five rates, and write it up. | With AI, about 15 min total (estimate): 3 min to fill in the scaffold, 35 s for the AI, about 8 min to check 32 numbers against the CSV, and 3 min to decide on edits. | AI response times were 35 s, 27 s, and 28 s over three runs (measured). The check script ran in under a minute. | Saves 10–15 min (about 40–50%), **but only once the check is counted.** Skipping the check saves about 25 min, but then the summary names a different "strongest program" than the baseline does. Checking takes about half the AI workflow. |
| **Reliability**: same answer every time? (extra criterion) | One human summary, no reruns. | I ran the same prompt 3 times. All three led with 78.9%, named Senior Tech Help strongest, caught 5 of 5 problems, and missed the Adult Digital Skills trend. | All three runs are in `ai_output.md`. They had 0 wrong numbers and ran 211, 213, and 249 words for a 150-word ask. | The answer is consistent, so the gap with the baseline comes from **the prompt, not chance**. That makes it fixable: a clear rule in the prompt should change the result every time (tested below). The length limit was ignored in every run. |

### Scorecard: baseline points vs. AI

| # | Baseline point (`dataset.csv` line) | AI run 1 | Refined prompt (2 runs) |
|---|---|---|---|
| 1 | 25 rows; Adult Digital Skills Sept 22 is a duplicate (11–12) | Match | Match |
| 2 | 24 program-weeks (4 programs × 6 weeks) | Missing | Match in 1 of 2 |
| 3 | Senior Tech Help Sept 29 is 0 because of a power outage, left out (18) | Match | Match |
| 4 | Homework Help Oct 6 is blank, left out (21) | Match | Match |
| 5 | 22 sessions in the averages | Differs (uses 21) | Match |
| 6 | Overall 398 / 489 = 81.4% | Differs (second figure only) | Match |
| 7 | Teen Coding Club highest at 87.5% | Differs (names Senior Tech Help) | Match |
| 8 | Adult Digital Skills lowest at 70.8% | Match | Match |
| 9 | Adult Digital Skills slipping to 12 by Oct 13 (3, 7, 11, 16, 20, 24) | Missing | Match |
| 10 | Teen Coding Club's 31 vs. 24 on Oct 13 needs checking (23) | Match | Match |
| 11 | 78.9% without that row | Match | Match |
| 12 | "Rec Ctr" spelling (13) | Match | Match |
| | **Total** | **7 match, 3 differ, 2 missing** | **11 and 12 of 12** |

## Decision

**Decision:** ☐ Accept  ☑ **Edit**  ☐ Reject

**Rationale (2–4 sentences):** Nothing in it is wrong: all 32 numbers check out against `dataset.csv` and it caught all five data problems, so there's no reason to reject it. I can't accept it as-is, though, because its headline (78.9%, Senior Tech Help strongest) depends on dropping line 23 on a hunch, which is the opposite of the baseline's choice, and it leaves out the Adult Digital Skills decline. If site staff confirmed the 31 was a typo, the AI's headline would be right and I'd only add the trend. If any number had been wrong or a problem had been missed, I'd reject it and write my own.

**If you chose Edit, what you'd change:**

- Lead with 81.4% (398 / 489, 22 sessions) and Teen Coding Club strongest at 87.5%. Put 78.9% and Senior Tech Help right next to them as the "if line 23 is a typo" figures, not at the bottom.
- Add the trend: Adult Digital Skills fell to 12 on Oct 13, its lowest week.
- State the counts: 25 rows, 24 program-weeks, 22 sessions used.
- Cut it to about 150 words by giving each data problem one short line.

**Edited version (what I'd send):**

> **Fall 2026 attendance, weeks of Sept 8 – Oct 13**
>
> The file has 25 rows. One is a duplicate (Adult Digital Skills, Sept 22), which leaves 24 program-weeks. Two of those have no usable count and are left out: Senior Tech Help's site was closed Sept 29 for a power outage, and Homework Help's Oct 6 sign-in sheet wasn't returned.
>
> Across the other 22 sessions, **398 of 489 registered seats were filled (81.4%)**.
>
> - **Strongest:** Teen Coding Club, 87.5% (126 / 144)
> - Senior Tech Help 84.0% (63 / 75); Homework Help 82.7% (124 / 150)
> - **Weakest:** Adult Digital Skills, 70.8% (85 / 120). It dropped to 12 attendees on Oct 13, its lowest week.
>
> **Please confirm:** Teen Coding Club shows 31 attendees for 24 seats on Oct 13. If that's a typo, the overall rate is 78.9% and Senior Tech Help is strongest. Also, "Sherman Park Rec Ctr" (Sept 22) is the same site as Sherman Park Rec Center.

## Going further

### Time vs. quality

| Approach | Time per report | Numbers right | Baseline points | Risk |
|---|---|---|---|---|
| Write it by hand | 25–30 min (est.) | (it is the baseline) | 12 / 12 | Slow, and easy to slip on the math |
| AI output pasted as-is | about 4 min (est.) | 32 / 32 | 7 / 12 | Names the wrong "strongest program" and has no trend |
| AI plus check plus edit (what I did) | about 15 min (est.) | 32 / 32 | 12 / 12, plus two extra program rates | Checking takes half the time |
| Refined prompt plus script check (next time) | about 6 min (est.), after a one-time setup | all correct in 2 of 2 runs | 11–12 / 12 | Still over the word limit, still needs a person to read it |

**Bottom line:** used as-is with a manual check, AI saves 10–15 minutes per report (about 40–50%). With the refined prompt and a check script it saves about 20 minutes per report (about 75%) and reaches baseline quality. For a weekly report, that's about 2 hours over a six-week term.

### Prompt refinements (tested)

I added these lines to the prompt and ran it twice. The raw replies are at the bottom of `ai_output.md`.

1. In **Include**: `any program whose attendance is going up or down week to week`
2. `Say how many rows, program-weeks, and sessions you used.`
3. `Count exact duplicate rows once. Leave a row out only if its notes say no session happened or the count is missing.`
4. `If a count looks wrong but has no note explaining it, keep it in the headline numbers, flag it, and give the rate without it as a second figure.`
5. `Keep it under 170 words.`

**Result:** both runs led with 81.4% and Teen Coding Club, both flagged line 23 with the 78.9% fallback, both reported the Adult Digital Skills drop, and every number was correct. Rule 5 was ignored (228 and 216 words). Next I'd try a fixed format, like "five bullets, one line each," instead of a word count.

Rules 3 and 4 aren't copied from the baseline. They're data-handling decisions an organization should make once and write down (guardrail 1 below). The AI's choice wasn't unreasonable; it just wasn't anyone's agreed rule.

### Workflow refinements

- **Code for the math, AI for the words.** A short script computes the totals from the CSV, and the AI writes the summary from those totals. The check drops from about 8 minutes to about 1, and the AI can't get the math wrong.
- **Run it more than once.** Two or three runs take under 2 minutes. If the headline changes between runs, the data holds a judgment call a person needs to make. Here it didn't change, which showed the gap came from the prompt.
- **Check against a must-have list.** Keep a short checklist like the scorecard above and tick it off for every AI draft before anyone else sees it.

### Org-level guardrails

1. **Write the data rules down once.** One page, owned by one person, covering closures, missing sheets, duplicates, and impossible counts. Put the same rules in the prompt template so every person and every AI run handles the data the same way. Missing rules are exactly what split the AI from the baseline here.
2. **No unchecked AI numbers.** Every AI-drafted figure gets recomputed from the source file, by a second person or a script, before it leaves the team, and the check gets logged like this one.
3. **Control what goes in.** Only fictional, aggregated, or de-identified data goes into AI tools, through an organization-approved account with its data-retention settings checked. Real sign-in sheets with names of kids 8–17 and adults 60+ never go in. Every prompt states where the data came from.
4. **Label and keep.** Mark reports "AI-assisted, checked by ___" and keep the prompt, raw output, and log on file.
5. **Fix it at the source.** Give the sign-in form a site dropdown (no more "Rec Ctr"), make the attendance field required with a "no session" checkbox, and add a walk-in count so a case like 31 attended for 24 seats comes with an explanation.
