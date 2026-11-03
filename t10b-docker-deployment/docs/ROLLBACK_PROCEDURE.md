# Rollback Procedure: CohortHub Events Service

Use this when a new version fails verification or causes problems. Follow it **exactly**. Don't debug first: roll back, then investigate.

## When to roll back

- **Rollback trigger (what you see that means "roll back now"):** `npm run verify` says `NOT VERIFIED`, `docker ps` shows `(unhealthy)` or the container keeps restarting, `docker logs` shows `[ERROR]` lines, or users report the page/API is broken after a release.
- **Who decides:** The deployer on duty rolls back immediately without waiting for approval, then notifies the team lead / trainer.

## Before you start

- **How to find which version is running now:** `docker ps --filter name=cohorthub-events --format "{{.Image}}"` (or `curl http://localhost:8090/health` and read `version`).
- **How to find which versions are available to roll back to:** `docker images cohorthub-events` lists every tag built on this machine. Pick the last version that was VERIFIED (see `evidence/`).

## Steps

```bash
# Replace 1.0.0 with the last known-good version
docker logs cohorthub-events > evidence/bad-release-logs.txt
docker stop cohorthub-events
docker rm cohorthub-events
docker run -d --name cohorthub-events -p 8090:8080 --env-file app/.env --restart unless-stopped cohorthub-events:1.0.0
```

No code edits and no rebuild: the old image is still on the machine.

## Confirm

- **How to prove the old version is back and working:** `docker ps` shows `cohorthub-events:1.0.0` `Up (healthy)`; `BASE_URL=http://localhost:8090 npm run verify -- 1.0.0` prints `RESULT: VERIFIED`; the browser footer at http://localhost:8090 says "Version 1.0.0".

## Afterwards

- **What to keep for investigating the bad version (logs, image, notes):** The saved logs (`evidence/bad-release-logs.txt`), the failing verify output (`evidence/verify-v<bad>.txt`), and the bad image itself. Do **not** `docker rmi` it, so it can be run again to reproduce. Write down the time and symptoms.
- **Who to tell, and what to say:** Tell the team lead/trainer and teammates: "Rolled back CohortHub Events from vX to vY at HH:MM because <symptom>. vY verified. Logs saved in evidence/. Investigating."

## Rollback test record

| Date | From version | To version | Time taken | Verified? |
|---|---|---|---|---|
| 2026-11-03 | 1.1.0 | 1.0.0 | 7 seconds | Yes, `RESULT: VERIFIED` |
