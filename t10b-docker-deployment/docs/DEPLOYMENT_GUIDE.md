# Deployment Guide: CohortHub Events Service

Written so someone who has never seen this project can deploy it. Every command is copy-pasteable and in order. Run everything from the `t10b-docker-deployment` folder (the one with `app/` in it).

## Prerequisites

- **Software needed (with versions):** Docker Desktop (tested on 4.98.0, Docker Engine 29.9.2) and Node 18+ for the verify script (tested on 26.7.0). No `npm install` needed.
- **How to check Docker is running:** Run `docker info`. It should print server details, not `Cannot connect to the Docker daemon`. If the terminal says `docker` isn't recognized, see "Common problems" in `RUNBOOK.md`.

## 1. Configure

- **Where the runtime settings live and how to create them:** In `app/.env`, copied from `app/.env.example`. Open it and set `SUPPORT_API_KEY` to the real value. Git and Docker both ignore this file, so the secret stays out of the repo and the image.

```bash
cp app/.env.example app/.env
```

## 2. Build the image

```bash
docker build -t cohorthub-events:1.0.0 ./app
```

- **How to confirm the image exists:** Run `docker images cohorthub-events`. The list should include `cohorthub-events:1.0.0`.

## 3. Run the container

```bash
docker run -d --name cohorthub-events -p 8080:8080 --env-file app/.env --restart unless-stopped cohorthub-events:1.0.0
```

- **What each flag in the run command does:** `-d` runs it in the background. `--name` gives it a fixed name for later commands. `-p 8080:8080` publishes container port 8080 on your computer's port 8080. `--env-file app/.env` passes the settings and secret in at run time. `--restart unless-stopped` restarts it after a crash or a Docker restart, unless you stopped it yourself. The last argument is the image and version to run.

## 4. Verify

```bash
docker ps
docker logs cohorthub-events
npm run verify -- 1.0.0
```

- **What "success" looks like (exact output or what you see):** `docker ps` shows `cohorthub-events` as `Up` and, within about 10 seconds of starting, `(healthy)`, with `0.0.0.0:8080->8080/tcp` under PORTS. The logs include `CohortHub Events v1.0.0 listening on http://0.0.0.0:8080`. The verify script shows four `[PASS]` lines and `RESULT: VERIFIED`. http://localhost:8080 shows the event list with `Version 1.0.0` in the footer.

## 5. Deploying a new version

First change the app and set the new `"version"` in `app/package.json`. The commands below use 1.1.0. The old container must be removed before a new one can use its name and port.

```bash
docker build -t cohorthub-events:1.1.0 ./app
docker stop cohorthub-events
docker rm cohorthub-events
docker run -d --name cohorthub-events -p 8080:8080 --env-file app/.env --restart unless-stopped cohorthub-events:1.1.0
npm run verify -- 1.1.0
```

If verification fails, follow `ROLLBACK_PROCEDURE.md`.

## Command log

Record the deployments you actually did today. Times are CST on 2026-11-04, run from the `gamboa` branch.

| Time | Version | Command(s) | Result |
|---|---|---|---|
| 21:16 | 1.0.0 | `docker build`, `docker run`, `npm run verify -- 1.0.0` | VERIFIED, container `healthy` |
| 21:17 | 1.1.0 | `docker build`, `docker stop`, `docker rm`, `docker run`, `npm run verify -- 1.1.0` | VERIFIED, container `healthy`, new page title showing |
| 21:17 | 1.0.0 (rollback) | `docker logs`, `docker stop`, `docker rm`, `docker run`, `npm run verify -- 1.0.0` | VERIFIED, original page title back, no code edits |
