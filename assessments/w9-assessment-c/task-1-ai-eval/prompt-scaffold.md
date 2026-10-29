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
- [what to report, e.g. "overall attendance rate"]
- [what to report, e.g. "the strongest and weakest program"]
- [what to report, e.g. "any data quality problems you notice"]

RULES:
- Only use numbers that are in the data. If you are not sure, say so.
- [one more rule you think matters]

DATA:
[paste the contents of data/dataset.csv here]
```

---

**Tool used:** [e.g. Copilot, ChatGPT, Claude]
**Date and time:** [when you ran it]
