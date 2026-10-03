# Git Cheat Sheet — Team Workflow

Keep this next to you. The everyday loop is: **branch → change → add → commit → push → PR**.

## Start work

```bash
git clone <repo-url>              # copies the repo to your machine (once)
cd <repo-folder>                  # move into the project folder
git checkout main                 # make sure you're on the main branch
git pull origin main              # get the latest changes from GitHub
git checkout -b my-branch         # create and switch to your own feature branch
```

Use a clear branch name such as `feature/about-page`, `fix/nav-link`, or `docs/git-cheat-sheet`.

## Save your work

```bash
git status                       # see what changed; use this often
git add .                        # stage all your changes
git commit -m                    "Describe the change clearly"
git push origin my-branch         # send your branch to GitHub
```

Then open a Pull Request (PR) on GitHub and ask for review.

## Writing a good commit message

- Say what changed in a few words: `Add about section`, `Fix broken nav link`, `Update README setup steps`.
- Avoid vague messages like `stuff`, `update`, `asdf`, or `final FINAL v2`.
- A good rule is: the message should complete the sentence, "This commit will…"
- Keep it short, specific, and easy to understand for your team.

## Before opening a PR

```bash
git status
```

Check that:

- only the files you intended are changed,
- there are no accidental debug statements or temporary edits,
- your branch is up to date with the main branch,
- your PR description explains the purpose of the change.

If needed, update your branch before submitting:

```bash
git checkout main
git pull origin main
git checkout my-branch
git merge main
```

## Fix a merge conflict

```bash
# Git tells you which file has a conflict. Open the file.
# You'll see conflict markers like this:
# <<<<<<< HEAD
# your version
# =======
# incoming version
# >>>>>>> branch-name
# 1. Delete the marker lines.
# 2. Keep the code you want.
# 3. Save the file.
# 4. Stage and commit the resolution.

git add .
git commit -m "Resolve conflict in <file>"
git push origin my-branch
```

If you are unsure which version to keep, ask a teammate or facilitator before finalizing the resolution.

## Issue hygiene

- One issue per bug or improvement.
- Link your PR to the issue: include `Closes #5` in the PR description.
- Do not open a PR without a related issue.
- Keep issue titles clear and action-oriented.

## When you're stuck

1. Run `git status` first — it usually tells you what to do next.
2. Do not force a reset or overwrite unless you understand the impact.
3. Ask a facilitator or teammate for help if something looks confusing.
4. Conflicts are normal; they are not errors. Git is asking you to decide which version should stay.

## Common Git workflow summary

```bash
git checkout main
git pull origin main
git checkout -b my-branch
# make changes

git status
git add .
git commit -m "Describe the change"
git push origin my-branch
# open PR on GitHub
```

This is the basic team workflow: create a branch, make a focused change, save it, push it, and submit a pull request for review.
