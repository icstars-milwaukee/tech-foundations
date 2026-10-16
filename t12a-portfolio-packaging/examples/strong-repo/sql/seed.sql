-- Made-up sample data. Run after schema.sql.
INSERT INTO events (event_id, title, starts_at) VALUES
  (1, 'Demo Day', '2026-11-06T13:00'),
  (2, 'Resume Lab', '2026-10-28T10:00');

INSERT INTO rsvps (event_id, intern, answer) VALUES
  (1, 'Maya', 'yes'), (1, 'Andre', 'no'), (1, 'Priya', 'yes'),
  (2, 'Luis', 'maybe'), (2, 'Keisha', 'yes');
