# Operations Runbook: CohortHub Events Service

How to keep the app running after it's deployed: what to watch, and what to do when something breaks.

## Monitoring

- **How to check the container is up:** 
- **How to check the app is healthy (not just running):** 
- **How to read the logs (and follow them live):** 
- **What a healthy log line looks like vs. a problem:** 

## Common problems

Starter rows are filled in. Add the ones **you** hit today.

| Symptom | Likely cause | How to check | Fix |
|---|---|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop isn't running | `docker info` | Start Docker Desktop, wait for it to say "running" |
| `port is already allocated` | Another container or app is using 8080 | `docker ps`, or `lsof -i :8080` (Mac) / `netstat -ano \| findstr :8080` (Windows) | Stop the other container, or publish a different port: `-p 9090:8080` |
| Container is Up but the browser can't connect | Port not published, or the app listens on 127.0.0.1 inside the container | `docker ps` (check the PORTS column), `docker logs` | Add `-p 8080:8080`. App must listen on `0.0.0.0` |
| Container exits right away | App crashed on startup | `docker ps -a`, then `docker logs <name>` | Read the first error line in the logs |
| `/health` shows the old version | Old container still running, or image not rebuilt | `docker ps`, `docker images` | Rebuild with the new tag, remove the old container, run the new tag |
|  |  |  |  |

## Failure scenarios

At least one scenario you **tested** (your partner broke it, or you did) with a recovery step.

| Scenario | How we detected it | Recovery step | Tested? |
|---|---|---|---|
|  |  |  |  |

## Escalation

- **If the runbook doesn't fix it, who do you contact and what do you send them:** 
