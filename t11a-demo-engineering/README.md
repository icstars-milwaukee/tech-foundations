# T11A: Demo Engineering

**i.c.stars Tech Foundations · Week 11 · 90 min**

> A great demo isn't luck. It's engineered.

Your final client presentation is coming. In T9B you rehearsed and named risks. Today you **harden** the demo: add an offline fallback, break the network on purpose to see what happens, pass a quality gate before every run, and burn down the defects that would embarrass you on stage. This prepares you for the **Final Sprint Client Presentations**.

**Standards:** QA.SK3 · QA.SK4 · PF.SK1 · PF.O1

---

## Setup (5 minutes)

- Sit with your **sprint team**, with your project running on the laptop you'll present from.
- Open this folder in VS Code too. Node 18+, no `npm install`.
- `cp .env.example .env`, then set `DEMO_API_KEY` to anything you like (for example `demo-key-123`). The sandbox API and the gate both read it from `.env`.
- The sandbox needs **three terminals**. VS Code's split terminal works well.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `sandbox/` | A tiny API + a demo app with an offline fallback, for practicing | Modeling |
| `sandbox/demo-app.js` | **Read this.** The fallback pattern to copy into your project | Modeling |
| `tools/chaos-proxy.js` | Failure injection: cut one app's network for 15 seconds | Guided Practice |
| `tools/gate.js` + `gate.config.json` | Quality gate: env, data, creds, health → GREEN or RED | All session |
| `tools/burndown.js` | Draws your defect burndown | All session |
| `data/seed/` | Seed data for the sandbox fallback | Modeling |
| `DEMO_RUNBOOK.md` | **Your demo runbook** | All session |
| `DEFECT_BURNDOWN.md` | **Your defect log + burndown** | All session |

## Commands

| Command | Does |
|---|---|
| `npm run sandbox:api` | Terminal 1: sandbox API on :4000 |
| `npm run chaos` | Terminal 2: chaos proxy on :4100 → :4000. **Press ENTER = 15-second outage.** |
| `npm run sandbox:app` | Terminal 3: demo app on http://localhost:3000 |
| `npm run gate` | Quality gate. Use `node tools/gate.js <your-config>` for your project. |
| `npm run burndown` | Defect burndown from `DEFECT_BURNDOWN.md` |
| `npm run check` | Shows which parts of your artifact are done |

---

## Hardening a demo

| Habit | Why |
|---|---|
| **Short timeouts** | A request that hangs for 30 seconds on stage is worse than one that fails in 2. |
| **Offline / mock fallback** | When the API or wifi dies, show saved data with an honest label, not a blank screen. |
| **An emergency switch** | One setting (e.g. `DEMO_MODE=offline`) that forces the fallback before you even start, if the venue wifi looks bad. |
| **Seeded data** | The demo always starts from the same, known, made-up data. |
| **A reset script** | Get back to the starting state in under a minute between runs. |
| **Quality gate** | Env ready, data seeded, creds verified, health OK. **Green, or you don't start.** |

**Failure injection** means breaking things on purpose, in rehearsal, so the first time it happens isn't in front of the client. The chaos proxy sits between an app and its API. Press ENTER and it cuts the connection for 15 seconds, without touching anyone else's wifi.

```
 your app ──► chaos proxy :4100 ──► API :4000
               press ENTER = 15s of dropped connections
```

To use it with **your** project: run `node tools/chaos-proxy.js --target <your API's base URL>` and point your app's API URL at `http://localhost:4100`.

---

## Modeling (trainer, 10 min)

Your trainer runs the sandbox, opens http://localhost:3000, presses ENTER in the chaos proxy, and refreshes. Watch the banner switch to "Offline: showing saved data". Then they set `DEMO_MODE=offline` and restart the app to show the emergency switch. Then `npm run gate`, during and after an outage.

## Guided Practice (your team, 40 min)

**1. Quality gate (10 min).** Copy `gate.config.json` into your project. Point it at your `.env` keys, your seed data file, an endpoint that proves your credentials work, and your health checks. Run `node tools/gate.js <path-to-your-config>` until it's **ALL GREEN**. Fill in the gate checklist in `DEMO_RUNBOOK.md`.

**2. Fallback (15 min).** Add an offline or mock-data fallback to your project, following `sandbox/demo-app.js`: short timeout → cached or seed data → visible label. Add an emergency switch. Write the commands in the runbook. If your project can't do this in time, use the T9A mock server as your fallback API and document that switch.

**3. Script + failure injection (15 min).** Write the demo script table. Run the demo once with the gate green. Then run it again with the chaos proxy in front of your API, and have your backup press ENTER **mid-demo** without warning. Write what happened under "Failure injection results". Fix what broke, then inject again.

Log every bug you hit in `DEFECT_BURNDOWN.md` as you go.

## Application: side-by-side rehearsal (pairs of teams, 30 min)

Two teams sit together. Each team runs its full demo while the other team watches **and** injects one failure at a moment of their choosing (press ENTER, or flip a setting you agreed on beforehand). Then swap.

- Watchers fill in the presenting team's **Side-by-side rehearsal feedback**.
- Presenters log new defects, fix the demo-blocking ones, and run `npm run burndown`.
- Finish with a reset and one more clean run, gate first.

Commit: `docs: demo runbook, failure injection results, defect burndown`.

## Before you leave

```bash
npm run check
```

Your **artifact** is:

- [ ] Demo runbook: roles, a green quality gate, a step-by-step script with fallbacks, offline/mock fallback commands, failure injection results, reset steps
- [ ] Defect burndown: every defect logged with severity and dates, **no open demo-blocking defects**
- [ ] Side-by-side rehearsal feedback from another team

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | Demo is "click around and talk". No fallback. Defects not tracked. |
| Emerging | Steps listed. Fallback is "we'll figure it out". Failure injection not tried. |
| Developing | Script with fallbacks. Quality gate used. Failure injected once, but the demo still broke and nothing changed. |
| **Proficient** | Gate is green before every run. Offline/mock fallback works with a visible label. Failure injected mid-demo and handled. Defects burned down to zero demo-blocking. Peer feedback acted on. |
| Advanced | Emergency switch tested. Reset in under a minute. Second injection after fixes shows a smooth recovery. Presenters hand off cleanly when something fails. |

Limited or Emerging? You'll join a 30-minute demo clinic before the final presentations. That's practice, not punishment.

---

**Practice the failure until it's boring. Then it can't rattle you on stage.**
