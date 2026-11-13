# Status Update

**Team:** TEQ Solutions
**Date:** 2026-11-13
**Audience (who's reading this):** Molson Coors

## Overall status

Pick one: **Green** (on track) · **Yellow** (at risk, we have a plan) · **Red** (off track, we need help)

- **Status:** **Yellow**
- **Why (one sentence with a fact, not a feeling):** The demo script, offline fallback, and reset steps for the Molson Coors project are not yet written down or rehearsed end to end, and we haven't run the quality gate or a failure-injection test. [TEAM: replace with a real fact, e.g. "X of Y demo steps work end to end"]

## Since last update

- **Done:** Demo roles assigned (Driver: Luke; Narrators: Q, Luke, Ventura; Backup: two laptops). Team name and project set in the demo runbook. [TEAM: add what is actually built and working]
- **Not done that we said we'd do, and why:** Demo script table, offline/mock-data fallback, and reset commands in `DEMO_RUNBOOK.md` are still blank. Defect burndown and risk log have no entries yet. [TEAM: add the reason for each]

## Next, before the presentation

- **Next:** (1) Fill in the 5-step demo script with timings. (2) Build and test the offline/mock-data fallback. (3) Run `npm run gate` and get it all green. (4) Run one failure injection (network dead for 15 seconds) and record what happened. (5) Log every defect found in `DEFECT_BURNDOWN.md`. (6) Rehearse twice with the paired team and file issues from the feedback.

## Top risks

The 3 biggest from `RISK_LOG.md`. Trend: ↑ worse · → same · ↓ better.

| Risk | Impact if it happens | Mitigation | Owner | Trend |
|---|---|---|---|---|
| If the network or an API fails during the live demo, the app shows a blank or broken screen | Molson Coors sees a failed demo and loses confidence in the solution | Offline/mock-data fallback with a visible banner, tested within 24 hours of the demo; narrator has a pre-written line | Luke (driver) | → |
| If the Driver freezes or their laptop fails, nobody knows who takes over | Demo stalls in front of the client | Agreed hand-off signal; second laptop already logged in as backup; Q and Ventura both know the script | Q | → |
| If the demo runs long or short, the key points get cut or rushed | Client misses the main value of the project | Time each step in the script; rehearse twice against the clock; Backup watches the time | Ventura | → |

## Asks

- **What we need, from whom, by when:** 20 minutes with a trainer before the final presentation to review our demo script and fallback plan. [TEAM: add a date]
- **The thing we're most worried about that we haven't said out loud yet:** We haven't yet run the full demo start to finish, so we don't know whether it fits the time or survives a failure. [TEAM: confirm or replace with your real worry]
