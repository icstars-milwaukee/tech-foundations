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
//This is what was asked of me using the hints LaQuesha
// for (let row = 1; row <= 3; row++) {
  let rowText = "";

  for (let cell = 1; cell <= 3; cell++) {
    rowText += row * cell + " ";
  }

  console.log(rowText);
}

process.argv[2]
const MIN_SIZE = 1;
const MAX_SIZE = 12;

const size = Number(process.argv[2]);

// Guard clause: reject anything that is not a whole number
// between the allowed minimum and maximum.
if (!Number.isInteger(size) || size < MIN_SIZE || size > MAX_SIZE) {
  console.log(`Please enter a whole number between ${MIN_SIZE} and ${MAX_SIZE}.`);
  process.exit(1);
}

// The outer loop creates each row of the table.
for (let row = 1; row <= size; row++) {
  let rowText = "";

  // The inner loop creates each cell within the current row.
  for (let column = 1; column <= size; column++) {
    rowText += row * column + " ";
  }

  // Print the completed row once instead of printing each cell separately.
  console.log(rowText);
}

for (let row = 1; row <= size; row++) {
  for (let column = 1; column <= size; column++) {

    // Completed Kata 3, the first item I shared has the row rows 1x1, 2x1, 3,1 next line 2x1, 2x2, 3x2