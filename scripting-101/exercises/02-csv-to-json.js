/*
 * EXERCISE 2 — CSV to JSON
 * Hint level: NAMED (you get the exact built-in to look up)
 *
 * Run it:        node exercises/02-csv-to-json.js
 * Check it:      node check.js 02
 *
 * GOAL
 *   Turn data/interns.csv into output/interns.json: an array with one object
 *   per row, using the header row as the keys. "score" must be a NUMBER.
 *
 * INPUT (data/interns.csv)
 *   name,email,track,score
 *   Ava Johnson,ava@example.com,Software,88
 *   Marcus Lee,marcus@example.com,Data,92
 *   ...
 *
 * EXPECTED (output/interns.json)
 *   [
 *     {
 *       "name": "Ava Johnson",
 *       "email": "ava@example.com",
 *       "track": "Software",
 *       "score": 88
 *     },
 *     ...
 *   ]
 *
 * Also print: Converted 5 rows to output/interns.json
 */


// STEP 1 — Bring in the file system module.
//   Look up: require(), node:fs



// STEP 2 — Read data/interns.csv as text. Remove any whitespace or newline
//   at the very start and end of the file.
//   Look up: fs.readFileSync, String.prototype.trim



// STEP 3 — Split the text into lines. The FIRST line is the header.
//   Everything after it is data.
//   Look up: String.prototype.split
//   Bonus: look up "array destructuring" and the "rest" syntax (...)
//   to grab the first line and the rest in one line of code.



// STEP 4 — Split the header line into an array of column names.
//   Try it: console.log it. You should see ['name', 'email', 'track', 'score']



// STEP 5 — Turn each data line into an object.
//   For one line: split it into values, then pair each header with the value
//   in the same position.
//   Look up: Array.prototype.map (do this for every line)
//   Look up: Object.fromEntries (builds an object from [key, value] pairs)
//   Try it: console.log the first object before doing all of them.



// STEP 6 — "score" came out as a string ("88"). Convert it to a number (88).
//   Look up: Number()



// STEP 7 — Turn your array of objects into JSON text. Make it readable:
//   2-space indentation.
//   Look up: JSON.stringify — read about its third argument



// STEP 8 — Write the JSON text to output/interns.json, then print the
//   "Converted ..." message.
//   Look up: fs.writeFileSync



/*
 * STRETCH (not checked)
 *   1. Make it work for ANY csv: take the input file name from the command
 *      line (see process.argv) and name the output file to match.
 *   2. Convert ANY value that looks like a number, not just "score".
 */
