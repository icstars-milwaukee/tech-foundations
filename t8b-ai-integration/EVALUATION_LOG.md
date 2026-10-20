# AI Evaluation Log

**Names:** Luke, Q, Ventura

Fill this in **while** you work. Use `out/evaluation-report.md` and `out/provenance.json` as evidence.

---

## 1. The workflow

- **Task AI is helping with:**
- **Before (no AI): who does what, how long it takes:**
- **After (with AI): which step AI does, which steps stay human:**

## 2. Guardrails

- **Personal data removed before prompting (what + how):**
- **Fields never sent to AI at all:**
- **Provenance: where the data came from:**
- **Provenance: who owns it, and do we have permission to use it:**
- **Provenance: which AI tool it was sent to, and when:**
- **Output guardrail problems found by `npm run evaluate`:**

## 3. Comparison rubric

Score each from **1** (poor) to **3** (strong). Evidence = a ticket ID, a number, or a quote. Not a feeling.

| Criterion                                                 | Baseline (IT lead) | AI  | Evidence |
| --------------------------------------------------------- | ------------------ | --- | -------- |
| **Accuracy**: right category and priority?                |                    |     |          |
| **Completeness**: every ticket handled?                   |                    |     |          |
| **Bias risk**: any ticket judged by _how_ it was written? |                    |     |          |
| **Privacy risk**: could personal data leak?               |                    |     |          |
| **Time saved** (minutes, including your review time)      |                    |     |          |

## 4. Decisions, ticket by ticket

At least **5 tickets**. Start with every ticket where AI and the baseline disagree.

- **Accept:** the AI output is right as-is.
- **Edit:** close, but a person has to fix it.
- **Reject:** wrong or unsafe. Don't use it.

| Ticket | AI said | Baseline said | Decision | Why                                                |
| ------ | ------- | ------------- | -------- | -------------------------------------------------- |
| T101   |         |               | Edit     | With hardware issues, a human should be involved   |
|        |         |               |          |                                                    |
|        |         |               |          |                                                    |
| T103   |         |               | Reject   | Urgent because whole team impacted, AI said normal |
|        |         |               |          |                                                    |

## 5. Overall decision

- **Should this AI step go into the real workflow? (accept / edit / reject):**
- **What a human must ALWAYS do in this workflow:**
- **One change to the prompt or guardrails, and why:**

## 6. Peer share

- **Where AI succeeded for us:**
- **Where AI failed for us:**
- **Something another team found that surprised us:**
