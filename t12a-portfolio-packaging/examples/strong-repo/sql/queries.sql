-- Headcount per event: how many people to expect.
SELECT e.title,
       SUM(CASE WHEN r.answer = 'yes' THEN 1 ELSE 0 END)   AS going,
       SUM(CASE WHEN r.answer = 'maybe' THEN 1 ELSE 0 END) AS maybe
FROM events e
LEFT JOIN rsvps r ON r.event_id = e.event_id
GROUP BY e.event_id, e.title
ORDER BY e.starts_at;
