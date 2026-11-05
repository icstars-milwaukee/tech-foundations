/*
 * EXERCISE 1 — File stats
 * Hint level: NAMED (you get the exact built-in to look up)
 *
 * Run it:        node exercises/01-file-stats.js
 * Check it:      node check.js 01
 *
 * GOAL
 *   Read data/notes.txt and print how many lines, words, and characters it has.
 *
 * EXPECTED OUTPUT
 *   Lines: 5
 *   Non-empty lines: 4
 *   Words: 22
 *   Characters: 135
 *   Longest line: "Scripts save time by doing boring work for you."
 *
 * Fill in the code under each step. Run the script after EVERY step.
 * Use console.log to look at what you have before moving on.
 */


// STEP 1 — Bring in Node's file system module so you can read files.
//   Look up: require(), the node:fs module



// STEP 2 — Read data/notes.txt into ONE string. You want text, not raw bytes.
//   Look up: fs.readFileSync — pay attention to the "encoding" argument
//   Try it: console.log the string. Do you see the file's contents?



// STEP 3 — The number of characters is just the string's length. Save it.
//   Look up: String length



// STEP 4 — Break the string into an array of lines.
//   Look up: String.prototype.split — what character separates lines?
//   Watch out: the file ends with a newline. Does that give you an extra
//   empty "line" at the end? If so, remove it.
//   Look up: Array.prototype.pop



// STEP 5 — Count the lines. Then count only the lines that are NOT blank.
//   Look up: Array length, Array.prototype.filter, String.prototype.trim



// STEP 6 — Count the words. Join the lines into one string with spaces,
//   split on spaces, and throw away any empty pieces.
//   Look up: Array.prototype.join, Array.prototype.filter



// STEP 7 — Find the longest line. Walk through the lines and remember the
//   longest one you've seen so far.
//   Look up: for...of loop



// STEP 8 — Print each result so it matches EXPECTED OUTPUT exactly.
//   Look up: template literals (backticks)



/*
 * STRETCH (not checked)
 *   Print the 5 most common words and how many times each appears.
 */
