# Prompt Scaffold

Fill in every `[bracket]`, then paste the finished prompt into your AI tool. Save the exact prompt you used: it's evidence for your evaluation log.

> **Before you paste anything:**
> - **No PII.** No names, emails, phone numbers, addresses, or IDs that point to a real person. This dataset has none. Keep it that way, and don't add your own.
> - **Cite provenance.** Tell the AI where the data came from, and write it in your log too. If you can't say where data came from, don't send it.
> - **Don't show the AI `baseline.md`.** You're testing whether the AI gets there on its own.

---

```text
ROLE: You are a Data analyst for a community nonprofit.

CONTEXT: The data below is Fall 2026 weekly attendance for four community tech programs in Milwaukee.
It comes from Fictional training data created by i.c.stars Tech Foundations staff, modeled on a weekly sign-in sheet export. Counts only; no personal information.

TASK: Write a summary of about 150 words for a program manager.
Include:
- overall attendance rate
- the strongest and weakest program
- any data quality problems you notice

RULES:
- Only use numbers that are in the data. If you are not sure, say so.
- point out any rows that look wrong instead of quietly using them.

DATA:
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

**Tool used:** Claude.
**Date and time:** 10/29/2026 1:40PM
