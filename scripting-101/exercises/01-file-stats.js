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

import fs from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'path';

// STEP 2 — Read data/notes.txt into ONE string. You want text, not raw bytes.
//   Look up: fs.readFileSync — pay attention to the "encoding" argument
//   Try it: console.log the string. Do you see the file's contents?
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'notes.txt');

const fileContent = fs.readFileSync(filePath, 'utf8');

console.log("fileContent: ", fileContent);


// STEP 3 — The number of characters is just the string's length. Save it.
//   Look up: String length
const fileLen = fileContent.length;
console.log("fileLen: ", fileLen);


// STEP 4 — Break the string into an array of lines.
//   Look up: String.prototype.split — what character separates lines?
//   Watch out: the file ends with a newline. Does that give you an extra
//   empty "line" at the end? If so, remove it.
//   Look up: Array.prototype.pop

const fileLines = fileContent.split('\n');
console.log("fileLines: ", fileLines);


// STEP 5 — Count the lines. Then count only the lines that are NOT blank.
//   Look up: Array length, Array.prototype.filter, String.prototype.trim

const fileLinesCount = fileLines.length;
console.log("fileLinesCount: ", fileLinesCount);

const nonEmptyLinesCount = fileLines.filter(line => line.trim() !== '').length;
console.log("nonEmptyLinesCount: ", nonEmptyLinesCount);

// STEP 6 — Count the words. Join the lines into one string with spaces,
//   split on spaces, and throw away any empty pieces.
//   Look up: Array.prototype.join, Array.prototype.filter

const fileWords = fileLines.join(' ').split(' ').filter(word => word.trim() !== ''); 
const fileWordsCount = fileWords.length;

console.log("fileWords: ", fileWords);
console.log("fileWordsCount: ", fileWordsCount);

// STEP 7 — Find the longest line. Walk through the lines and remember the
//   longest one you've seen so far.
//   Look up: for...of loop

let LongestLine = '';

for (const Line of fileLines) {
    if (Line.length > LongestLine.length) {
        LongestLine = Line;
    }
}
console.log("LongestLine: ", LongestLine);


// STEP 8 — Print each result so it matches EXPECTED OUTPUT exactly.
//   Look up: template literals (backticks)

console.log();
console.log(`Lines: ${fileLinesCount}`);
console.log(`Non-empty lines: ${nonEmptyLinesCount}`);
console.log(`Words: ${fileWordsCount}`);
console.log(`Characters: ${fileLen}`);
console.log(`Longest line: "${LongestLine}"`);

/*
 * STRETCH (not checked)
 *   Print the 5 most common words and how many times each appears.
 */
