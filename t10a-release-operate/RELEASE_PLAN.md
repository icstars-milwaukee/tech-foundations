# Release Plan

Write this **before** you release. If the release goes wrong, this is the document you follow, so write it for a tired teammate at 11 p.m., not for yourself today.

## 1. The release

- **System:** Windows 11
- **Version going out:** OneTouch 1.0.0
- **Version we'd roll back to (last known good):** OneTouch 1.0.0 
- **What's changing (1–2 sentences):** Nothing so far but we will implement the next set of feedback. 
- **Release owner (runs the release):** Ventura
- **Rollback owner (makes the rollback call):** Ventura 

## 2. Pre-flight checklist

Every box checked before step 3 starts.

- [x] `npm run preflight` says CLEARED FOR RELEASE
- [x] Every key in `.env.example` is set in the target environment
- [x] No secrets in the repo or its history
- [x] Tests pass on the exact commit we're releasing
- [x] The rollback version is written above and still available
- [x] Data is backed up (or this release doesn't change data)
- [x] People who need to know have been told when it's happening

## 3. Deployment steps

Exact commands, in order. Someone else should be able to copy and paste them.

```bash
# TODO: deployment commands
git clone https://github.com/vperez-stars/OneTouch-TEQSolutions.git
cd OneTouch-TEQSolutions
npm install
copy .env.example .env                # then fill in the passwords and keys
# put the ServiceNow CSV export in csv_data\ (it isn't in git)

docker compose up -d postgres db-setup cube   # database, loads the CSVs, Cube
docker compose logs db-setup
docker exec analytics_postgres psql -U admin -d analytics_db -c "SELECT count(*) FROM incident"

docker compose up -d --build                  # everything else, including the app
docker logs --tail 30 analytics_node_app

docker exec analytics_node_app node scripts/metabase-setup.mjs   # dashboards
docker exec -it analytics_node_app node scripts/users.mjs add jsmith "Jane Smith"
npm run warmup                                # optional: fills the answer cache
```

## 4. Success criteria

The release is only "done" when it meets **every** one of these. Use numbers.

| Signal | Threshold | How we measure it |
|---|---|---|
| Health check | returns 200 | if we get 200 |
| Error rate | below __<2_ % | if we get <2% |
| p95 latency | below _300__ ms | if we get <300ms |

## 5. Monitoring

- **Signals we watch after release (logs, metrics, user reports):**  User reports
- **Alert threshold (when someone gets notified):**  When we get close to API limits
- **Who gets alerted, and how:**  Ventura through email
- **How long we watch closely after release:** Extremely closely for a couple minutes

## 6. Rollback

- **Rollback trigger (which criterion fails, for how long):** 
- **Who decides to roll back:** 

```bash
# TODO: rollback commands
```
git log --oneline -5                  # find the commit to undo
git revert c570261                    # e.g. undo the Node 24 move
git push origin main
docker restart analytics_node_app                  # only *.mjs files changed
docker compose up -d --build --no-deps -V app      # Dockerfile / package.json changed
git checkout d8b4d7e                  # the app runs this folder's code
docker restart analytics_node_app
# ...when done:
git checkout main
docker restart analytics_node_app
git revert c570261
docker compose up -d --build --no-deps -V app
docker exec analytics_node_app node -v            # should say v20.x
git push origin main
docker logs --tail 30 analytics_node_app
curl.exe -s https://onetouch.fyi | Select-String "Sign in to OneTouch"

- **How we confirm the rollback worked:** 
The app works as before
## 7. Evidence

- **Release check result for the new version (file in evidence/):** C:\Users\VenturaPerez\OneDrive - i.c.stars\Documents\GitHub\tech-foundations\t10a-release-operate\evidence\release-check-v1.5.0.txt
- **Release check result after rollback:** 
C:\Users\VenturaPerez\OneDrive - i.c.stars\Documents\GitHub\tech-foundations\t10a-release-operate\evidence\release-check-v1.4.0.txt