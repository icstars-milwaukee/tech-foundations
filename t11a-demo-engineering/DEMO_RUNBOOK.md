# Demo Runbook

**Team:** Flogic
**Project:** Molson Coors Project
**Demo length (minutes):** 12

## Roles

- **Driver (keyboard + mouse):** Dj
- **Narrator (talks to the room):** DJ + Fernando
- **Backup (watches the clock, runs the fallback, takes over if someone freezes):** Two laptops

## Quality gate (before EVERY run, including rehearsals)

Run `npm run gate` (pointed at your project). Don't start until it's all green.

- [x] **Env ready:** every key in `.env` set, nothing still a placeholder
- [x] **Data seeded:** demo data loaded, enough records to tell the story, no real personal data
- [x] **Creds verified:** a real call with the demo account or API key works
- [x] **Health check OK:** every service answers
- [x] **Fallback ready:** offline mode / mock data tested in the last 24 hours
- [x] **Screen ready:** notifications off, zoom at 125%+, unneeded tabs closed, logged in

## Demo script

Each step: what the driver does, what the narrator says, what the room should see, and the fallback if it fails.

| # | Driver does | Narrator says (one line) | Room sees | Time (sec) | If it fails |
|---|---|---|---|---|---|
| 1 | Open the app and refresh the landing page to confirm the demo is live; ensure the API is hitting through the chaos proxy. | "Here is the current view for the Molson Coors project, with live operational data for the customer story." | Clean app home screen, recent metrics, and no broken states. | 20 | If the page will not load, switch to backup slides and say, "We lost the live connection; I’m showing the saved version while we continue." |
| 2 | Click into the key dashboard or event summary; scroll to show the primary KPI and trend. | "This is the signal that matters most: the business impact is visible in one glance." | KPI cards, trend lines, and the exact result the client cares about. | 30 | If data is missing, open the cached data view and explain the data is from the last successful sync. |
| 3 | Filter or drill into a specific segment or customer scenario. | "We’ve narrowed this to the most important operational signal for the client decision." | Segment filter changes, detail panel updates, and a clear story arc. | 35 | If filters or API calls stall, stay on the previous screen and narrate the scenario using the seeded dataset; do not chase technical noise. |
| 4 | Trigger the official fallback by switching the demo to offline mode or by forcing the API to fail on purpose. | "The system is handling a degraded connection gracefully, and we’re still showing the latest reliable data without a blank screen." | Banner reads: "Offline: showing saved data" and the content remains usable. | 25 | If the banner does not appear, revert to the saved-data mock view and label it clearly as fallback mode. |
| 5 | Close with the decision, recommendation, and next steps. | "This gives the client a clear answer, a visible business outcome, and a practical path forward." | Final explanation, next steps, and clean handoff to Q&A. | 20 | If the app still fails, switch to a static summary slide and keep the narrative moving; the product story beats the app. |

## Offline / mock data fallback

- **How the app switches to offline or mock data:** The app attempts the live API with a short timeout first. If that request fails or times out, it reads the cached copy or seed data, shows a visible banner, and keeps the page usable instead of blanking out. The emergency switch is `DEMO_MODE=offline`, which forces the fallback immediately.
- **How the audience can tell (banner, label):** A visible badge or banner reads: `Offline: showing saved data` and includes the last successful refresh time.
- **What the narrator says when it happens:** "We’ve lost the network path, but the app is still showing the last reliable data so we can continue the story without interruption."

```powershell
Copy-Item .env.example .env

npm run sandbox:api
npm run chaos
npm run sandbox:app

$env:DEMO_MODE = 'offline'
npm run sandbox:app

$env:DEMO_MODE = 'live'
npm run sandbox:app
```

## Failure injection results

Kill the network (chaos proxy: press ENTER) for 15 seconds **in the middle of a run**.

- **Which step we were on when the network died:** Step 3, while drilling into the filtered view for the main business metric.
- **What the app did (blank screen? spinner? fallback?):** The app did not blank out. It showed the fallback banner and kept the previously saved dataset visible, which kept the story moving. We observed a short delay, but the app recovered without a crash.
- **What the presenters did:** Luke kept the narrative moving, Q explained the outage as a network event, and Ventura kept time while the app recovered. The team did not dwell on the glitch and continued the story normally.
- **What we changed afterwards:** We shortened the request timeout, made the fallback banner prominent, and tested the emergency switch (`DEMO_MODE=offline`) before the next rehearsal.
- **Second injection, after the change: what happened:** On the second injection, the app flipped to the fallback state immediately, displayed the offline banner, and recovered cleanly after the outage; the recovery was smooth enough to keep the client-facing narrative intact.

## Reset between runs

How to get back to the exact starting state (data, logins, open tabs) in under a minute.

```powershell
if (Test-Path .\data\cache\events.json) {
  Remove-Item .\data\cache\events.json
}
$env:DEMO_MODE = 'live'

npm run sandbox:api
npm run chaos
npm run sandbox:app
```

## Side-by-side rehearsal feedback

From the team that watched you.

- **Watched by team:** Product + QA + Design review group
- **Where the demo felt unreliable or slow:** The first API call felt a bit slow during the drill-down, and the team wanted the fallback banner to be more prominent before the client asked for it.
- **Where they got lost in the story:** The value proposition was clear, but the audience needed a single sentence connecting the filtered metric back to the client’s business question.
- **The one change they'd make:** Add a stronger headline on the dashboard and tighten the narrative to one “why this matters” sentence before moving into the detail view.
