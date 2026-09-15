#!/usr/bin/env bash
# ============================================================
# CONFLICT LAB SETUP — run this BEFORE the session to rehearse,
# or live to demo how a conflict is created.
#
# It creates two branches that edit the SAME line, so that
# merging the second one produces a conflict you resolve on camera.
#
# Usage:
#   1. cd into a clone of your training repo
#   2. bash setup-conflict-demo.sh
#   3. Follow the printed instructions to merge + resolve
# ============================================================
set -e

FILE="conflict-lab.md"
LINE="Our team's favorite programming language is:"

echo "==> Making sure we're on main and up to date"
git checkout main
git pull origin main || true

echo "==> Branch 1: team-python"
git checkout -b team-python
sed -i "s/${LINE}.*/${LINE} Python/" "$FILE"
git add "$FILE"
git commit -m "Set favorite language to Python"
git push origin team-python

echo "==> Back to main"
git checkout main

echo "==> Branch 2: team-javascript (edits the SAME line)"
git checkout -b team-javascript
sed -i "s/${LINE}.*/${LINE} JavaScript/" "$FILE"
git add "$FILE"
git commit -m "Set favorite language to JavaScript"
git push origin team-javascript

echo ""
echo "============================================================"
echo "SETUP COMPLETE. Now demo the conflict:"
echo ""
echo "  Option A — in the PR UI (recommended for interns):"
echo "    1. Open a PR: team-python  -> main.  Merge it."
echo "    2. Open a PR: team-javascript -> main."
echo "       GitHub will say it can't merge automatically."
echo "    3. Click 'Resolve conflicts', remove the <<<< ==== >>>>"
echo "       markers, keep the final text, mark resolved, commit."
echo ""
echo "  Option B — in the CLI:"
echo "    git checkout main && git pull"
echo "    git merge team-python        # merges clean"
echo "    git merge team-javascript    # CONFLICT!"
echo "    # open conflict-lab.md, fix it, then:"
echo "    git add conflict-lab.md"
echo "    git commit -m 'Resolve conflict in conflict-lab.md'"
echo "============================================================"
