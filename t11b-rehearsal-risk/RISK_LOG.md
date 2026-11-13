# Risk Log

**Team:** 

Start from your T9B risk register. A risk log is **alive**: every week, update the status, add what's new, close what's gone. Note what changed so readers can see movement.

- **Probability / Impact:** Low · Medium · High
- **Status:** Open · Mitigated · Happened · Closed
- **Source:** T9B, rehearsal round 1, rehearsal round 2, client, trainer, peer team

| ID | Risk (If ___, then ___) | Probability | Impact | Mitigation | Owner | Status | Source | What changed since last update |
|---|---|---|---|---|---|---|---|---|
| R-1 | If the events API is down during the demo, the RSVP page shows an empty list | Medium | High | Use the cached fallback in `output/events.json`, keep mock mode on during demo, and rehearse the offline path before the final presentation | Andre | Mitigated | T9B, rehearsal round 1 | Added the offline fallback and verified it during Round 2; the team still monitors the API during the live run. |
| R-2 | If the demo laptop is not on the projector wifi, nothing loads | Medium | High | Test the room setup 30 minutes early and keep a phone hotspot ready as backup | Maya | Open | T9B | No change yet; room check still needs to be scheduled before the final presentation. |
| R-3 | If the API key in `.env` expires, Stage 3 calls return 403 | Low | High | Run a preflight check the morning of the demo, confirm the key in the environment, and keep the trainer's spare key ready | Luis | Open | peer team | Raised after rehearsal feedback and added to the demo checklist so it is not missed again. |
| R-4 | If the demo runs over 7 minutes, we get cut off before the RSVP count | High | Medium | Keep a timed rehearsal, skip the login walkthrough, and start already logged in so the count is reached on time | Priya | Mitigated | T9B, rehearsal round 2 | Shortened the narration after Round 1 and tightened the story flow to stay within the time window. |
| R-5 | If test data contains real employee names, we show private information on the projector | Low | High | Use made-up names in the seed data and check the sample records before rehearsal | Priya | Closed | peer team | Caught in rehearsal; the seed data was corrected and verified before the next run. |
| R-6 | If the presenter freezes when something breaks, the room loses confidence | Medium | Medium | Use a one-line reset script, assign a backup presenter, and rehearse the handoff before the final demo | Maya | Open | rehearsal round 1 | Added the recovery line and backup plan after Round 1, but it still needs to be practiced under time pressure. |
