#!/usr/bin/env bash
# ============================================================
# CONFLICT LAB SETUP
# ------------------------------------------------------------
# Run this script before the session to prepare a clean demo of
# a merge conflict. It creates two branches that each edit the
# same line in the same file, so the second merge creates a
# visible conflict that can be resolved live.
#
# Usage:
#   1. cd into a clone of your training repository
#   2. bash setup-conflict-demo.sh
#   3. Follow the printed instructions to merge and resolve
# ============================================================

set -euo pipefail

FILE="conflict-lab.md"
LINE="Our team's favorite programming language is:"
BRANCH_PYTHON="team-python"
BRANCH_JAVASCRIPT="team-javascript"

echo "==> Verifying repository state"
git rev-parse --is-inside-work-tree >/dev/null

git fetch origin --prune

if git show-ref --verify --quiet refs/heads/main; then
  git switch main
else
  git switch -c main --track origin/main || git switch -c main
fi

git pull --ff-only origin main || true

# Clean up any old demo branches before creating fresh ones.
for branch in "$BRANCH_PYTHON" "$BRANCH_JAVASCRIPT"; do
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    git branch -D "$branch"
  fi

  if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
    git push origin --delete "$branch" >/dev/null 2>&1 || true
  fi
done

if [[ ! -f "$FILE" ]]; then
  printf '%s\n' "$LINE" > "$FILE"
fi

echo
echo "============================================================"
echo "Branch setup"
echo "============================================================"

echo "==> Branch 1: ${BRANCH_PYTHON}"
git switch -c "$BRANCH_PYTHON"
sed -i "s|${LINE}.*|${LINE} Python|" "$FILE"
git add "$FILE"
git commit -m "Set favorite language to Python" || echo "  No commit needed for branch 1; continuing."
git push -u origin "$BRANCH_PYTHON"

echo
echo "==> Returning to main"
git switch main

echo "==> Branch 2: ${BRANCH_JAVASCRIPT} (edits the same line)"
git switch -c "$BRANCH_JAVASCRIPT"
sed -i "s|${LINE}.*|${LINE} JavaScript|" "$FILE"
git add "$FILE"
git commit -m "Set favorite language to JavaScript" || echo "  No commit needed for branch 2; continuing."
git push -u origin "$BRANCH_JAVASCRIPT"

echo
echo "============================================================"
echo "SETUP COMPLETE — the repository is ready for the conflict demo."
echo "============================================================"
echo

echo "Recommended flow (GitHub UI):"
echo "  1. Open a pull request: ${BRANCH_PYTHON} -> main and merge it."
echo "  2. Open a pull request: ${BRANCH_JAVASCRIPT} -> main."
echo "     GitHub will report that the pull request cannot be merged automatically."
echo "  3. Click 'Resolve conflicts', remove the conflict markers (<<<<<<<, =======, >>>>>>>),"
echo "     keep the final wording you want, and commit the resolution."
echo

echo "CLI flow:"
echo "  git switch main && git pull --ff-only origin main"
echo "  git merge ${BRANCH_PYTHON}                 # merges cleanly"
echo "  git merge ${BRANCH_JAVASCRIPT}            # CONFLICT!"
echo "  # Edit conflict-lab.md, remove the conflict markers, and keep the final version."
echo "  git add conflict-lab.md"
echo "  git commit -m 'Resolve conflict in conflict-lab.md'"
echo "============================================================"
