// =====================================================================
// T9A: Transform raw API data into a clean dataset.
// =====================================================================
//
// APIs return data shaped for the API, not for you. Your job is to turn
// the raw /api/events response into a flat, sorted list someone could
// drop into a spreadsheet or a web page.
//
// INPUT (raw): look at it first!  Run the mock server, then open
//   http://localhost:4000/api/events in your browser, or use Postman.
//
// OUTPUT: an array like this, one object per event:
//   {
//     "id": "evt-303",
//     "title": "Alumni Panel: First Year in Tech",
//     "date": "2026-10-22",             first 10 characters of starts_at
//     "time": "17:30",                  characters 11-15 of starts_at
//     "location": "Main Hall, i.c.stars HQ",
//     "going": 52,                      rsvp.yes  (0 if rsvp is missing)
//     "seatsLeft": 28                   capacity - going (never below 0)
//   }
//
// RULES
//   - Skip events whose status is "cancelled".
//   - Sort by date and time, earliest first.
//   - Don't crash if rsvp is null. Some events don't have RSVPs yet.
//
// Check your work:  npm test
// =====================================================================

function transformEvents(raw) {
  // TODO: replace this with your transformation.
  return [];
}

module.exports = { transformEvents };
