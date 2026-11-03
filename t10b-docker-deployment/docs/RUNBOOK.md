# Operations Runbook: CohortHub Events Service

How to keep the app running after it's deployed: what to watch, and what to do when something breaks.

## Monitoring

- **How to check the container is up:** `docker ps --filter name=cohorthub-events` shows STATUS `Up ...` (Docker Desktop > Containers shows a green running dot).
- **How to check the app is healthy (not just running):** STATUS shows `(healthy)` from the HEALTHCHECK; `curl http://localhost:8090/health` returns `{"status":"ok",...}`; `BASE_URL=http://localhost:8090 npm run verify -- <version>` says VERIFIED.
- **How to read the logs (and follow them live):** `docker logs cohorthub-events`; add `-f` to follow live, `--tail 50` for the latest lines (or the Logs tab in Docker Desktop).
- **What a healthy log line looks like vs. a problem:** Healthy: `[INFO] GET /health -> 200 (1ms)`. Problem: any `[ERROR]` line or `-> 500`, repeated startup lines (crash loop), or `[WARN] SUPPORT_API_KEY is not set` (fix `app/.env` and recreate the container).

## Common problems

Starter rows are filled in. Add the ones **you** hit today.

| Symptom | Likely cause | How to check | Fix |
|---|---|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop isn't running | `docker info` | Start Docker Desktop, wait for it to say "running" |
| `port is already allocated` | Another container or app is using 8080 | `docker ps`, or `lsof -i :8080` (Mac) / `netstat -ano \| findstr :8080` (Windows) | Stop the other container, or publish a different port: `-p 9090:8080` |
| Container is Up but the browser can't connect | Port not published, or the app listens on 127.0.0.1 inside the container | `docker ps` (check the PORTS column), `docker logs` | Add `-p 8080:8080`. App must listen on `0.0.0.0` |
| Container exits right away | App crashed on startup | `docker ps -a`, then `docker logs <name>` | Read the first error line in the logs |
| `/health` shows the old version | Old container still running, or image not rebuilt | `docker ps`, `docker images` | Rebuild with the new tag, remove the old container, run the new tag |
| `Bind for 0.0.0.0:8090 failed: port is already allocated` | Our container (or another) already holds 8090 | `docker ps` (PORTS column) | Stop/remove the existing container first, or use another host port |
| `[WARN] SUPPORT_API_KEY is not set` in logs | `app/.env` still has `replace-me` | `docker logs cohorthub-events` | Set the key in `app/.env`, then `docker rm -f` and `docker run` again |

## Failure scenarios

At least one scenario you **tested** (your partner broke it, or you did) with a recovery step.

| Scenario | How we detected it | Recovery step | Tested? |
|---|---|---|---|
| Second container started on port 8090 while v1.0.0 was running | `docker run` failed: `Bind for 0.0.0.0:8090 failed: port is already allocated` | `docker rm -f` the duplicate; confirmed original still `Up (healthy)` with `docker ps` | Yes, 2026-11-03 |
| v1.1.0 treated as a bad release | Simulated trigger | Followed ROLLBACK_PROCEDURE.md, back on 1.0.0 in 7s, verify VERIFIED | Yes, 2026-11-03 |

## Escalation

- **If the runbook doesn't fix it, who do you contact and what do you send them:** The trainer / team lead. Send: the symptom, the time it started, output of `docker ps -a`, the last 50 lines of `docker logs cohorthub-events`, the verify output, and what you already tried.
