# T10A: Release & Operate

**i.c.stars Tech Foundations · Week 10**

> Shipping isn't the finish line. It's when real people start depending on you.

Writing code is half the job. The other half is getting it to users safely, knowing whether it's working, and getting back to safety fast when it isn't. Today you'll study real releases that failed, then practice the discipline that prevents them: a pre-flight check, measurable success criteria, monitoring, and a rollback you've actually done. Your release plan is **directly assessed in Week 12 Assessment D** (*a release plan with rollback, monitoring, and success metrics*).

**Standards:** RL.KU1 · RL.SK1 · RL.SK2 · RL.O1

---

## Setup (2 minutes)

- Open this folder in VS Code. Node 18+ is all you need. No `npm install`.
- If this folder isn't a git repo yet: `git init`, then commit the starter files.
- You'll use **two terminals**: one runs the app, the other runs the checks.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `stories/FAILED_RELEASES.md` | Five real failed releases and the guardrails they taught | Opening |
| `sample-app/` | The CohortHub Events Service, versions 1.4.0 and 1.5.0 | Guided Practice |
| `.env.example` | The settings and secrets the app needs | Guided Practice |
| `release.config.json` | Success criteria as numbers: error rate, p95 latency | Guided Practice |
| `tools/preflight.js` | Pre-flight checklist, automated | Guided Practice |
| `tools/release-check.js` | Measures the release and says **GO** or **ROLLBACK** | Guided Practice |
| `RELEASE_PLAN.md` | **Your release plan** | All session |
| `INCIDENT_LOG.md` | **Your incident log** for the bad release | Guided Practice |
| `evidence/` | Release check results get saved here | Guided Practice |

## Commands

| Command | Does |
|---|---|
| `npm run preflight` | Checks `.env`, secrets, and config before a release |
| `npm run app` | Starts the app on http://localhost:5000 using the version in `.env` |
| `npm run release-check` | Measures the running app against `release.config.json`: GO or ROLLBACK |
| `npm run check` | Shows which parts of your artifact are done |

---

## Release metrics: decide "good" before you ship

If you decide what "working" means *after* the release, you'll talk yourself into "it's fine". Write the numbers down first.

| Metric | What it tells you | Example threshold |
|---|---|---|
| **Health check** | The app is running and answering | `/health` returns 200 |
| **Error rate** | % of requests that fail (5xx) | below 2% |
| **p95 latency** | 95% of requests are faster than this. It shows what your *slowest* users feel. | below 300 ms |

A health check alone isn't enough. An app can say "I'm fine" while failing every tenth request. You'll see that today.

## Ops basics

| Term | Means |
|---|---|
| **Monitoring signal** | Something you watch: error rate, latency, logs, user reports |
| **Alert threshold** | The value that wakes someone up: "error rate above 2% for 5 minutes" |
| **Rollback trigger** | The rule, decided **ahead of time**, that means "go back now". No debate during the incident. |
| **Incident log** | What happened, when, what you did, and the root cause. Blame the process, not the person. |

## Secrets and environments

- Settings and secrets live in **`.env`** (git-ignored). **`.env.example`** lists the keys with fake values.
- Every environment (your laptop, staging, production) has its **own** `.env`. Never copy production secrets to a laptop.
- `npm run preflight` refuses to clear a release if a key is missing, still a placeholder, or ever committed.

---

## Opening: failed release stories (groups, 10 min)

Each group takes one story from `stories/FAILED_RELEASES.md`. In 60 seconds, tell the room what happened and **one guardrail** that would have stopped it or sped up recovery. Your trainer collects the guardrails on the board.

## Guided Practice (pairs, 25 min)

**1. Pre-flight (3 min).** Run `npm run preflight`. It fails. Fix it: `cp .env.example .env`, then set `SUPPORT_API_KEY` to the value your trainer gives you. Run it again until **CLEARED FOR RELEASE**.

**2. Baseline: the current release (4 min).** Terminal 1: `npm run app` (version 1.4.0). Terminal 2: `npm run release-check`. It should say **GO**. This is your "known good".

**3. Release 1.5.0 (5 min).** In `.env`, set `APP_VERSION=1.5.0`. Stop the app (Ctrl+C) and start it again. Run `npm run release-check`. Read the verdict. Look at `/health` in your browser: what does it say?

**4. Roll back (5 min).** Follow the rule: a criterion failed, so roll back. No debugging first. Put `APP_VERSION=1.4.0` back, restart, and run `npm run release-check` again. Confirm **GO**. Time how long the rollback took.

**5. Log it (8 min).** Fill in `INCIDENT_LOG.md` for the 1.5.0 release: timeline, impact, resolution, root cause, and at least one follow-up guardrail.

Commit: `git add . && git commit -m "docs: incident log for v1.5.0 rollback"` (check that `.env` is **not** in the list first).

## Application (on your own or with your sprint team, 15 min)

Fill in `RELEASE_PLAN.md` for **your sprint project** (or the sample app if your project isn't deployable yet):

- Real deploy and rollback commands, not "deploy the app".
- Success criteria with numbers.
- Monitoring: what you watch, when someone gets alerted, who.
- A rollback trigger someone could apply without asking you.

Swap with a partner. Could they roll back your release using only your plan?

## Before you leave

```bash
npm run check
```

Your **artifact** is:

- [ ] A release plan: pre-flight, deploy steps, success criteria with numbers, monitoring, rollback trigger and steps
- [ ] Evidence: release checks for the good release, the bad release, and after the rollback
- [ ] An incident log for the bad release with a root cause and follow-ups

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | "Deploy it and see." No rollback. No definition of success. |
| Emerging | Deploy steps listed. Rollback mentioned but not written as steps. Success is vague ("it works"). |
| Developing | Deploy and rollback steps written. Some numbers in success criteria. Monitoring named but no thresholds or owners. |
| **Proficient** | Pre-flight checklist. Exact deploy and rollback commands. Numeric success criteria (health, error rate, p95). Monitoring with alert thresholds and owners. Clear rollback trigger. Incident logged with root cause. |
| Advanced | Rollback tested with evidence before and after. Staged rollout or canary considered. Follow-ups turn the incident into guardrails. |

Limited or Emerging? You'll join a 30-minute release clinic before Week 12. That's practice, not punishment.

---

**Decide when you'll roll back before you ship. During an incident, nobody thinks clearly.**
