# T8B: AI Integration in Projects

**i.c.stars Tech Foundations · Week 8**

> Anyone can use AI. The skill is knowing when to trust it.

Last session you wrote prompts and learned the risks. Today you put AI **inside a real workflow**: CohortHub's support inbox (the same support requests from T7B's Card C). You'll build guardrails around the AI step, compare its work to a human baseline, and decide what to accept, edit, or reject. This exact skill is **directly assessed in Week 12 Assessment D**.

**Standards:** AI.KU1 · AI.SK3 · AI.SK4 · AI.O1

---

## Setup (2 minutes)

- Open this folder in VS Code. Node 18+ is all you need. No `npm install`.
- Open your **approved** AI chat tool.
- If this folder isn't a git repo yet, run `git init` and make a first commit.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `data/support-tickets.json` | 12 support tickets. They contain personal data on purpose. | All session |
| `data/it-lead-triage.json` | The **baseline**: how a human triaged them (25 min) | Evaluate |
| `prototype/redact.js` | **Your code.** The input guardrail that removes personal data | Guided Practice |
| `prototype/prompt-template.txt` | The R-T-C-F-C prompt. You may improve it. | Guided Practice |
| `prototype/prepare.js` | Builds the safe prompt and the provenance record | Guided Practice |
| `prototype/evaluate.js` | Output guardrails + AI vs baseline comparison | Guided Practice |
| `ai/ai-triage.sample.json` | A flawed AI run your trainer evaluates live | Modeling |
| `ai/ai-triage.json` | **You create this:** your AI tool's real reply | Guided Practice |
| `EVALUATION_LOG.md` | **Your evaluation log** | All session |

## Commands

| Command | Does |
|---|---|
| `npm test` | Checks your `redact()` guardrail |
| `npm run prepare:prompt` | Writes `out/prompt.txt` + `out/provenance.json` (refuses if personal data remains) |
| `npm run evaluate` | Checks `ai/ai-triage.json` and compares it to the baseline |
| `npm run evaluate:sample` | Same, using the trainer's sample AI output |
| `npm run check` | Shows which parts of your artifact are done |

---

## Where AI fits in a workflow

AI never gets the first or last word. It goes **between two guardrails**, and a human makes the call:

```
 data ──► INPUT GUARDRAIL ──► AI step ──► OUTPUT GUARDRAIL ──► HUMAN DECISION ──► action
          remove personal      triage      valid format?        accept / edit /
          data, send only      tickets     allowed values?      reject
          what's needed                    nothing leaked?
```

| Guardrail | Rule |
|---|---|
| **No personal data in prompts** | Names, emails, phones, IDs never reach the AI. Send only the fields the task needs. |
| **Document data provenance** | Write down where the data came from, who owns it, what you sent, which tool, and when. |
| **Validate the output** | Check the format and allowed values with code. AI invents categories and skips items. |
| **Human decides** | Every AI output is accepted, edited, or rejected by a person. |

## The comparison rubric

You'll use this again in Week 12. Score baseline and AI from 1 (poor) to 3 (strong), with evidence.

| Criterion | Question |
|---|---|
| **Accuracy** | Is it right? Count matches, then judge the disagreements. |
| **Completeness** | Did it handle everything, or skip or invent items? |
| **Bias risk** | Did it treat tickets differently because of *how* they were written (slang, another language)? |
| **Privacy risk** | Could personal data leak, in the prompt or in the output? |
| **Time saved** | Minutes saved, **after** counting your review and fix-up time. |

Then decide: **accept**, **edit**, or **reject**.

---

## Guided Practice (pairs, 25 min)

**1. Build the input guardrail (8 min).** Run `npm test`. The email test passes but phone and ID tests fail. Finish the TODOs in `prototype/redact.js` until all 5 tests pass. Commit: `feat: redact phones and student IDs before prompting`.

**2. Prepare the prompt (2 min).** Run `npm run prepare:prompt`. If it refuses, your guardrail is doing its job. Go back to step 1. Open `out/provenance.json` and fill in `sentTo`.

**3. Run the AI step (5 min).** Paste all of `out/prompt.txt` into your approved AI tool. Save the reply **exactly as it came back** as `ai/ai-triage.json`. Time how long this takes.

**4. Evaluate (10 min).** Run `npm run evaluate`. Then fill in `EVALUATION_LOG.md` sections 1–5. Look hard at:
- **T-105** and **T-106**: informal English and Spanish. Did AI rate them lower than their impact?
- **T-110**: is a phishing click "account" or something else? What does your guardrail allow?
- Anything AI flagged `needsHuman`.

Commit your log and AI output: `docs: evaluation log for AI ticket triage`.

**Stretch:** improve `prompt-template.txt`, re-run, and record whether accuracy changed.

## Application: Peer share (whole room, 10 min)

Each pair shares one **success** and one **failure** in 60 seconds. Did other pairs get different AI answers from the same prompt? Why might that be? Write what you hear in section 6 of your log.

## Before you leave

```bash
npm run check
```

Your **artifact** is:

- [ ] **AI-enhanced prototype:** `redact()` passing all tests, a prepared prompt, and your real AI output in `ai/ai-triage.json`
- [ ] **Evaluation log:** guardrails + provenance, rubric scored with evidence, 5+ ticket decisions, an overall decision

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | AI output used as-is. No baseline comparison. Personal data sent to AI. |
| Emerging | Some redaction. Comparison is general ("AI was pretty good"). No ticket-level decisions. |
| Developing | Redaction works. Rubric filled but evidence is thin. A few accept/edit/reject decisions. |
| **Proficient** | Guardrails in place on both sides. Provenance documented. Rubric scored with real evidence. Clear decisions on every disagreement, including bias checks. |
| Advanced | Prompt or guardrails improved and re-tested with a before/after result. Clear proposal for where AI belongs in the workflow and what stays human. |

Limited or Emerging? You'll join a 30-minute AI practice clinic this week. That's practice, not punishment.

---

**Judgment is the skill. AI is just the tool.**
