# Demo Runbook

**Team:** 
**Project:** 
**Demo length (minutes):** 

## Roles

- **Driver (keyboard + mouse):** 
- **Narrator (talks to the room):** 
- **Backup (watches the clock, runs the fallback, takes over if someone freezes):** 

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
| 1 |  |  |  |  |  |
| 2 |  |  |  |  |  |
| 3 |  |  |  |  |  |
| 4 |  |  |  |  |  |
| 5 |  |  |  |  |  |

## Offline / mock data fallback

- **How the app switches to offline or mock data:** 
- **How the audience can tell (banner, label):** 
- **What the narrator says when it happens:** 

```bash
# TODO: exact commands to switch to offline mode, and back
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
