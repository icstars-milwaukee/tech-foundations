# T10B: Deployment Phase Using Docker

**i.c.stars Tech Foundations · Week 10 · 60–90 min**

> "It works on my machine" isn't a deployment plan.

In T10A you planned a release and practiced rollback. Today you do it for real with **Docker**: package an app so it runs the same way on any computer, deploy it, verify it from the outside, ship a new version, roll it back, and write the docs so someone else could do all of it without you. This contributes to the **Week 10 Performance Assessment (Application Deployment & Operations)**.

**Standards:** RL.KU1 · RL.SK1 · RL.SK2 · RL.O1 · SE.O1

---

## Setup (do this BEFORE the session)

1. Install **Docker Desktop** (https://docs.docker.com/get-docker/). It's a big download, so don't wait until class. On Windows, let it set up WSL 2 when it asks.
2. Start Docker Desktop and wait until it says it's running.
3. In a terminal:
   ```bash
   docker --version
   docker run --rm hello-world
   ```
   If you see "Hello from Docker!", you're ready.
4. Node 18+ for the helper scripts. No `npm install`.

Can't install Docker on your laptop? Tell your trainer **before** the session so you can pair or use the backup environment.

## What's in here

| Path | What it's for | When |
|---|---|---|
| `app/` | The CohortHub Events Service you'll containerize | All session |
| `app/Dockerfile` | **Your code.** The recipe for the image (7 TODOs) | Guided |
| `app/.dockerignore` | **Your code.** What must never go into the image | Guided |
| `app/.env.example` | Runtime settings and secrets (passed in at run time) | Guided |
| `scripts/verify-deploy.js` | Checks the deployed app from the outside, saves evidence | All session |
| `docs/DEPLOYMENT_CHECKLIST.md` | The standard checklist + peer validation | All session |
| `docs/DEPLOYMENT_GUIDE.md` | **Your deployment guide** | Independent |
| `docs/ROLLBACK_PROCEDURE.md` | **Your rollback procedure** | Independent |
| `docs/RUNBOOK.md` | **Your ops runbook**: monitoring, troubleshooting, failure scenarios | All session |

## Commands

| Command | Does |
|---|---|
| `npm run app:local` | Runs the app **without** Docker on http://localhost:8080 (know what "working" looks like first) |
| `npm run verify -- 1.0.0` | Verifies the deployed app is up, healthy, and running version 1.0.0 |
| `npm run check` | Shows which parts of your artifact are done |

---

## Image, container, tag

| Word | Means | Analogy |
|---|---|---|
| **Dockerfile** | The recipe | A recipe card |
| **Image** | The packaged app + everything it needs, built from the Dockerfile. Read-only. | A meal-prep container, sealed |
| **Tag** | The image's version label: `cohorthub-events:1.0.0` | The date on the label |
| **Container** | A running copy of an image | The meal, heated and served |

Why bother? The image has the **exact** Node version, files, and settings. It runs the same on your laptop, your teammate's laptop, and a server. And rolling back is just running the previous tag.

## Dockerfile instructions

| Instruction | Does |
|---|---|
| `FROM node:24-alpine` | Start from an official base image. **Pin the version.** |
| `WORKDIR /app` | Folder inside the container where the next steps happen |
| `COPY package.json ./` | Copy files from your project into the image |
| `RUN npm install --omit=dev` | Run a command while **building** (only needed if the app has dependencies) |
| `ENV PORT=8080` | Set an environment variable (never a secret) |
| `EXPOSE 8080` | Document which port the app listens on |
| `USER node` | Run as a non-root user |
| `HEALTHCHECK ...` | A command Docker runs to decide if the app is healthy |
| `CMD ["node", "server.js"]` | What runs when a container **starts** |

Here's a Dockerfile for a **different** app (a "hello-api" on port 3000). Yours follows the same pattern:

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY . .
ENV PORT=3000
EXPOSE 3000
USER node
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "server.js"]
```

## Docker cheat sheet

Run these from **this folder** (the one with `app/` in it).

```bash
# Build an image from ./app and tag it with a version
docker build -t cohorthub-events:1.0.0 ./app

# Run it: detached (-d), named, port published (host:container), settings
# passed in at run time, and restarted automatically if it crashes
docker run -d --name cohorthub-events -p 8080:8080 \
  --env-file app/.env --restart unless-stopped cohorthub-events:1.0.0

docker ps                          # running containers (add -a to see stopped ones)
docker logs cohorthub-events       # the app's logs (add -f to follow live)
docker images cohorthub-events     # every version you've built
docker stop cohorthub-events       # stop it (sends SIGTERM, the app shuts down cleanly)
docker rm cohorthub-events         # remove the stopped container (the image stays)
```

On Windows PowerShell, use a backtick `` ` `` instead of `\` to continue a line, or put the command on one line.

## Secrets in containers

- **Never** `COPY` a `.env` file into an image. Anyone who has the image can read every file in it.
- `.dockerignore` makes sure `COPY . .` can't sneak it in by accident.
- Pass secrets when the container **starts**: `--env-file app/.env`.

---

## Facilitator-guided deployment (together, 25 min)

1. **Know "working" first.** `npm run app:local`. Open http://localhost:8080 and http://localhost:8080/health. Stop it (Ctrl+C).
2. **Settings.** `cp app/.env.example app/.env`. Set `SUPPORT_API_KEY` to the value your trainer gives you.
3. **Dockerfile + .dockerignore.** With your trainer, replace each TODO. Talk through **why** each line exists.
4. **Build:** `docker build -t cohorthub-events:1.0.0 ./app`. Then `docker images cohorthub-events`.
5. **Run** with the full `docker run` command from the cheat sheet.
6. **Verify:** `docker ps`, `docker logs cohorthub-events`, then `npm run verify -- 1.0.0`. Open the page in your browser.
7. **Write it down** in `docs/DEPLOYMENT_GUIDE.md` as you go. Commit: `feat: containerize CohortHub Events v1.0.0`.

## Independent deployment (on your own, 20 min)

Ship version **1.1.0**, then roll it back.

1. Make a visible change: edit the page title or add an event in `app/server.js`. Bump `"version"` in `app/package.json` to `1.1.0`.
2. Build `cohorthub-events:1.1.0`. Replace the running container with the new version. Verify: `npm run verify -- 1.1.0`.
3. Pretend 1.1.0 has a problem. **Roll back** to 1.0.0 using only commands, no code edits. Verify: `npm run verify -- 1.0.0`.
4. Fill in `docs/ROLLBACK_PROCEDURE.md` (with the time it took) and the command log in the deployment guide.
5. Fill in **Monitoring** in `docs/RUNBOOK.md`.

## Peer validation (pairs, 15 min)

1. **Follow their docs.** Swap laptops (or screens). Deploy your partner's app using **only** their `DEPLOYMENT_GUIDE.md`, then roll it back using **only** their `ROLLBACK_PROCEDURE.md`. Fill in **Peer validation** in *their* checklist. Where you got stuck is where their docs need work.
2. **Break it.** Cause one problem from the runbook's "Common problems" table on your partner's setup (stop Docker Desktop, start something else on port 8080, remove `-p`...). They diagnose it with their runbook. They record it under **Failure scenarios**.

## Time buffer (10–15 min)

Something won't work the first time. That's normal, and it's the job. Use this time for troubleshooting, finishing peer validation, and reviewing rollback procedures. Add every problem you hit to the runbook.

## Before you leave

```bash
npm run check
```

Then clean up so you don't leave containers running:

```bash
docker stop cohorthub-events && docker rm cohorthub-events
```

Your **artifact** is:

- [ ] A Dockerized app: a complete `Dockerfile` and `.dockerignore`
- [ ] A successfully deployed container, with verification evidence for 1.0.0 and 1.1.0
- [ ] A deployment guide and a rollback procedure someone else has followed successfully
- [ ] An ops runbook with monitoring, troubleshooting, and at least one tested failure scenario + recovery step

## How it's assessed

| Level | What the artifact shows |
|---|---|
| Limited | No working image, or the container runs but the app can't be reached. No docs. |
| Emerging | Image builds and runs with help. Docs list some commands but skip steps. No rollback. Secrets may be in the image. |
| Developing | Deployed and verified. Guide mostly complete. Rollback described but not tested. Runbook thin. |
| **Proficient** | Pinned base image, non-root user, secrets passed at run time. Versioned deploy, verified from the outside. Rollback tested and documented. Peer deployed from the guide alone. Runbook has monitoring and a tested failure scenario. |
| Advanced | HEALTHCHECK shows `healthy` in `docker ps`. Restart policy explained. Runbook covers several failures you actually hit. Docs good enough that the peer needed no help. |

Limited or Emerging? You'll join a 30-minute deployment clinic this week. That's practice, not punishment.

---

**A deployment isn't done when the container starts. It's done when someone else can repeat it and undo it.**
