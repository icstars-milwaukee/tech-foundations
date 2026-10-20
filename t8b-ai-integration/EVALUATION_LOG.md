# AI Evaluation Log

**Names:** Amir Cortez 

Fill this in **while** you work. Use `out/evaluation-report.md` and `out/provenance.json` as evidence.

---

## 1. The workflow

- **Task AI is helping with:** 
- **Before (no AI): who does what, how long it takes:** 
- **After (with AI): which step AI does, which steps stay human:** 

## 2. Guardrails

- **Personal data removed before prompting (what + how):** Customer names, email addresses, phone numbers, and employee information were removed or replaced with generic labels before sending data to AI.
- **Fields never sent to AI at all:** User contact information, account numbers, passwords, and internal company identifiers.
- **Provenance: where the data came from:** Service desk ticket records provided for the project dataset.
- **Provenance: who owns it, and do we have permission to use it:** The organization that owns the ticketing system provided the data for evaluation and testing purposes.
- **Provenance: which AI tool it was sent to, and when:** The ticket data was sent to the approved AI tool during project testing and evaluation.
- **Output guardrail problems found by `npm run evaluate`:** No critical privacy issues found, but several ticket categories required human review for accuracy.

## 3. Comparison rubric

Score each from **1** (poor) to **3** (strong). Evidence = a ticket ID, a number, or a quote. Not a feeling.

| Criterion | Baseline (IT lead) | AI | Evidence |
|---|---|---|---|
| **Accuracy**: right category and priority? |3  |2  |AI misclassified some tickets that required human judgment.  |
| **Completeness**: every ticket handled? |3  |3  |All tickets received a category and priority.  |
| **Bias risk**: any ticket judged by *how* it was written? |3  |2  |AI occasionally relied on wording rather than ticket context.  |
| **Privacy risk**: could personal data leak? |3  |3  |Personal information was removed before processing.  |
| **Time saved** (minutes, including your review time) |1  |3  |AI categorized tickets in seconds while human review took several minutes.  |

## 4. Decisions, ticket by ticket

At least **5 tickets**. Start with every ticket where AI and the baseline disagree.

- **Accept:** the AI output is right as-is.
- **Edit:** close, but a person has to fix it.
- **Reject:** wrong or unsafe. Don't use it.

| Ticket | AI said | Baseline said | Decision | Why |
|---|---|---|---|---|
| INC-001| Medium Priority| High Priority| Edit| AI underestimated business impact.|
| INC-004| Hardware Issue| Access Issue| Edit| Ticket description focused on login access problems.|
| INC-007| Low Priority| Low Priority| Accept| Classification matched baseline review.|
| INC-010| Software Issue| Software Issue| Accept| Category and priority were correct.|
| INC-015| Medium Priority| High Priority| Reject| AI missed urgency described in the ticket details.|
## 5. Overall decision

- **Should this AI step go into the real workflow? (accept / edit / reject):** 
- **What a human must ALWAYS do in this workflow:** 
- **One change to the prompt or guardrails, and why:** 

## 6. Peer share

- **Where AI succeeded for us:** 
- **Where AI failed for us:** 
- **Something another team found that surprised us:** 
