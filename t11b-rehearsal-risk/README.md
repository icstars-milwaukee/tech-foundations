# T11B: Rehearsal & Risk Management

**i.c.stars Tech Foundations · Week 11**

> Calm is a skill. You build it the same way you build everything else: reps.

The final presentation is close. Two things decide how it goes, and neither one is code. First: can you tell people **honestly** where things stand, including the risks? Second: when the pressure spikes (a demo breaks, a client asks a hard question, a teammate freezes), can you stay steady and help each other? Today you practice both, in two short rehearsal rounds. This ties directly to the **Final Sprint Client Presentations**.

**Standards:** PM.SK9 · EI.SK4 · EI.SK5

---

## Setup (2 minutes)

- Sit with your **sprint team**. Your trainer pairs you with another team for the rehearsals.
- Have your project repo open on GitHub, so you can file issues during feedback.
- Bring your T9B risk register and your T11A demo runbook.
- Node 18+ for `npm run check`. No `npm install`.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `STATUS_UPDATE.md` | **Team:** a transparent status update | Part 1 |
| `RISK_LOG.md` | **Team:** your living risk log | Part 1 |
| `PRESSURE_PLAN.md` | **You:** your personal plan for staying steady | Part 2 |
| `REHEARSAL_FEEDBACK.md` | **Team:** two rounds of feedback, linked to issues | Part 3 |
| `templates/rehearsal-feedback.md` | A GitHub issue template for rehearsal feedback | Part 3 |

## Commands

| Command | Does |
|---|---|
| `npm run check` | Shows which parts of your artifact are done |

---

## Transparent status: weak vs strong

**Weak.** Sounds fine, says nothing, and the surprise comes later:

> Everything's going great! Just a few small things left. We'll be ready.

**Strong.** Clear status, facts, risks, and an ask:

> **Yellow.** RSVP flow works end to end; the staff dashboard is still failing 2 of 6 tests. **Risk:** if the events API is down on Thursday, the dashboard is blank. **Mitigation:** offline mode with saved data, tested twice (Andre). **Ask:** 20 minutes with a trainer on Tuesday to review the failing tests.

| Rule | Why |
|---|---|
| **Lead with the color** | The reader knows in one word whether to worry |
| **Facts, not feelings** | "2 of 6 tests failing" beats "almost done" |
| **Yellow is not failure** | Yellow + a plan builds **more** trust than a Green that turns Red on demo day |
| **Name the scary thing** | The risk you don't mention is the one that becomes a surprise |
| **Make a specific ask** | Who, what, by when |

## Staying steady under pressure

Stress narrows your thinking. That's biology, not weakness. The fix is to have the hard parts **decided in advance**:

1. **Notice it early.** Know your signals (racing heart, talking fast, going blank).
2. **Reset in 10 seconds.** One long breath out. Feet on the floor. Say the next step out loud.
3. **Use your pre-written line.** "Let me show you that with our saved data" beats an awkward silence.
4. **Hand off on a signal.** A teammate can take over smoothly if you've agreed how.

## Supporting a stressed teammate

| Helps | Doesn't help |
|---|---|
| Take the next step for them: "I'll drive, you narrate." | "Just relax." |
| Name it calmly, privately: "That was a rough one. You recovered well." | Correcting them in front of the room |
| Ask: "What do you need right now?" | Taking over without asking or agreeing first |

## Feedback that's usable

- **Glow / Grow:** one specific thing that worked, one specific thing to change.
- **SBI** for feedback to a person: **S**ituation ("During the login step"), **B**ehavior ("you turned to the screen and spoke quietly"), **I**mpact ("the back row couldn't hear the key point").
- Say what you **saw**, not what you assume they felt.

---

## Part 1: Status + risks (team, 10 min)

1. Update `RISK_LOG.md`: carry over your T9B risks, update their status, add new ones from T11A failure injection, close the ones that are gone. Fill in **What changed**.
2. Write `STATUS_UPDATE.md` for your trainer as the reader. Pick a color and back it with a fact. Name your top 3 risks. Make at least one specific ask.
3. Read your status update out loud to your paired team in **60 seconds**. Did they understand where you really stand?

## Part 2: Pressure plan (solo, 5 min)

Fill in `PRESSURE_PLAN.md`. It's personal: share what you choose to. Agree on a **hand-off signal** with your team before the rehearsals.

## Part 3: Two micro-rehearsals (paired teams, 40 min)

Two rounds. In each round, each team gets **10 minutes**: about 6 for the demo, 4 for feedback. While one team presents, the other watches and gives feedback.

**Round 1 (20 min)**
- Watchers: give Glow / Grow. The watching team may inject **one** surprise: a hard question, "your API is down", or "you have 2 minutes left".
- Presenters: use your resets and recovery lines.
- File every actionable piece of feedback as an issue in your project repo, **during** the feedback:

  ```bash
  gh issue create --title "[Rehearsal] Narrator rushes the RSVP step" \
    --body "Round 1. Seen by Team Atlas. Back row lost the key point. Slow down, pause after the count appears." \
    --label rehearsal
  ```

  No `gh`? Use **New issue** on GitHub. Want a reusable template? Copy `templates/rehearsal-feedback.md` into your project's `.github/ISSUE_TEMPLATE/`. If the `rehearsal` label doesn't exist yet, create it first: `gh label create rehearsal`.

**Between rounds (included):** fix one or two issues fast, or just change the flow.

**Round 2 (20 min):** Same format. **Switch presenters** if you can, so more people practice under pressure. Did round 1's issues get better?

Fill in `REHEARSAL_FEEDBACK.md` as you go, including **Peer coaching**: one private SBI for one person.

## Before you leave

```bash
npm run check
```

Commit the team files to your project repo (not your pressure plan unless you want to):

```bash
git add STATUS_UPDATE.md RISK_LOG.md REHEARSAL_FEEDBACK.md
git commit -m "docs: status update, risk log, rehearsal feedback rounds 1-2"
```

Your **artifact** is:

- [ ] A status update: color backed by a fact, top risks with mitigations, a specific ask
- [ ] A risk log: 5+ risks, updated since T9B, showing what changed
- [ ] Rehearsal feedback for 2 rounds, with GitHub issue numbers
- [ ] Your pressure plan, used in at least one rehearsal

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | "Everything's fine." No risks named. No rehearsal feedback captured. |
| Emerging | Status given without facts. Risks listed without mitigations or owners. Feedback noted but not turned into issues. |
| Developing | Clear status color with some facts. Risks mostly complete. Two rounds run; some issues filed. Pressure plan written but not used. |
| **Proficient** | Honest status with facts, top risks, and a specific ask. Risk log updated with what changed. Both rounds captured as issues with changes between rounds. Reset and recovery line used under pressure. Supportive, specific peer coaching. |
| Advanced | Yellow or Red raised early with a credible plan. Round 2 visibly better because of round 1's issues. Smooth hand-off when something went wrong. Peer coaching changed someone's next run. |

Limited or Emerging? You'll join a 30-minute rehearsal clinic before the final presentations. That's practice, not punishment.

---

**Say the risk out loud early. A risk you've named is one the team can plan for.**
