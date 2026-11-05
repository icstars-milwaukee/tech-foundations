// Counts RSVP answers for each event.
// Answers are normalized so "Yes", "yes " and "YES" all count the same.

function countByEvent(rsvps) {
  const counts = {};
  for (const { event, answer } of rsvps) {
    const key = String(answer).trim().toLowerCase();
    counts[event] ||= { yes: 0, no: 0, maybe: 0 };
    if (key in counts[event]) counts[event][key]++;
  }
  return counts;
}

function parseCsv(text) {
  const [header, ...rows] = text.trim().split(/\r?\n/);
  const cols = header.split(",");
  return rows.map((row) => Object.fromEntries(row.split(",").map((v, i) => [cols[i], v])));
}

module.exports = { countByEvent, parseCsv };
