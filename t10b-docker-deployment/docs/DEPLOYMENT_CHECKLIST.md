# Deployment Checklist

The standard checklist for every deployment. **Your partner** fills in the Peer validation section by following your docs, not by watching you.

**Deployer:** Fernando Gamboa
**Version deployed:** 1.0.0, then 1.1.0, then rolled back to 1.0.0

## Before

- [x] App runs locally without Docker (`npm run app:local`)
- [x] `Dockerfile` has no TODOs left. Base image version is pinned (no `latest`).
- [x] `.dockerignore` keeps out `.env`, `node_modules`, `.git`
- [x] Secrets are passed at run time (`--env-file`), not copied into the image
- [x] Version in `app/package.json` matches the image tag

## Deploy

- [x] Image built with a version tag (`cohorthub-events:X.Y.Z`)
- [x] Old container stopped and removed (or none was running)
- [x] New container running with a name, a published port, and a restart policy
- [x] Every command used is written in `DEPLOYMENT_GUIDE.md`

## Verify

- [x] `docker ps` shows the container as Up (and `healthy`, if you added a HEALTHCHECK)
- [x] `npm run verify -- X.Y.Z` says VERIFIED
- [x] Opened http://localhost:8080 in a browser and saw the right version in the footer
- [x] `docker logs` shows requests and no errors

## Recover

- [x] Rollback tested: went back to the previous version and verified it
- [ ] At least one failure scenario + recovery step written in `RUNBOOK.md`

## Peer validation

Your partner deploys **your** app using only your `DEPLOYMENT_GUIDE.md` and rolls it back using only your `ROLLBACK_PROCEDURE.md`.

- **Validated by:** 
- **Deployed successfully from the guide alone? (yes / no + where they got stuck):** 
- **Rolled back successfully from the procedure alone? (yes / no + where they got stuck):** 
- **One thing to make clearer:** 
