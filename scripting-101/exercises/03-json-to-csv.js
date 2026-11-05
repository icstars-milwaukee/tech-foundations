/*
 * EXERCISE 3 — JSON to CSV
 * Hint level: SEARCH PHRASE (type the phrase into a search engine)
 *
 * Run it:        node exercises/03-json-to-csv.js
 * Check it:      node check.js 03
 *
 * GOAL
 *   Go the other direction: turn data/events.json into output/events.csv.
 *
 * INPUT (data/events.json)
 *   [
 *     { "title": "Resume Workshop", "date": "2026-11-10", "room": "Lab A", "seats": 20 },
 *     ...
 *     { "title": "Demo Day, Dry Run", "date": "2026-11-18", "room": "Main Hall", "seats": 60 }
 *   ]
 *
 * EXPECTED (output/events.csv)
 *   title,date,room,seats
 *   Resume Workshop,2026-11-10,Lab A,20
 *   Mock Interviews,2026-11-12,Lab B,12
 *   Git Office Hours,2026-11-14,Lab A,15
 *   "Demo Day, Dry Run",2026-11-18,Main Hall,60
 *
 * Also print: Wrote 4 events to output/events.csv
 *
 * Notice the last row. "Demo Day, Dry Run" has a comma IN it, so it has to be
 * wrapped in double quotes — otherwise a spreadsheet would think it's two columns.
 */


// STEP 1 — Read data/events.json and turn the text into a real JavaScript array.
//   Search: "javascript parse json string into object"



// STEP 2 — Get the column names from the keys of the first object.
//   Search: "javascript get keys of an object as array"



// STEP 3 — Build the header line by joining the column names with commas.
//   Search: "javascript join array into string with separator"



// STEP 4 — Write a small helper function that takes one value and returns it
//   ready for CSV:
//     - turn it into a string
//     - if it contains a comma, wrap it in double quotes
//   Search: "javascript check if string contains character"



// STEP 5 — Build one line per event: for each column name, look up that
//   event's value, run it through your helper, and join with commas.
//   Search: "javascript access object property with variable key"



// STEP 6 — Put the header line and all event lines together, one per line,
//   with a newline at the end of the file. Write it to output/events.csv.



/*
 * STRETCH (not checked)
 *   What if a value contains a double quote, like: She said "hi"
 *   Search: "csv escape double quotes rule" — then update your helper.
 */
