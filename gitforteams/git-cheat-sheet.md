# Git Cheat Sheet — Team Workflow

Keep this next to you. The everyday loop is: **branch → change → add → commit → push → PR.**

## Start work
```bash
git clone <repo-url>        # copy the repo to your machine (once)
git checkout main           # make sure you're on main
git pull                    # get the latest changes
git checkout -b my-branch   # create + switch to your own branch
```

## Save your work
```bash
git status                  # see what changed (use this A LOT)
git add .                   # stage all your changes
git commit -m "Clear message about what changed"
git push origin my-branch   # send your branch to GitHub
```
Then open the Pull Request on GitHub.

## Writing a good commit message
- Say WHAT changed, in a few words: `Add about section`, `Fix broken nav link`.
- Not: `stuff`, `update`, `asdf`, `final FINAL v2`.
- Rule of thumb: it finishes the sentence "This commit will…"

## Fix a merge conflict
```bash
# Git tells you which file has a conflict. Open it.
# You'll see <<<<<<<  =======  >>>>>>> markers.
# 1. Delete the marker lines.
# 2. Keep the text you want.
# 3. Save.
git add .
git commit -m "Resolve conflict in <file>"
git push
```

## Issue hygiene
- One issue per bug or improvement.
- Link your PR to it: put `Closes #5` in the PR description.
- No PR without an issue.

## When you're stuck
1. Run `git status` — it usually tells you what to do next.
2. Don't force anything. Ask a facilitator.
3. Conflicts are normal. They are not errors — they're Git asking you to decide.
