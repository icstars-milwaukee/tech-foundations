# T3B Run-of-Show — Git for Teams (90 min)

Quick timing card to keep on your second monitor. Full plan is in the session doc.

| Time | Segment | You do | Interns do |
|------|---------|--------|-----------|
| 0–10 | **Opening / Hook** | Ask: "Who's lost track of which file was the *real* one?" Show no-Git vs Git visual. | Share chaos stories. |
| 10–20 | **Concepts** | Define repo/clone/branch/commit/push/pull/PR/issue with the highway analogy. | Listen, ask. |
| 20–35 | **Modeling** | Live: clone → branch → edit README → commit → push → PR → link issue. Narrate aloud. End on the PR Checklist. | Watch. |
| 35–60 | **Guided Practice** | Float and coach. Confirm each pair's PR is submitted. | Pairs: clone, branch = their name, add line to team-rules.md, commit, push, PR. |
| 60–75 | **Conflict Lab** | Run the conflict demo (script or live). Resolve in PR UI, then CLI. | Resolve their own conflict, add a resolution note in the PR. |
| 75–85 | **Application** | Check issue links are correct. | Open ≥1 issue, link their PR (`Closes #N`). |
| 85–90 | **Closing** | Debrief: easy? hard? habit to carry into RFP? | Reflect, name one habit. |

## The three analogies (keep them handy)
- **Branch** = your own copy of the highway.
- **PR** = request to merge your lane back in.
- **Conflict** = two cars in the same lane; we need rules to merge safely.

## Trainer mindset
Expect mistakes. Model calm troubleshooting: "This conflict looks scary — here's how I break it down." A conflict is not an error; it's Git asking a human to decide.

## Pre-flight (do before interns arrive)
- [ ] Training repo created and set so interns can push branches / open PRs.
- [ ] Sample issues #1–#5 created (see sample-issues.md).
- [ ] Conflict demo rehearsed once with setup-conflict-demo.sh.
- [ ] PR Checklist + Cheat Sheet printed or linked.
- [ ] Backup cloud IDE (Gitpod / VS Code web) ready for broken local setups.

## Rubric target
Move everyone to **Proficient**: clear branch name, small meaningful commits, conflict resolved, PR linked to issue, resolution note included. Flag anyone at Limited/Emerging for the 30-min follow-up.
