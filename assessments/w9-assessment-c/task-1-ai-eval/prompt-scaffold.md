# Prompt Scaffold

Fill in every `[bracket]`, then paste the finished prompt into your AI tool. Save the exact prompt you used: it's evidence for your evaluation log.

> **Before you paste anything:**
> - **No PII.** No names, emails, phone numbers, addresses, or IDs that point to a real person. This dataset has none. Keep it that way, and don't add your own.
> - **Cite provenance.** Tell the AI where the data came from, and write it in your log too. If you can't say where data came from, don't send it.
> - **Don't show the AI `baseline.md`.** You're testing whether the AI gets there on its own.

---

```text
ROLE: You are a [role, e.g. "data analyst for a community nonprofit"].

CONTEXT: The data below is [what it is, e.g. "weekly program attendance"].
It comes from [provenance: who made it and how, from the baseline header].
It contains no personal information.

TASK: Write a summary of about [number] words for [audience, e.g. "a program manager"].
Include:
- [what to report: Overall attendance rate averages 70-87% 
- [what to report: Strongest program is Teen Coding Club at 87% and weakest program Adult Digital Skills at 70%
- [what to report: Duplicate records of same site, missing attendance, site name inconsistency, closed site recorded as zero when it should be treated as unavailable. 

RULES:
- Only use numbers that are in the data. If you are not sure, say so.
- [one more rule you think matters]

DATA:
[paste the contents of data/dataset.csv here]
week_start,site,program,age_group,registered,attended,notes
2026-09-08,Washington Park Library,Teen Coding Club,13-17,24,18,
2026-09-08,Mitchell Street Library,Adult Digital Skills,18+,20,15,
2026-09-08,Sherman Park Rec Center,Homework Help,8-12,30,26,
2026-09-08,Bay View Community Center,Senior Tech Help,60+,15,12,
2026-09-15,Washington Park Library,Teen Coding Club,13-17,24,20,
2026-09-15,Mitchell Street Library,Adult Digital Skills,18+,20,14,
2026-09-15,Sherman Park Rec Center,Homework Help,8-12,30,24,
2026-09-15,Bay View Community Center,Senior Tech Help,60+,15,13,
2026-09-22,Washington Park Library,Teen Coding Club,13-17,24,17,
2026-09-22,Mitchell Street Library,Adult Digital Skills,18+,20,16,
2026-09-22,Mitchell Street Library,Adult Digital Skills,18+,20,16,
2026-09-22,Sherman Park Rec Ctr,Homework Help,8-12,30,25,
2026-09-22,Bay View Community Center,Senior Tech Help,60+,15,11,
2026-09-29,Washington Park Library,Teen Coding Club,13-17,24,21,
2026-09-29,Mitchell Street Library,Adult Digital Skills,18+,20,13,
2026-09-29,Sherman Park Rec Center,Homework Help,8-12,30,27,
2026-09-29,Bay View Community Center,Senior Tech Help,60+,15,0,site closed - power outage
2026-10-06,Washington Park Library,Teen Coding Club,13-17,24,19,
2026-10-06,Mitchell Street Library,Adult Digital Skills,18+,20,15,
2026-10-06,Sherman Park Rec Center,Homework Help,8-12,30,,sign-in sheet not returned
2026-10-06,Bay View Community Center,Senior Tech Help,60+,15,14,
2026-10-13,Washington Park Library,Teen Coding Club,13-17,24,31,
2026-10-13,Mitchell Street Library,Adult Digital Skills,18+,20,12,
2026-10-13,Sherman Park Rec Center,Homework Help,8-12,30,22,
2026-10-13,Bay View Community Center,Senior Tech Help,60+,15,13,
```

---

**Tool used:** used Copilot
**Date and time:** October 29,2026 at 1:40PM
