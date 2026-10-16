# Prompt Cookbook

**Name:** 

A recipe is a prompt you can **reuse**: same structure, new ingredients. Write prompts you'll actually use for studying, writing, code, or your sprint project.

Every recipe needs all fields filled in. Keep private data out of the prompts and the sample results.

---

## Example recipe (already done, don't count this one)

- **Name:** Explain an error message
- **Goal:** Understand a confusing error before I try to fix it.
- **Prompt:**

```text
You are a patient JavaScript tutor for a beginner.
Explain the error message below in plain language.
Context: I'm running a Node.js script from the terminal. Here is the line
the error points to: <paste one line of code>
Format: 1) What it means in one sentence. 2) The two most common causes.
3) One thing I can check first.
Constraints: Don't rewrite my whole program. If you can't tell the cause
from what I gave you, say what else you need to see.

Error:
<paste the first line of the error>
```

- **Sample result (short):** "It means you tried to read a property of something that's undefined. Common causes: an array index past the end, or a typo in a property name. Check: log the value right before that line."
- **What I checked:** Added a `log.debug` before the line. The value was undefined, so the explanation was correct.
- **Risks to watch:** It may guess a cause that sounds right. The log proves it, the AI doesn't.
- **Peer test:** 

---

## Recipe 1

- **Name:** 
- **Goal:** 
- **Prompt:**

```text
TODO
```

- **Sample result (short):** 
- **What I checked:** 
- **Risks to watch:** 
- **Peer test:** 

## Recipe 2

- **Name:** 
- **Goal:** 
- **Prompt:**

```text
TODO
```

- **Sample result (short):** 
- **What I checked:** 
- **Risks to watch:** 
- **Peer test:** 

## Recipe 3

- **Name:** 
- **Goal:** 
- **Prompt:**

```text
TODO
```

- **Sample result (short):** 
- **What I checked:** 
- **Risks to watch:** 
- **Peer test:** 
