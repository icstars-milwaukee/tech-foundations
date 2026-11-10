# Demo Runbook

**Team:** TEQ Solutions
**Project:** Molson Coors Project: OneTouch (https://onetouch.fyi, run from Ventura's laptop)
**Demo length (minutes):** about 9 (sum of the script below; time it at the next rehearsal)

## Roles

- **Driver (keyboard + mouse):** Luke and Ventura (Ventura drives OneTouch on the server laptop, signed in as the admin `vperez`)
- **Narrator (talks to the room):** Q, Luke, Ventura (each narrates their own slides and steps)
- **Backup (watches the clock, runs the fallback, takes over if someone freezes):** TODO: name one person. Plan: they hold the second laptop, signed in as the Brewers player `test.cyelich` for step 5, with this runbook open, and they flip the fallback (offline commands below) if the narrator gives the signal.

## Quality gate (before EVERY run, including rehearsals)

Run `npm run gate` (pointed at your project). Don't start until it's all green.

From the OneTouch folder on the server laptop, in this order:

```bash
npm run share
npm run warmup
node ../tech-foundations/t11a-demo-engineering/tools/gate.js demo/gate.config.json
```

`npm run share` brings the public link up (or starts it). `npm run warmup` signs in as warmup, asks the 114 demo questions and opens every dashboard; it must end with 0 failures.

`npm run warmup` is also our real check of the Claude key: the gate can't send the workspace header Claude needs, so it checks the Brevo email key instead.

- [x] **Env ready:** every key in `.env` set, nothing still a placeholder (gate GREEN 2026-11-09: 10 keys incl. `DEMO_MODE`)
- [ ] **Data seeded:** demo data loaded, enough records to tell the story, no real personal data. The 11 made-up `[Demo]` tickets and the Milwaukee Brewers test team were restored on 2026-11-09. The gate's count of saved answers is RED until the app restarts on the new code and `npm run warmup` runs. Answers are saved per day, so run the warm-up on the presentation day.
- [x] **Creds verified:** a real call with the demo account or API key works (Brevo key: HTTP 200 from the gate; Claude key: a real question answered on 2026-11-09)
- [x] **Health check OK:** every service answers (gate GREEN 2026-11-09: app, Cube, Metabase, https://onetouch.fyi)
- [ ] **Fallback ready:** offline mode / mock data tested in the last 24 hours. Tested on a test copy on 2026-11-09 (results below). Tick it once it has been tried on the live server after the restart.
- [ ] **Screen ready:** notifications off, zoom at 125%+, unneeded tabs closed, logged in (presentation day)

## Demo script

Each step: what the driver does, what the narrator says, what the room should see, and the fallback if it fails.

| # | Driver does | Narrator says (one line) | Room sees | Time (sec) | If it fails |
|---|---|---|---|---|---|
| 1 | Click through the slides. | Whoever's slides are on: the problem, who OneTouch is for, how we built it | The slides | 120 | Slides won't load or connect: the team carries on from memory (everyone knows their part), and the driver opens the PDF copy on the second laptop |
| 2 | Open 🧊 Architecture: the 🗺️ 2D map first, then 3D, then click "What happens when… asking Claude" | "Here's our tech stack and how a question travels through it" | Our tech stack drawn as a map, with a request animating through it | 180 | 3D won't draw: stay on 🗺️ 2D (it needs no graphics card) or 📝 List. Page won't load: the stack diagram in our slides |
| 3 | Type a warm-up question in the Ask bar: "How many open incidents are there by priority?" | "Anyone can ask the ServiceNow data a plain-English question, and only sees their own tickets" | A table and chart in under a second, labelled "asked before" | 60 | Error, or slower than 5 s: ask another warm-up question. Internet down: localhost + offline mode (commands below); answers then say "🔌 Offline mode: a saved answer". Never ask follow-ups on stage: they always go to Claude |
| 4 | Team tab → 📥 Not assigned yet → move the INC9900001 family to the Milwaukee Brewers → type "Yelich" and give it all to him | "Managers hand out whole ticket families by typing a name; nothing gets split" | The [Demo] family moving to the Brewers, then assigned to Christian Yelich | 60 | An error or wrong click: 🎬 Before a presentation → 🧹 Put the demo tickets back, then redo it (seconds). Public link down: the same steps on http://localhost:8000 (assigning doesn't need the internet) |
| 5 | Second laptop (player `test.cyelich`): open 🔔, show Assigned to me, mark INC9900001 resolved; back to the admin laptop's 🔔 | "The player sees their work at once and tells their manager when it's done" | The new-ticket notification and the family in Assigned to me, then the resolved report arriving at the manager | 90 | Second laptop can't sign in: the driver shows the Brewers' tickets in the Team tab on the admin laptop and narrates what the player would see |
| 6 | Team tab → 🎬 → After the presentation → 👑 Make everyone an admin; hand over for Q&A | "Now you can all try every feature with your own accounts" | The switch turning on; the link on screen | 30 | Switch fails: take questions on the driver's laptop instead |

## Offline / mock data fallback

- **How the app switches to offline or mock data:** Everything but the AI assistant runs on the server laptop, so if the public link or the venue wifi dies, the driver opens http://localhost:8000 on that laptop and carries on. The AI assistant answers every question asked before (the morning's `npm run warmup`) from saved answers kept in `.cache/answers.json`, which survive a restart. New questions give up after 20 s (`CLAUDE_TIMEOUT_MS`) with "couldn't reach Claude" instead of hanging. The emergency switch, `DEMO_MODE=offline` in `.env` plus a restart, stops it asking Claude at all.
- **How the audience can tell (banner, label):** In offline mode every answer carries an amber "🔌 Offline mode: a saved answer (Claude isn't being asked right now)" label. A new question gets "OneTouch is in offline mode for this presentation…" plus a list of questions that work. 🧊 Architecture → 🩺 Health shows the Claude check as off.
- **What the narrator says when it happens:** "The venue's internet just dropped, which is why OneTouch runs on our own machine. You're now seeing answers it saved this morning, and it says so on screen. Everything else works the same."

Emergency switch ON (venue wifi looks bad), in the OneTouch folder on the server laptop, then open http://localhost:8000 on that laptop (not the public link):

```bash
node -e "const fs=require('fs');fs.writeFileSync('.env',fs.readFileSync('.env','utf8').replace(/^DEMO_MODE=.*$/m,'DEMO_MODE=offline'))"
docker restart analytics_node_app
```

Back to normal:

```bash
node -e "const fs=require('fs');fs.writeFileSync('.env',fs.readFileSync('.env','utf8').replace(/^DEMO_MODE=.*$/m,'DEMO_MODE=live'))"
docker restart analytics_node_app
```

## Failure injection results

Kill the network (chaos proxy: press ENTER) for 15 seconds **in the middle of a run**.

How we inject it: OneTouch's only dependency on the internet is the Claude API, so the chaos proxy goes between the app and Claude. Run `node tools/chaos-proxy.js --target https://api.anthropic.com` from this folder, add `ANTHROPIC_BASE_URL=http://host.docker.internal:4100` to OneTouch's `.env`, then `docker restart analytics_node_app`. Take the line out and restart again afterwards. To test losing the public link instead, stop the tunnel: `npm run share -- --stop`.

Pre-rehearsal technical run, 2026-11-09, on a test copy (second server on port 8099 with a throwaway account database, chaos proxy in front of Claude). These rows are not from a team rehearsal:

- **Which step we were on when the network died:** Step 3 (the AI assistant), right after a question had been answered once.
- **What the app did (blank screen? spinner? fallback?):** Fallback. A new question failed in 0.5 s with "The AI assistant couldn't reach Claude just now… Questions asked before still answer at once". The question asked before still answered. Before the fixes, reading the code showed it would have waited up to 10 minutes (no timeout), then said "Claude API error (undefined)".
- **What the presenters did:** TODO: fill in at the team rehearsal, with the backup pressing ENTER in the chaos proxy mid-demo without warning.
- **What we changed afterwards:** Found by reading the code and fixed before injecting: a 20 s timeout on every Claude call (D-1), a plain-English error message (D-2), saved answers that survive a restart (D-3), and the `DEMO_MODE=offline` emergency switch with an on-screen label (D-4).
- **Second injection, after the change: what happened:** Hung network (Claude's address accepted connections but never answered), with a 3 s timeout: it gave up in 6.5 s with the same clear message, and the saved question answered in 0.1 s. Emergency switch: after a restart into offline mode the saved answer loaded from disk, came back in 0.3 s with the offline label, and a new question got the suggestions list at once. TODO: repeat as a team, mid-demo.

## Reset between runs

How to get back to the exact starting state (data, logins, open tabs) in under a minute.

In the app (no restart, a few seconds): Team tab → 🎬 Before a presentation → **↩ Undo every status**, then **🧹 Put the demo tickets back**. Then on the second laptop: clear the player's 🔔 (Clear all), sign out, and sign in again as `test.cyelich`. Delete the chat on the admin laptop, and close every tab except OneTouch and the slides.

Or from the OneTouch folder (about 20 s; saved answers are kept):

```bash
Get-Content db\demo-tickets.sql | docker exec -i analytics_postgres psql -U admin -d analytics_db
docker restart analytics_node_app
node ../tech-foundations/t11a-demo-engineering/tools/gate.js demo/gate.config.json
```

## Side-by-side rehearsal feedback

From the team that watched you.

- **Watched by team:** TODO: the watching team fills this in
- **Where the demo felt unreliable or slow:** TODO
- **Where they got lost in the story:** TODO
- **The one change they'd make:** TODO
