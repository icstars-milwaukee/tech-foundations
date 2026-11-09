# Demo Runbook

**Team:** Ibis Tek Solutions 
**Project: Molson Coors Project
**Demo length (minutes): 15 min

## Roles

- **Driver (keyboard + mouse): Cortez
- **Narrator (talks to the room): Amir, Cortez
- **Backup (watches the clock, runs the fallback, takes over if someone freezes): Two laptops

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
| 1 |Open dashboard landing page  |This dashboard gives managers a real-time view of ticket health, workload, and trends.  |Executive dashboard with KPIs and charts  |60  |Refresh page or switch to backup laptop  |
| 2 |Review KPI cards and trends  |KPI cards, trend charts, and summaries  |Interactive filtering across widgets  |60  |Use pre-saved filter view  |
| 3 |Filter by assignment group and priority  |Managers can move from summary metrics into the underlying records in one click.  |Detailed ticket list and drill-through experience  |75  |Open prepared report tab  |
| 4 |Drill into a specific ticket segment  |AI summarizes trends, highlights risks, and suggests next actions.  |AI-generated summary and suggested actions  |60  |Use cached AI response or screenshot  |
| 5 |Show AI insights and recommendations  |AI summarizes trends, highlights risks, and suggests next actions.  |AI-generated summary and suggested actions  |60  |Continue presentation verbally  |

## Offline / mock data fallback

- **How the app switches to offline or mock data:** Feature flag or environment variable loads local JSON demo data instead of APIs.
- **How the audience can tell (banner, label):** Yellow banner at the top shows "Demo Mode - Using Mock Data".
- **What the narrator says when it happens:** To ensure a smooth demonstration, we're displaying our validated demo dataset. The experience and functionality remain the same.

```bash
# TODO: exact commands to switch to offline mode, and back

# Enable mock mode
REACT_APP_DEMO_MODE=true

# Run application
npm start

# Return to live mode
REACT_APP_DEMO_MODE=false
npm start

```

## Failure injection results

Kill the network (chaos proxy: press ENTER) for 15 seconds **in the middle of a run**.

- **Which step we were on when the network died:** 
- **What the app did (blank screen? spinner? fallback?):** 
- **What the presenters did:** 
- **What we changed afterwards:** 
- **Second injection, after the change: what happened:** 

## Reset between runs

How to get back to the exact starting state (data, logins, open tabs) in under a minute.

```bash
# TODO: reset commands
Clear all filters
Return to Executive Dashboard
Close drill-through views
Reset date range to Last 30 Days
Ensure Demo Mode setting is correct
Verify presenter account is logged in
Reopen presentation tab
```

## Side-by-side rehearsal feedback

From the team that watched you.

- **Watched by team:** 
- **Where the demo felt unreliable or slow:** 
- **Where they got lost in the story:** 
- **The one change they'd make:** 
