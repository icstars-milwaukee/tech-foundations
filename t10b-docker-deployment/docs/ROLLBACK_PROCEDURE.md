# Rollback Procedure: CohortHub Events Service

Use this when a new version fails verification or causes problems. Follow it **exactly**. Don't debug first: roll back, then investigate.

## When to roll back

- **Rollback trigger (what you see that means "roll back now"):** `npm run verify` says `NOT VERIFIED`, `docker ps` shows `(unhealthy)` or the container keeps restarting, the logs show repeated `[ERROR]` lines, or users report that the page or API is broken.
- **Who decides:** The person running the deployment. They don't need to wait for approval, and they tell the trainer right after.

## Before you start

- **How to find which version is running now:** Run `docker ps` and read the IMAGE column, or open http://localhost:8080/health and read `version`.
- **How to find which versions are available to roll back to:** Run `docker images cohorthub-events`. Each tag is a version you can run without rebuilding.

## Steps

Run from the `t10b-docker-deployment` folder. Replace `1.0.0` if you're going back to a different version. The first command saves the bad version's logs, because `docker rm` deletes them. If the `evidence` folder doesn't exist yet, create it first.

```bash
docker logs cohorthub-events > evidence/logs-bad-version.txt 2>&1
docker stop cohorthub-events
docker rm cohorthub-events
docker run -d --name cohorthub-events -p 8080:8080 --env-file app/.env --restart unless-stopped cohorthub-events:1.0.0
npm run verify -- 1.0.0
```

No code edits and no rebuild. Rolling back just runs the previous image.

## Confirm

- **How to prove the old version is back and working:** `npm run verify -- 1.0.0` shows `RESULT: VERIFIED`, `docker ps` shows the `cohorthub-events:1.0.0` image as `Up`, and http://localhost:8080 shows `Version 1.0.0` in the footer.

## Afterwards

- **What to keep for investigating the bad version (logs, image, notes):** Keep the logs saved in the first step and the `verify-vX.Y.Z.txt` file in `evidence/`. Don't delete the bad version's image, so it can be run again to reproduce the problem. Write down what you saw and when.
- **Who to tell, and what to say:** Tell the trainer and team: which version was rolled back, which version is running now, what triggered the rollback, and that it's verified.

## Rollback test record

| Date | From version | To version | Time taken | Verified? |
|---|---|---|---|---|
| 2026-11-04 | 1.1.0 | 1.0.0 | About 4 seconds (commands run back to back from a script) | Yes, `evidence/verify-v1.0.0.txt` |
