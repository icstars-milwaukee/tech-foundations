// ============================================================
// KATA 3 (Stretch) — Multiplication Table + Input Validation
// ------------------------------------------------------------
// Goal: Take a size from the command line and print that size
// of multiplication table. `node katas/kata3.js 5` prints a
// 5x5 table.
//
// Requirements:
//   - A nested loop (a loop inside a loop): outer = rows,
//     inner = the cells in that row.
//   - A guard clause that rejects bad input up front — not a
//     whole number, less than 1, or more than 12 — and exits
//     with a helpful message.
//   - Comments explaining your logic choices.
//
// Commit rhythm (3 commits — one after each step):
//   1. scaffold  – nested loop, hard-coded 3x3 table
//   2. feature   – read the size argument, add the guard clause
//   3. refactor  – better names, no magic numbers, comments
//
// Hints:
//   - `process.argv[2]` is the first thing typed after the
//     filename. It arrives as text, so convert it to a number.
//   - Build each row into a string, then print the row once.
//
// Run it:  node katas/kata3.js 5
// ============================================================

// Your code here

const size = Number(process.argv[2]);

if (!Number.isInteger(size) || size < 1 || size > 12) {
  console.error("Please give a whole number from 1 to 12, e.g. node katas/kata3.js 5");
  process.exit(1);
}

for (let row = 1; row <= size; row++) {
  let line = "";
  for (let col = 1; col <= size; col++) {
    line += row * col + " ";
  }
  console.log(line);
}
// I used a nested loop to generate the multiplication table.
// The outer loop iterates over the rows, and the inner loop iterates over the columns.
// I built each row into a string and printed it once per row to avoid multiple console.log calls.
// The guard clause ensures that the input is a whole number between 1 and 12, exiting with an error message if it is not.