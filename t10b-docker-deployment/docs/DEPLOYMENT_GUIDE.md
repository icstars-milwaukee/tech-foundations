# Deployment Guide: CohortHub Events Service

Written so someone who has never seen this project can deploy it. Every command is copy-pasteable and in order. Run everything from the `t10b-docker-deployment/` folder (the one with `app/` in it).

> This deployment publishes the app on host port **8090** (`-p 8090:8080`) because 8080/3000/4000/8000 are used by other services on this machine. The app still listens on 8080 *inside* the container.

## Prerequisites

- **Software needed (with versions):** Docker Desktop (Docker Engine 29.x tested, any 24+ works), Node.js 18+ (for the verify script only), Git.
- **How to check Docker is running:** `docker info` prints a Server section with no errors (or Docker Desktop shows "Engine running"). `docker run --rm hello-world` prints "Hello from Docker!".

## 1. Configure

- **Where the runtime settings live and how to create them:** In `app/.env` (never committed, never copied into the image). Create it from the example, then set `SUPPORT_API_KEY` to the value from your trainer.

```bash
cp app/.env.example app/.env
# then edit app/.env and set SUPPORT_API_KEY=<value from trainer>
```

## 2. Build the image

```bash
docker build -t cohorthub-events:1.0.0 ./app
```

- **How to confirm the image exists:** `docker images cohorthub-events` lists a row with TAG `1.0.0`.

## 3. Run the container

```bash
docker run -d --name cohorthub-events -p 8090:8080 --env-file app/.env --restart unless-stopped cohorthub-events:1.0.0
```

- **What each flag in the run command does:** `-d` runs it in the background (detached); `--name cohorthub-events` gives it a fixed name for logs/stop/rm; `-p 8090:8080` publishes container port 8080 on host port 8090; `--env-file app/.env` passes settings and secrets in at run time; `--restart unless-stopped` restarts it automatically if it crashes or Docker restarts; the last argument is the image and version tag to run.

## 4. Verify

```bash
docker ps --filter name=cohorthub-events
docker logs cohorthub-events
# Mac/Linux/Git Bash:
BASE_URL=http://localhost:8090 npm run verify -- 1.0.0
# PowerShell:
$env:BASE_URL="http://localhost:8090"; npm run verify -- 1.0.0
```

- **What "success" looks like (exact output or what you see):** `docker ps` STATUS shows `Up ... (healthy)` and PORTS shows `0.0.0.0:8090->8080/tcp`. The logs show `CohortHub Events v1.0.0 listening on http://0.0.0.0:8080`. Verify prints four `[PASS]` lines and `RESULT: VERIFIED` and saves `evidence/verify-v1.0.0.txt`. http://localhost:8090 shows the events list with "Version 1.0.0" in the footer.

## 5. Deploying a new version

```bash
# 1. bump "version" in app/package.json (e.g. 1.1.0) and make your change
docker build -t cohorthub-events:1.1.0 ./app
docker stop cohorthub-events
docker rm cohorthub-events
docker run -d --name cohorthub-events -p 8090:8080 --env-file app/.env --restart unless-stopped cohorthub-events:1.1.0
BASE_URL=http://localhost:8090 npm run verify -- 1.1.0
```

## Command log

Record the deployments you actually did today.

| Time | Version | Command(s) | Result |
|---|---|---|---|
| 2026-11-03 13:59 | 1.0.0 | `docker build -t cohorthub-events:1.0.0 ./app`; `docker run -d --name cohorthub-events -p 8090:8080 --env-file app/.env --restart unless-stopped cohorthub-events:1.0.0`; `npm run verify -- 1.0.0` | Up (healthy), VERIFIED |
| 2026-11-03 13:59 | 1.1.0 | `docker build -t cohorthub-events:1.1.0 ./app`; `docker stop`/`docker rm cohorthub-events`; `docker run ... cohorthub-events:1.1.0`; `npm run verify -- 1.1.0` | Up (healthy), VERIFIED, 4 events |
| 2026-11-03 14:00 | 1.0.0 (rollback) | `docker stop`/`docker rm cohorthub-events`; `docker run ... cohorthub-events:1.0.0`; `npm run verify -- 1.0.0` | VERIFIED in 7 seconds |
