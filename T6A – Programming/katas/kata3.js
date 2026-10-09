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

const rawInput = process.argv[2];
const size = Number(rawInput);

// Guard clause for invalid input
if (!Number.isInteger(size) || size < 1 || size > 12) {
  console.error("Please provide a whole number between 1 and 12.");
  process.exit(1);
}

// Generate multiplication table
for (let row = 1; row <= size; row++) {
  let rowString = "";
  for (let col = 1; col <= size; col++) {
    rowString += (row * col).toString().padStart(4, " ");
  }
  console.log(rowString);
}