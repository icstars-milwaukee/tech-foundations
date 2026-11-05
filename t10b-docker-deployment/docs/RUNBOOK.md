# Operations Runbook: CohortHub Events Service

How to keep the app running after it's deployed: what to watch, and what to do when something breaks.

## Monitoring

- **How to check the container is up:** Run `docker ps`. `cohorthub-events` should be listed as `Up`. If it isn't there, run `docker ps -a` to see whether it exited.
- **How to check the app is healthy (not just running):** Look for `(healthy)` in the `docker ps` STATUS column, open http://localhost:8080/health and look for `"status":"ok"` with the expected version, or run `npm run verify -- X.Y.Z`.
- **How to read the logs (and follow them live):** `docker logs cohorthub-events` shows the logs so far. `docker logs -f cohorthub-events` follows them live (Ctrl+C stops following, not the app).
- **What a healthy log line looks like vs. a problem:** Healthy: `[INFO] GET /health -> 200 (3ms)`. Problem: any `[ERROR]` line or `-> 500` response, or `[WARN] SUPPORT_API_KEY is not set`, which means the `--env-file` setting was missed or still has the placeholder value.

## Common problems

Starter rows are filled in. Add the ones **you** hit today.

| Symptom | Likely cause | How to check | Fix |
|---|---|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop isn't running | `docker info` | Start Docker Desktop, wait for it to say "running" |
| `port is already allocated` | Another container or app is using 8080 | `docker ps`, or `lsof -i :8080` (Mac) / `netstat -ano \| findstr :8080` (Windows) | Stop the other container, or publish a different port: `-p 9090:8080` |
| Container is Up but the browser can't connect | Port not published, or the app listens on 127.0.0.1 inside the container | `docker ps` (check the PORTS column), `docker logs` | Add `-p 8080:8080`. App must listen on `0.0.0.0` |
| Container exits right away | App crashed on startup | `docker ps -a`, then `docker logs <name>` | Read the first error line in the logs |
| `/health` shows the old version | Old container still running, or image not rebuilt | `docker ps`, `docker images` | Rebuild with the new tag, remove the old container, run the new tag |
| `docker rm` or other commands never finish, the app stops answering, and `docker desktop restart` fails with `processes still running` | Docker Desktop is frozen (ours froze after being left running overnight; the exact cause wasn't confirmed) | Run a `docker` command and see whether it ever returns | Close the Docker Desktop processes in Task Manager, run `wsl --shutdown`, reopen Docker Desktop, then run `docker run --rm hello-world`. Images and containers were still there afterwards. Start the app again with `docker start cohorthub-events` or the full `docker run` command |
| `docker` is not recognized / `command not found`, but Docker Desktop is running | Docker Desktop is installed for your user only and its `bin` folder isn't on PATH | Look for `%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe` | Add that `bin` folder to PATH and open a new terminal |
|  |  |  |  |

## Failure scenarios

At least one scenario you **tested** (your partner broke it, or you did) with a recovery step.

| Scenario | How we detected it | Recovery step | Tested? |
|---|---|---|---|
|  |  |  |  |

## Escalation

- **If the runbook doesn't fix it, who do you contact and what do you send them:** 
