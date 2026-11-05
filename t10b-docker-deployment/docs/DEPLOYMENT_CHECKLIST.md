# Deployment Checklist

The standard checklist for every deployment. **Your partner** fills in the Peer validation section by following your docs, not by watching you.

**Deployer:** 
**Version deployed:** 

## Before

- [ ] App runs locally without Docker (`npm run app:local`)
- [ ] `Dockerfile` has no TODOs left. Base image version is pinned (no `latest`).
- [ ] `.dockerignore` keeps out `.env`, `node_modules`, `.git`
- [ ] Secrets are passed at run time (`--env-file`), not copied into the image
- [ ] Version in `app/package.json` matches the image tag

## Deploy

- [ ] Image built with a version tag (`cohorthub-events:X.Y.Z`)
- [ ] Old container stopped and removed (or none was running)
- [ ] New container running with a name, a published port, and a restart policy
- [ ] Every command used is written in `DEPLOYMENT_GUIDE.md`

## Verify

- [ ] `docker ps` shows the container as Up (and `healthy`, if you added a HEALTHCHECK)
- [ ] `npm run verify -- X.Y.Z` says VERIFIED
- [ ] Opened http://localhost:8080 in a browser and saw the right version in the footer
- [ ] `docker logs` shows requests and no errors

## Recover

- [ ] Rollback tested: went back to the previous version and verified it
- [ ] At least one failure scenario + recovery step written in `RUNBOOK.md`

## Peer validation

Your partner deploys **your** app using only your `DEPLOYMENT_GUIDE.md` and rolls it back using only your `ROLLBACK_PROCEDURE.md`.

- **Validated by:** 
- **Deployed successfully from the guide alone? (yes / no + where they got stuck):** 
- **Rolled back successfully from the procedure alone? (yes / no + where they got stuck):** 
- **One thing to make clearer:** 
