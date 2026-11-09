# Demo Runbook

**Team:** Unity Forward Solutions
**Project:** RFP Project
**Demo length (minutes):** 10 mins (maybe)

## Roles

- **Driver (keyboard + mouse):** Jose
- **Narrator (talks to the room):** Any member UFS.
- **Backup (watches the clock, runs the fallback, takes over if someone freezes):** All members of UFS

## Quality gate (before EVERY run, including rehearsals)

Run `npm run gate` (pointed at your project). Don't start until it's all green.

- [ ] **Env ready:** every key in `.env` set, nothing still a placeholder
- [ ] **Data seeded:** demo data loaded, enough records to tell the story, no real personal data
- [ ] **Creds verified:** a real call with the demo account or API key works
- [ ] **Health check OK:** every service answers
- [ ] **Fallback ready:** offline mode / mock data tested in the last 24 hours
- [ ] **Screen ready:** notifications off, zoom at 125%+, unneeded tabs closed, logged in

## Demo script

Each step: what the driver does, what the narrator says, what the room should see, and the fallback if it fails.

| # | Driver does | Narrator says (one line) | Room sees | Time (sec) | If it fails |
|---|---|---|---|---|---|
| 1 | Opens slide deck | "Hello everyone, we are Unity Forward Solutions"  | Photos of team | 30 secs  | We'll just speak |
| 2 | Talks about the problem the client brought us | "Here's the problem you gave us" | A slide | 1min 15sec | we go to a backup computer |
| 3 | Who did what on the team | "We'll now speak about the work we did" | A slide | 1 min 30 secs | We go to print outs. |
| 4 | Navigates to next slide, what we promised | "We'll now talk about what we promised" | A slide | 1 min 30 secs | Go to printouts or backup laptop |
| 5 | Navigates to app, shares app on projector | "The moment you've finally been waiting for" | Applicaiton home page | 5 mins | back up computer / print outs / local app (instead of live deployment) |

## Offline / mock data fallback

- **How the app switches to offline or mock data:** A separate tab with the offline app is already pulled up and ready to go
- **How the audience can tell (banner, label):** We will say so.
- **What the narrator says when it happens:** "We'll now demonstrate how the app looks"

```bash
# TODO: exact commands to switch to offline mode, and back
# There are no commands needed for this
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
```

## Side-by-side rehearsal feedback

From the team that watched you.

- **Watched by team:** 
- **Where the demo felt unreliable or slow:** 
- **Where they got lost in the story:** 
- **The one change they'd make:** 
