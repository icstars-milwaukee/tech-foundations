# T9B: Sprint 2 Rehearsal & Risks

**i.c.stars Tech Foundations · Week 9**

> Hope is not a plan. A rehearsal is.

Your Sprint 2 demo is coming. Today your team gets ready for it: refine what's left, name what could go wrong **before** it does, and rehearse the demo so a failure doesn't become a freeze. You'll also write a rollback for the most likely failure: the API from T9A going down. This pulls together QA, Agile, and APIs for **Week 9 Performance Assessment C**.

**Standards:** AG.KU1 · AG.SK5 · QA.SK3 · QA.SK4 · QA.O1

---

## Setup (2 minutes)

- Sit with your **sprint team**. Have your sprint project open, and its board (GitHub Projects, Trello, whatever you use).
- One teammate opens this folder in VS Code and shares their screen, or copy these files into your team's project repo under `docs/`.
- Node 18+ for the helper commands. No `npm install`.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `BACKLOG.md` | Refined backlog: estimates and owners | Part 1 |
| `RISK_REGISTER.md` | **Your risk register** | Part 2 |
| `examples/RISK_REGISTER.example.md` | A filled-in register to model from | Part 2 |
| `REHEARSAL_NOTES.md` | Roles, demo flow, rehearsal results | Part 3 |
| `RUNBOOK.md` | What to do when the API is down | Part 3 |

## Commands

| Command | Does |
|---|---|
| `npm run risks` | Sorts your risk register by score and shows gaps |
| `npm run risks:example` | Same, for the example |
| `npm run check` | Shows which parts of your artifact are done |

---

## Estimates and owners

Agile teams learn by iterating. That only works when work is small and has a name on it.

- **Story points** measure size and uncertainty, not hours: **1, 2, 3, 5, 8**. If a task is bigger than 8, nobody understands it well enough yet. **Split it.**
- **One owner per task.** "The team" owns nothing.
- **Demo-critical** tasks go first. Anything that isn't demo-critical can move to after the demo.

## Risk = Probability × Impact

| | **Low impact** | **Medium impact** | **High impact** |
|---|---|---|---|
| **High probability** | 3 · plan | 6 · plan | **9 · act now** |
| **Medium probability** | 2 · watch | 4 · plan | 6 · plan |
| **Low probability** | 1 · watch | 2 · watch | 3 · plan |

Write risks as **"If ___, then ___."** "The API might break" is a worry. "If the events API returns 500 during the demo, the RSVP page shows a blank list" is a risk you can do something about.

## A demo is a flow, not a tour

- Put steps in an order where **each step sets up the next**.
- Every step has an **expected result**. That's how you know it worked.
- Every step has an **"if it fails"**: a fallback and one sentence the narrator says.
- Most likely failure for anything using an API: **the API is down.** Your fallback is the cached or mock data from T9A (`output/events.json` or `npm run mock`).

---

## Guided Practice (your team, 35 min)

**Part 1: Refine the backlog (10 min)**

Fill in `BACKLOG.md` with everything left before the demo. Estimate every task together. On a count of three, everyone shows fingers for 1, 2, 3, 5, or 8. If you disagree by a lot, the high and low people explain, then vote again. Put **one** name on every task. Split anything over 8.

**Part 2: Risk register + peer surfacing (15 min)**

1. **Your team (7 min):** at least 4 risks in `RISK_REGISTER.md`. Include the API-down risk. Run `npm run risks`.
2. **Swap (5 min):** trade registers with another team. Read theirs and **add at least one risk they missed**. Mark it `peer (your team name)`. Be useful, not polite: the risk they didn't see is the one that will bite.
3. **Swap back (3 min):** give the new risks a mitigation and an owner.

**Part 3: Rehearse + runbook (10 min)**

1. Assign roles in `REHEARSAL_NOTES.md`. Write the demo flow: steps, timing, expected result, "if it fails".
2. **Run the demo once, out loud, with a timer.** Write what broke.
3. Write the API-down rollback in `RUNBOOK.md`, with the exact commands. If there's time, **actually do it**: stop the API mid-demo and switch.

## Application (whole room, 10 min)

Two teams share one risk they hadn't thought of until a peer raised it, and how they'll mitigate it. Then each team commits:

```bash
git add BACKLOG.md RISK_REGISTER.md REHEARSAL_NOTES.md RUNBOOK.md
git commit -m "docs: sprint 2 backlog, risk register, rehearsal notes, runbook"
```

## Before you leave

```bash
npm run check
```

Your **artifact** is:

- [ ] Updated backlog with estimates and owners
- [ ] Risk register: 5+ risks with probability, impact, mitigation, owner, status, including one from a peer team
- [ ] Rehearsal notes: roles, demo flow with fallbacks, results of a timed run
- [ ] Runbook: rollback to cached or mock data if the API is down

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | Backlog unchanged. Risks are vague worries. No rehearsal. |
| Emerging | Some estimates, owners missing. Risks listed without mitigations. Demo steps listed but never run. |
| Developing | Backlog refined. Risk register mostly complete. One rehearsal run. Fallback named but not written as steps. |
| **Proficient** | Every task sized and owned. 5+ specific risks, scored, with mitigations and owners, including peer-raised. Demo flow sequenced with fallbacks. API rollback written as exact steps. |
| Advanced | Rollback actually tested in rehearsal. Flow changed because of what broke. Risks updated after the run. |

Limited or Emerging? You'll join a 30-minute rehearsal clinic before the demo. That's practice, not punishment.

---

**Rehearse the failure, not just the success.**
