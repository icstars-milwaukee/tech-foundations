# Defect Burndown

**Team:** TEQ Solutions (OneTouch)

Log **every** defect you find while hardening and rehearsing, even small ones. Dates as `YYYY-MM-DD`. Leave **Fixed** blank until it's fixed. Then run `npm run burndown`.

- **Severity:** S1 = demo can't continue · S2 = demo continues but looks broken · S3 = cosmetic
- **Demo-blocking?** Yes / No. Every S1 is demo-blocking.

## Defects

| ID | Defect | Severity | Demo-blocking? | Found | Fixed | Owner | Status |
|---|---|---|---|---|---|---|---|
| D-1 | AI assistant: Claude calls had no timeout (the SDK's default is 10 minutes, retried twice), so on a bad network a question could spin on stage for minutes | S2 | Yes | 2026-11-09 | 2026-11-09 | Ventura | Fixed: 20 s timeout plus a stall guard (`CLAUDE_TIMEOUT_MS`); a hung network now gives up in about 6 s with a 3 s timeout. Live after `docker restart analytics_node_app` |
| D-2 | AI assistant: when Claude can't be reached, the chat said "Claude API error (undefined). Please try again." | S2 | No | 2026-11-09 | 2026-11-09 | Ventura | Fixed: now "The AI assistant couldn't reach Claude just now… Questions asked before still answer at once" |
| D-3 | Any restart (including after changing `.env` on the day) threw away the morning's warm-up, so every answer went back to waiting on Claude | S2 | No | 2026-11-09 | 2026-11-09 | Ventura | Fixed: saved answers kept in `.cache/answers.json` and reloaded on start |
| D-4 | No offline fallback or emergency switch for the AI assistant, and nothing on screen told the room it was showing saved answers | S2 | Yes | 2026-11-09 | 2026-11-09 | Ventura | Fixed: `DEMO_MODE=offline` answers only saved questions, with a "🔌 Offline mode" label, and suggests questions that work |
| D-5 | `WARMUP_PASSWORD` in `.env` no longer matched the warmup account, so `npm run warmup` couldn't sign in: no saved answers, and the gate's DATA SEEDED would stay RED | S2 | Yes | 2026-11-09 | 2026-11-09 | Ventura | Fixed: warmup's password reset to the value in `.env`. Run `npm run warmup` on the presentation day (answers are saved per day), then the gate |
| D-6 | The Postgres rebuild on 2026-11-05 removed the 11 [Demo] tickets and the Milwaukee Brewers test team, so the assigning demo (steps 4-5) had nothing to assign | S1 | Yes | 2026-11-09 | 2026-11-09 | Ventura | Fixed: the Brewers, their 4 test players and `db/demo-tickets.sql` restored |
| D-7 | The same rebuild wiped every email address, so notification emails (step 5) would have gone nowhere | S2 | No | 2026-11-09 | 2026-11-09 | Ventura | Fixed: addresses reloaded; emails go only to Ventura until 🎬 Demo day → Email everyone |
| D-8 | The T11A sandbox uses ports 4000 and 3000, which Cube and Metabase already use on the presenting laptop, so `npm run sandbox:api` / `sandbox:app` can't start while OneTouch runs | S3 | No | 2026-11-09 |  | Ventura | Accepted: rehearse with `API_PORT=4200`, `APP_PORT=3200` and `--target http://localhost:4200`, or put the chaos proxy in front of Claude instead (runbook) |

## Decisions

- **Open defects we're accepting for the demo, and why it's safe:** D-8 only affects the class's practice sandbox, never OneTouch or the presentation. Also accepted by design: follow-up questions ("same but for changes") always go to Claude and are never saved, so they can't be part of the offline fallback.
- **How we'll avoid them during the demo (route around, don't click, etc.):** On stage, ask only opening questions from `scripts/warmup-questions.txt`, never follow-ups. Present from the server laptop, so http://localhost:8000 is one tab away if the public link drops. Run the gate before every run, and don't start on RED.
