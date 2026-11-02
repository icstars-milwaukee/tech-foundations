# Incident Log

An incident is any time users are (or could be) hurt by something the system did. Log it **while** it's happening. Fix the process afterwards, not the person.

## Incident: v1.5.0 RSVP regression and rollback

- **Date + time detected:** 2026-11-02 13:38:07 CST (19:38:07.608 UTC)
- **Detected by (alert, release check, user report):** Automated `npm run release-check`; the check sampled 60 requests.
- **Severity (SEV1 = everyone down, SEV2 = major feature broken, SEV3 = degraded):** SEV2 — the RSVP feature was failing intermittently and was substantially slow.
- **Who was affected, and how:** Potentially CohortHub users making RSVP requests. The sample recorded a 10% overall request error rate (6 of 60 requests) and 612 ms p95 latency. The health endpoint still returned 200. No real-user count or reports were recorded.
- **Version running:** 1.5.0

### Timeline

| Time | What happened / what we did |
|---|---|
| 13:38:07 CST | The v1.5.0 release check found `/health` passing, but a 10% error rate and 612 ms p95 latency (limits: below 2% and 300 ms). Verdict: ROLLBACK. |
| After the failed check; exact time not recorded | Followed the rollback procedure: changed `APP_VERSION` back to 1.4.0 and restarted the app. Terminal history records the app and release-check commands, but not their individual times. |
| 13:41:34 CST | The v1.4.0 release check returned GO: health 200, 0% errors, and 68 ms p95 latency. Rollback was verified. |

### Resolution

- **What we did to stop the impact (rollback? fix forward?):** Rolled back to v1.4.0 by changing `APP_VERSION` and restarting the app; confirmed recovery with a passing release check.
- **Time from detection to resolution:** About 3 minutes 27 seconds, from the failed check at 19:38:07.608 UTC to the passing rollback check at 19:41:34.453 UTC. This is the interval between evidence timestamps; command-level timing was not captured.
- **Root cause (what actually went wrong, not who):** The v1.5.0 RSVP path introduced a slow request path and an intermittent 500-error condition. In the sample app, RSVP requests are deliberately delayed and some fail. The `/health` endpoint remained healthy, so checking health alone would not have detected the release regression; request-level error-rate and latency checks exposed it.

### Follow-ups

Guardrails so this can't happen the same way again.

| Action | Owner | Due |
|---|---|---|
| Add RSVP regression/load coverage that fails the release if the error rate reaches 2% or p95 latency reaches 300 ms. | Release owner | Before the next release |
| Use a staged/canary rollout and monitor endpoint-level errors and latency; do not use `/health` as the sole release signal. | Operations owner | Before the next release |
