# Risk Register (EXAMPLE)

**Team:** CohortHub RSVP team (example only, this team isn't real)

| ID | Risk | Probability | Impact | Mitigation | Owner | Status | Raised by |
|---|---|---|---|---|---|---|---|
| R-1 | If the events API is down during the demo, the RSVP page shows an empty list | Medium | High | Fallback: set USE_MOCK=true to load cached output/events.json. Rehearsed in run 2. | Andre | Mitigated | team |
| R-2 | If the demo laptop isn't on the projector wifi, nothing loads | Medium | High | Test the room 30 min early. Phone hotspot as backup. | Maya | Open | team |
| R-3 | If the API key in .env expired, Stage 3 calls return 403 | Low | High | Run the preflight check the morning of the demo. Trainer has a spare key. | Luis | Open | peer (Team Atlas) |
| R-4 | If the demo runs over 7 minutes, we get cut off before the RSVP count | High | Medium | Timed rehearsal. Cut the login walkthrough, start already logged in. | Priya | Mitigated | team |
| R-5 | If test data has real intern names, we'd show private info on the projector | Low | High | Seed data uses made-up names only. Checked in rehearsal. | Priya | Closed | peer (Team Atlas) |
| R-6 | If the presenter freezes when something breaks, the room loses confidence | Medium | Medium | Each step has a one-line "if it fails" script. Backup presenter knows the flow. | Maya | Open | team |
