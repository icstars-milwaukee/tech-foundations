# Decisions

## 1. One RSVP per intern per event

- **Context:** Interns change their minds. Counting every submission double-counted people.
- **Options:** keep every answer and use the latest; or allow only one row per intern per event.
- **Decision:** one row, enforced in the database with `UNIQUE (event_id, intern)`. Changing an answer updates the row.
- **Consequences:** counts are always right; we lose the history of changes (fine for this use).

## 2. Read CSV for the demo, SQL for the real thing

- **Context:** The showcase laptop may not have a database installed.
- **Decision:** the demo server reads `data/sample-rsvps.csv`; the SQL files show the production design.
- **Consequences:** the demo runs anywhere with Node. The README explains both.
