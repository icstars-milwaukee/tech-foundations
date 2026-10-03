# T3B Training Repo — Git for Teams

Welcome! This shared repository will be used to practice a realistic team-based Git workflow.

## What you'll do today

1. Clone this repository to your local machine.
2. Create a branch using your own name.
3. Add one line to `team-rules.md`.
4. Commit your change with a clear and meaningful message.
5. Push your branch and open a Pull Request.
6. Link your Pull Request to an issue.

## The one rule

**Never commit directly to `main`.** Always work on a feature branch and open a Pull Request before merging. This keeps `main` stable, reviewable, and easier to manage as a team.

## Quick reference

```bash
git clone <repo-url>                 # copy the repository to your machine
git checkout -b your-name           # create and switch to your branch
# ...make your edit...
git add .                           # stage your changes
git commit -m "Add my team rule"    # save your work with a message
git push origin your-name           # send your branch to GitHub
```

After pushing, open the Pull Request in GitHub and link it to an issue.

See `team-rules.md` to make your first contribution.

Example team rules:

- Always create a branch before making changes.
- Keep commit messages clear and specific.
- Review the PR before merging into `main`.
