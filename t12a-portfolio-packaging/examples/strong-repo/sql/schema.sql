-- RSVP Tracker schema. Run first.
CREATE TABLE events (
  event_id   INTEGER PRIMARY KEY,
  title      TEXT NOT NULL,
  starts_at  TEXT NOT NULL
);

CREATE TABLE rsvps (
  rsvp_id    INTEGER PRIMARY KEY,
  event_id   INTEGER NOT NULL REFERENCES events(event_id),
  intern     TEXT NOT NULL,
  answer     TEXT NOT NULL CHECK (answer IN ('yes', 'no', 'maybe')),
  UNIQUE (event_id, intern)
);
