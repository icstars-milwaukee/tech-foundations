# Status Update

**Team:** TEQ Solutions (Molson Coors project: OneTouch)
**Date:** 2026-11-13
**Audience (who's reading this):** Our trainer

## Overall status

Pick one: **Green** (on track) · **Yellow** (at risk, we have a plan) · **Red** (off track, we need help)

- **Status:** Yellow
- **Why (one sentence with a fact, not a feeling):** Our 6-step OneTouch demo is scripted and the 2026-11-09 quality gate was green on keys, credentials, health and the public link, but the saved-answers check is still RED, the offline fallback has only been tested on a test copy, and the team hasn't run the demo together with a mid-demo network cut.

## Since last update

- **Done:** Fixed 7 of 8 logged defects on 2026-11-09, including a 20 s Claude timeout, saved answers that survive a restart, an offline mode with an on-screen label, and the restored demo tickets and Brewers team. A hung network now gives up in 6.5 s instead of waiting up to 10 minutes.
- **Not done that we said we'd do, and why:** Team failure injection mid-demo (the 2026-11-09 run was on a test copy, not a team rehearsal), a named Backup (the runbook still says TODO), and a timed run (the script adds up to about 9 minutes but has never been timed).

## Next, before the presentation

- **Next:** Name the Backup and agree a hand-off signal, time a full run, restart the app and run `npm run warmup` then the gate until it's all green, test the offline fallback on the live server, and run two rehearsal rounds with the network cut mid-demo.

## Top risks

The 3 biggest from `RISK_LOG.md`. Trend: ↑ worse · → same · ↓ better.

| Risk | Impact if it happens | Mitigation | Owner | Trend |
|---|---|---|---|---|
| R-4: No warm-up on the presentation day, so no saved answers | The offline fallback has nothing to show and step 3 gives only a suggestions list | Run `npm run warmup` on presentation day (0 failures), then the gate. Don't start on RED | Ventura | → |
| R-5: No named Backup in the runbook | If someone freezes or a laptop fails, nobody is assigned to run the fallback | Name one Backup today and agree a hand-off signal | TBD: team assigns at rehearsal | → |
| R-6: Demo is about 9 minutes and has never been timed | Steps get cut mid-story if the slot is shorter | Time a full run, agree a cut order, Backup watches the clock | TBD: team assigns at rehearsal | ↑ |

## Asks

- **What we need, from whom, by when:** From our trainer: watch one full timed run of the demo during today's session (2026-11-13) and press ENTER on the chaos proxy mid-demo without warning, so we can practice the recovery live.
- **The thing we're most worried about that we haven't said out loud yet:** The whole demo runs from one laptop (Ventura's), so if it fails we have no second machine that can run OneTouch.
