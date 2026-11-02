# Incident Log

An incident is any time users are (or could be) hurt by something the system did. Log it **while** it's happening. Fix the process afterwards, not the person.

## Incident: CohortHub Events Service v1.5.0 failed release check (high error rate and slow responses)

- **Date + time detected:** 2026-11-02, 1:58 PM CST (19:58 UTC)
- **Detected by (alert, release check, user report):** Release check (`npm run release-check`), not the health check
- **Severity (SEV1 = everyone down, SEV2 = major feature broken, SEV3 = degraded):** SEV3. The service stayed up, but the RSVP feature was slow and failing for some requests.
- **Who was affected, and how:** Anyone using the RSVP feature (`/api/rsvps`). About 10% of the 60 test requests failed with a 500 error, and the 95th-percentile response time was 616 ms, so the slowest users waited over twice the 300 ms target.
- **Version running:** 1.5.0 (rolled back to 1.4.0, last known good)

### Timeline

| Time (CST) | What happened / what we did |
|---|---|
| 1:36 PM | Baseline check on v1.4.0 passed: 0% errors, p95 68 ms, verdict GO. This is the known good. |
| Between 1:36 and 1:58 PM | Set `APP_VERSION=1.5.0` in `.env` and restarted the app. |
| 1:58 PM | Release check on v1.5.0: health passed (200), but error rate was 10% (target < 2%) and p95 was 616 ms (target < 300 ms). Verdict: ROLLBACK. Evidence saved in `evidence/release-check-v1.5.0.txt`. |
| Between 1:58 and 2:02 PM | Followed the rollback rule: set `APP_VERSION=1.4.0` in `.env` and restarted the app. No debugging first. |
| 2:02 PM | Release check after rollback: 0% errors, p95 68 ms, verdict GO. Evidence saved in `evidence/release-check-after-rollback.txt`. |

### Resolution

- **What we did to stop the impact (rollback? fix forward?):** Rolled back to v1.4.0 by restoring `APP_VERSION=1.4.0` and restarting, because a success criterion failed.
- **Time from detection to resolution:** About 3.5 minutes (1:58:46 PM detection until the 2:02:11 PM post-rollback check said GO)
- **Root cause (what actually went wrong, not who):** v1.5.0 added the RSVP feature with a slow database query and a bug that fails on some requests. The `/health` endpoint only reports that the app is running, so it said "ok" while real requests were failing and slow. Nothing in our release process measured error rate or latency before the release counted as done.

### Follow-ups

Guardrails so this can't happen the same way again.

| Action | Owner | Due |
|---|---|---|
| Make `npm run release-check` a required step: no release counts as done until it says GO | Jose Romero | Next release |
| Add alerts for error rate above 2% and p95 latency above 300 ms | Jose Romero | Before the next release |
| Make the health check exercise a real endpoint, so "ok" means requests are succeeding | Jose Romero | Next sprint |
| Fix the slow query and the failing requests in the RSVP feature, then re-test v1.5.0 with the release check | Jose Romero | Before re-releasing 1.5.0 |
| Try a staged rollout: send 1.5.0 to a small share of users first | Jose Romero | Next sprint |
