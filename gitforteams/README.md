# T3B Training Repo — Git for Teams

Welcome! This is the shared repo we'll use to practice real team Git workflow.

## What you'll do today
1. Clone this repo to your machine.
2. Create a branch named after yourself.
3. Add one line to `team-rules.md`.
4. Commit with a meaningful message.
5. Push your branch and open a Pull Request.
6. Link your PR to an issue.

## The one rule
**Never commit directly to `main`.** Always branch, then open a PR. That's how teams keep `main` stable and reviewable.

## Quick reference
```bash
git clone <repo-url>          # copy the repo to your machine
git checkout -b your-name      # make + switch to your branch
# ...make your edit...
git add .                      # stage your changes
git commit -m "Add my team rule"   # save with a message
git push origin your-name      # send your branch to GitHub
```
Then open the PR on GitHub and link it to an issue.

See `team-rules.md` to make your first contribution.
