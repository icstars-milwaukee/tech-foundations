# T3B Run-of-Show — Git for Teams (90 minutes)

Quick timing card for your second monitor. The full session plan lives in the session doc.

| Time | Segment | You do | Interns do |
| --- | --- | --- | --- |
| 0–10 | **Opening / Hook** | Ask: "Who has ever lost track of which file was the real one?" Show a simple no-Git vs. Git visual. | Share stories about file chaos or version confusion. |
| 10–20 | **Concepts** | Define repo, clone, branch, commit, push, pull, PR, and issue using the highway analogy. | Listen, ask questions, and connect each term to a real action. |
| 20–35 | **Modeling** | Live demo: clone → branch → edit README → commit → push → PR → link issue. Narrate the steps out loud. End with the PR Checklist. | Watch closely and follow the flow. |
| 35–60 | **Guided Practice** | Float and coach. Confirm each pair has submitted a PR. | In pairs: clone, create a branch using their names, add a line to `team-rules.md`, commit, push, and open a PR. |
| 60–75 | **Conflict Lab** | Run the conflict demo (scripted or live). Resolve the conflict in the PR UI and then in the CLI. | Resolve their own conflict and add a brief resolution note in the PR. |
| 75–85 | **Application** | Check that issue links are correct and clear. | Open at least one issue and link their PR with `Closes #N`. |
| 85–90 | **Closing** | Debrief: What felt easy? What felt hard? What habit will you carry into RFP work? | Reflect and name one habit to keep. |

## The three analogies to keep handy

- **Branch** = your own lane on the highway, a version of the project you can work on safely.
- **PR** = a request to merge your lane back into the main road.
- **Conflict** = two cars trying to use the same lane at once; we need rules and coordination to merge safely.

## Trainer mindset

Expect mistakes. Model calm troubleshooting: "This conflict looks scary — here is how I break it down." A conflict is not a failure; it is Git asking a human to decide how the changes should be combined.

## Pre-flight (do before interns arrive)

- [ ] Training repo created and configured so interns can push branches and open PRs.
- [ ] Sample issues #1–#5 created (see `sample-issues.md`).
- [ ] Conflict demo rehearsed once with `setup-conflict-demo.sh`.
- [ ] PR Checklist and cheat sheet printed or linked.
- [ ] Backup cloud IDE (Gitpod / VS Code web) ready for broken local setups.

## Rubric target

Move everyone to **Proficient**: clear branch name, small meaningful commits, conflict resolved, PR linked to the issue, and a resolution note included. Flag anyone at **Limited** or **Emerging** for the 30-minute follow-up.
