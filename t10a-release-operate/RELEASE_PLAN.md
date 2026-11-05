# Release Plan

Write this **before** you release. If the release goes wrong, this is the document you follow, so write it for a tired teammate at 11 p.m., not for yourself today.

## 1. The release

- **System:** 
- **Version going out:** 
- **Version we'd roll back to (last known good):** 
- **What's changing (1–2 sentences):** 
- **Release owner (runs the release):** 
- **Rollback owner (makes the rollback call):** 

## 2. Pre-flight checklist

Every box checked before step 3 starts.

- [ ] `npm run preflight` says CLEARED FOR RELEASE
- [ ] Every key in `.env.example` is set in the target environment
- [ ] No secrets in the repo or its history
- [ ] Tests pass on the exact commit we're releasing
- [ ] The rollback version is written above and still available
- [ ] Data is backed up (or this release doesn't change data)
- [ ] People who need to know have been told when it's happening

## 3. Deployment steps

Exact commands, in order. Someone else should be able to copy and paste them.

```bash
# TODO: deployment commands
```

## 4. Success criteria

The release is only "done" when it meets **every** one of these. Use numbers.

| Signal | Threshold | How we measure it |
|---|---|---|
| Health check | returns 200 |  |
| Error rate | below ___ % |  |
| p95 latency | below ___ ms |  |

## 5. Monitoring

- **Signals we watch after release (logs, metrics, user reports):** 
- **Alert threshold (when someone gets notified):** 
- **Who gets alerted, and how:** 
- **How long we watch closely after release:** 

## 6. Rollback

- **Rollback trigger (which criterion fails, for how long):** 
- **Who decides to roll back:** 

```bash
# TODO: rollback commands
```

- **How we confirm the rollback worked:** 

## 7. Evidence

- **Release check result for the new version (file in evidence/):** 
- **Release check result after rollback:** 
