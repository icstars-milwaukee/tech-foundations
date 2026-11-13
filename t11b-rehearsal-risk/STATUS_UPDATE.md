# Status Update

**Team:** Unity Forward Solutions
**Date:** 2026-11-13
**Audience (who's reading this):** Jakwoun

## Overall status

Pick one: **Green** (on track) · **Yellow** (at risk, we have a plan) · **Red** (off track, we need help)

- **Status:** Yellow
- **Why (one sentence with a fact, not a feeling):** The app works end to end and has 196 API tests behind it, but the hosted site is on Render's free plan (it sleeps and the database expires after 30 days), the AI can only answer about made-up tickets, and we have not yet finished a timed rehearsal on the demo laptop.

## Since last update

- **Done:** Merged 4 pull requests in two days (#13 to #16): Home, Dashboards (35 charts), saved and scheduled Reports, a UX pass, a guided tour, and a feedback survey. On Nov 13 we separated the AI from the real MCBC data, so the AI reads made-up tickets only. CI runs the API and web tests on every pull request.
- **Not done that we said we'd do, and why:** Scheduled report emails are not connected because no mail service is set up. The Render site is still on the free plan, so it is not ready for a client demo until we pay for the web service and database or re-import the data.

## Next, before the presentation

- **Next:** Run the demo script twice on the demo laptop, timed, with the quality gate first. Do the two rehearsal rounds with our paired team and file every piece of feedback as a GitHub issue. Check Render (plan and database age) and re-import the six CSV files if needed. Put at least $1 of credit on the AI account and test the AI page. Charge and test a phone hotspot.

## Top risks

The 3 biggest from `RISK_LOG.md`. Trend: ↑ worse · → same · ↓ better.

| Risk | Impact if it happens | Mitigation | Owner | Trend |
|---|---|---|---|---|
| R-7: The free Render database is deleted after 30 days | Home and Dashboards are empty in the demo | Check the database age on Render. Upgrade to a paid database or re-import the six CSV files before the demo. | Jose | ↑ |
| R-8: The AI is asked about real MCBC tickets but only reads made-up ones | The client thinks the AI is broken or wrong | Say out loud that the AI reads demonstration tickets only, and ask it questions that match the made-up data. | Jose | ↑ |
| R-3: The app malfunctions during the demo | The room sees a broken page instead of the story | 196 API tests plus the web tests pass in CI. Run through the demo on the demo laptop right before presenting. | Jose | → |

## Asks

- **What we need, from whom, by when:** From our trainer: 20 minutes before the final presentation to review our demo script and the AI step. From the client contact (through our trainer): confirm that it is okay to host the sanitized MCBC data on Render for the demo. Our docs say nobody has approved this yet.
- **The thing we're most worried about that we haven't said out loud yet:** That the AI Assistant only answers about made-up tickets, so a client who expects it to answer about their real tickets will be disappointed. We need to explain that clearly in the demo, not hope nobody asks.
